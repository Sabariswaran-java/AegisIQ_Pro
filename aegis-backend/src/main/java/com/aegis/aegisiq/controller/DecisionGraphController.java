package com.aegis.aegisiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decision-graph")
@CrossOrigin(origins = "*")
public class DecisionGraphController {

    @PostMapping("/order")
    public ResponseEntity<List<String>> getExecutionOrder(@RequestBody(required = false) String rawBody) {
        System.out.println("POST /order received: " + rawBody);
        return ResponseEntity.ok(List.of("gng", "Abi"));
    }

    @PostMapping("/impact")
    public ResponseEntity<List<String>> getFailureImpact(@RequestBody(required = false) String rawBody) {
        System.out.println("POST /impact received: " + rawBody);
        return ResponseEntity.ok(List.of("Abi"));
    }
}
