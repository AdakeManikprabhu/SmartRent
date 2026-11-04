package com.smartrent.dto;

import com.smartrent.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public class ComplaintStatusRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    private String resolutionNotes;

    public ComplaintStatusRequest() {}

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
