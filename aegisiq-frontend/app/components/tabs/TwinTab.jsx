import React, { useState } from "react";
import { Cpu, Loader2, ChevronRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function TwinTab({ assets, setActiveTab }) {
  const { selectedAsset, setAiWorkflowData } = useAegis();
  const [isSimulatingTwin, setIsSimulatingTwin] = useState(false);
  const [twinResult, setTwinResult] = useState(null);

  // Clean professional recommendation parser for clean alignment
  const formatRecommendation = (text) => {
    if (!text) return null;

    // Split sentences by period or colon for structured flow
    const parts = text.split(/(?<=[.!?])\s+/);

    return parts.map((part, idx) => {
      let trimmed = part.trim();
      if (!trimmed) return null;

      // Check if it contains specific optimal action plans to highlight them
      if (trimmed.includes('Optimal Action Plan:') || trimmed.includes('OPT-')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-2 font-mono text-xs text-blue-900 bg-blue-100/60 p-2.5 rounded-lg border border-blue-200">
            <span className="font-bold text-blue-700">★</span>
            <span className="font-semibold">{trimmed}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-800 leading-relaxed font-sans my-1.5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 w-full pb-20 pr-4">
      {/* Top Header with Proceed Button */}
      <div className="flex justify-between items-center bg-[#0E131F] border border-[#1E293B] px-6 py-4 rounded-2xl shadow-md w-full">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Decision Twin Digital Simulation Engine</h2>
          <p className="text-xs text-slate-400">Simulate real-time failover loads and multi-solution diagnostics mapping.</p>
        </div>
        <button 
          disabled={!twinResult}
          onClick={() => setActiveTab("scenario")}
          className={`px-4 py-2 border text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 shrink-0 ${
            twinResult 
              ? 'bg-[#1B2538] hover:bg-[#253450] border-[#2E3F5E] text-slate-100 cursor-pointer' 
              : 'bg-[#0E131F] border-[#1E293B] text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Proceed to What-If Simulation</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        
        {/* Left Column: Target Node & Simulation Trigger */}
        <div className="lg:col-span-2 space-y-4 bg-[#141B2B] p-5 rounded-xl border border-[#25324A]">
          <div className="space-y-1 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Target Asset Node</span>
            <div className="text-sm font-bold text-slate-100 font-mono mt-1">
              {selectedAsset ? selectedAsset.name : "No Asset Selected"}
            </div>
          </div>

          <div className="pt-2">
            <button 
              disabled={isSimulatingTwin || !selectedAsset}
              onClick={async () => {
                if (!selectedAsset) return;
                try {
                  setIsSimulatingTwin(true);
                  setTwinResult(null); 

                  await new Promise((resolve) => setTimeout(resolve, 5000));

                  const response = await fetch('http://localhost:8075/api/ai/decision-twin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assetId: selectedAsset.name })
                  });
                  
                  const data = await response.json();

                  const resultData = {
                    assetName: selectedAsset.name,
                    currentCpu: selectedAsset.cpuUsage || 40,
                    currentTemp: selectedAsset.temperature || 42,
                    predictedCpuLoad: data.predictedCpuLoad,
                    failoverProbability: data.failoverProbability,
                    downtimeCut: "38.5%",
                    riskScore: data.calculatedRiskScore || (selectedAsset.status === 'CRITICAL' ? 92 : 24),
                    thermalRisk: data.thermalRisk || "OPTIMAL",
                    identifiedProblems: data.identifiedProblems || [],
                    mitigationOptions: data.mitigationOptions || [],
                    recommendedBestOption: data.recommendedBestOption || "",
                    recommendation: data.recommendation
                  };

                  setTwinResult(resultData);
                  setAiWorkflowData((prev) => ({ ...prev, twinResult: resultData }));
                } catch (error) {
                  console.error("Failed to run Decision Twin algorithm simulation:", error);
                } finally {
                  setIsSimulatingTwin(false);
                }
              }} 
              className={`w-auto px-6 py-3 border text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
                selectedAsset ? 'bg-[#1B2538] hover:bg-[#253450] border-[#2E3F5E] text-white cursor-pointer' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Cpu className="h-4 w-4 text-slate-300" />
              <span>Simulate Digital Twin AI</span>
            </button>
            {!selectedAsset && (
              <span className="text-[10px] text-amber-400 block mt-1.5 text-center font-mono">
                * Please select or acknowledge an asset node from the Alerts or Graph tab first.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Node Diagnostics */}
        <div className="bg-[#141B2B] p-5 rounded-xl border border-[#25324A] flex flex-col justify-between font-mono text-xs space-y-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">Virtual Mirror Status</span>
            <div className="text-sm font-bold text-slate-100 mt-1">
              {isSimulatingTwin ? "Evaluating Algorithm Vectors..." : (selectedAsset ? `Synchronized to ${selectedAsset.name}` : "Awaiting Data")}
            </div>
          </div>
          <div className="space-y-2 border-t border-[#25324A] pt-3 text-slate-300">
            <div className="flex justify-between"><span>Downtime Cut:</span> <b className="text-slate-200">{twinResult ? twinResult.downtimeCut : (selectedAsset?.status === 'CRITICAL' ? '38.5%' : '25.0%')}</b></div>
            <div className="flex justify-between"><span>Vector Engine:</span> <b className="text-slate-200">Multi-Solution AI</b></div>
            <div className="flex justify-between"><span>State:</span> <b className="text-slate-300">{isSimulatingTwin ? "Processing" : "Ready"}</b></div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            {isSimulatingTwin ? "Running Spring Boot multi-solution diagnostics against database..." : "Real-time failover loads mapped from active database."}
          </div>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {isSimulatingTwin && (
        <div className="bg-[#141B2B] border border-[#25324A] p-6 rounded-2xl text-center space-y-3 animate-pulse w-full">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
          <p className="text-xs font-mono text-slate-300">Executing Deep Digital Twin Diagnostics & Multi-Solution Ranking across database nodes...</p>
        </div>
      )}

      {/* Smooth Transition Simulation Results Workspace */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden w-full ${twinResult && !isSimulatingTwin ? 'opacity-100 max-h-[2000px] pt-4 border-t border-[#1E293B]' : 'opacity-0 max-h-0 pt-0'}`}>
        {twinResult && (
          <div className="space-y-6 w-full">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Predicted Load Impact</span>
                <div className="text-xl font-bold text-slate-200">{twinResult.predictedCpuLoad}%</div>
              </div>
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Failover Probability</span>
                <div className="text-xl font-bold text-slate-200">{(twinResult.failoverProbability * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Thermal Risk State</span>
                <div className={`text-sm font-bold truncate ${twinResult.thermalRisk?.includes('CRITICAL') ? 'text-rose-400' : 'text-blue-400'}`}>
                  {twinResult.thermalRisk || "OPTIMAL"}
                </div>
              </div>
            </div>

            {/* 1. IDENTIFIED PROBLEMS LIST */}
            {twinResult.identifiedProblems && twinResult.identifiedProblems.length > 0 && (
              <div className="bg-[#141B2B] border border-[#25324A] p-5 rounded-xl space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Autonomous Diagnostics: Underlying Anomalies Detected
                  </h3>
                </div>
                <div className="space-y-2 pt-1">
                  {twinResult.identifiedProblems.map((prob, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-1 text-xs font-mono text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                      <span>{prob}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. POSSIBLE MITIGATION WAYS & BEST OPTION HIGHLIGHT */}
            {twinResult.mitigationOptions && twinResult.mitigationOptions.length > 0 && (
              <div className="bg-[#141B2B] border border-[#25324A] p-5 rounded-xl space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Multi-Solution Mitigation Strategies & AI Ranking
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {twinResult.mitigationOptions.map((opt) => {
                    const isBest = twinResult.recommendedBestOption && twinResult.recommendedBestOption.includes(opt.optionId);

                    return (
                      <div 
                        key={opt.optionId} 
                        className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 relative transition-all ${
                          isBest 
                            ? 'bg-blue-950/40 border-blue-500 shadow-lg ring-1 ring-blue-500/50' 
                            : 'bg-[#0E131F] border-[#25324A]'
                        }`}
                      >
                        {isBest && (
                          <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow">
                            ★ AI BEST CHOICE
                          </span>
                        )}

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 block">{opt.optionId}</span>
                          <h4 className="text-xs font-bold text-white">{opt.strategy}</h4>
                        </div>

                        <div className="space-y-1 font-mono text-[11px] text-slate-300 border-t border-[#25324A] pt-2">
                          <div className="flex justify-between"><span>Impact:</span> <b className="text-white">{opt.impactScore}</b></div>
                          <div className="flex justify-between"><span>Downtime Cut:</span> <b className="text-emerald-400">{opt.downtimeCut}</b></div>
                          <div className="flex justify-between"><span>Feasibility:</span> <b className="text-white">{opt.feasibility}</b></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PROFESSIONAL WHITE CLEAN RECOMMENDATION CARD WITH STRUCTURED ALIGNMENT */}
            <div className="bg-slate-50 border border-slate-300 p-6 rounded-2xl space-y-4 w-full shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  AI Algorithm Recommendation & Action Plan
                </h3>
              </div>

              {/* Structured multi-line alignment */}
              <div className="space-y-1 pt-1">
                {formatRecommendation(twinResult.recommendation)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}