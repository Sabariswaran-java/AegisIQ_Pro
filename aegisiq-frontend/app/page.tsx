"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import OverviewTab from "./components/OverviewTab";
import AssetsTab from "./components/AssetsTab";
import MonitoringTab from "./components/MonitoringTab";
import AlertsTab from "./components/AlertsTab";
import ReportsTab from "./components/ReportsTab";
import GraphTab from "./components/GraphTab";
import TwinTab from "./components/TwinTab";
import ScenarioTab from "./components/ScenarioTab";
import ExplainableTab from "./components/ExplainableTab";
import MemoryTab from "./components/MemoryTab";
import DeployTab from "./components/DeployTab";
import { AegisProvider } from "./context/AegisContext";
import apiClient from "./services/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchAssets = async () => {
    try {
      setIsSyncing(true);
      const response = await apiClient.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AegisProvider>
      <div className="flex h-screen bg-white overflow-hidden text-[#1e293b]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex flex-col flex-1 h-screen overflow-y-auto">
          <TopNavbar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            syncData={fetchAssets} 
            isSyncing={isSyncing} 
            assets={assets}
          />

          <main className="p-6 w-full flex-1">
            {activeTab === "dashboard" && <OverviewTab assets={assets} setActiveTab={setActiveTab} />}
            {activeTab === "assets" && <AssetsTab assets={assets} syncData={fetchAssets} />}
            {activeTab === "monitoring" && <MonitoringTab assets={assets} searchQuery={searchQuery} />}
            {activeTab === "alerts" && <AlertsTab assets={assets} />}
            {activeTab === "reports" && <ReportsTab assets={assets} syncData={fetchAssets} />}
            {activeTab === "graph" && <GraphTab assets={assets} setActiveTab={setActiveTab} />}
            {activeTab === "twin" && <TwinTab assets={assets} />}
            {activeTab === "scenario" && <ScenarioTab assets={assets} />}
            {activeTab === "explainable" && <ExplainableTab assets={assets} />}
            {activeTab === "memory" && <MemoryTab assets={assets} />}
            {activeTab === "deploy" && <DeployTab assets={assets} />}
          </main>
        </div>
      </div>
    </AegisProvider>
  );
}
