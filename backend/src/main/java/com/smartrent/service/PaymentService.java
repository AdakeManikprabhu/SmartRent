package com.smartrent.service;

import com.smartrent.dto.PaymentDto;
import com.smartrent.dto.PaymentRequest;
import com.smartrent.entity.*;
import com.smartrent.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public List<PaymentDto> getTenantPaymentHistory(String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return paymentRepository.findByTenant(tenant).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getOwnerPaymentHistory(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return paymentRepository.findByOwner(owner).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentDto processRentPayment(PaymentRequest request, String tenantEmail) {
        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment record not found"));

        if (!payment.getTenant().getEmail().equals(tenantEmail)) {
            throw new RuntimeException("Unauthorized payment attempt");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidDate(LocalDateTime.now());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Payment saved = paymentRepository.save(payment);

        // Notify Owner
        notificationRepository.save(new Notification(
                payment.getBooking().getProperty().getOwner(),
                "Rent Payment Received",
                "Rent payment of ₹" + payment.getAmount() + " received from " + payment.getTenant().getName() + " for " + payment.getMonthYear(),
                "PAYMENT",
                "/owner/dashboard"
        ));

        return PaymentDto.fromEntity(saved);
    }

    public Map<String, Object> getOwnerRevenueAnalytics(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Double totalRevenue = paymentRepository.sumTotalRevenueByOwner(owner);
        List<Payment> ownerPayments = paymentRepository.findByOwner(owner);

        long pendingCount = ownerPayments.stream().filter(p -> p.getStatus() == PaymentStatus.PENDING).count();
        long paidCount = ownerPayments.stream().filter(p -> p.getStatus() == PaymentStatus.PAID).count();
        double pendingAmount = ownerPayments.stream().filter(p -> p.getStatus() == PaymentStatus.PENDING).mapToDouble(Payment::getAmount).sum();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        analytics.put("pendingPaymentsCount", pendingCount);
        analytics.put("paidPaymentsCount", paidCount);
        analytics.put("pendingAmount", pendingAmount);
        return analytics;
    }
}
