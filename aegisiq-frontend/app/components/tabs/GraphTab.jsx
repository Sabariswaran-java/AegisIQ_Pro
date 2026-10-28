import React, { useEffect, useState } from "react";
import { Network, ChevronRight, AlertTriangle, GitBranch, Server, Lock } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import apiClient from "../../services/api";

export default function GraphTab({ assets, setActiveTab }) {
  const { selectedAsset } = useAegis();
  
  const [executionOrder, setExecutionOrder] = useState([]);
  const [impactedNodes, setImpactedNodes] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  // 1. Topological Sort API Call
  const fetchDependencyOrder = async (nodesList, edgesList) => {
    try {
      const response = await apiClient.post('/decision-graph/order', {
        nodes: nodesList,
        edges: edgesList
      });
      const sortedOrder = response.data;
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
      const response = await apiClient.post('/decision-graph/impact', {
        nodes: nodesList,
        edges: edgesList,
        failedNode: targetFailedNode
      });
      const impacted = response.data;
      setImpactedNodes(impacted);
      setHasSimulated(true);
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
    <div className="space-y-6 w-full pb-12 bg-[#F8FAFC] min-h-screen p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Enterprise Decision Graph & Dependencies</h2>
        <p className="text-xs text-slate-500">
          {selectedAsset ? `Interactive dependency pipeline centered around acknowledged asset: ${selectedAsset.name}` : "Interactive topology mapping of microservices and system assets."}
        </p>
      </div>

      {/* Clean Visual Flow Pipeline (Topological Order with Live BFS Impact Highlighting) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider block font-mono">
              Topological Dependency Flow & BFS Cascade Path
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {selectedAsset ? `Highlighting dependency & failure impact relative to: ${selectedAsset.name}` : "Select an asset and run simulation to inspect cascading risk."}
            </p>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={!selectedAsset || isSimulating}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-sm ${
              selectedAsset && !isSimulating
                ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{isSimulating ? "Simulating BFS..." : "Simulate Failure Impact (BFS)"}</span>
          </button>
        </div>

        {/* Visual Flow Nodes Container */}
        <div className="flex items-center flex-wrap gap-2.5 pt-2 overflow-x-auto pb-2">
          {executionOrder.length > 0 ? (
            executionOrder.map((nodeName, idx) => {
              const isImpacted = impactedNodes.includes(nodeName);
              const isTarget = selectedAsset && selectedAsset.name === nodeName;

              return (
                <React.Fragment key={idx}>
                  <div className={`px-3.5 py-2.5 rounded-xl border font-mono text-xs flex items-center gap-2.5 shadow-xs ${
                    isTarget 
                      ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-500/20' 
                      : isImpacted 
                      ? 'bg-rose-50 border-rose-300 text-rose-900' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${isTarget ? 'bg-blue-600' : isImpacted ? 'bg-rose-600' : 'bg-slate-400'}`}></span>
                    <div className="flex flex-col">
                      <span className="font-bold">{nodeName}</span>
                      <span className="text-[8px] text-slate-400 uppercase">
                        {isTarget ? "Target Node" : isImpacted ? "Cascade Affected" : "Connected Node"}
                      </span>
                    </div>
                  </div>

                  {idx < executionOrder.length - 1 && (
                    <div className="text-slate-400 font-bold px-1 text-sm">➔</div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 font-mono">Loading pipeline execution order...</span>
          )}
        </div>
      </div>

      {/* Interconnection Matrix Workspace */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm w-full">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 w-full">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {selectedAsset ? `Dependency Topology for ${selectedAsset.name}` : "Cluster Interconnection Matrix"}
            </h3>
          </div>
          
          <button 
            onClick={() => hasSimulated && setActiveTab("twin")}
            disabled={!hasSimulated}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-xs ${
              hasSimulated 
                ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' 
                : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
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
                    ? 'bg-blue-50/50 border-blue-300 shadow-sm ring-1 ring-blue-500/20' 
                    : isImpacted
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 block">{asset.name}</span>
                      {isTarget && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-mono font-bold">TARGET</span>
                      )}
                      {isImpacted && !isTarget && (
                        <span className="text-[9px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">AFFECTED</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">TYPE: {asset.type}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    asset.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    asset.status === 'WARNING' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between"><span>CPU Load:</span> <b className="text-slate-900">{asset.cpuUsage ?? 0}%</b></div>
                  <div className="flex justify-between"><span>Temperature:</span> <b className="text-slate-900">{asset.temperature ?? 0}°C</b></div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between border-t border-slate-200/40 mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isTarget || isImpacted ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
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
