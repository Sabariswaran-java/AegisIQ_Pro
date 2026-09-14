package com.aegis.aegisiq.dto;

public class ScenarioRequest {
    private String assetId;
    private String eventType;
    private int loadPercentage;

    public ScenarioRequest() {}

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public int getLoadPercentage() { return loadPercentage; }
    public void setLoadPercentage(int loadPercentage) { this.loadPercentage = loadPercentage; }
}