package com.aegis.aegisiq.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aegis.aegisiq.entity.Dependency;



public interface DependencyRepository 
        extends JpaRepository<Dependency, Long>{


    List<Dependency> findByAssetId(Long assetId);

}