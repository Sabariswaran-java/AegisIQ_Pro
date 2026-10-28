import React, { useEffect, useState } from "react";
import { ChevronRight, AlertTriangle, Lock, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import apiClient from "../../services/api";


export default function GraphTab({ assets = [], setActiveTab }) {
  const { selectedAsset } = useAegis();

  const [executionOrder, setExecutionOrder] = useState([]);
  const [impactedNodes, setImpactedNodes] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Dynamic Node Positions for Canvas Viewport
  const [nodePositions, setNodePositions] = useState({});

  useEffect(() => {
    if (assets && assets.length > 0) {
      const positions = {};
      const total = assets.length;
      const centerX = 450;
      const centerY = 260;
      const radius = 190;

      assets.forEach((asset, index) => {
        if (selectedAsset && asset.id === selectedAsset.id) {
          positions[asset.name] = { x: centerX, y: centerY };
        } else {
          const angle = (index / Math.max(total - 1, 1)) * 2 * Math.PI;
          positions[asset.name] = {
            x: Math.round(centerX + radius * Math.cos(angle)),
            y: Math.round(centerY + radius * Math.sin(angle)),
          };
        }
      });
      setNodePositions(positions);
    }
  }, [assets, selectedAsset]);

  // API Call: Dependency Order
  const fetchDependencyOrder = async (nodesList, edgesList) => {
    try {
      const response = await apiClient.post("/decision-graph/order", {
        nodes: nodesList,
        edges: edgesList,
      });
      setExecutionOrder(response.data || []);
    } catch (error) {
      console.error("Failed to fetch dependency order:", error);
    }
  };

  // API Call: Failure Impact Simulation
  const simulateFailureImpact = async (nodesList, edgesList, targetFailedNode) => {
    try {
      setIsSimulating(true);
      const response = await apiClient.post("/decision-graph/impact", {
        nodes: nodesList,
        edges: edgesList,
        failedNode: targetFailedNode,
      });
      setImpactedNodes(response.data || []);
      setHasSimulated(true);
    } catch (error) {
      console.error("Failed to simulate failure impact:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (assets && assets.length > 0) {
      const nodesList = assets.map((a) => a.name);
      const edgesList = [];
      for (let i = 0; i < nodesList.length - 1; i++) {
        edgesList.push({ from: nodesList[i], to: nodesList[i + 1] });
      }
      fetchDependencyOrder(nodesList, edgesList);
    }
    setHasSimulated(false);
    setImpactedNodes([]);
  }, [assets, selectedAsset]);

  const handleRunSimulation = () => {
    if (!selectedAsset) return;
    const nodesList = assets.map((a) => a.name);
    const edgesList = [];
    for (let i = 0; i < nodesList.length - 1; i++) {
      edgesList.push({ from: nodesList[i], to: nodesList[i + 1] });
    }
    simulateFailureImpact(nodesList, edgesList, selectedAsset.name);
  };

  return (
    <div className="space-y-6 w-full pb-12 bg-[#F8FAFC] min-h-screen p-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Enterprise Decision Graph</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedAsset
              ? `Topology mapping centered on active asset: ${selectedAsset.name}`
              : "Interactive network graph of enterprise assets and connected nodes."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={!selectedAsset || isSimulating}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs ${
              selectedAsset && !isSimulating
                ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{isSimulating ? "Simulating BFS..." : "Simulate Failure Impact (BFS)"}</span>
          </button>

          <button
            onClick={() => hasSimulated && setActiveTab("twin")}
            disabled={!hasSimulated}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs ${
              hasSimulated
                ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {hasSimulated ? (
              <>
                <span>Proceed to Decision Twin AI</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Run Simulation First</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Asset Relation Viewport Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ASSET RELATION VIEWPORT (DYNAMIC TOPOLOGY)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedAsset ? `Target: ${selectedAsset.name}` : "Select a node to inspect"}
          </span>
        </div>

        {/* Dynamic Topology Graph Canvas Area */}
        <div className="relative w-full h-[540px] bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {assets.map((asset, idx) => {
              if (idx === 0) return null;
              const prevAsset = assets[idx - 1];
              const p1 = nodePositions[prevAsset.name];
              const p2 = nodePositions[asset.name];

              if (!p1 || !p2) return null;

              const isAffectedPath =
                impactedNodes.includes(asset.name) && impactedNodes.includes(prevAsset.name);

              return (
                <g key={idx}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={isAffectedPath ? "#E11D48" : "#CBD5E1"}
                    strokeWidth={isAffectedPath ? "3" : "1.5"}
                    strokeDasharray={isAffectedPath ? "4,4" : "none"}
                    className="transition-all duration-300"
                  />
                  <circle
                    cx={(p1.x + p2.x) / 2}
                    cy={(p1.y + p2.y) / 2}
                    r="3.5"
                    fill={isAffectedPath ? "#F43F5E" : "#94A3B8"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Dynamic Asset Nodes */}
          {assets.map((asset) => {
            const pos = nodePositions[asset.name] || { x: 450, y: 260 };
            const isTarget = selectedAsset && asset.id === selectedAsset.id;
            const isImpacted = impactedNodes.includes(asset.name);

            return (
              <div
                key={asset.id}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredNode(asset)}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute cursor-pointer group transition-transform hover:scale-110 z-10"
              >
                {/* Node Box UI */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all shadow-md ${
                    isTarget
                      ? "bg-teal-50 border-teal-500 ring-4 ring-teal-500/20"
                      : isImpacted
                      ? "bg-rose-50 border-rose-500 ring-4 ring-rose-500/20"
                      : "bg-white border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isTarget
                        ? "bg-teal-600 text-white"
                        : isImpacted
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {asset.name ? asset.name.substring(0, 2).toUpperCase() : "ND"}
                  </div>
                </div>

                {/* Node Title Label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-xs">
                  {asset.name}
                </div>

                {/* Hover Tooltip Info */}
                {hoveredNode?.id === asset.id && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs w-48 z-50 pointer-events-none font-mono space-y-1">
                    <div className="font-bold border-b border-slate-700 pb-1 flex justify-between">
                      <span>{asset.name}</span>
                      <span className="text-emerald-400">{asset.status}</span>
                    </div>
                    <div className="text-[10px] text-slate-300 flex justify-between">
                      <span>CPU Load:</span>
                      <span>{asset.cpuUsage ?? 0}%</span>
                    </div>
                    <div className="text-[10px] text-slate-300 flex justify-between">
                      <span>Temp:</span>
                      <span>{asset.temperature ?? 0}°C</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Floating Controls Bar */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-1.5 flex items-center gap-1 shadow-xs z-20">
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ZoomIn className="h-4 w-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ZoomOut className="h-4 w-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><RefreshCw className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
