package com.smartrent.service;

import com.smartrent.dto.PropertyDto;
import com.smartrent.entity.Favorite;
import com.smartrent.entity.Property;
import com.smartrent.entity.User;
import com.smartrent.repository.FavoriteRepository;
import com.smartrent.repository.PropertyRepository;
import com.smartrent.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, PropertyRepository propertyRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    public List<PropertyDto> getFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUser(user).stream()
                .map(fav -> PropertyDto.fromEntity(fav.getProperty()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleFavorite(Long propertyId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (favoriteRepository.existsByUserAndProperty(user, property)) {
            favoriteRepository.deleteByUserAndProperty(user, property);
        } else {
            favoriteRepository.save(new Favorite(user, property));
        }
    }
}
