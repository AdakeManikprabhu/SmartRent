package com.smartrent.repository;

import com.smartrent.entity.Property;
import com.smartrent.entity.Review;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProperty(Property property);
    Optional<Review> findByTenantAndProperty(User tenant, Property property);
    boolean existsByTenantAndProperty(User tenant, Property property);
}
