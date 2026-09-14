package com.aegis.aegisiq.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String reportType; // DOWNTIME_RISK, COMPLIANCE, TELEMETRY_AUDIT
    private String summary;
    private Double downtimeReduction; // 25.0%
    private LocalDateTime generatedAt;
}