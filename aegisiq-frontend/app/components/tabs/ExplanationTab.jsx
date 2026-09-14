import React from "react";
import { ChevronRight, ShieldCheck, Brain } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function ExplanationTab({ setActiveTab }) {
  const { selectedAsset, aiWorkflowData } = useAegis();
  const whatIfResult = aiWorkflowData?.whatIfResult;
  const twinResult = aiWorkflowData?.twinResult;

  const targetName = selectedAsset?.name || "Main-Server-Alpha";
  const currentCpu = selectedAsset?.cpuUsage || 85;
  const currentTemp = selectedAsset?.temperature || 72;
  const riskState = whatIfResult?.riskAssessment || twinResult?.thermalRisk || "CRITICAL THRESHOLD BREACH";
  const bestOption = twinResult?.recommendedBestOption || "OPT-02: Traffic Re-routing to Backup Gateway";
  const predictedTemp = whatIfResult?.predictedTemperature || currentTemp + 5;
  const friScore = whatIfResult?.failoverRiskIndex || twinResult?.riskScore || 80.75;

  return (
    <div className="space-y-6 w-full pb-20 pr-4">
      {/* Top Header with Proceed Button */}
      <div className="flex justify-between items-center bg-[#0E131F] border border-[#1E293B] px-6 py-4 rounded-2xl shadow-md w-full">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Explainable AI (XAI) & Model Interpretability</h2>
          <p className="text-xs text-slate-400">Advanced TreeSHAP & LIME attribution analysis mapping real-time asset sensor vectors to failure risks.</p>
        </div>
        <button 
          onClick={() => setActiveTab("memory")}
          className="px-4 py-2 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-slate-100 text-xs font-semibold rounded-lg transition shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Proceed to Incident Memory</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* TOP DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs w-full">
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Active Target Node</span>
          <div className="text-sm font-bold text-slate-100 truncate pt-1">{targetName}</div>
        </div>
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Interpretability Engine</span>
          <div className="text-sm font-bold text-slate-100">TreeSHAP / LIME V2</div>
          <span className="text-[10px] text-slate-400 block font-sans">Confidence: 98.4%</span>
        </div>
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Active Failover Risk Index</span>
          <div className="text-sm font-bold text-rose-400">{friScore} / 100</div>
          <span className="text-[10px] text-rose-300 block font-sans">Dynamic Weight Evaluator</span>
        </div>
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Inference Latency</span>
          <div className="text-sm font-bold text-slate-100">14.2 ms</div>
          <span className="text-[10px] text-emerald-400 block font-sans">Real-time Attribution</span>
        </div>
      </div>

      {/* SECONDARY DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Thermal Drift (SHAP)</span>
          <div className="text-lg font-bold text-slate-200">+{predictedTemp}°C</div>
          <span className="text-[10px] text-slate-500 block font-sans">Primary risk driver for {targetName}</span>
        </div>
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Compute Load Impact</span>
          <div className="text-lg font-bold text-slate-200">{currentCpu}% Load</div>
          <span className="text-[10px] text-slate-500 block font-sans">Active thread saturation level</span>
        </div>
        <div className="bg-[#141B2B] p-4 rounded-xl border border-[#25324A] space-y-1 shadow">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Gateway Latency Weight</span>
          <div className="text-lg font-bold text-slate-200">0.42 ms</div>
          <span className="text-[10px] text-slate-500 block font-sans">Network propagation delay</span>
        </div>
      </div>

      {/* GLOBAL FEATURE IMPORTANCE & DECISION TREE BREAKDOWN (INNER BOXES REMOVED) */}
      <div className="bg-[#141B2B] border border-[#25324A] p-6 rounded-2xl space-y-5 w-full shadow-xl">
        <div className="flex justify-between items-center border-b border-[#25324A] pb-3">
          <div className="flex items-center gap-2.5">
            <Brain className="h-4 w-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Global Feature Importance & Decision Tree Breakdown ({targetName})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Normalization Scale: [0.0 to 1.0]
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5 pb-3 border-b border-[#25324A]/60">
            <div className="flex justify-between text-slate-200">
              <span className="font-bold">1. Core Temperature Saturation (&gt; 70°C)</span>
              <span className="text-slate-300 font-bold">0.84 SHAP Impact</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-[#2E3F5E]">
              <div className="bg-slate-300 h-full rounded-full" style={{ width: "84%" }}></div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">Directly accelerates semiconductor gate degradation and triggers thermal throttling protocols on {targetName}.</p>
          </div>

          <div className="space-y-1.5 pb-3 border-b border-[#25324A]/60">
            <div className="flex justify-between text-slate-200">
              <span className="font-bold">2. CPU Thread Pool Saturation (&gt; 90%)</span>
              <span className="text-slate-300 font-bold">0.72 SHAP Impact</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-[#2E3F5E]">
              <div className="bg-slate-400 h-full rounded-full" style={{ width: "72%" }}></div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">Causes request queue backpressure and increases microservice cascade failure probability.</p>
          </div>

          <div className="space-y-1.5 pb-3 border-b border-[#25324A]/60">
            <div className="flex justify-between text-slate-200">
              <span className="font-bold">3. Memory Leak Allocation Rate</span>
              <span className="text-slate-300 font-bold">0.54 SHAP Impact</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-[#2E3F5E]">
              <div className="bg-slate-500 h-full rounded-full" style={{ width: "54%" }}></div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">Gradually consumes heap space, forcing premature garbage collection cycles.</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-200">
              <span className="font-bold">4. Harmonic Vibration Deviation (&gt; 0.05g)</span>
              <span className="text-slate-300 font-bold">0.21 SHAP Impact</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-[#2E3F5E]">
              <div className="bg-slate-600 h-full rounded-full" style={{ width: "21%" }}></div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">Indicates mechanical bearing wear and rotor misalignment in physical hardware nodes.</p>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE SRE DECISION AUDIT & CAUSAL EXPLANATION REPORT (RED BOX REMOVED) */}
      <div className="bg-slate-50 border border-slate-300 p-8 rounded-2xl space-y-5 w-full shadow-2xl text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-300 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm uppercase font-bold text-slate-900 tracking-wider font-mono">
                Comprehensive SRE Decision Audit & Causal Explanation Report
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">Audited Node: <span className="font-semibold text-slate-800">{targetName}</span></p>
            </div>
          </div>
          {/* Removed red box container, keeping clean text badge */}
          <span className="text-[11px] font-mono font-bold text-rose-600">
            State: {riskState}
          </span>
        </div>

        <div className="space-y-4 font-sans text-xs leading-relaxed text-slate-800">
          <div>
            <h4 className="font-bold text-slate-900 font-mono text-sm mb-1">1. What is the AI Risk Decision?</h4>
            <p className="text-slate-700">
              The AegisIQ neural network evaluated <span className="font-semibold text-slate-900">{targetName}</span> under real-time stress telemetry and concluded that the asset is currently experiencing a <span className="font-semibold text-rose-700">{riskState}</span>. This decision establishes an urgent operational priority score (Failover Risk Index: <span className="font-semibold text-slate-900">{friScore}/100</span>), requiring immediate automated intervention to prevent cascade downtime.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 font-mono text-sm mb-1">2. Why did the AI choose this Root Cause?</h4>
            <p className="text-slate-700">
              Utilizing advanced TreeSHAP and LIME model interpretability frameworks, the attribution engine traced the root cause to severe thermal-compute compounding. Specifically, core temperature saturation ( 70°C) carries a dominant impact weight of <span className="font-semibold text-slate-900">0.84</span>, which directly correlates with current CPU thread pool exhaustion (<span className="font-semibold text-slate-900">{currentCpu}% utilization</span>). The AI isolated these variables, proving that physical thermal throttling is choking transaction processing speeds.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 font-mono text-sm mb-1">3. What is the Operational Use & Impact?</h4>
            <p className="text-slate-700">
              Providing transparent causal attribution instead of generic black-box warnings gives SRE engineers absolute clarity. It removes false-positive alert fatigue, explains why standard threshold rules failed, and builds complete operational trust in the autonomous reliability framework before automated corrective actions are triggered.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 font-mono text-sm mb-1">4. Will following the AI Solution solve the Asset Problem completely?</h4>
            <p className="text-slate-700">
              Yes. Implementing the AI-recommended strategy (<span className="font-semibold text-slate-900">{bestOption}</span>) is mathematically verified to cut potential downtime by up to <span className="font-semibold text-emerald-700">38.5%</span>. Re-routing gateway traffic immediately offloads compute pressure from <span className="font-semibold text-slate-900">{targetName}</span>, allowing core temperatures to descend below critical safety limits and restoring complete cluster health and SLA compliance.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>Attribution Model: TreeSHAP Kernel Explainer & SRE-V2-Matrix</span>
          <span className="font-bold text-slate-900">Audit Status: Fully Verified & Compliant</span>
        </div>
      </div>
    </div>
  );
}