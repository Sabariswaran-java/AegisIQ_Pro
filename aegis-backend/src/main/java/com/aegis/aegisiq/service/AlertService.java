package com.aegis.aegisiq.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.aegis.aegisiq.entity.Alert;
import com.aegis.aegisiq.repository.AlertRepository;

@Service
public class AlertService {

    private final AlertRepository repository;

    public AlertService(AlertRepository repository) {
        this.repository = repository;
    }


    public List<Alert> getAlerts() {
        return repository.findAll();
    }


    public Alert createAlert(Alert alert) {
        return repository.save(alert);
    }

}