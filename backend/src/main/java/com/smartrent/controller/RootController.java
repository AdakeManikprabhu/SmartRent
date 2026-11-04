package com.smartrent.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> info = new HashMap<>();
        info.put("status", "UP");
        info.put("service", "SmartRent AI-Powered PG & Rental Management Platform Backend API");
        info.put("frontendUrl", "http://localhost:5173");
        info.put("h2ConsoleUrl", "http://localhost:8080/h2-console");
        info.put("apiDocs", "http://localhost:8080/api/properties");
        return ResponseEntity.ok(info);
    }
}
