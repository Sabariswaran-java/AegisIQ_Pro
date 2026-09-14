package com.aegis.aegisiq.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

        public NodeDto() {}

        public NodeDto(String id, String label, String type, String status) {
            this.id = id;
            this.label = label;
            this.type = type;
            this.status = status;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class EdgeDto {
        private String id;
        
        @JsonProperty("from")
        private String source;
        
        @JsonProperty("to")
        private String target;

        public EdgeDto() {}

        public EdgeDto(String id, String source, String target) {
            this.id = id;
            this.source = source;
            this.target = target;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getTarget() { return target; }
        public void setTarget(String target) { this.target = target; }
    }
}
