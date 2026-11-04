package com.smartrent.dto;

import com.smartrent.entity.ComplaintCategory;
import com.smartrent.entity.ComplaintPriority;

public class ComplaintClassificationResponse {
    private ComplaintCategory category;
    private ComplaintPriority priority;
    private String explanation;

    public ComplaintClassificationResponse() {}

    public ComplaintClassificationResponse(ComplaintCategory category, ComplaintPriority priority, String explanation) {
        this.category = category;
        this.priority = priority;
        this.explanation = explanation;
    }

    public ComplaintCategory getCategory() { return category; }
    public void setCategory(ComplaintCategory category) { this.category = category; }

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
