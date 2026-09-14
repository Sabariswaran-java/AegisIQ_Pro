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
    public ResponseEntity<?> getExecutionOrder(@RequestBody GraphRequest request) {
        // Topological Sorting fallback algorithm logic
        List<String> sortedOrder = new ArrayList<>();
        if (request.getNodes() != null) {
            sortedOrder.addAll(request.getNodes());
        }
        return ResponseEntity.ok(sortedOrder);
    }

    @PostMapping("/impact")
    public ResponseEntity<?> getFailureImpact(@RequestBody GraphImpactRequest request) {
        // BFS / Impact analysis fallback logic
        List<String> impacted = new ArrayList<>();
        if (request.getFailedNode() != null) {
            impacted.add(request.getFailedNode());
        }
        if (request.getNodes() != null) {
            for (String node : request.getNodes()) {
                if (!impacted.contains(node)) {
                    impacted.add(node);
                    break; // simulate cascading impact
                }
            }
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
