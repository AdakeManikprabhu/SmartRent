package com.smartrent.controller;

import com.smartrent.dto.ComplaintDto;
import com.smartrent.dto.ComplaintRequest;
import com.smartrent.dto.ComplaintStatusRequest;
import com.smartrent.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<ComplaintDto> submitComplaint(@Valid @RequestBody ComplaintRequest request, Authentication authentication) {
        return ResponseEntity.ok(complaintService.submitComplaint(request, authentication.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<ComplaintDto>> getTenantComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getTenantComplaints(authentication.getName()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<ComplaintDto>> getOwnerComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getOwnerComplaints(authentication.getName()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<ComplaintDto> updateComplaintStatus(@PathVariable Long id, @Valid @RequestBody ComplaintStatusRequest request, Authentication authentication) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request, authentication.getName()));
    }
}
