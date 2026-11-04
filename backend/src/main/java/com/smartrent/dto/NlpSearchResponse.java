package com.smartrent.dto;

import com.smartrent.entity.RoomType;
import java.util.List;

public class NlpSearchResponse {
    private String extractedLocation;
    private Double extractedMaxRent;
    private Double extractedMinRent;
    private RoomType extractedRoomType;
    private Boolean extractedFood;
    private Boolean extractedWifi;
    private Boolean extractedAc;
    private Boolean extractedParking;
    private List<PropertyDto> matchingProperties;

    public NlpSearchResponse() {}

    public String getExtractedLocation() { return extractedLocation; }
    public void setExtractedLocation(String extractedLocation) { this.extractedLocation = extractedLocation; }

    public Double getExtractedMaxRent() { return extractedMaxRent; }
    public void setExtractedMaxRent(Double extractedMaxRent) { this.extractedMaxRent = extractedMaxRent; }

    public Double getExtractedMinRent() { return extractedMinRent; }
    public void setExtractedMinRent(Double extractedMinRent) { this.extractedMinRent = extractedMinRent; }

    public RoomType getExtractedRoomType() { return extractedRoomType; }
    public void setExtractedRoomType(RoomType extractedRoomType) { this.extractedRoomType = extractedRoomType; }

    public Boolean getExtractedFood() { return extractedFood; }
    public void setExtractedFood(Boolean extractedFood) { this.extractedFood = extractedFood; }

    public Boolean getExtractedWifi() { return extractedWifi; }
    public void setExtractedWifi(Boolean extractedWifi) { this.extractedWifi = extractedWifi; }

    public Boolean getExtractedAc() { return extractedAc; }
    public void setExtractedAc(Boolean extractedAc) { this.extractedAc = extractedAc; }

    public Boolean getExtractedParking() { return extractedParking; }
    public void setExtractedParking(Boolean extractedParking) { this.extractedParking = extractedParking; }

    public List<PropertyDto> getMatchingProperties() { return matchingProperties; }
    public void setMatchingProperties(List<PropertyDto> matchingProperties) { this.matchingProperties = matchingProperties; }
}
