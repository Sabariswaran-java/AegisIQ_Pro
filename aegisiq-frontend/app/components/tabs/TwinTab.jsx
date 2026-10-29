import React, { useState } from "react";
import { Cpu, Loader2, ChevronRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import { simulateDecisionTwin } from "../../services/api";

export default function TwinTab({ assets, setActiveTab }) {
  const { selectedAsset, setAiWorkflowData } = useAegis();
  const [isSimulatingTwin, setIsSimulatingTwin] = useState(false);
  const [twinResult, setTwinResult] = useState(null);

  const formatRecommendation = (text) => {
    if (!text) return null;
    const parts = text.split(/(?<=[.!?])\s+/);
    return parts.map((part, idx) => {
      let trimmed = part.trim();
      if (!trimmed) return null;
      if (trimmed.includes('Optimal Action Plan:') || trimmed.includes('OPT-')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-2 font-mono text-xs text-blue-900 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
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
    <div className="space-y-6 w-full pb-20 p-6 bg-[#F8FAFC] min-h-screen">
      {/* Top Header with Icon-Only Next Button */}
      <div className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm w-full">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Decision Twin Digital Simulation Engine</h2>
          <p className="text-xs text-slate-500">Simulate real-time failover loads and multi-solution diagnostics mapping.</p>
        </div>
        <button 
          onClick={() => twinResult && setActiveTab && setActiveTab("scenario")}
          disabled={!twinResult}
          title="Proceed to What-If Simulation"
          className={`p-2.5 rounded-xl text-xs transition flex items-center justify-center ${
            twinResult
              ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer active:scale-95"
              : "text-slate-300 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        
        {/* Left Column: Target Node & Simulation Trigger */}
        <div className="lg:col-span-2 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Target Asset Node</span>
            <div className="text-sm font-bold text-slate-900 font-mono mt-1">
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

                  // 6 seconds dynamic loading simulation delay
                  await new Promise((resolve) => setTimeout(resolve, 6000));

                  const data = await simulateDecisionTwin({ assetId: selectedAsset.name });

                  const resultData = {
                    assetName: selectedAsset.name,
                    currentCpu: selectedAsset.cpuUsage,
                    currentTemp: selectedAsset.temperature,
                    predictedCpuLoad: data.predictedCpuLoad,
                    failoverProbability: data.failoverProbability,
                    downtimeCut: data.downtimeCut,
                    riskScore: data.calculatedRiskScore,
                    thermalRisk: data.thermalRisk,
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
              className={`w-auto px-6 py-3 border text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                selectedAsset ? 'bg-teal-600 hover:bg-teal-700 border-teal-600 text-white cursor-pointer active:scale-95' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Cpu className="h-4 w-4 text-white" />
              <span>Simulate Digital Twin AI</span>
            </button>
            {!selectedAsset && (
              <span className="text-[10px] text-amber-600 block mt-1.5 font-mono">
                * Please select or acknowledge an asset node from the Alerts or Graph tab first.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Node Diagnostics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between font-mono text-xs space-y-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Virtual Mirror Status</span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {isSimulatingTwin ? "Evaluating Algorithm Vectors..." : (selectedAsset ? `Synchronized to ${selectedAsset.name}` : "Awaiting Data")}
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-600">
            <div className="flex justify-between"><span>Downtime Cut:</span> <b className="text-slate-900">{twinResult ? twinResult.downtimeCut : (selectedAsset ? `${selectedAsset.cpuUsage || 0}%` : "---")}</b></div>
            <div className="flex justify-between"><span>Vector Engine:</span> <b className="text-slate-900">Multi-Solution AI</b></div>
            <div className="flex justify-between"><span>State:</span> <b className="text-slate-700">{isSimulatingTwin ? "Processing" : "Ready"}</b></div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            {isSimulatingTwin ? "Running Spring Boot multi-solution diagnostics against database..." : "Real-time failover loads mapped from active database."}
          </div>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {isSimulatingTwin && (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-3 shadow-sm w-full">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600" />
          <p className="text-xs font-mono text-slate-600">Executing Deep Digital Twin Diagnostics & Multi-Solution Ranking across database nodes...</p>
        </div>
      )}

      {/* Smooth Transition Simulation Results Workspace */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden w-full ${twinResult && !isSimulatingTwin ? 'opacity-100 max-h-[2000px] pt-4' : 'opacity-0 max-h-0 pt-0'}`}>
        {twinResult && (
          <div className="space-y-6 w-full">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Predicted Load Impact</span>
                <div className="text-xl font-bold text-slate-900">{twinResult.predictedCpuLoad}%</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Failover Probability</span>
                <div className="text-xl font-bold text-slate-900">{(twinResult.failoverProbability * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Thermal Risk State</span>
                <div className={`text-sm font-bold truncate ${twinResult.thermalRisk?.includes('CRITICAL') ? 'text-rose-600' : 'text-teal-600'}`}>
                  {twinResult.thermalRisk}
                </div>
              </div>
            </div>

            {/* 1. IDENTIFIED PROBLEMS LIST */}
            {twinResult.identifiedProblems && twinResult.identifiedProblems.length > 0 && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 w-full shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Autonomous Diagnostics: Underlying Anomalies Detected
                  </h3>
                </div>
                <div className="space-y-2 pt-1">
                  {twinResult.identifiedProblems.map((prob, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-1 text-xs font-mono text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      <span>{prob}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. POSSIBLE MITIGATION WAYS & BEST OPTION HIGHLIGHT */}
            {twinResult.mitigationOptions && twinResult.mitigationOptions.length > 0 && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 w-full shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-teal-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
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
                            ? 'bg-teal-50/60 border-teal-500 shadow-md ring-1 ring-teal-500/30' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {isBest && (
                          <span className="absolute -top-2.5 right-3 bg-teal-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow">
                            ★ AI BEST CHOICE
                          </span>
                        )}

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 block">{opt.optionId}</span>
                          <h4 className="text-xs font-bold text-slate-900">{opt.strategy}</h4>
                        </div>

                        <div className="space-y-1 font-mono text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                          <div className="flex justify-between"><span>Impact:</span> <b className="text-slate-900">{opt.impactScore}</b></div>
                          <div className="flex justify-between"><span>Downtime Cut:</span> <b className="text-emerald-600">{opt.downtimeCut}</b></div>
                          <div className="flex justify-between"><span>Feasibility:</span> <b className="text-slate-900">{opt.feasibility}</b></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PROFESSIONAL RECOMMENDATION CARD */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 w-full shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="p-1.5 bg-teal-600 text-white rounded-lg shadow-sm">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  AI Algorithm Recommendation & Action Plan
                </h3>
              </div>

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
