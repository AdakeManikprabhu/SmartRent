package com.smartrent.service;

import com.smartrent.dto.ComplaintDto;
import com.smartrent.dto.ComplaintRequest;
import com.smartrent.dto.ComplaintStatusRequest;
import com.smartrent.entity.*;
import com.smartrent.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final PropertyRepository propertyRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AiService aiService;

    public ComplaintService(ComplaintRepository complaintRepository, PropertyRepository propertyRepository,
                            RoomRepository roomRepository, UserRepository userRepository,
                            NotificationRepository notificationRepository, AiService aiService) {
        this.complaintRepository = complaintRepository;
        this.propertyRepository = propertyRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.aiService = aiService;
    }

    @Transactional
    public ComplaintDto submitComplaint(ComplaintRequest request, String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Room room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId()).orElse(null);
        }

        Complaint complaint = new Complaint();
        complaint.setTenant(tenant);
        complaint.setProperty(property);
        complaint.setRoom(room);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setAttachmentUrl(request.getAttachmentUrl());

        // AI Auto-classification if category/priority are not explicitly supplied
        if (request.getCategory() != null) {
            complaint.setCategory(request.getCategory());
        }
        if (request.getPriority() != null) {
            complaint.setPriority(request.getPriority());
        }

        if (complaint.getCategory() == null || complaint.getPriority() == null) {
            var autoClassified = aiService.classifyComplaint(request.getDescription());
            if (complaint.getCategory() == null) complaint.setCategory(autoClassified.getCategory());
            if (complaint.getPriority() == null) complaint.setPriority(autoClassified.getPriority());
        }

        Complaint saved = complaintRepository.save(complaint);

        // Notify Property Owner
        notificationRepository.save(new Notification(
                property.getOwner(),
                "New Complaint Submitted",
                "Tenant " + tenant.getName() + " logged issue: " + complaint.getTitle() + " (" + complaint.getPriority() + " priority)",
                "COMPLAINT",
                "/owner/complaints"
        ));

        return ComplaintDto.fromEntity(saved);
    }

    public List<ComplaintDto> getTenantComplaints(String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return complaintRepository.findByTenant(tenant).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getOwnerComplaints(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return complaintRepository.findByOwner(owner).stream()
                .map(ComplaintDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintDto updateComplaintStatus(Long complaintId, ComplaintStatusRequest request, String ownerEmail) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(request.getStatus());
        if (request.getResolutionNotes() != null) {
            complaint.setResolutionNotes(request.getResolutionNotes());
        }
        complaint.setUpdatedAt(LocalDateTime.now());

        Complaint updated = complaintRepository.save(complaint);

        // Notify Tenant
        notificationRepository.save(new Notification(
                complaint.getTenant(),
                "Complaint Status Updated",
                "Your complaint '" + complaint.getTitle() + "' is now " + request.getStatus().name(),
                "COMPLAINT",
                "/tenant/dashboard"
        ));

        return ComplaintDto.fromEntity(updated);
    }
}
