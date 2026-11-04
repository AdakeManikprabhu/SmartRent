package com.smartrent.dto;

import com.smartrent.entity.PropertyImage;

public class PropertyImageDto {
    private Long id;
    private String imageUrl;
    private boolean primaryImage;

    public PropertyImageDto() {}

    public static PropertyImageDto fromEntity(PropertyImage img) {
        if (img == null) return null;
        PropertyImageDto dto = new PropertyImageDto();
        dto.setId(img.getId());
        dto.setImageUrl(img.getImageUrl());
        dto.setPrimaryImage(img.isPrimaryImage());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isPrimaryImage() { return primaryImage; }
    public void setPrimaryImage(boolean primaryImage) { this.primaryImage = primaryImage; }
}
