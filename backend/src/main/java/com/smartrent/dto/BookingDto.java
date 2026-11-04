package com.smartrent.dto;

import com.smartrent.entity.Booking;
import com.smartrent.entity.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDto {
    private Long id;
    private UserDto tenant;
    private RoomDto room;
    private PropertyDto property;
    private LocalDate moveInDate;
    private Integer durationMonths;
    private Double totalMonthlyRent;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;

    public BookingDto() {}

    public static BookingDto fromEntity(Booking b) {
        if (b == null) return null;
        BookingDto dto = new BookingDto();
        dto.setId(b.getId());
        dto.setTenant(UserDto.fromEntity(b.getTenant()));
        dto.setRoom(RoomDto.fromEntity(b.getRoom()));
        dto.setProperty(PropertyDto.fromEntity(b.getProperty()));
        dto.setMoveInDate(b.getMoveInDate());
        dto.setDurationMonths(b.getDurationMonths());
        dto.setTotalMonthlyRent(b.getTotalMonthlyRent());
        dto.setStatus(b.getStatus());
        dto.setNotes(b.getNotes());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getTenant() { return tenant; }
    public void setTenant(UserDto tenant) { this.tenant = tenant; }

    public RoomDto getRoom() { return room; }
    public void setRoom(RoomDto room) { this.room = room; }

    public PropertyDto getProperty() { return property; }
    public void setProperty(PropertyDto property) { this.property = property; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public Integer getDurationMonths() { return durationMonths; }
    public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }

    public Double getTotalMonthlyRent() { return totalMonthlyRent; }
    public void setTotalMonthlyRent(Double totalMonthlyRent) { this.totalMonthlyRent = totalMonthlyRent; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
