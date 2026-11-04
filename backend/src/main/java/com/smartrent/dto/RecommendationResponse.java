package com.smartrent.dto;

import java.util.List;

public class RecommendationResponse {
    private List<PropertyMatchDto> recommendations;

    public RecommendationResponse() {}

    public RecommendationResponse(List<PropertyMatchDto> recommendations) {
        this.recommendations = recommendations;
    }

    public List<PropertyMatchDto> getRecommendations() { return recommendations; }
    public void setRecommendations(List<PropertyMatchDto> recommendations) { this.recommendations = recommendations; }
}
