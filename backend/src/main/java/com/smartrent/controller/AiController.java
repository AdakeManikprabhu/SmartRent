package com.smartrent.controller;

import com.smartrent.dto.*;
import com.smartrent.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/search")
    public ResponseEntity<NlpSearchResponse> nlpSearch(@RequestBody NlpSearchRequest request) {
        return ResponseEntity.ok(aiService.parseAndExecuteNlpSearch(request));
    }

    @PostMapping("/recommendations")
    public ResponseEntity<RecommendationResponse> getRecommendations(@RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(aiService.generateRecommendations(request));
    }

    @PostMapping("/classify-complaint")
    public ResponseEntity<ComplaintClassificationResponse> classifyComplaint(@RequestBody ComplaintClassificationRequest request) {
        return ResponseEntity.ok(aiService.classifyComplaint(request.getText()));
    }

    @PostMapping("/generate-description")
    public ResponseEntity<String> generateDescription(@RequestBody GenerateDescriptionRequest request) {
        return ResponseEntity.ok(aiService.generatePropertyDescription(request));
    }
}
