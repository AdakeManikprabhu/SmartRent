package com.smartrent.repository;

import com.smartrent.entity.Complaint;
import com.smartrent.entity.ComplaintStatus;
import com.smartrent.entity.Property;
import com.smartrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByTenant(User tenant);
    List<Complaint> findByProperty(Property property);
    List<Complaint> findByStatus(ComplaintStatus status);

    @Query("SELECT c FROM Complaint c WHERE c.property.owner = :owner")
    List<Complaint> findByOwner(@Param("owner") User owner);
}
