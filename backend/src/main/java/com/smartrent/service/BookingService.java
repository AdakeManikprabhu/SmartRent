package com.smartrent.service;

import com.smartrent.dto.BookingDto;
import com.smartrent.dto.BookingRequest;
import com.smartrent.entity.*;
import com.smartrent.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository,
                          UserRepository userRepository, PaymentRepository paymentRepository,
                          NotificationRepository notificationRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public BookingDto createBooking(BookingRequest request, String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (room.getAvailabilityStatus() == AvailabilityStatus.OCCUPIED) {
            throw new RuntimeException("Room is currently occupied");
        }

        Property property = room.getProperty();

        Booking booking = new Booking();
        booking.setTenant(tenant);
        booking.setRoom(room);
        booking.setProperty(property);
        booking.setMoveInDate(request.getMoveInDate());
        booking.setDurationMonths(request.getDurationMonths());
        booking.setTotalMonthlyRent(room.getRentMonthly());
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(request.getNotes());

        Booking savedBooking = bookingRepository.save(booking);

        // Send notification to Owner
        notificationRepository.save(new Notification(
                property.getOwner(),
                "New Booking Request",
                "Tenant " + tenant.getName() + " requested room " + room.getRoomNumber() + " at " + property.getName(),
                "BOOKING",
                "/owner/bookings"
        ));

        return BookingDto.fromEntity(savedBooking);
    }

    public List<BookingDto> getMyTenantBookings(String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return bookingRepository.findByTenant(tenant).stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingDto> getOwnerBookings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return bookingRepository.findByPropertyOwner(owner).stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDto updateBookingStatus(Long bookingId, BookingStatus status, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);

        if (status == BookingStatus.APPROVED) {
            // Update room availability
            Room room = booking.getRoom();
            room.setAvailableBeds(Math.max(0, room.getAvailableBeds() - 1));
            if (room.getAvailableBeds() == 0) {
                room.setAvailabilityStatus(AvailabilityStatus.OCCUPIED);
            }
            roomRepository.save(room);

            // Generate initial monthly rent payment
            Payment initialPayment = new Payment();
            initialPayment.setBooking(booking);
            initialPayment.setTenant(booking.getTenant());
            initialPayment.setAmount(booking.getTotalMonthlyRent());
            initialPayment.setDueDate(LocalDate.now().plusDays(5));
            initialPayment.setMonthYear(LocalDate.now().getMonth().name() + " " + LocalDate.now().getYear());
            initialPayment.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(initialPayment);

            // Notify Tenant
            notificationRepository.save(new Notification(
                    booking.getTenant(),
                    "Booking Approved!",
                    "Your booking for " + booking.getProperty().getName() + " has been approved by the owner.",
                    "BOOKING",
                    "/tenant/dashboard"
            ));
        } else if (status == BookingStatus.REJECTED) {
            notificationRepository.save(new Notification(
                    booking.getTenant(),
                    "Booking Request Status",
                    "Your booking request for " + booking.getProperty().getName() + " was declined.",
                    "BOOKING",
                    "/tenant/dashboard"
            ));
        }

        Booking updated = bookingRepository.save(booking);
        return BookingDto.fromEntity(updated);
    }
}
