package com.smartrent.dto;

import com.smartrent.entity.RoomType;

public class RecommendationRequest {
    private Double maxBudget;
    private String preferredLocation;
    private RoomType preferredRoomType;
    private Boolean foodRequired;
    private Boolean wifiRequired;
    private Boolean parkingRequired;
    private Boolean acRequired;
    private Double maxDistanceKm;

    public RecommendationRequest() {}

    public Double getMaxBudget() { return maxBudget; }
    public void setMaxBudget(Double maxBudget) { this.maxBudget = maxBudget; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }

    public RoomType getPreferredRoomType() { return preferredRoomType; }
    public void setPreferredRoomType(RoomType preferredRoomType) { this.preferredRoomType = preferredRoomType; }

    public Boolean getFoodRequired() { return foodRequired; }
    public void setFoodRequired(Boolean foodRequired) { this.foodRequired = foodRequired; }

    public Boolean getWifiRequired() { return wifiRequired; }
    public void setWifiRequired(Boolean wifiRequired) { this.wifiRequired = wifiRequired; }

    public Boolean getParkingRequired() { return parkingRequired; }
    public void setParkingRequired(Boolean parkingRequired) { this.parkingRequired = parkingRequired; }

    public Boolean getAcRequired() { return acRequired; }
    public void setAcRequired(Boolean acRequired) { this.acRequired = acRequired; }

    public Double getMaxDistanceKm() { return maxDistanceKm; }
    public void setMaxDistanceKm(Double maxDistanceKm) { this.maxDistanceKm = maxDistanceKm; }
}
