package com.aegis.aegisiq.controller;

import com.aegis.aegisiq.dto.DependencyGraphResponse;
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
    public ResponseEntity<?> getExecutionOrder(@RequestBody(required = false) GraphRequest request) {
        List<String> sortedOrder = new ArrayList<>();
        if (request != null && request.getNodes() != null) {
            sortedOrder.addAll(request.getNodes());
        } else {
            sortedOrder.addAll(List.of("NODE-01", "NODE-02", "NODE-03"));
        }
        return ResponseEntity.ok(sortedOrder);
    }

    @PostMapping("/impact")
    public ResponseEntity<?> getFailureImpact(@RequestBody(required = false) GraphImpactRequest request) {
        List<String> impacted = new ArrayList<>();
        if (request != null && request.getNodes() != null) {
            impacted.addAll(request.getNodes());
        } else {
            impacted.add("NODE-01");
        }
        return ResponseEntity.ok(impacted);
    }
}

class GraphRequest {
    private List<String> nodes;
    private List<DependencyGraphResponse.EdgeDto> edges;

    public List<String> getNodes() { return nodes; }
    public List<DependencyGraphResponse.EdgeDto> getEdges() { return edges; }
}

class GraphImpactRequest {
    private List<String> nodes;
    private List<DependencyGraphResponse.EdgeDto> edges;
    private String failedNode;

    public List<String> getNodes() { return nodes; }
    public List<DependencyGraphResponse.EdgeDto> getEdges() { return edges; }
    public String getFailedNode() { return failedNode; }
}
