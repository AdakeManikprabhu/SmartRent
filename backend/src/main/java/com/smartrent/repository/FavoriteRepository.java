package com.smartrent.repository;

import com.smartrent.entity.Favorite;
import com.smartrent.entity.Property;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndProperty(User user, Property property);
    boolean existsByUserAndProperty(User user, Property property);
    void deleteByUserAndProperty(User user, Property property);
}
