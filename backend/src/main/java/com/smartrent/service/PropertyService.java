package com.smartrent.service;

import com.smartrent.dto.PropertyDto;
import com.smartrent.dto.PropertyRequest;
import com.smartrent.dto.RoomDto;
import com.smartrent.dto.RoomRequest;
import com.smartrent.entity.*;
import com.smartrent.repository.PropertyRepository;
import com.smartrent.repository.RoomRepository;
import com.smartrent.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository, RoomRepository roomRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public List<PropertyDto> getAllVerifiedProperties() {
        return propertyRepository.findByStatus(PropertyStatus.VERIFIED).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PropertyDto> getFeaturedProperties() {
        return propertyRepository.findByFeaturedTrueAndStatus(PropertyStatus.VERIFIED).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + id));
        return PropertyDto.fromEntity(property);
    }

    public List<PropertyDto> searchProperties(String city, String area, Double minRent, Double maxRent, Double maxDistance, String roomType, String amenitiesStr) {
        List<Property> properties = propertyRepository.filterProperties(PropertyStatus.VERIFIED, city, area, minRent, maxRent, maxDistance);

        return properties.stream()
                .filter(p -> {
                    // Amenities filter
                    if (amenitiesStr != null && !amenitiesStr.isBlank()) {
                        String[] reqAmenities = amenitiesStr.toLowerCase().split(",");
                        Set<String> propAmenities = p.getAmenities().stream().map(String::toLowerCase).collect(Collectors.toSet());
                        for (String req : reqAmenities) {
                            if (!propAmenities.contains(req.trim())) return false;
                        }
                    }

                    // Room Type filter
                    if (roomType != null && !roomType.isBlank()) {
                        try {
                            RoomType typeEnum = RoomType.valueOf(roomType.toUpperCase());
                            boolean hasRoomType = p.getRooms().stream()
                                    .anyMatch(r -> r.getType() == typeEnum 
                                            && r.getAvailabilityStatus() == AvailabilityStatus.AVAILABLE
                                            && (maxRent == null || r.getRentMonthly() <= maxRent)
                                            && (minRent == null || r.getRentMonthly() >= minRent));
                            if (!hasRoomType) return false;
                        } catch (IllegalArgumentException e) {
                            // Invalid room type enum, ignore filter
                        }
                    } else if (maxRent != null || minRent != null) {
                        // Ensure at least one room fits min/max rent
                        boolean hasRentMatch = p.getRooms().stream()
                                .anyMatch(r -> (maxRent == null || r.getRentMonthly() <= maxRent)
                                        && (minRent == null || r.getRentMonthly() >= minRent));
                        if (!hasRentMatch) return false;
                    }
                    return true;
                })
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PropertyDto> getPropertiesByOwner(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return propertyRepository.findByOwner(owner).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyDto createProperty(PropertyRequest request, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Property property = new Property();
        property.setName(request.getName());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setArea(request.getArea());
        property.setPincode(request.getPincode());
        property.setLandmark(request.getLandmark());
        property.setDistanceKm(request.getDistanceKm() != null ? request.getDistanceKm() : 2.5);
        property.setOwner(owner);
        property.setStatus(PropertyStatus.VERIFIED);
        property.setStartingRent(request.getStartingRent() != null ? request.getStartingRent() : 8000.0);

        if (request.getAmenities() != null) {
            property.setAmenities(request.getAmenities());
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            boolean first = true;
            for (String url : request.getImageUrls()) {
                property.getImages().add(new PropertyImage(property, url, first));
                first = false;
            }
        }

        Property saved = propertyRepository.save(property);
        return PropertyDto.fromEntity(saved);
    }

    @Transactional
    public RoomDto addRoomToProperty(Long propertyId, RoomRequest request, String ownerEmail) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized: You do not own this property");
        }

        Room room = new Room(
                property,
                request.getRoomNumber(),
                request.getType(),
                request.getRentMonthly(),
                request.getDepositAmount(),
                request.isAc(),
                request.isFurnished(),
                request.getTotalBeds(),
                request.getTotalBeds()
        );

        Room savedRoom = roomRepository.save(room);

        if (property.getStartingRent() == null || savedRoom.getRentMonthly() < property.getStartingRent()) {
            property.setStartingRent(savedRoom.getRentMonthly());
            propertyRepository.save(property);
        }

        return RoomDto.fromEntity(savedRoom);
    }

    @Transactional
    public PropertyDto updatePropertyStatus(Long propertyId, PropertyStatus status) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus(status);
        Property updated = propertyRepository.save(property);
        return PropertyDto.fromEntity(updated);
    }

    public List<PropertyDto> getAllPropertiesAdmin() {
        return propertyRepository.findAll().stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());
    }
}
