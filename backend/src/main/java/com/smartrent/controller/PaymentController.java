package com.smartrent.controller;

import com.smartrent.dto.PaymentDto;
import com.smartrent.dto.PaymentRequest;
import com.smartrent.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<PaymentDto>> getTenantPaymentHistory(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getTenantPaymentHistory(authentication.getName()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<PaymentDto>> getOwnerPaymentHistory(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getOwnerPaymentHistory(authentication.getName()));
    }

    @GetMapping("/owner/analytics")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> getOwnerAnalytics(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getOwnerRevenueAnalytics(authentication.getName()));
    }

    @PostMapping("/pay")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<PaymentDto> processPayment(@Valid @RequestBody PaymentRequest request, Authentication authentication) {
        return ResponseEntity.ok(paymentService.processRentPayment(request, authentication.getName()));
    }
}
