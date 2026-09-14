package com.aegis.aegisiq.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aegis.aegisiq.entity.Asset;
import com.aegis.aegisiq.repository.AssetRepository;

@Service
public class DashboardService {

    private final AssetRepository assetRepository;

    public DashboardService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public Map<String, Object> getDashboard() {

        List<Asset> assets = assetRepository.findAll();

        Map<String, Object> data = new HashMap<>();

        int totalAssets = assets.size();
        int activeAssets = 0;
        int warningAssets = 0;
        int criticalAssets = 0;

        double totalCpu = 0;
        double totalMemory = 0;

        for (Asset asset : assets) {

            totalCpu += asset.getCpuUsage();
            totalMemory += asset.getMemoryUsage();

            String health = asset.getStatus();

            if (health != null) {

                if (health.equalsIgnoreCase("GOOD")) {
                    activeAssets++;
                } else if (health.equalsIgnoreCase("WARNING")) {
                    warningAssets++;
                } else if (health.equalsIgnoreCase("CRITICAL")) {
                    criticalAssets++;
                }

            }
        }

        double cpuAverage = 0;
        double memoryAverage = 0;

        if (totalAssets > 0) {
            cpuAverage = totalCpu / totalAssets;
            memoryAverage = totalMemory / totalAssets;
        }

        String systemHealth = "GOOD";

        if (criticalAssets > 0) {
            systemHealth = "CRITICAL";
        } else if (warningAssets > 0) {
            systemHealth = "WARNING";
        }

        data.put("totalAssets", totalAssets);
        data.put("activeAssets", activeAssets);
        data.put("warningAssets", warningAssets);
        data.put("criticalAssets", criticalAssets);
        data.put("cpuAverage", Math.round(cpuAverage * 100.0) / 100.0);
        data.put("memoryAverage", Math.round(memoryAverage * 100.0) / 100.0);
        data.put("systemHealth", systemHealth);

        return data;
    }
}