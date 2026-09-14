package com.aegis.aegisiq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // SERVER, DATABASE, TURBINE_PUMP, MICROSERVICE

    @Column(nullable = false)
    private String status; // HEALTHY, WARNING, CRITICAL

    // Compute & Telemetry Parameters
    private Double cpuUsage;
    private Double memoryUsage;
    private Double diskUtilization;
    private Double networkLatency;

    // Industrial Sensor Parameters
    private Double temperature;
    private Double vibration;
    private Double pressure;
    private Double voltage;
    private Double currentAmperage;
    private Double powerConsumption;
    private Double rpmSpeed;

    // AI & Risk Metrics
    private Double failoverProbability;
    private Double riskScore;

    // No-arg Constructor
    public Asset() {}

    // Full-arg Constructor
    public Asset(Long id, String name, String type, String status, Double cpuUsage, Double memoryUsage, 
                 Double diskUtilization, Double networkLatency, Double temperature, Double vibration, 
                 Double pressure, Double voltage, Double currentAmperage, Double powerConsumption, 
                 Double rpmSpeed, Double failoverProbability, Double riskScore) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.diskUtilization = diskUtilization;
        this.networkLatency = networkLatency;
        this.temperature = temperature;
        this.vibration = vibration;
        this.pressure = pressure;
        this.voltage = voltage;
        this.currentAmperage = currentAmperage;
        this.powerConsumption = powerConsumption;
        this.rpmSpeed = rpmSpeed;
        this.failoverProbability = failoverProbability;
        this.riskScore = riskScore;
    }

    // --- EXPLICIT GETTERS & SETTERS (Fixes Controller Red Marks) ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(Double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public Double getMemoryUsage() {
        return memoryUsage;
    }

    public void setMemoryUsage(Double memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public Double getDiskUtilization() {
        return diskUtilization;
    }

    public void setDiskUtilization(Double diskUtilization) {
        this.diskUtilization = diskUtilization;
    }

    public Double getNetworkLatency() {
        return networkLatency;
    }

    public void setNetworkLatency(Double networkLatency) {
        this.networkLatency = networkLatency;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getVibration() {
        return vibration;
    }

    public void setVibration(Double vibration) {
        this.vibration = vibration;
    }

    public Double getPressure() {
        return pressure;
    }

    public void setPressure(Double pressure) {
        this.pressure = pressure;
    }

    public Double getVoltage() {
        return voltage;
    }

    public void setVoltage(Double voltage) {
        this.voltage = voltage;
    }

    public Double getCurrentAmperage() {
        return currentAmperage;
    }

    public void setCurrentAmperage(Double currentAmperage) {
        this.currentAmperage = currentAmperage;
    }

    public Double getPowerConsumption() {
        return powerConsumption;
    }

    public void setPowerConsumption(Double powerConsumption) {
        this.powerConsumption = powerConsumption;
    }

    public Double getRpmSpeed() {
        return rpmSpeed;
    }

    public void setRpmSpeed(Double rpmSpeed) {
        this.rpmSpeed = rpmSpeed;
    }

    public Double getFailoverProbability() {
        return failoverProbability;
    }

    public void setFailoverProbability(Double failoverProbability) {
        this.failoverProbability = failoverProbability;
    }

    public Double getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Double riskScore) {
        this.riskScore = riskScore;
    }
}