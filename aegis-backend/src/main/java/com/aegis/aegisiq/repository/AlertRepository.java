package com.aegis.aegisiq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aegis.aegisiq.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {

}