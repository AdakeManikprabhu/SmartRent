package com.smartrent.dto;

import com.smartrent.entity.AvailabilityStatus;
import com.smartrent.entity.Room;
import com.smartrent.entity.RoomType;

public class RoomDto {
    private Long id;
    private Long propertyId;
    private String roomNumber;
    private RoomType type;
    private Double rentMonthly;
    private Double depositAmount;
    private AvailabilityStatus availabilityStatus;
    private boolean ac;
    private boolean furnished;
    private Integer totalBeds;
    private Integer availableBeds;

    public RoomDto() {}

    public static RoomDto fromEntity(Room room) {
        if (room == null) return null;
        RoomDto dto = new RoomDto();
        dto.setId(room.getId());
        if (room.getProperty() != null) dto.setPropertyId(room.getProperty().getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setType(room.getType());
        dto.setRentMonthly(room.getRentMonthly());
        dto.setDepositAmount(room.getDepositAmount());
        dto.setAvailabilityStatus(room.getAvailabilityStatus());
        dto.setAc(room.isAc());
        dto.setFurnished(room.isFurnished());
        dto.setTotalBeds(room.getTotalBeds());
        dto.setAvailableBeds(room.getAvailableBeds());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public RoomType getType() { return type; }
    public void setType(RoomType type) { this.type = type; }

    public Double getRentMonthly() { return rentMonthly; }
    public void setRentMonthly(Double rentMonthly) { this.rentMonthly = rentMonthly; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public boolean isAc() { return ac; }
    public void setAc(boolean ac) { this.ac = ac; }

    public boolean isFurnished() { return furnished; }
    public void setFurnished(boolean furnished) { this.furnished = furnished; }

    public Integer getTotalBeds() { return totalBeds; }
    public void setTotalBeds(Integer totalBeds) { this.totalBeds = totalBeds; }

    public Integer getAvailableBeds() { return availableBeds; }
    public void setAvailableBeds(Integer availableBeds) { this.availableBeds = availableBeds; }
}
