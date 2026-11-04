package com.smartrent.dto;

import com.smartrent.entity.Complaint;
import com.smartrent.entity.ComplaintCategory;
import com.smartrent.entity.ComplaintPriority;
import com.smartrent.entity.ComplaintStatus;
import java.time.LocalDateTime;

public class ComplaintDto {
    private Long id;
    private UserDto tenant;
    private PropertyDto property;
    private RoomDto room;
    private String title;
    private String description;
    private ComplaintCategory category;
    private ComplaintPriority priority;
    private ComplaintStatus status;
    private String attachmentUrl;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ComplaintDto() {}

    public static ComplaintDto fromEntity(Complaint c) {
        if (c == null) return null;
        ComplaintDto dto = new ComplaintDto();
        dto.setId(c.getId());
        dto.setTenant(UserDto.fromEntity(c.getTenant()));
        dto.setProperty(PropertyDto.fromEntity(c.getProperty()));
        if (c.getRoom() != null) dto.setRoom(RoomDto.fromEntity(c.getRoom()));
        dto.setTitle(c.getTitle());
        dto.setDescription(c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setPriority(c.getPriority());
        dto.setStatus(c.getStatus());
        dto.setAttachmentUrl(c.getAttachmentUrl());
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getTenant() { return tenant; }
    public void setTenant(UserDto tenant) { this.tenant = tenant; }

    public PropertyDto getProperty() { return property; }
    public void setProperty(PropertyDto property) { this.property = property; }

    public RoomDto getRoom() { return room; }
    public void setRoom(RoomDto room) { this.room = room; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ComplaintCategory getCategory() { return category; }
    public void setCategory(ComplaintCategory category) { this.category = category; }

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
