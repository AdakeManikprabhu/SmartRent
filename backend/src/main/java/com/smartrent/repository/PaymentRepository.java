package com.smartrent.repository;

import com.smartrent.entity.Booking;
import com.smartrent.entity.Payment;
import com.smartrent.entity.PaymentStatus;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenant(User tenant);
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.booking.property.owner = :owner")
    List<Payment> findByOwner(@Param("owner") User owner);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID' AND p.booking.property.owner = :owner")
    Double sumTotalRevenueByOwner(@Param("owner") User owner);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    Double sumTotalPlatformRevenue();
}
