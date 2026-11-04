package com.smartrent.dto;

import jakarta.validation.constraints.NotNull;

public class PaymentRequest {

    @NotNull(message = "Payment ID is required")
    private Long paymentId;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // e.g. "UPI", "Credit Card", "Net Banking"

    public PaymentRequest() {}

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
