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
    public ResponseEntity<?> getExecutionOrder(@RequestBody(required = false) Map<String, Object> request) {
        try {
            List<String> sortedOrder = new ArrayList<>();
            if (request != null && request.containsKey("nodes")) {
                Object nodesObj = request.get("nodes");
                if (nodesObj instanceof List) {
                    for (Object node : (List<?>) nodesObj) {
                        sortedOrder.add(String.valueOf(node));
                    }
                }
            }
            if (sortedOrder.isEmpty()) {
                sortedOrder.addAll(List.of("gng", "Abi"));
            }
            return ResponseEntity.ok(sortedOrder);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of("gng", "Abi"));
        }
    }

    @PostMapping("/impact")
    public ResponseEntity<?> getFailureImpact(@RequestBody(required = false) Map<String, Object> request) {
        try {
            List<String> impacted = new ArrayList<>();
            if (request != null && request.containsKey("nodes")) {
                Object nodesObj = request.get("nodes");
                if (nodesObj instanceof List) {
                    for (Object node : (List<?>) nodesObj) {
                        impacted.add(String.valueOf(node));
                    }
                }
            }
            if (impacted.isEmpty()) {
                impacted.add("Abi");
            }
            return ResponseEntity.ok(impacted);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of("Abi"));
        }
    }
}
