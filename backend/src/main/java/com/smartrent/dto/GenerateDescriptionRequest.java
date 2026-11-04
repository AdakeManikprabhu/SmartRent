package com.smartrent.dto;

import java.util.Set;

public class GenerateDescriptionRequest {
    private String name;
    private String area;
    private String city;
    private String landmark;
    private Double startingRent;
    private Set<String> amenities;

    public GenerateDescriptionRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public Double getStartingRent() { return startingRent; }
    public void setStartingRent(Double startingRent) { this.startingRent = startingRent; }

    public Set<String> getAmenities() { return amenities; }
    public void setAmenities(Set<String> amenities) { this.amenities = amenities; }
}
