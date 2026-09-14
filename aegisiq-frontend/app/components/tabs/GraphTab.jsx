import React, { useEffect, useState } from "react";
import { Network, ChevronRight, AlertTriangle, GitBranch, Server, Lock } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function GraphTab({ assets, setActiveTab }) {
  const { selectedAsset } = useAegis();
  
  const [executionOrder, setExecutionOrder] = useState([]);
  const [impactedNodes, setImpactedNodes] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false); // Track if simulation has been run

  // 1. Topological Sort API Call
  const fetchDependencyOrder = async (nodesList, edgesList) => {
    try {
     const response = await apiClient.get('/decision-graph/order', ...);{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesList, edges: edgesList })
      });
      const sortedOrder = await response.json();
      setExecutionOrder(sortedOrder);
      return sortedOrder;
    } catch (error) {
      console.error("Failed to fetch dependency order:", error);
    }
  };

  // 2. BFS Impact Analysis API Call
  const simulateFailureImpact = async (nodesList, edgesList, targetFailedNode) => {
    try {
      setIsSimulating(true);
      const data = await apiClient.post('/decision-graph/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesList, edges: edgesList, failedNode: targetFailedNode })
      });
      const impacted = await response.json();
      setImpactedNodes(impacted);
      setHasSimulated(true); // Unlock Decision Twin button once simulation runs successfully
    } catch (error) {
      console.error("Failed to simulate failure impact:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (assets && assets.length > 0) {
      const nodesList = assets.map(a => a.name);
      const edgesList = [];
      for (let i = 0; i < nodesList.length - 1; i++) {
        edgesList.push({ from: nodesList[i], to: nodesList[i + 1] });
      }
      if (nodesList.length > 0) {
        fetchDependencyOrder(nodesList, edgesList);
      }
    }
    // Reset simulation state when selectedAsset changes
    setHasSimulated(false);
    setImpactedNodes([]);
  }, [assets, selectedAsset]);

  const handleRunSimulation = () => {
    if (!selectedAsset) return;
    const nodesList = assets.map(a => a.name);
    const edgesList = [];
    for (let i = 0; i < nodesList.length - 1; i++) {
      edgesList.push({ from: nodesList[i], to: nodesList[i + 1] });
    }
    simulateFailureImpact(nodesList, edgesList, selectedAsset.name);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Enterprise Decision Graph & Dependencies</h2>
        <p className="text-xs text-slate-400">
          {selectedAsset ? `Interactive dependency pipeline centered around acknowledged asset: ${selectedAsset.name}` : "Interactive topology mapping of microservices and system assets."}
        </p>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Target Selected Asset</span>
          <div className="text-base font-bold text-slate-100 font-mono truncate">
            {selectedAsset ? selectedAsset.name : "None (Select from Alerts)"}
          </div>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Propagation Path Risk</span>
          <div className={`text-base font-bold font-mono ${selectedAsset?.status === 'CRITICAL' ? 'text-rose-400' : 'text-slate-100'}`}>
            {selectedAsset?.status === 'CRITICAL' ? 'High Cascading Risk' : `${impactedNodes.length} Cascading Failures`}
          </div>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Graph Topology Engine</span>
          <div className="text-base font-bold text-slate-100 font-mono">Synchronized (100Hz)</div>
        </div>
      </div>

      {/* Clean Visual Flow Pipeline (Topological Order with Live BFS Impact Highlighting) */}
      <div className="bg-[#0E131F] border border-[#1E293B] p-5 rounded-2xl space-y-4 shadow-xl w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#1E293B] pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
              Topological Dependency Flow & BFS Cascade Path
            </span>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {selectedAsset ? `Highlighting dependency & failure impact relative to: ${selectedAsset.name}` : "Select an asset and run simulation to inspect cascading risk."}
            </p>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={!selectedAsset || isSimulating}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-sm ${
              selectedAsset && !isSimulating
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                : 'bg-[#141B2B] border border-[#1E293B] text-slate-600 cursor-not-allowed'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{isSimulating ? "Simulating BFS..." : "Simulate Failure Impact (BFS)"}</span>
          </button>
        </div>

        {/* Visual Flow Nodes Container (Stable, Zero-Shaking Layout) */}
        <div className="flex items-center flex-wrap gap-2.5 pt-2 overflow-x-auto pb-2">
          {executionOrder.length > 0 ? (
            executionOrder.map((nodeName, idx) => {
              const isImpacted = impactedNodes.includes(nodeName);
              const isTarget = selectedAsset && selectedAsset.name === nodeName;

              return (
                <React.Fragment key={idx}>
                  {/* Node Flow Box - Shaking/Scaling removed for 100% stability */}
                  <div className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs flex items-center gap-2.5 shadow-sm ${
                    isTarget 
                      ? 'bg-blue-950/60 border-blue-400 text-white ring-2 ring-blue-500/50' 
                      : isImpacted 
                      ? 'bg-rose-950/80 border-rose-600 text-rose-200' 
                      : 'bg-[#1B2538] border-[#2E3F5E] text-slate-200'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isTarget ? 'bg-blue-400' : isImpacted ? 'bg-rose-400' : 'bg-slate-400'}`}></span>
                    <div className="flex flex-col">
                      <span className="font-bold">{nodeName}</span>
                      <span className="text-[8px] text-slate-400 uppercase">
                        {isTarget ? "Target Node" : isImpacted ? "Cascade Affected" : "Connected Node"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Divider */}
                  {idx < executionOrder.length - 1 && (
                    <div className="text-slate-600 font-bold px-1 text-sm">➔</div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span className="text-xs text-slate-500 font-mono">Loading pipeline execution order...</span>
          )}
        </div>
      </div>

      {/* Interconnection Matrix Workspace */}
      <div className="bg-[#0E131F] border border-[#1E293B] p-6 rounded-2xl space-y-5 shadow-md w-full">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 w-full">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {selectedAsset ? `Dependency Topology for ${selectedAsset.name}` : "Cluster Interconnection Matrix"}
            </h3>
          </div>
          
          {/* Decision Twin AI Button with Strict Simulation Dependency Check */}
          <button 
            onClick={() => hasSimulated && setActiveTab("twin")}
            disabled={!hasSimulated}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-sm ${
              hasSimulated 
                ? 'bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-slate-100 cursor-pointer' 
                : 'bg-[#141B2B] border border-[#1E293B] text-slate-600 cursor-not-allowed'
            }`}
          >
            {hasSimulated ? (
              <>
                <span>Proceed to Decision Twin AI</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 text-slate-600" />
                <span>Run Failure Impact Simulation First</span>
              </>
            )}
          </button>
        </div>

        {/* Render Connected Nodes Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {assets.map((asset) => {
            const isTarget = selectedAsset && asset.id === selectedAsset.id;
            const isImpacted = impactedNodes.includes(asset.name);
            
            return (
              <div 
                key={asset.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  isTarget 
                    ? 'bg-[#182234] border-slate-500 shadow-md ring-1 ring-slate-500/50' 
                    : isImpacted
                    ? 'bg-rose-950/30 border-rose-800/80'
                    : 'bg-[#141B2B] border-[#25324A]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white block">{asset.name}</span>
                      {isTarget && (
                        <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">TARGET</span>
                      )}
                      {isImpacted && !isTarget && (
                        <span className="text-[9px] bg-rose-900 text-rose-200 border border-rose-700 px-1.5 py-0.5 rounded font-mono font-bold">AFFECTED</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">TYPE: {asset.type}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    asset.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    asset.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1 font-mono pt-2 border-t border-[#25324A]">
                  <div className="flex justify-between"><span>CPU Load:</span> <b className="text-white">{asset.cpuUsage ?? 0}%</b></div>
                  <div className="flex justify-between"><span>Temperature:</span> <b className="text-white">{asset.temperature ?? 0}°C</b></div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between border-t border-[#25324A]/40 mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isTarget || isImpacted ? 'bg-rose-400' : 'bg-slate-600'}`}></span>
                    <span>{isTarget ? "Primary Focus Node" : isImpacted ? "Cascading Failure Path" : "Connected Gateway"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}