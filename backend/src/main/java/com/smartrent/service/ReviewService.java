package com.smartrent.service;

import com.smartrent.dto.ReviewDto;
import com.smartrent.dto.ReviewRequest;
import com.smartrent.entity.Property;
import com.smartrent.entity.Review;
import com.smartrent.entity.User;
import com.smartrent.repository.PropertyRepository;
import com.smartrent.repository.ReviewRepository;
import com.smartrent.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, PropertyRepository propertyRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    public List<ReviewDto> getReviewsByProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return reviewRepository.findByProperty(property).stream()
                .map(ReviewDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(ReviewRequest request, String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (reviewRepository.existsByTenantAndProperty(tenant, property)) {
            throw new RuntimeException("You have already submitted a review for this property");
        }

        Review review = new Review();
        review.setTenant(tenant);
        review.setProperty(property);
        review.setRating(request.getRating());
        review.setCleanliness(request.getCleanliness());
        review.setFood(request.getFood());
        review.setLocation(request.getLocation());
        review.setSecurity(request.getSecurity());
        review.setFacilities(request.getFacilities());
        review.setValueForMoney(request.getValueForMoney());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        // Recalculate property average rating & review count
        List<Review> allReviews = reviewRepository.findByProperty(property);
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
        property.setRatingAvg(Math.round(avg * 10.0) / 10.0);
        property.setReviewCount(allReviews.size());
        propertyRepository.save(property);

        return ReviewDto.fromEntity(saved);
    }
}
