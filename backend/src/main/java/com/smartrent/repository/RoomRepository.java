package com.smartrent.repository;

import com.smartrent.entity.AvailabilityStatus;
import com.smartrent.entity.Property;
import com.smartrent.entity.Room;
import com.smartrent.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByProperty(Property property);
    List<Room> findByPropertyAndAvailabilityStatus(Property property, AvailabilityStatus status);
    List<Room> findByTypeAndAvailabilityStatus(RoomType type, AvailabilityStatus status);
}
