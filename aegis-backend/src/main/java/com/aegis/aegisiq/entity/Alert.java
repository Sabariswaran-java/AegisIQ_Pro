package com.aegis.aegisiq.entity;

import jakarta.persistence.*;

@Entity
@Table(name="alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assetId;

    private String assetName;

    private String alertType;

    private String severity;

    private String message;


    public Alert() {

    }


    public Alert(Long assetId, String assetName,
                 String alertType,
                 String severity,
                 String message) {

        this.assetId = assetId;
        this.assetName = assetName;
        this.alertType = alertType;
        this.severity = severity;
        this.message = message;
    }


    public Long getId() {
        return id;
    }

    public Long getAssetId() {
        return assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public String getAlertType() {
        return alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public String getMessage() {
        return message;
    }
}