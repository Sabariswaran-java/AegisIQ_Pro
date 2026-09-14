import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://aegisiq-backend-8cjm.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

// Asset API functions
export const getAssets = async () => (await apiClient.get("/assets")).data;
export const createAsset = async (data) => (await apiClient.post("/assets", data)).data;
export const updateAsset = async (id, data) => (await apiClient.put(`/assets/${id}`, data)).data;
export const deleteAsset = async (id) => (await apiClient.delete(`/assets/${id}`)).data;

// AI Intelligence API functions
export const simulateDecisionTwin = async (payload) => (await apiClient.post("/ai/decision-twin", payload)).data;
export const evaluateScenario = async (payload) => (await apiClient.post("/ai/what-if", payload)).data;
export const getExplanation = async (assetName) => (await apiClient.get(`/ai/explain/${assetName}`)).data;
export const getHistoricalIncidents = async (query) => (await apiClient.post("/ai/incident-memory", { query })).data;
export const evaluateDeployment = async (payload) => (await apiClient.post("/ai/deploy-optimizer", payload)).data;

// Decision Graph & Impact Analysis API functions (Connected to Render Backend)
export const getDependencyGraph = async () => ({
  nodes: [
    { id: "NODE-01", label: "Primary Database Cluster", type: "DATABASE", status: "HEALTHY" },
    { id: "NODE-02", label: "Industrial Turbine Gateway", type: "GATEWAY", status: "HEALTHY" },
    { id: "NODE-03", label: "Core Auth Microservice", type: "SERVICE", status: "HEALTHY" }
  ],
  edges: []
});

export const getDependencyOrder = async (nodes, edges) => 
  (await apiClient.post("/decision-graph/order", { nodes, edges })).data;

export const simulateFailureImpact = async (nodes, edges, failedNode) => 
  (await apiClient.post("/decision-graph/impact", { nodes, edges, failedNode })).data;
