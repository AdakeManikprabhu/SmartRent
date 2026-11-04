package com.smartrent.controller;

import com.smartrent.dto.PropertyDto;
import com.smartrent.dto.UserDto;
import com.smartrent.entity.PropertyStatus;
import com.smartrent.repository.BookingRepository;
import com.smartrent.repository.ComplaintRepository;
import com.smartrent.repository.PaymentRepository;
import com.smartrent.repository.UserRepository;
import com.smartrent.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final PropertyService propertyService;
    private final BookingRepository bookingRepository;
    private final ComplaintRepository complaintRepository;
    private final PaymentRepository paymentRepository;

    public AdminController(UserRepository userRepository, PropertyService propertyService,
                           BookingRepository bookingRepository, ComplaintRepository complaintRepository,
                           PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.propertyService = propertyService;
        this.bookingRepository = bookingRepository;
        this.complaintRepository = complaintRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList()));
    }

    @GetMapping("/properties")
    public ResponseEntity<List<PropertyDto>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllPropertiesAdmin());
    }

    @PutMapping("/properties/{id}/verify")
    public ResponseEntity<PropertyDto> verifyProperty(@PathVariable Long id, @RequestParam PropertyStatus status) {
        return ResponseEntity.ok(propertyService.updatePropertyStatus(id, status));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAdminAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalProperties", propertyService.getAllPropertiesAdmin().size());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalComplaints", complaintRepository.count());
        Double rev = paymentRepository.sumTotalPlatformRevenue();
        stats.put("totalPlatformRevenue", rev != null ? rev : 0.0);
        return ResponseEntity.ok(stats);
    }
}
