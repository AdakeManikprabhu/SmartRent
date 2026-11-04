package com.smartrent.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotNull(message = "Overall rating is required")
    @Min(1) @Max(5)
    private Integer rating;

    @Min(1) @Max(5) private Integer cleanliness = 5;
    @Min(1) @Max(5) private Integer food = 5;
    @Min(1) @Max(5) private Integer location = 5;
    @Min(1) @Max(5) private Integer security = 5;
    @Min(1) @Max(5) private Integer facilities = 5;
    @Min(1) @Max(5) private Integer valueForMoney = 5;

    private String comment;

    public ReviewRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

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
}
