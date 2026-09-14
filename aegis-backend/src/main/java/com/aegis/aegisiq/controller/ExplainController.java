package com.aegis.aegisiq.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/explain")
public class ExplainController {

    @PostMapping("/reason")
    public Map<String, Object> explainIncident(@RequestBody Map<String, Object> request) {
        return Map.of(
            "alertId", request.getOrDefault("alertId", "ALERT-101"),
            "primaryCause", "Unindexed database query during traffic spike",
            "stepByStepReasoning", List.of(
                "Step 1: CPU spike detected at 12:40 PM",
                "Step 2: Database Connection Pool exhausted",
                "Step 3: Downstream gateway timeout triggered"
            ),
            "confidenceScore", 0.94
        );
    }
}