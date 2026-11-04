package com.smartrent.dto;

import com.smartrent.entity.RoomType;

public class NlpSearchRequest {
    private String prompt;

    public NlpSearchRequest() {}

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}
