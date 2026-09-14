package com.aegis.aegisiq.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.aegis.aegisiq.entity.Alert;
import com.aegis.aegisiq.service.AlertService;



@RestController
@RequestMapping("/api/alerts")
public class AlertController {


    private final AlertService service;


    public AlertController(AlertService service){

        this.service = service;

    }



    @GetMapping
    public List<Alert> getAlerts(){

        return service.getAlerts();

    }



    @PostMapping
    public Alert createAlert(@RequestBody Alert alert){

        return service.createAlert(alert);

    }

}