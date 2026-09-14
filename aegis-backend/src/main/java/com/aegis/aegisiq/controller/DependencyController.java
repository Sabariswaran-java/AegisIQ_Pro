package com.aegis.aegisiq.controller;

import com.aegis.aegisiq.dto.DependencyGraphResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dependency")
public class DependencyController {

    @GetMapping("/graph")
    public DependencyGraphResponse getDependencyGraph() {
        List<DependencyGraphResponse.NodeDto> nodes = List.of(
            new DependencyGraphResponse.NodeDto("node-1", "Auth Service", "SERVICE", "HEALTHY"),
            new DependencyGraphResponse.NodeDto("node-2", "Payment DB", "DATABASE", "WARNING"),
            new DependencyGraphResponse.NodeDto("node-3", "Core Gateway", "SERVER", "CRITICAL")
        );

        List<DependencyGraphResponse.EdgeDto> edges = List.of(
            new DependencyGraphResponse.EdgeDto("e1-2", "node-1", "node-2"),
            new DependencyGraphResponse.EdgeDto("e3-1", "node-3", "node-1")
        );

        return new DependencyGraphResponse(nodes, edges);
    }
}