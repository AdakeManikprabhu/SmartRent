package com.smartrent.repository;

import com.smartrent.entity.Booking;
import com.smartrent.entity.BookingStatus;
import com.smartrent.entity.Property;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTenant(User tenant);
    List<Booking> findByProperty(Property property);
    List<Booking> findByPropertyOwner(User owner);
    List<Booking> findByStatus(BookingStatus status);
}
