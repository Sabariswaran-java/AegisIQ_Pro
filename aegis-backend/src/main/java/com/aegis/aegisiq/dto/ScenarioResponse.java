package com.aegis.aegisiq.dto;

public class ScenarioResponse {
    private String assetId;
    private String predictedImpact;
    private String riskLevel;
    private double failureProbability;
    private String recommendedAction;

    public ScenarioResponse(String assetId, String predictedImpact, String riskLevel, double failureProbability, String recommendedAction) {
        this.assetId = assetId;
        this.predictedImpact = predictedImpact;
        this.riskLevel = riskLevel;
        this.failureProbability = failureProbability;
        this.recommendedAction = recommendedAction;
    }

    public String getAssetId() { return assetId; }
    public String getPredictedImpact() { return predictedImpact; }
    public String getRiskLevel() { return riskLevel; }
    public double getFailureProbability() { return failureProbability; }
    public String getRecommendedAction() { return recommendedAction; }
}