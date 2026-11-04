package com.smartrent.repository;

import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyStatus;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    List<Property> findByOwner(User owner);
    List<Property> findByStatus(PropertyStatus status);
    List<Property> findByFeaturedTrueAndStatus(PropertyStatus status);

    @Query("SELECT DISTINCT p FROM Property p LEFT JOIN p.rooms r WHERE p.status = :status AND " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:area IS NULL OR LOWER(p.area) LIKE LOWER(CONCAT('%', :area, '%')) " +
           "  OR LOWER(p.name) LIKE LOWER(CONCAT('%', :area, '%')) " +
           "  OR LOWER(p.landmark) LIKE LOWER(CONCAT('%', :area, '%')) " +
           "  OR LOWER(p.description) LIKE LOWER(CONCAT('%', :area, '%')) " +
           "  OR LOWER(p.address) LIKE LOWER(CONCAT('%', :area, '%'))) AND " +
           "(:maxRent IS NULL OR p.startingRent <= :maxRent OR r.rentMonthly <= :maxRent) AND " +
           "(:minRent IS NULL OR p.startingRent >= :minRent OR r.rentMonthly >= :minRent) AND " +
           "(:maxDistance IS NULL OR p.distanceKm <= :maxDistance)")
    List<Property> filterProperties(
            @Param("status") PropertyStatus status,
            @Param("city") String city,
            @Param("area") String area,
            @Param("minRent") Double minRent,
            @Param("maxRent") Double maxRent,
            @Param("maxDistance") Double maxDistance
    );
}
