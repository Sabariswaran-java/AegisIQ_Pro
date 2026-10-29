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

  // Dynamic graph topology generation based on assets and selected asset
  const { nodePositions, dynamicEdges } = useMemo(() => {
    if (safeAssets.length === 0) return { nodePositions: {}, dynamicEdges: [] };

    const positions = {};
    const edges = [];
    const total = safeAssets.length;
    const centerX = 450;
    const centerY = 260;
    const radius = 200;

    // Deterministic position calculation with selectedAsset as center/primary anchor
    safeAssets.forEach((asset, index) => {
      const isTarget = selectedAsset && asset.id === selectedAsset.id;
      if (isTarget) {
        positions[asset.name] = { x: centerX, y: centerY };
      } else {
        // Offset angle dynamically per asset ID to make graphs unique
        const baseAngle = (index / Math.max(total, 1)) * 2 * Math.PI;
        const seed = (asset.id || index) * 0.5;
        const angle = baseAngle + seed;
        positions[asset.name] = {
          x: Math.round(centerX + radius * Math.cos(angle)),
          y: Math.round(centerY + radius * Math.sin(angle)),
        };
      }
    });

    // Generate dynamic directional edges connecting target turbine with connected nodes
    safeAssets.forEach((asset, i) => {
      safeAssets.forEach((targetAsset, j) => {
        if (i < j && ((asset.id + targetAsset.id) % 2 === 0 || (selectedAsset && (asset.id === selectedAsset.id || targetAsset.id === selectedAsset.id)))) {
          edges.push({ from: asset.name, to: targetAsset.name });
        }
      });
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

  // Status Badge Color Formatter
  const getStatusBadge = (status) => {
    const uppercaseStatus = (status || "").toUpperCase();
    if (uppercaseStatus === "CRITICAL" || uppercaseStatus === "ERROR" || uppercaseStatus === "FAILED") {
      return "bg-rose-50 text-rose-600 border-rose-200";
    }
    if (uppercaseStatus === "WARNING" || uppercaseStatus === "WARN") {
      return "bg-amber-50 text-amber-600 border-amber-200";
    }
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
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

        <div className="flex items-center gap-3">
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

          {/* Next SVG Icon Only Button */}
          <button
            onClick={() => hasSimulated && setActiveTab("twin")}
            disabled={!hasSimulated}
            title="Proceed to Decision Twin AI"
            className={`p-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center shadow-sm ${
              hasSimulated
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
                : "bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ASSET RELATION VIEWPORT - Single Container Structure */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden min-h-[580px] flex flex-col justify-between">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ASSET RELATION VIEWPORT (DYNAMIC TOPOLOGY)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedAsset ? `Target: ${selectedAsset.name}` : "Select a node to inspect"}
          </span>
        </div>

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
                  selectedAsset && (edge.to === selectedAsset.name || edge.from === selectedAsset.name);

                return (
                  <g key={idx}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isAffectedPath ? "#E11D48" : isTargetInputFlow ? "#0D9488" : "#CBD5E1"}
                      strokeWidth={isAffectedPath ? "3" : isTargetInputFlow ? "2" : "1.5"}
                      strokeDasharray={isTargetInputFlow || isAffectedPath ? "6,6" : "none"}
                      className="transition-all duration-300"
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

            {/* Render Nodes */}
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

                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 text-[10px] font-mono font-bold text-slate-700 shadow-xs">
                    {asset.name}
                  </div>

                  {/* Clean Light-Themed Pop-up Tooltip */}
                  {hoveredNode?.id === asset.id && (
                    <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-slate-800 p-3 rounded-xl shadow-xl text-xs w-52 z-50 pointer-events-none font-sans space-y-1.5 animate-in fade-in zoom-in-95">
                      <div className="font-bold border-b border-slate-100 pb-1.5 flex justify-between items-center">
                        <span className="text-slate-900 font-mono text-xs">{asset.name}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(asset.status)}`}>
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

          {/* Interactive Zoom and Reload Controls */}
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
