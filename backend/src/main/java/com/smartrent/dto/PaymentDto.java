package com.smartrent.dto;

import com.smartrent.entity.Payment;
import com.smartrent.entity.PaymentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long id;
    private Long bookingId;
    private UserDto tenant;
    private Double amount;
    private LocalDate dueDate;
    private LocalDateTime paidDate;
    private String monthYear;
    private PaymentStatus status;
    private String transactionId;
    private String paymentMethod;
    private LocalDateTime createdAt;

    public PaymentDto() {}

    public static PaymentDto fromEntity(Payment p) {
        if (p == null) return null;
        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        if (p.getBooking() != null) dto.setBookingId(p.getBooking().getId());
        dto.setTenant(UserDto.fromEntity(p.getTenant()));
        dto.setAmount(p.getAmount());
        dto.setDueDate(p.getDueDate());
        dto.setPaidDate(p.getPaidDate());
        dto.setMonthYear(p.getMonthYear());
        dto.setStatus(p.getStatus());
        dto.setTransactionId(p.getTransactionId());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public UserDto getTenant() { return tenant; }
    public void setTenant(UserDto tenant) { this.tenant = tenant; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDateTime paidDate) { this.paidDate = paidDate; }

    public String getMonthYear() { return monthYear; }
    public void setMonthYear(String monthYear) { this.monthYear = monthYear; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
