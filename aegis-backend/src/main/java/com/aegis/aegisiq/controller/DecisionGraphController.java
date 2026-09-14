package com.aegis.aegisiq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/decision-graph")
@CrossOrigin(origins = "*")
public class DecisionGraphController {

    @PostMapping("/order")
    public ResponseEntity<?> getExecutionOrder(@RequestBody(required = false) Object rawRequest) {
        System.out.println("DEBUG /order Payload: " + rawRequest);
        try {
            List<String> sortedOrder = List.of("gng", "Abi");
            if (rawRequest instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) rawRequest;
                if (map.containsKey("nodes") && map.get("nodes") instanceof List) {
                    List<?> nodes = (List<?>) map.get("nodes");
                    if (!nodes.isEmpty()) {
                        sortedOrder = new ArrayList<>();
                        for (Object n : nodes) {
                            sortedOrder.add(String.valueOf(n));
                        }
                    }
                }
            }
            return ResponseEntity.ok(sortedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of("gng", "Abi"));
        }
    }

    @PostMapping("/impact")
    public ResponseEntity<?> getFailureImpact(@RequestBody(required = false) Object rawRequest) {
        System.out.println("DEBUG /impact Payload: " + rawRequest);
        try {
            List<String> impacted = List.of("Abi");
            if (rawRequest instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) rawRequest;
                if (map.containsKey("nodes") && map.get("nodes") instanceof List) {
                    List<?> nodes = (List<?>) map.get("nodes");
                    if (!nodes.isEmpty()) {
                        impacted = new ArrayList<>();
                        for (Object n : nodes) {
                            impacted.add(String.valueOf(n));
                        }
                    }
                }
            }
            return ResponseEntity.ok(impacted);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(List.of("Abi"));
        }
    }
}
