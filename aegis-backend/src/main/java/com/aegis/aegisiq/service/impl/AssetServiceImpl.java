package com.aegis.aegisiq.service.impl;

import com.aegis.aegisiq.entity.Asset;
import com.aegis.aegisiq.repository.AssetRepository;
import com.aegis.aegisiq.service.AssetService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;

    public AssetServiceImpl(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    @Override
    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }

    @Override
    public Asset createAsset(Asset asset) {
        // ID field backend-aala generate aaga, reset panrom
        asset.setId(null);
        if (asset.getStatus() == null) asset.setStatus("HEALTHY");
        return assetRepository.save(asset);
    }

    @Override
    public Asset updateAsset(Long id, Asset assetDetails) {
        Asset asset = getAssetById(id);
        asset.setName(assetDetails.getName());
        asset.setType(assetDetails.getType());
        asset.setStatus(assetDetails.getStatus());
        asset.setCpuUsage(assetDetails.getCpuUsage());
        asset.setMemoryUsage(assetDetails.getMemoryUsage());
        return assetRepository.save(asset);
    }

    @Override
    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }
}