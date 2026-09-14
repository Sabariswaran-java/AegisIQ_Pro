package com.aegis.aegisiq.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/incident")
public class IncidentController {

    @GetMapping("/historical")
    public Map<String, Object> searchHistoricalFixes(@RequestParam(defaultValue = "CPU_SPIKE") String query) {
        return Map.of(
            "matchedQuery", query,
            "similarPastIncidents", List.of(
                Map.of("id", "INC-2025-01", "resolution", "Restart Pod and increase memory limit to 4GB", "similarityScore", 0.92),
                Map.of("id", "INC-2025-09", "resolution", "Apply index on user_id column", "similarityScore", 0.88)
            )
        );
    }
}