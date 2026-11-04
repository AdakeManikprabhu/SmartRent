package com.smartrent.dto;

import com.smartrent.entity.Review;
import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private UserDto tenant;
    private Long propertyId;
    private Integer rating;
    private Integer cleanliness;
    private Integer food;
    private Integer location;
    private Integer security;
    private Integer facilities;
    private Integer valueForMoney;
    private String comment;
    private LocalDateTime createdAt;

    public ReviewDto() {}

    public static ReviewDto fromEntity(Review r) {
        if (r == null) return null;
        ReviewDto dto = new ReviewDto();
        dto.setId(r.getId());
        dto.setTenant(UserDto.fromEntity(r.getTenant()));
        if (r.getProperty() != null) dto.setPropertyId(r.getProperty().getId());
        dto.setRating(r.getRating());
        dto.setCleanliness(r.getCleanliness());
        dto.setFood(r.getFood());
        dto.setLocation(r.getLocation());
        dto.setSecurity(r.getSecurity());
        dto.setFacilities(r.getFacilities());
        dto.setValueForMoney(r.getValueForMoney());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getTenant() { return tenant; }
    public void setTenant(UserDto tenant) { this.tenant = tenant; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getCleanliness() { return cleanliness; }
    public void setCleanliness(Integer cleanliness) { this.cleanliness = cleanliness; }

    public Integer getFood() { return food; }
    public void setFood(Integer food) { this.food = food; }

    public Integer getLocation() { return location; }
    public void setLocation(Integer location) { this.location = location; }

    public Integer getSecurity() { return security; }
    public void setSecurity(Integer security) { this.security = security; }

    public Integer getFacilities() { return facilities; }
    public void setFacilities(Integer facilities) { this.facilities = facilities; }

    public Integer getValueForMoney() { return valueForMoney; }
    public void setValueForMoney(Integer valueForMoney) { this.valueForMoney = valueForMoney; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
