import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, AlertTriangle, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import apiClient from "../../services/api";

export default function GraphTab({ assets, setActiveTab }) {
  const safeAssets = useMemo(() => assets || [], [assets]);
  const { selectedAsset } = useAegis();

  const [executionOrder, setExecutionOrder] = useState([]);
  const [impactedNodes, setImpactedNodes] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Interactive Controls State
  const [zoomLevel, setZoomLevel] = useState(1);

  // Dynamic realistic graph topology generation (Sparse connectivity)
  const { nodePositions, dynamicEdges } = useMemo(() => {
    if (safeAssets.length === 0) return { nodePositions: {}, dynamicEdges: [] };

    const positions = {};
    const edges = [];
    const total = safeAssets.length;
    const centerX = 450;
    const centerY = 260;
    const radius = 200;

    // Position calculation centered around selectedAsset
    safeAssets.forEach((asset, index) => {
      const isTarget = selectedAsset && asset.id === selectedAsset.id;
      if (isTarget) {
        positions[asset.name] = { x: centerX, y: centerY };
      } else {
        const baseAngle = (index / Math.max(total - 1, 1)) * 2 * Math.PI;
        positions[asset.name] = {
          x: Math.round(centerX + radius * Math.cos(baseAngle)),
          y: Math.round(centerY + radius * Math.sin(baseAngle)),
        };
      }
    });

    // Realistic non-full-mesh connections (Star / Pipeline topology)
    safeAssets.forEach((asset, i) => {
      if (i < safeAssets.length - 1) {
        // Linear pipeline chain
        edges.push({ from: asset.name, to: safeAssets[i + 1].name });
      }
      // Connect selected target to immediate adjacent nodes only
      if (selectedAsset && asset.id === selectedAsset.id && i > 0) {
        edges.push({ from: safeAssets[0].name, to: selectedAsset.name });
      }
    });

    return { nodePositions: positions, dynamicEdges: edges };
  }, [safeAssets, selectedAsset]);

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
    if (safeAssets.length > 0) {
      const nodesList = safeAssets.map((a) => a.name);
      fetchDependencyOrder(nodesList, dynamicEdges);
    }
    setHasSimulated(false);
    setImpactedNodes([]);
  }, [safeAssets, selectedAsset, dynamicEdges]);

  const handleRunSimulation = () => {
    if (!selectedAsset) return;
    const nodesList = safeAssets.map((a) => a.name);
    simulateFailureImpact(nodesList, dynamicEdges, selectedAsset.name);
  };

  // Plain status text color without background cards
  const getStatusTextColor = (status) => {
    const uppercaseStatus = (status || "").toUpperCase();
    if (uppercaseStatus === "CRITICAL" || uppercaseStatus === "ERROR" || uppercaseStatus === "FAILED") {
      return "text-rose-600 font-bold";
    }
    if (uppercaseStatus === "WARNING" || uppercaseStatus === "WARN") {
      return "text-amber-600 font-bold";
    }
    return "text-emerald-600 font-bold";
  };

  return (
    <div className="space-y-6 w-full pb-12 bg-[#F8FAFC] min-h-screen p-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Enterprise Decision Graph</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedAsset
              ? `Topology mapping centered on active asset: ${selectedAsset.name}`
              : "Interactive network graph of enterprise assets and connected nodes."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulate Red Button */}
          <button
            onClick={handleRunSimulation}
            disabled={!selectedAsset || isSimulating}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-sm ${
              selectedAsset && !isSimulating
                ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-95"
                : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{isSimulating ? "Simulating..." : "Simulate"}</span>
          </button>

          {/* Next Button - Icon Only Without Green Background */}
          <button
            onClick={() => hasSimulated && setActiveTab("twin")}
            disabled={!hasSimulated}
            title="Proceed to Decision Twin AI"
            className={`p-2 rounded-xl text-xs transition flex items-center justify-center ${
              hasSimulated
                ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer active:scale-95"
                : "text-slate-300 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ASSET RELATION VIEWPORT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden min-h-[580px] flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ASSET RELATION VIEWPORT 
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedAsset ? `Target: ${selectedAsset.name}` : "Select a node to inspect"}
          </span>
        </div>

        {/* Inline CSS Animation for Flow Lines */}
        <style>{`
          @keyframes lineFlow {
            0% { stroke-dashoffset: 24; }
            100% { stroke-dashoffset: 0; }
          }
          .animated-flow-line {
            stroke-dasharray: 8, 8;
            animation: lineFlow 1s linear infinite;
          }
        `}</style>

        {/* Graph Viewport Area */}
        <div className="relative w-full h-[480px] rounded-xl flex items-center justify-center overflow-hidden">
          <div
            className="w-full h-full relative transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {dynamicEdges.map((edge, idx) => {
                const p1 = nodePositions[edge.from];
                const p2 = nodePositions[edge.to];

                if (!p1 || !p2) return null;

                const isAffectedPath =
                  impactedNodes.includes(edge.from) && impactedNodes.includes(edge.to);
                const isTargetInputFlow =
                  selectedAsset && (edge.from === selectedAsset.name || edge.to === selectedAsset.name);

                return (
                  <g key={idx}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isAffectedPath ? "#E11D48" : isTargetInputFlow ? "#0D9488" : "#CBD5E1"}
                      strokeWidth={isAffectedPath || isTargetInputFlow ? "2.5" : "1.5"}
                      className={hasSimulated || isSimulating || isTargetInputFlow ? "animated-flow-line" : ""}
                    />
                    <circle
                      cx={(p1.x + p2.x) / 2}
                      cy={(p1.y + p2.y) / 2}
                      r="3.5"
                      fill={isAffectedPath ? "#F43F5E" : isTargetInputFlow ? "#0D9488" : "#94A3B8"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Asset Nodes */}
            {safeAssets.map((asset) => {
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
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all shadow-md relative ${
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

                    {/* Cause / Impacted Alert Badge */}
                    {isImpacted && !isTarget && (
                      <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full shadow-xs animate-bounce">
                        CAUSE
                      </span>
                    )}
                  </div>

                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-xs">
                    {asset.name}
                  </div>

                  {/* Clean Tooltip (Plain Text Status without Background Cards) */}
                  {hoveredNode?.id === asset.id && (
                    <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-slate-800 p-3 rounded-xl shadow-xl text-xs w-48 z-50 pointer-events-none font-sans space-y-1">
                      <div className="font-bold border-b border-slate-100 pb-1 flex justify-between items-center">
                        <span className="text-slate-900 font-mono text-xs">{asset.name}</span>
                        <span className={`text-[10px] font-mono ${getStatusTextColor(asset.status)}`}>
                          {asset.status || "HEALTHY"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between items-center">
                        <span>CPU Load:</span>
                        <span className="font-mono font-semibold text-slate-700">{asset.cpuUsage ?? 0}%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between items-center">
                        <span>Temperature:</span>
                        <span className="font-mono font-semibold text-slate-700">{asset.temperature ?? 0}°C</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Zoom Controls */}
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-xl p-1 flex items-center gap-1 shadow-xs z-20">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8))}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition active:scale-90"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.6))}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition active:scale-90"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition active:scale-90"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
