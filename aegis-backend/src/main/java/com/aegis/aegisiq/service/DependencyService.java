package com.aegis.aegisiq.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.aegis.aegisiq.entity.Dependency;
import com.aegis.aegisiq.repository.DependencyRepository;



@Service
public class DependencyService {


    private final DependencyRepository dependencyRepository;


    public DependencyService(
            DependencyRepository dependencyRepository) {

        this.dependencyRepository = dependencyRepository;
    }



    // Get dependency using asset id
    public List<Dependency> getDependencies(Long assetId) {

        return dependencyRepository.findByAssetId(assetId);

    }



    // Save dependency
    public Dependency saveDependency(
            Dependency dependency) {

        return dependencyRepository.save(dependency);

    }



    // Delete dependency
    public void deleteDependency(Long id) {

        dependencyRepository.deleteById(id);

    }

}