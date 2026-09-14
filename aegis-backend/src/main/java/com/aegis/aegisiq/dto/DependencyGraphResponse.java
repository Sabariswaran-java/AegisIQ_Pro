package com.aegis.aegisiq.dto;

import java.util.List;

public class DependencyGraphResponse {
    private List<NodeDto> nodes;
    private List<EdgeDto> edges;

    public DependencyGraphResponse() {}

    public DependencyGraphResponse(List<NodeDto> nodes, List<EdgeDto> edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public List<NodeDto> getNodes() { return nodes; }
    public void setNodes(List<NodeDto> nodes) { this.nodes = nodes; }

    public List<EdgeDto> getEdges() { return edges; }
    public void setEdges(List<EdgeDto> edges) { this.edges = edges; }

    public static class NodeDto {
        private String id;
        private String label;
        private String type;
        private String status;

        public NodeDto(String id, String label, String type, String status) {
            this.id = id;
            this.label = label;
            this.type = type;
            this.status = status;
        }

        public String getId() { return id; }
        public String getLabel() { return label; }
        public String getType() { return type; }
        public String getStatus() { return status; }
    }

    public static class EdgeDto {
        private String id;
        private String source;
        private String target;

        public EdgeDto(String id, String source, String target) {
            this.id = id;
            this.source = source;
            this.target = target;
        }

        public String getId() { return id; }
        public String getSource() { return source; }
        public String getTarget() { return target; }
    }
}