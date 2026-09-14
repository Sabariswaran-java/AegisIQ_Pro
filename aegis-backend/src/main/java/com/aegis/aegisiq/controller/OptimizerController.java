package com.aegis.aegisiq.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/optimizer")
public class OptimizerController {

    @PostMapping("/plan")
    public Map<String, Object> evaluateDeploymentRisk(@RequestBody Map<String, Object> deploymentData) {
        return Map.of(
            "deploymentName", deploymentData.getOrDefault("name", "v2.1-Release"),
            "deploymentRiskScore", 12,
            "recommendedWindow", "2:00 AM - 4:00 AM UTC",
            "approvalStatus", "RECOMMENDED"
        );
    }
}