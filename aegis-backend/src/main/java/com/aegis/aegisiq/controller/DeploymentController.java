package com.aegis.aegisiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deployment")
public class DeploymentController {

    @GetMapping("/status")
    public ResponseEntity<?> getDeploymentStatus() {
        return ResponseEntity.ok("Deployment optimizer is active");
    }
}
