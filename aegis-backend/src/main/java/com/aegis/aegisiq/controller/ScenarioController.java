package com.aegis.aegisiq.controller;

import com.aegis.aegisiq.dto.ScenarioRequest;
import com.aegis.aegisiq.dto.ScenarioResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenario")
public class ScenarioController {

    @PostMapping("/evaluate")
    public ScenarioResponse evaluateScenario(@RequestBody ScenarioRequest request) {
        double prob = request.getLoadPercentage() > 80 ? 0.85 : 0.15;
        String risk = request.getLoadPercentage() > 80 ? "HIGH" : "LOW";
        String action = request.getLoadPercentage() > 80 ? "Auto-scale 2 additional instances" : "Maintain normal configuration";

        return new ScenarioResponse(
            request.getAssetId(),
            "Evaluated " + request.getEventType() + " load test",
            risk,
            prob,
            action
        );
    }
}