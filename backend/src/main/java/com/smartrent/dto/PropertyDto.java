package com.smartrent.dto;

import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PropertyDto {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String area;
    private String pincode;
    private String landmark;
    private Double distanceKm;
    private UserDto owner;
    private PropertyStatus status;
    private boolean featured;
    private Double ratingAvg;
    private Integer reviewCount;
    private Double startingRent;
    private List<PropertyImageDto> images = new ArrayList<>();
    private List<RoomDto> rooms = new ArrayList<>();
    private Set<String> amenities = new HashSet<>();
    private LocalDateTime createdAt;

    public PropertyDto() {}

    public static PropertyDto fromEntity(Property property) {
        if (property == null) return null;
        PropertyDto dto = new PropertyDto();
        dto.setId(property.getId());
        dto.setName(property.getName());
        dto.setDescription(property.getDescription());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setArea(property.getArea());
        dto.setPincode(property.getPincode());
        dto.setLandmark(property.getLandmark());
        dto.setDistanceKm(property.getDistanceKm());
        dto.setOwner(UserDto.fromEntity(property.getOwner()));
        dto.setStatus(property.getStatus());
        dto.setFeatured(property.isFeatured());
        dto.setRatingAvg(property.getRatingAvg());
        dto.setReviewCount(property.getReviewCount());
        dto.setStartingRent(property.getStartingRent());
        if (property.getImages() != null) {
            dto.setImages(property.getImages().stream().map(PropertyImageDto::fromEntity).collect(Collectors.toList()));
        }
        if (property.getRooms() != null) {
            dto.setRooms(property.getRooms().stream().map(RoomDto::fromEntity).collect(Collectors.toList()));
        }
        if (property.getAmenities() != null) {
            dto.setAmenities(new HashSet<>(property.getAmenities()));
        }
        dto.setCreatedAt(property.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public UserDto getOwner() { return owner; }
    public void setOwner(UserDto owner) { this.owner = owner; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Double getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Double getStartingRent() { return startingRent; }
    public void setStartingRent(Double startingRent) { this.startingRent = startingRent; }

    public List<PropertyImageDto> getImages() { return images; }
    public void setImages(List<PropertyImageDto> images) { this.images = images; }

    public List<RoomDto> getRooms() { return rooms; }
    public void setRooms(List<RoomDto> rooms) { this.rooms = rooms; }

    public Set<String> getAmenities() { return amenities; }
    public void setAmenities(Set<String> amenities) { this.amenities = amenities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
