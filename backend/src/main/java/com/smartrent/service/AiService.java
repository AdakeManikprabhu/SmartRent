package com.smartrent.service;

import com.smartrent.dto.*;
import com.smartrent.entity.ComplaintCategory;
import com.smartrent.entity.ComplaintPriority;
import com.smartrent.entity.PropertyStatus;
import com.smartrent.entity.RoomType;
import com.smartrent.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final PropertyRepository propertyRepository;

    public AiService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public NlpSearchResponse parseAndExecuteNlpSearch(NlpSearchRequest request) {
        String prompt = request.getPrompt() != null ? request.getPrompt().toLowerCase() : "";
        NlpSearchResponse response = new NlpSearchResponse();

        // Extract budget (e.g. under 12000, 12,000, ₹15000, below 10k)
        Pattern rentPattern = Pattern.compile("(under|below|max|less than|budget|₹|rs\\.?)\\s*([0-9]{1,2},?[0-9]{3}|[0-9]{1,2}k)");
        Matcher rentMatcher = rentPattern.matcher(prompt);
        if (rentMatcher.find()) {
            String valStr = rentMatcher.group(2).replace(",", "");
            if (valStr.endsWith("k")) {
                double num = Double.parseDouble(valStr.replace("k", "")) * 1000;
                response.setExtractedMaxRent(num);
            } else {
                response.setExtractedMaxRent(Double.parseDouble(valStr));
            }
        }

        // Extract Room Type
        if (prompt.contains("single") || prompt.contains("1 sharing") || prompt.contains("private room")) {
            response.setExtractedRoomType(RoomType.SINGLE);
        } else if (prompt.contains("double") || prompt.contains("2 sharing") || prompt.contains("twin")) {
            response.setExtractedRoomType(RoomType.DOUBLE);
        } else if (prompt.contains("triple") || prompt.contains("3 sharing") || prompt.contains("three sharing")) {
            response.setExtractedRoomType(RoomType.TRIPLE);
        }

        // Extract Amenities
        if (prompt.contains("food") || prompt.contains("meals") || prompt.contains("mess")) {
            response.setExtractedFood(true);
        }
        if (prompt.contains("wifi") || prompt.contains("wi-fi") || prompt.contains("internet")) {
            response.setExtractedWifi(true);
        }
        if (prompt.contains("ac") || prompt.contains("air condition")) {
            response.setExtractedAc(true);
        }
        if (prompt.contains("parking") || prompt.contains("bike parking") || prompt.contains("car parking")) {
            response.setExtractedParking(true);
        }

        // Extract Location (e.g. near REVA University, Koramangala, Indiranagar, Whitefield, HSR Layout)
        List<String> knownLocations = List.of("reva university", "koramangala", "indiranagar", "whitefield", "hsr layout", "electronic city", "hebbal", "yelahanka", "manyata");
        for (String loc : knownLocations) {
            if (prompt.contains(loc)) {
                response.setExtractedLocation(loc);
                break;
            }
        }

        // Run query against DB
        List<PropertyDto> allVerified = propertyRepository.findByStatus(PropertyStatus.VERIFIED).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());

        List<PropertyDto> matched = allVerified.stream().filter(p -> {
            if (response.getExtractedMaxRent() != null && p.getStartingRent() != null && p.getStartingRent() > response.getExtractedMaxRent()) {
                return false;
            }
            if (response.getExtractedLocation() != null) {
                String searchLoc = response.getExtractedLocation().toLowerCase();
                boolean locMatch = p.getArea().toLowerCase().contains(searchLoc) ||
                                   p.getName().toLowerCase().contains(searchLoc) ||
                                   (p.getLandmark() != null && p.getLandmark().toLowerCase().contains(searchLoc));
                if (!locMatch) return false;
            }
            if (response.getExtractedFood() != null && response.getExtractedFood() && !p.getAmenities().contains("Food")) {
                return false;
            }
            if (response.getExtractedWifi() != null && response.getExtractedWifi() && !p.getAmenities().contains("Wi-Fi")) {
                return false;
            }
            if (response.getExtractedAc() != null && response.getExtractedAc() && !p.getAmenities().contains("AC")) {
                return false;
            }
            return true;
        }).collect(Collectors.toList());

        // Fallback: if matched list is empty, return top rated properties
        if (matched.isEmpty()) {
            matched = allVerified.stream().limit(6).collect(Collectors.toList());
        }

        response.setMatchingProperties(matched);
        return response;
    }

    public RecommendationResponse generateRecommendations(RecommendationRequest req) {
        List<PropertyDto> allProps = propertyRepository.findByStatus(PropertyStatus.VERIFIED).stream()
                .map(PropertyDto::fromEntity)
                .collect(Collectors.toList());

        List<PropertyMatchDto> ranked = new ArrayList<>();

        for (PropertyDto p : allProps) {
            int score = 50; // base score
            List<String> reasons = new ArrayList<>();

            // Budget evaluation
            if (req.getMaxBudget() != null && p.getStartingRent() != null) {
                if (p.getStartingRent() <= req.getMaxBudget()) {
                    score += 25;
                    reasons.add("Within your budget of ₹" + String.format("%,.0f", req.getMaxBudget()));
                } else if (p.getStartingRent() <= req.getMaxBudget() * 1.1) {
                    score += 10;
                    reasons.add("Slightly above budget (₹" + String.format("%,.0f", p.getStartingRent()) + ")");
                } else {
                    score -= 20;
                }
            }

            // Location evaluation
            if (req.getPreferredLocation() != null && !req.getPreferredLocation().isBlank()) {
                String loc = req.getPreferredLocation().toLowerCase();
                if (p.getArea().toLowerCase().contains(loc) || p.getName().toLowerCase().contains(loc) || (p.getLandmark() != null && p.getLandmark().toLowerCase().contains(loc))) {
                    score += 20;
                    reasons.add("Prime location in " + p.getArea());
                }
            }

            // Distance evaluation
            if (p.getDistanceKm() != null) {
                if (req.getMaxDistanceKm() != null && p.getDistanceKm() <= req.getMaxDistanceKm()) {
                    score += 15;
                    reasons.add("Only " + p.getDistanceKm() + " km from your location");
                } else if (p.getDistanceKm() <= 3.0) {
                    score += 10;
                    reasons.add(p.getDistanceKm() + " km away");
                }
            }

            // Amenities evaluation
            if (Boolean.TRUE.equals(req.getFoodRequired())) {
                if (p.getAmenities().contains("Food")) {
                    score += 10;
                    reasons.add("Food & Mess included");
                } else {
                    score -= 10;
                }
            }
            if (Boolean.TRUE.equals(req.getWifiRequired())) {
                if (p.getAmenities().contains("Wi-Fi")) {
                    score += 10;
                    reasons.add("High-speed Wi-Fi available");
                }
            }
            if (Boolean.TRUE.equals(req.getParkingRequired())) {
                if (p.getAmenities().contains("Parking")) {
                    score += 5;
                    reasons.add("Secure Parking");
                }
            }
            if (Boolean.TRUE.equals(req.getAcRequired())) {
                if (p.getAmenities().contains("AC")) {
                    score += 10;
                    reasons.add("Air Conditioning");
                }
            }

            // Rating evaluation
            if (p.getRatingAvg() != null && p.getRatingAvg() >= 4.5) {
                score += 10;
                reasons.add("Top rated (" + p.getRatingAvg() + " ★)");
            }

            int finalPercent = Math.min(99, Math.max(50, score));
            if (reasons.isEmpty()) {
                reasons.add("Popular choice in " + p.getCity());
            }

            ranked.add(new PropertyMatchDto(p, finalPercent, reasons));
        }

        ranked.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));

        return new RecommendationResponse(ranked.stream().limit(8).collect(Collectors.toList()));
    }

    public ComplaintClassificationResponse classifyComplaint(String text) {
        String lower = text != null ? text.toLowerCase() : "";
        ComplaintCategory category = ComplaintCategory.OTHER;
        ComplaintPriority priority = ComplaintPriority.MEDIUM;
        String explanation = "Standard maintenance priority";

        if (lower.contains("wifi") || lower.contains("internet") || lower.contains("router") || lower.contains("network")) {
            category = ComplaintCategory.WIFI;
            priority = ComplaintPriority.MEDIUM;
            explanation = "Network / connectivity issue identified.";
        } else if (lower.contains("power") || lower.contains("electricity") || lower.contains("light") || lower.contains("switch") || lower.contains("fuse") || lower.contains("spark") || lower.contains("current")) {
            category = ComplaintCategory.ELECTRICITY;
            priority = lower.contains("spark") || lower.contains("out") || lower.contains("hours") || lower.contains("no power") ? ComplaintPriority.HIGH : ComplaintPriority.MEDIUM;
            explanation = "Electrical outage / risk issue identified.";
        } else if (lower.contains("water") || lower.contains("tap") || lower.contains("leak") || lower.contains("drain") || lower.contains("geyser") || lower.contains("shower")) {
            category = ComplaintCategory.WATER;
            priority = lower.contains("overflow") || lower.contains("leak") || lower.contains("no water") ? ComplaintPriority.HIGH : ComplaintPriority.MEDIUM;
            explanation = "Plumbing / water supply concern detected.";
        } else if (lower.contains("food") || lower.contains("meal") || lower.contains("breakfast") || lower.contains("dinner") || lower.contains("taste") || lower.contains("kitchen")) {
            category = ComplaintCategory.FOOD;
            priority = ComplaintPriority.LOW;
            explanation = "Catering / mess food quality feedback.";
        } else if (lower.contains("lock") || lower.contains("security") || lower.contains("cctv") || lower.contains("stolen") || lower.contains("thief") || lower.contains("gate")) {
            category = ComplaintCategory.SECURITY;
            priority = ComplaintPriority.HIGH;
            explanation = "Safety and security alert!";
        } else if (lower.contains("clean") || lower.contains("dust") || lower.contains("trash") || lower.contains("garbage") || lower.contains("sweep")) {
            category = ComplaintCategory.CLEANING;
            priority = ComplaintPriority.LOW;
            explanation = "Housekeeping and sanitation request.";
        } else if (lower.contains("lift") || lower.contains("bed") || lower.contains("door") || lower.contains("fan") || lower.contains("ac")) {
            category = ComplaintCategory.MAINTENANCE;
            priority = ComplaintPriority.MEDIUM;
            explanation = "General fixture and furniture maintenance.";
        }

        return new ComplaintClassificationResponse(category, priority, explanation);
    }

    public String generatePropertyDescription(GenerateDescriptionRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Welcome to ").append(req.getName() != null ? req.getName() : "this modern property")
          .append(", a premier living space located in the vibrant hub of ").append(req.getArea() != null ? req.getArea() : "the city")
          .append(", ").append(req.getCity() != null ? req.getCity() : "Bengaluru").append(". ");

        if (req.getLandmark() != null && !req.getLandmark().isBlank()) {
            sb.append("Conveniently situated near ").append(req.getLandmark()).append(", offering effortless commute and access to key tech parks, colleges, and metro stations. ");
        }

        sb.append("Designed for modern students and professionals, this property provides fully furnished room options starting at just ₹")
          .append(req.getStartingRent() != null ? String.format("%,.0f", req.getStartingRent()) : "8,000").append("/month. ");

        if (req.getAmenities() != null && !req.getAmenities().isEmpty()) {
            sb.append("Enjoy world-class amenities including ").append(String.join(", ", req.getAmenities()))
              .append(". Experience 24/7 safety, hygienic meals, and a supportive community atmosphere that feels just like home.");
        } else {
            sb.append("Enjoy 24/7 security, high-speed Wi-Fi, daily housekeeping, and a warm community environment.");
        }

        return sb.toString();
    }
}
