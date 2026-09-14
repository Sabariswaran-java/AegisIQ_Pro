package com.aegis.aegisiq.entity;


import jakarta.persistence.*;


@Entity
@Table(name="dependencies")
public class Dependency {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long assetId;


    private String dependencyName;


    private String dependencyType;



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Long getAssetId() {
        return assetId;
    }


    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }


    public String getDependencyName() {
        return dependencyName;
    }


    public void setDependencyName(String dependencyName) {
        this.dependencyName = dependencyName;
    }


    public String getDependencyType() {
        return dependencyType;
    }


    public void setDependencyType(String dependencyType) {
        this.dependencyType = dependencyType;
    }

}