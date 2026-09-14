package com.aegis.aegisiq.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patternName;
    private String failureSignature;
    private String rootCause;
    private String playbookAction;
    private Double similarityScore;
}