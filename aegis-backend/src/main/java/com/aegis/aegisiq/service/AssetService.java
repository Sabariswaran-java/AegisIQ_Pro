package com.aegis.aegisiq.service;

import com.aegis.aegisiq.entity.Asset;
import java.util.List;

public interface AssetService {
    List<Asset> getAllAssets();
    Asset getAssetById(Long id);
    Asset createAsset(Asset asset);
    Asset updateAsset(Long id, Asset assetDetails);
    void deleteAsset(Long id);
}