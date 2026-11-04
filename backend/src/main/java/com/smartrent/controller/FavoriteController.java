package com.smartrent.controller;

import com.smartrent.dto.PropertyDto;
import com.smartrent.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    @PreAuthorize("hasRole('TENANT') or hasRole('OWNER')")
    public ResponseEntity<List<PropertyDto>> getFavorites(Authentication authentication) {
        return ResponseEntity.ok(favoriteService.getFavorites(authentication.getName()));
    }

    @PostMapping("/{propertyId}")
    @PreAuthorize("hasRole('TENANT') or hasRole('OWNER')")
    public ResponseEntity<Void> toggleFavorite(@PathVariable Long propertyId, Authentication authentication) {
        favoriteService.toggleFavorite(propertyId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
