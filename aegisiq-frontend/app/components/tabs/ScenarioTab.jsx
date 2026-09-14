import React, { useState } from "react";
import { Play, Loader2, ChevronRight, ShieldAlert, Thermometer } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function ScenarioTab({ assets, setActiveTab }) {
  const { selectedAsset, setAiWorkflowData } = useAegis();
  const [scenarioLoad, setScenarioLoad] = useState(85);
  const [memorySaturation, setMemorySaturation] = useState(80);
  const [isSimulatingTwin, setIsSimulatingTwin] = useState(false);
  const [scenarioResult, setScenarioResult] = useState(null);

  // Clean professional parser without heading bullets or multi-containers
  const formatUnifiedReport = (text) => {
    if (!text) return null;

    const lines = text.split('\n');

    return lines.map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-0.5"></div>;

      // Skip raw table borders
      if (trimmed.startsWith('|---') || trimmed.startsWith('---') || trimmed === '---' || trimmed.match(/^[\|\-\:\s]+$/)) {
        return null;
      }

      // Handle Headings (Clean text without any bullet points or dots)
      if (trimmed.startsWith('#') || trimmed.match(/^[0-9]+\.\s+/) || trimmed.startsWith('**Asset') || trimmed.startsWith('**Current')) {
        let cleanHeader = trimmed.replace(/#+/g, '').replace(/\*\*/g, '').replace(/\|/g, '').replace(/`/g, '').trim();
        if (!cleanHeader) return null;
        return (
          <h4 key={idx} className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-3 mb-1 font-mono border-b border-slate-200 pb-1">
            {cleanHeader}
          </h4>
        );
      }

      // Handle table structured lines
      if (trimmed.includes('|')) {
        let parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
        if (parts.length === 0) return null;
        if (parts[0].toLowerCase().includes('metric') || parts[0].toLowerCase().includes('action') || parts[0].toLowerCase().includes('condition') || parts[0].toLowerCase().includes('threshold')) {
          return null;
        }
        return (
          <div key={idx} className="py-1 border-b border-slate-100 flex justify-between items-center text-xs font-sans">
            <span className="font-bold text-slate-800">{parts[0].replace(/\*\*/g, '')}</span>
            <span className="text-slate-600 text-right">{parts[parts.length - 1].replace(/\*\*/g, '').replace(/<br>/g, ' ')}</span>
          </div>
        );
      }

      // Handle bullet points properly inside the unified container
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        let cleanBullet = trimmed.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/`/g, '').replace(/<br>/g, ' ');
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1 font-sans text-xs text-slate-700">
            <span className="text-blue-600 font-bold mt-0.5">•</span>
            <span>{cleanBullet}</span>
          </div>
        );
      }

      // Standard paragraphs
      let cleanParagraph = trimmed.replace(/\*\*/g, '').replace(/`/g, '').replace(/<br\s*[\/]?>/gi, ' ').replace(/\|/g, '');
      if (!cleanParagraph.trim()) return null;

      return (
        <p key={idx} className="text-xs text-slate-800 leading-relaxed font-sans my-0.5">
          {cleanParagraph}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 w-full pb-20 pr-4">
      {/* Top Header with Proceed Button */}
      <div className="flex justify-between items-center bg-[#0E131F] border border-[#1E293B] px-6 py-4 rounded-2xl shadow-md w-full">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Advanced What-If Stress Testing Engine</h2>
          <p className="text-xs text-slate-400">Simulate multi-vector operational surges, memory exhaustion, and thermal degradation based on active asset telemetry.</p>
        </div>
        <button 
          disabled={!scenarioResult}
          onClick={() => setActiveTab("explainable")}
          className={`px-4 py-2 border text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-2 shrink-0 ${
            scenarioResult 
              ? 'bg-[#1B2538] hover:bg-[#253450] border-[#2E3F5E] text-slate-100 cursor-pointer' 
              : 'bg-[#0E131F] border-[#1E293B] text-slate-600 cursor-not-allowed opacity-50'
          }`}
        >
          <span>Proceed to Explainable AI</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* CONTROLS GRID FLOWS DIRECTLY WITHOUT OUTER DARK CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
        <div className="lg:col-span-2 space-y-4 bg-[#141B2B] p-5 rounded-xl border border-[#25324A]">
          <div className="space-y-1 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block font-mono">Target Simulation Node (Linked)</span>
            <div className="text-sm font-bold text-slate-100 font-mono mt-1">
              {selectedAsset ? `${selectedAsset.name} [Type: ${selectedAsset.type}] • Baseline Load: ${selectedAsset.cpuUsage || 0}%` : "No Asset Selected (Select from Alerts or Graph)"}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Compute Load Surge Vector</span>
              <span className="text-slate-200 font-bold">{scenarioLoad}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={scenarioLoad} 
              onChange={(e) => setScenarioLoad(Number(e.target.value))} 
              className="w-full accent-slate-400 cursor-pointer bg-slate-800 rounded-lg h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>Memory Saturation Threshold</span>
              <span className="text-slate-400 font-bold">{memorySaturation}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={memorySaturation} 
              onChange={(e) => setMemorySaturation(Number(e.target.value))}
              className="w-full accent-slate-400 cursor-pointer bg-slate-800 rounded-lg h-2" 
            />
          </div>

          {/* STABLE BUTTON */}
          <button 
            disabled={isSimulatingTwin || !selectedAsset}
            onClick={async () => {
              if (!selectedAsset) return;
              try {
                setIsSimulatingTwin(true);
                setScenarioResult(null); 

                await new Promise((resolve) => setTimeout(resolve, 3000));

               const response = await apiClient.post('/ai/scenarios/what-if', payload); {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    loadPercentage: scenarioLoad,
                    memoryPercentage: memorySaturation
                  })
                });

                const data = await response.json();

                const resultData = {
                  failoverRiskIndex: data.failoverRiskIndex,
                  predictedTemperature: data.predictedTemperature,
                  riskAssessment: data.severityState,
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
            className={`w-auto px-6 py-3 border text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
              selectedAsset ? 'bg-[#1B2538] hover:bg-[#253450] border-[#2E3F5E] text-white cursor-pointer' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className="h-4 w-4 text-slate-300" />
            <span>Execute Stress Simulation Matrix</span>
          </button>
        </div>

        <div className="bg-[#141B2B] p-5 rounded-xl border border-[#25324A] flex flex-col justify-between font-mono text-xs space-y-3">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">Node Telemetry Vector</span>
            <div className="text-sm font-bold text-slate-100 mt-1">
              {isSimulatingTwin ? "Injecting Stress Vector..." : (selectedAsset ? selectedAsset.name : "Select Node")}
            </div>
          </div>
          <div className="space-y-2 border-t border-[#25324A] pt-3 text-slate-300">
            <div className="flex justify-between"><span>Polling Rate:</span> <b className="text-slate-200">100 Hz</b></div>
            <div className="flex justify-between"><span>Cluster Status:</span> <b className="text-slate-200">{isSimulatingTwin ? "Stressing" : "Synchronized"}</b></div>
            <div className="flex justify-between"><span>Prediction Model:</span> <b className="text-slate-200">SRE-V2-Matrix</b></div>
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            {isSimulatingTwin ? "Evaluating multi-vector stress decay algorithm..." : "Ready for vector stress injection across microservices."}
          </div>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {isSimulatingTwin && (
        <div className="bg-[#141B2B] border border-[#25324A] p-6 rounded-2xl text-center space-y-3 animate-pulse w-full">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
          <p className="text-xs font-mono text-slate-300">Running Deep Neural Stress Simulation & Thermal Decay Model across cluster nodes...</p>
        </div>
      )}

      {/* UNIFIED PROFESSIONAL ENTERPRISE REPORT CONTAINER */}
      <div className={`transition-all duration-700 ease-in-out w-full ${scenarioResult && !isSimulatingTwin ? 'opacity-100 pt-4 border-t border-[#1E293B]' : 'opacity-0 h-0 overflow-hidden'}`}>
        {scenarioResult && (
          <div className="space-y-5 w-full">

            {/* Metric Cards Grid (Formula Removed) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Failover Risk Index (FRI)</span>
                <div className="text-xl font-bold text-rose-400 pt-1">{scenarioResult.failoverRiskIndex} <span className="text-xs text-slate-500">/ 100</span></div>
              </div>
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Predicted Core Temperature</span>
                <div className="text-xl font-bold text-amber-400 pt-1">{scenarioResult.predictedTemperature}°C</div>
                <div className="text-[10px] text-amber-300 font-sans">Threshold Limit: 75.0°C (Critical)</div>
              </div>
              <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Active Stress Vectors</span>
                <div className="text-sm font-bold text-slate-200 pt-1">Load: {scenarioLoad}% | Mem: {memorySaturation}%</div>
                <div className="text-[10px] text-slate-400 font-sans">Status: Envelope Exceeded</div>
              </div>
            </div>

            {/* SINGLE UNIFIED REPORT CONTAINER (TOP GAP REDUCED) */}
            <div className="bg-slate-50 border border-slate-300 p-5 rounded-2xl space-y-3 w-full shadow-2xl h-auto">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-bold text-slate-900 tracking-wider font-mono">
                      Autonomous Mitigation Protocol & Live AI Analysis
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans">Target Asset: <span className="font-semibold text-slate-700">{selectedAsset?.name || "Main-Server-Alpha"}</span></p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-600">
                  State: {scenarioResult.riskAssessment || "CRITICAL THRESHOLD BREACH"}
                </span>
              </div>

              {/* Unified Clean Report Flow with tight spacing */}
              <div className="space-y-1 pt-1">
                {formatUnifiedReport(scenarioResult.predictedImpact)}
              </div>

              {/* Summary Footer Banner with Dynamic Priority */}
              <div className={`border p-3 rounded-xl flex items-center justify-between text-xs font-sans ${
                scenarioResult.riskAssessment?.includes('CRITICAL') ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-center gap-2">
                  <Thermometer className={`h-4 w-4 shrink-0 ${scenarioResult.riskAssessment?.includes('CRITICAL') ? 'text-rose-600' : 'text-blue-600'}`} />
                  <span><b>Remediation Protocol Active:</b> System health guardrails are active for {selectedAsset?.name}.</span>
                </div>
                <span className="font-mono font-bold">Priority: {scenarioResult.priorityLevel || "P3-OPTIMAL"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
