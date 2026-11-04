package com.smartrent.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "property_id"})
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(nullable = false)
    private Integer rating; // 1-5 overall

    private Integer cleanliness; // 1-5
    private Integer food; // 1-5
    private Integer location; // 1-5
    private Integer security; // 1-5
    private Integer facilities; // 1-5
    private Integer valueForMoney; // 1-5

    @Column(length = 2000)
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getTenant() { return tenant; }
    public void setTenant(User tenant) { this.tenant = tenant; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Integer getCleanliness() { return cleanliness; }
    public void setCleanliness(Integer cleanliness) { this.cleanliness = cleanliness; }

    public Integer getFood() { return food; }
    public void setFood(Integer food) { this.food = food; }

    public Integer getLocation() { return location; }
    public void setLocation(Integer location) { this.location = location; }

    public Integer getSecurity() { return security; }
    public void setSecurity(Integer security) { this.security = security; }

    public Integer getFacilities() { return facilities; }
    public void setFacilities(Integer facilities) { this.facilities = facilities; }

    public Integer getValueForMoney() { return valueForMoney; }
    public void setValueForMoney(Integer valueForMoney) { this.valueForMoney = valueForMoney; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
