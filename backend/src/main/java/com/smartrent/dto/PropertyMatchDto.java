package com.smartrent.dto;

import java.util.List;

public class PropertyMatchDto {
    private PropertyDto property;
    private int matchPercentage;
    private List<String> matchReasons;

    public PropertyMatchDto() {}

    public PropertyMatchDto(PropertyDto property, int matchPercentage, List<String> matchReasons) {
        this.property = property;
        this.matchPercentage = matchPercentage;
        this.matchReasons = matchReasons;
    }

    public PropertyDto getProperty() { return property; }
    public void setProperty(PropertyDto property) { this.property = property; }

    public int getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(int matchPercentage) { this.matchPercentage = matchPercentage; }

    public List<String> getMatchReasons() { return matchReasons; }
    public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }
}
