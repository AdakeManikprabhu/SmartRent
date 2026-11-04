package com.smartrent.controller;

import com.smartrent.dto.BookingDto;
import com.smartrent.dto.BookingRequest;
import com.smartrent.entity.BookingStatus;
import com.smartrent.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(bookingService.createBooking(request, authentication.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<BookingDto>> getMyTenantBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getMyTenantBookings(authentication.getName()));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<BookingDto>> getOwnerBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getOwnerBookings(authentication.getName()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<BookingDto> approveBooking(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.APPROVED, authentication.getName()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<BookingDto> rejectBooking(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.REJECTED, authentication.getName()));
    }
}
