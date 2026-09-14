package com.aegis.aegisiq.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/twin")
public class DecisionTwinController {

    @PostMapping("/simulate")
    public Map<String, Object> simulateTwin(@RequestBody Map<String, Object> request) {
        String assetId = String.valueOf(request.getOrDefault("assetId", "Asset-1"));
        return Map.of(
            "assetId", assetId,
            "simulatedStatus", "STABLE",
            "predictedCpuLoad", 68.5,
            "failoverProbability", 0.04,
            "status", "Twin Simulation Completed Successfully"
        );
    }
}