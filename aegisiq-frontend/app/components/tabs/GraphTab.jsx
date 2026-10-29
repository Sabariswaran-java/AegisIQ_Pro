import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function GraphTab({ assets, setActiveTab }) {
  const safeAssets = useMemo(() => assets || [], [assets]);
  const { selectedAsset } = useAegis();

  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Position and Edge logic for Left, Right, Top, Bottom Directional Flow
  const { nodePositions, dynamicEdges } = useMemo(() => {
    if (safeAssets.length === 0) return { nodePositions: {}, dynamicEdges: [] };

    const positions = {};
    const edges = [];
    const centerX = 450;
    const centerY = 260;
    const horizontalSpacing = 190;
    const verticalSpacing = 140;

    // Set precise locations around target asset
    safeAssets.forEach((asset, index) => {
      const isTarget = selectedAsset && asset.id === selectedAsset.id;
      
      if (isTarget) {
        positions[asset.name] = { x: centerX, y: centerY };
      } else {
        const nameLower = (asset.name || "").toLowerCase();
        if (nameLower.includes("7") || index === 0) {
          positions[asset.name] = { x: centerX - horizontalSpacing, y: centerY + 90 };
        } else if (nameLower.includes("akash") || nameLower.includes("5") || index === 1) {
          positions[asset.name] = { x: centerX + horizontalSpacing, y: centerY };
        } else if (nameLower.includes("4") || index === 2) {
          positions[asset.name] = { x: centerX, y: centerY - verticalSpacing };
        } else {
          positions[asset.name] = { x: centerX - 100, y: centerY + verticalSpacing };
        }
      }
    });

    if (selectedAsset) {
      safeAssets.forEach((asset) => {
        if (asset.name !== selectedAsset.name) {
          const targetPos = positions[selectedAsset.name];
          const assetPos = positions[asset.name];

          if (targetPos && assetPos) {
            edges.push({
              from: selectedAsset.name,
              to: asset.name,
              fromPos: targetPos,
              toPos: assetPos,
            });
          }
        }
      });
    }

    return { nodePositions: positions, dynamicEdges: edges };
  }, [safeAssets, selectedAsset]);

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
          <button
            onClick={() => setActiveTab && setActiveTab("twin")}
            title="Proceed to Decision Twin AI"
            className="p-2 rounded-xl text-xs transition flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer active:scale-95"
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

        {/* Smooth Red Flow Line CSS Keyframes without shaking */}
        <style>{`
          @keyframes smoothRedFlow {
            0% {
              stroke-dashoffset: 24;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .smooth-red-flow {
            stroke-dasharray: 8, 8;
            animation: smoothRedFlow 1.2s linear infinite;
            shape-rendering: geometricPrecision;
          }
        `}</style>

        {/* Graph Viewport Area */}
        <div className="relative w-full h-[480px] rounded-xl flex items-center justify-center overflow-hidden">
          <div
            className="w-full h-full relative transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {dynamicEdges.map((edge, idx) => {
                const p1 = edge.fromPos;
                const p2 = edge.toPos;

                if (!p1 || !p2) return null;

                return (
                  <g key={idx}>
                    {/* Clean Smooth Red Flow Line without middle dots */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#E11D48"
                      strokeWidth="2.5"
                      className="smooth-red-flow"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Asset Nodes */}
            {safeAssets.map((asset) => {
              const pos = nodePositions[asset.name] || { x: 450, y: 260 };
              const isTarget = selectedAsset && asset.id === selectedAsset.id;
              const isConnectedToTarget = selectedAsset && asset.id !== selectedAsset.id;

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
                  className="absolute cursor-pointer group transition-transform hover:scale-110 z-20"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all shadow-md relative ${
                      isTarget
                        ? "bg-teal-50 border-teal-500 ring-4 ring-teal-500/20"
                        : isConnectedToTarget
                        ? "bg-rose-50 border-rose-500 ring-4 ring-rose-500/20"
                        : "bg-white border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isTarget
                          ? "bg-teal-600 text-white"
                          : isConnectedToTarget
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

                  {/* Clean Tooltip with z-50 to prevent clipping */}
                  {hoveredNode?.id === asset.id && (
                    <div className="absolute bottom-[75px] left-1/2 -translate-x-1/2 bg-white border border-slate-200 text-slate-800 p-3 rounded-xl shadow-2xl text-xs w-48 z-50 pointer-events-none font-sans space-y-1">
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
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-xl p-1 flex items-center gap-1 shadow-xs z-30">
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
