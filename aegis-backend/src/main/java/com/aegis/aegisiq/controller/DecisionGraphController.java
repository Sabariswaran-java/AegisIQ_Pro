package com.aegis.aegisiq.controller;

import com.aegis.aegisiq.dto.DependencyGraphResponse;
import com.aegis.aegisiq.dto.DependencyGraphResponse.Edge; // <--- Intha import-a add panniruken
import com.aegis.aegisiq.service.BfsImpactService; 
import com.aegis.aegisiq.service.TopologicalSortService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decision-graph")
public class DecisionGraphController {

    @Autowired
    private TopologicalSortService topologicalSortService;

    @Autowired
    private BfsImpactService bfsImpactService; 

    @PostMapping("/order")
    public List<String> getExecutionOrder(@RequestBody GraphRequest request) {
        return topologicalSortService.getDependencyExecutionOrder(request.getNodes(), request.getEdges());
    }

    @PostMapping("/impact")
    public List<String> getFailureImpact(@RequestBody GraphImpactRequest request) {
        return bfsImpactService.getImpactedNodes(request.getNodes(), request.getEdges(), request.getFailedNode());
    }
}

class GraphRequest {
    private List<String> nodes;
    private List<Edge> edges;

    public List<String> getNodes() { return nodes; }
    public List<Edge> getEdges() { return edges; }
}

class GraphImpactRequest {
    private List<String> nodes;
    private List<Edge> edges;
    private String failedNode;

    public List<String> getNodes() { return nodes; }
    public List<Edge> getEdges() { return edges; }
    public String getFailedNode() { return failedNode; }
}