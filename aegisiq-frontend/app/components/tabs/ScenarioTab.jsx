import React, { useState } from "react";
import { Play, Loader2, ChevronRight, ShieldAlert } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import { evaluateScenario } from "../../services/api";

export default function ScenarioTab({ assets, setActiveTab }) {
  const { selectedAsset, setAiWorkflowData } = useAegis();
  const [scenarioLoad, setScenarioLoad] = useState(85);
  const [memorySaturation, setMemorySaturation] = useState(80);
  const [isSimulatingTwin, setIsSimulatingTwin] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);

  const formatUnifiedReport = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-0.5"></div>;

      if (trimmed.startsWith('|---') || trimmed.startsWith('---') || trimmed === '---' || trimmed.match(/^[\|\-\:\s]+$/)) {
        return null;
      }

      if (trimmed.startsWith('#') || trimmed.match(/^[0-9]+\.\s+/) || trimmed.startsWith('**Asset') || trimmed.startsWith('**Current')) {
        let cleanHeader = trimmed.replace(/#+/g, '').replace(/\*\*/g, '').replace(/\|/g, '').replace(/`/g, '').trim();
        if (!cleanHeader) return null;
        return (
          <h4 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-3 mb-1 font-mono border-b border-slate-200 pb-1">
            {cleanHeader}
          </h4>
        );
      }

      if (trimmed.includes('|')) {
        let parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length === 0) return null;
        if (parts[0].toLowerCase().includes('metric') || parts[0].toLowerCase().includes('action') || parts[0].toLowerCase().includes('condition') || parts[0].toLowerCase().includes('threshold')) {
          return null;
        }
        return (
          <div key={idx} className="py-1 border-b border-slate-100 flex justify-between items-center text-xs font-sans">
            <span className="font-bold text-slate-900">{parts[0].replace(/\*\*/g, '')}</span>
            <span className="text-slate-800 font-semibold text-right">{parts[parts.length - 1].replace(/\*\*/g, '').replace(/<br>/g, ' ')}</span>
          </div>
        );
      }

      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        let cleanBullet = trimmed.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/`/g, '').replace(/<br>/g, ' ');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1 font-sans text-xs text-slate-900 font-semibold">
            <span className="text-teal-600 font-bold mt-0.5">•</span>
            <span>{cleanBullet}</span>
          </div>
        );
      }

      let cleanParagraph = trimmed.replace(/\*\*/g, '').replace(/`/g, '').replace(/<br\s*[\/]?>/gi, ' ').replace(/\|/g, '');
      if (!cleanParagraph.trim()) return null;

      // Enhanced font weight for high visibility matching 'Synchronized' font style
      return (
        <p key={idx} className="text-xs text-slate-900 font-semibold leading-relaxed font-sans my-1.5">
          {cleanParagraph}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 w-full pb-20 p-6 bg-[#F8FAFC] min-h-screen">
      {/* Top Header with Icon-Only Next Button */}
      <div className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm w-full">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Advanced What-If Stress Testing Engine</h2>
          <p className="text-xs text-slate-500">Simulate multi-vector operational surges, memory exhaustion, and thermal degradation based on active asset telemetry.</p>
        </div>
        <button 
          onClick={() => scenarioResult && setActiveTab && setActiveTab("explainable")}
          disabled={!scenarioResult}
          title="Proceed to Explainable AI"
          className={`p-2.5 rounded-xl text-xs transition flex items-center justify-center ${
            scenarioResult
              ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer active:scale-95"
              : "text-slate-300 cursor-not-allowed"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div className="lg:col-span-2 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Target Simulation Node (Linked)</span>
            <div className="text-sm font-bold text-slate-900 font-mono mt-1">
              {selectedAsset ? `${selectedAsset.name} • Baseline Load: ${selectedAsset.cpuUsage || 0}% | Baseline Memory: ${selectedAsset.memoryUsage || 45}%` : "No Asset Selected (Select from Alerts or Graph)"}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-600 font-mono">
              <span>Compute Load Surge Vector</span>
              <span className="text-slate-900 font-bold">{scenarioLoad}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={scenarioLoad} 
              onChange={(e) => setScenarioLoad(Number(e.target.value))} 
              className="w-full accent-teal-600 cursor-pointer bg-slate-200 rounded-lg h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600 font-mono">
              <span>Memory Saturation Threshold</span>
              <span className="text-slate-900 font-bold">{memorySaturation}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={memorySaturation} 
              onChange={(e) => setMemorySaturation(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer bg-slate-200 rounded-lg h-2" 
            />
          </div>

          <button 
            disabled={isSimulatingTwin || !selectedAsset}
            onClick={async () => {
              if (!selectedAsset) return;
              try {
                setIsSimulatingTwin(true);
                setScenarioResult(null); 

                // 6 seconds delay simulation
                await new Promise((resolve) => setTimeout(resolve, 6000));

                const data = await evaluateScenario({
                  loadPercentage: scenarioLoad,
                  memoryPercentage: memorySaturation,
                  assetName: selectedAsset.name
                });

                const resultData = {
                  failoverRiskIndex: data.failoverRiskIndex ?? 85,
                  predictedTemperature: data.predictedTemperature ?? 78.4,
                  riskAssessment: data.severityState || "critical threshold breach",
                  priorityLevel: data.priorityLevel,
                  predictedImpact: data.predictedImpact
                };

                setScenarioResult(resultData);
                setAiWorkflowData((prev) => ({ ...prev, whatIfResult: resultData }));
              } catch (error) {
                console.error("Failed to execute What-If stress simulation API:", error);
              } finally {
                setIsSimulatingTwin(false);
              }
            }} 
            className={`w-auto px-6 py-3 border text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
              selectedAsset ? 'bg-teal-600 hover:bg-teal-700 border-teal-600 text-white cursor-pointer active:scale-95' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="h-4 w-4 text-white" />
            <span>Execute Stress Simulation Matrix</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between font-mono text-xs space-y-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Node Telemetry Vector</span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              {isSimulatingTwin ? "Injecting Stress Vector..." : (selectedAsset ? selectedAsset.name : "Select Node")}
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-600">
            <div className="flex justify-between"><span>Polling Rate:</span> <b className="text-slate-900 font-bold">100 Hz</b></div>
            <div className="flex justify-between"><span>Cluster Status:</span> <b className="text-slate-900 font-bold">{isSimulatingTwin ? "Stressing" : "Synchronized"}</b></div>
            <div className="flex justify-between"><span>Prediction Model:</span> <b className="text-slate-900 font-bold">SRE-V2-Matrix</b></div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            {isSimulatingTwin ? "Evaluating multi-vector stress decay algorithm..." : "Ready for vector stress injection across microservices."}
          </div>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {isSimulatingTwin && (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-3 shadow-sm w-full">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600" />
          <p className="text-xs font-mono text-slate-600 font-semibold">Running Deep Neural Stress Simulation & Thermal Decay Model across cluster nodes (6s delay)...</p>
        </div>
      )}

      {/* UNIFIED PROFESSIONAL ENTERPRISE REPORT CONTAINER */}
      <div className={`transition-all duration-700 ease-in-out w-full ${scenarioResult && !isSimulatingTwin ? 'opacity-100 pt-4' : 'opacity-0 h-0 overflow-hidden'}`}>
        {scenarioResult && (
          <div className="space-y-5 w-full">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Failover Risk Index (FRI)</span>
                {/* Fixed font matching for FRI score and denominator */}
                <div className="text-xl font-bold text-rose-600 pt-1 flex items-baseline gap-1">
                  <span>{scenarioResult.failoverRiskIndex}</span>
                  <span className="text-xs font-bold text-slate-500">/ 100</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Predicted Core Temperature</span>
                <div className="text-xl font-bold text-amber-600 pt-1">
                  {scenarioResult.predictedTemperature}°C
                </div>
                <div className="text-[10px] text-amber-500 font-sans font-semibold">Threshold Limit: 75.0°C (Critical)</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Active Stress Vectors</span>
                <div className="text-sm font-bold text-slate-900 pt-1">Load: {scenarioLoad}% | Mem: {memorySaturation}%</div>
                <div className="text-[10px] text-slate-500 font-sans font-semibold">Status: Envelope Exceeded</div>
              </div>
            </div>

            {/* SINGLE UNIFIED REPORT CONTAINER */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 w-full shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="text-teal-600">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-bold text-slate-900 tracking-wider font-mono">
                      Autonomous Mitigation Protocol & Live AI Analysis
                    </h3>
                    <p className="text-[11px] text-slate-600 font-semibold font-sans">Target Asset: <span className="font-bold text-slate-900">{selectedAsset?.name || "Main-Server-Alpha"}</span></p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-600 lowercase">
                  State: {scenarioResult.riskAssessment || "critical threshold breach"}
                </span>
              </div>

              <div className="space-y-1 pt-1">
                {formatUnifiedReport(scenarioResult.predictedImpact)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
