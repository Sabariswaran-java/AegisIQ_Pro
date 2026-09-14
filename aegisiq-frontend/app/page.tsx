"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAegis } from "./context/AegisContext";
import { getAssets, getDependencyGraph } from "./services/api";

// Components Import
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

// Tabs Import
import DashboardTab from "./components/tabs/DashboardTab";
import AssetsTab from "./components/tabs/AssetsTab";
import MonitoringTab from "./components/tabs/MonitoringTab";
import AlertsTab from "./components/tabs/AlertsTab";
import ReportsTab from "./components/tabs/ReportsTab";
import GraphTab from "./components/tabs/GraphTab";
import TwinTab from "./components/tabs/TwinTab";
import ScenarioTab from "./components/tabs/ScenarioTab";
import ExplainableTab from "./components/tabs/ExplanationTab";
import MemoryTab from "./components/tabs/MemoryTab";
import DeployTab from "./components/tabs/DeployTab";

export default function EnterpriseDashboard() {
  const { selectedAsset, setSelectedAsset, setWorkflowState, setAiWorkflowData } = useAegis();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assets, setAssets] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const data = await getAssets();
      if (Array.isArray(data)) setAssets(data);
    } catch (err) {
      console.error("Pipeline sync error");
    } finally {
      setIsSyncing(false);
      setLoading(false);
    }

    try {
      const graph = await getDependencyGraph();
      if (graph?.nodes) {
        setGraphData({ nodes: graph.nodes, edges: (graph as any).edges || [] });
      }
    } catch {}
  };

  useEffect(() => {
    syncData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#E2E8F0] flex font-sans antialiased selection:bg-slate-700 selection:text-white">
      {/* Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopNavbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          syncData={syncData} 
          isSyncing={isSyncing} 
          assets={assets} 
        />

        <main className="px-6 pt-8 pb-6 space-y-6 flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0.96 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="w-full"
            >
              {activeTab === "dashboard" && <DashboardTab assets={assets} setActiveTab={setActiveTab} />}
              {activeTab === "assets" && <AssetsTab assets={assets} syncData={syncData} />}
              {activeTab === "monitoring" && <MonitoringTab assets={assets} />}
              {activeTab === "alerts" && <AlertsTab assets={assets} setActiveTab={setActiveTab} />}
              {activeTab === "reports" && <ReportsTab assets={assets} syncData={syncData} />}
              {activeTab === "graph" && <GraphTab assets={assets} setActiveTab={setActiveTab} />}
              {activeTab === "twin" && <TwinTab assets={assets} setActiveTab={setActiveTab} />}
{activeTab === "scenario" && <ScenarioTab assets={assets} setActiveTab={setActiveTab} />}
              {activeTab === "explainable" && <ExplainableTab setActiveTab={setActiveTab} />}
              {activeTab === "memory" && <MemoryTab setActiveTab={setActiveTab} />}
              {activeTab === "deploy" && <DeployTab assets={assets} syncData={syncData} setActiveTab={setActiveTab} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}