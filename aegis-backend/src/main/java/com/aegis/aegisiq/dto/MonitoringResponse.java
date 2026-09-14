package com.aegis.aegisiq.dto;


public class MonitoringResponse {

    private Long assetId;
    private String assetName;
    private Double cpuUsage;
    private Double memoryUsage;
    private String healthStatus;


    public MonitoringResponse(Long assetId,
                              String assetName,
                              Double cpuUsage,
                              Double memoryUsage,
                              String healthStatus) {

        this.assetId = assetId;
        this.assetName = assetName;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.healthStatus = healthStatus;
    }


    public Long getAssetId() {
        return assetId;
    }


    public String getAssetName() {
        return assetName;
    }


    public Double getCpuUsage() {
        return cpuUsage;
    }


    public Double getMemoryUsage() {
        return memoryUsage;
    }


    public String getHealthStatus() {
        return healthStatus;
    }
}