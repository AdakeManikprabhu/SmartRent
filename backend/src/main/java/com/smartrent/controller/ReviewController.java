package com.smartrent.controller;

import com.smartrent.dto.ReviewDto;
import com.smartrent.dto.ReviewRequest;
import com.smartrent.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewDto>> getReviewsByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsByProperty(propertyId));
    }

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<ReviewDto> addReview(@Valid @RequestBody ReviewRequest request, Authentication authentication) {
        return ResponseEntity.ok(reviewService.addReview(request, authentication.getName()));
    }
}
