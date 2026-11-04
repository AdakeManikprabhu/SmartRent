package com.smartrent.controller;

import com.smartrent.dto.PropertyDto;
import com.smartrent.dto.PropertyRequest;
import com.smartrent.dto.RoomDto;
import com.smartrent.dto.RoomRequest;
import com.smartrent.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<List<PropertyDto>> getAllVerifiedProperties() {
        return ResponseEntity.ok(propertyService.getAllVerifiedProperties());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyDto>> getFeaturedProperties() {
        return ResponseEntity.ok(propertyService.getFeaturedProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDto>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) Double minRent,
            @RequestParam(required = false) Double maxRent,
            @RequestParam(required = false) Double maxDistance,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) String amenities
    ) {
        return ResponseEntity.ok(propertyService.searchProperties(city, area, minRent, maxRent, maxDistance, roomType, amenities));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<PropertyDto>> getOwnerProperties(Authentication authentication) {
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(authentication.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody PropertyRequest request, Authentication authentication) {
        return ResponseEntity.ok(propertyService.createProperty(request, authentication.getName()));
    }

    @PostMapping("/{propertyId}/rooms")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<RoomDto> addRoom(@PathVariable Long propertyId, @Valid @RequestBody RoomRequest request, Authentication authentication) {
        return ResponseEntity.ok(propertyService.addRoomToProperty(propertyId, request, authentication.getName()));
    }
}
