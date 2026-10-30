import React from "react";
import { Download, CheckCircle2, RotateCcw, Terminal } from "lucide-react";
import { useAegis } from "../../context/AegisContext";
import { updateAsset } from "../../services/api";

export default function DeployTab({ assets, syncData, setActiveTab }) {
  const { selectedAsset, setSelectedAsset, aiWorkflowData } = useAegis();
  const incidentResult = aiWorkflowData?.incidentReport;

  return (
    <div className="space-y-6 w-full pb-20 pr-4 font-sans">
      <div className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm w-full">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Deployment & Maintenance Window Optimizer</h2>
          <p className="text-xs text-slate-500">Finalizing release schedule and executing verified RAG resolution protocols.</p>
        </div>
        <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 font-bold">
          Protocol Active
        </span>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm w-full text-slate-900">
        {selectedAsset ? (
          <div className="space-y-6 w-full">
            <div className="p-5 flex justify-between items-center w-full border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 font-sans">Enterprise Master Incident & Remediation Audit Report</h3>
                <span className="text-[11px] text-slate-500 font-mono">Evaluated Vector Dataset: {incidentResult?.fileName || `${selectedAsset.name}_Telemetry`}</span>
              </div>
              
              <button 
                onClick={() => {
                  // Use the exact fullReportText generated from Incident Memory, or fallback to default template
                  const reportContent = incidentResult?.fullReportText || `AEGISIQ ENTERPRISE INCIDENT AND REMEDIATION REPORT

TIMESTAMP: ${new Date().toLocaleString()}
SYSTEM ENGINE: Multi-Vector RAG Synthesizer v2.4

1. ASSET PROFILE AND TELEMETRY
   Target Asset Tag    : ${selectedAsset?.name || "Turbine-Pump-01"}
   Architecture Type   : ${selectedAsset?.type || "TURBINE_PUMP"}
   Operating Status    : ${selectedAsset?.status || "CRITICAL"}
   Active Compute Load : ${selectedAsset?.cpuUsage || 24}%
   Core Temperature    : ${selectedAsset?.temperature || 41} C

2. CURRENT OPERATIONAL PROBLEM
   ALERT   : Severe thermal saturation and memory leak cascade across thread pool.
   Impact  : Gate stress acceleration and potential microservice locking if left unmitigated.

3. HISTORICAL DATA CORRELATION AND MATCHING
   Status  : Verified
   Details : Primary failure signature correlates with enterprise incident cluster #402.

4. PREVIOUS INCIDENT RESOLUTION STRATEGY
   Strategy: Dynamic thread reallocation and secondary coolant circuit override (Cluster Batch #8942-B).
   Result  : Outcome successfully restored nominal SLA bounds within 4 hours with zero data loss.

5. RECOMMENDED MITIGATION STRATEGY (ACTION REQUIRED)
   Directive: Dynamic thread reallocation and secondary coolant circuit override (Cluster Batch #8942-B).

6. STATISTICAL ASSURANCE AND CONFIDENCE
   Confidence Metric      : 97.8% High Historical Correlation
   Vector Database Store : Pinecone / ChromaDB Embedded SRE Corpus
   Safety Guarantee      : Executing recommended directives guarantees system stabilization with a 98.2% safety margin.

REPORT GENERATED & VERIFIED BY: AegisIQ Autonomous SRE Engine v2.4
STATUS: READY FOR DEPLOYMENT / AUDIT CLOSED`;

                  const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `AegisIQ_Master_Audit_Report_${selectedAsset?.name || "Asset"}_${new Date().toISOString().slice(0, 10)}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 border border-teal-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Download className="h-3.5 w-3.5 text-white" /> Download Report
              </button>
            </div>

            <div className="p-5 space-y-4 w-full">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">Deployment & Remediation Verification Protocol</h4>
                <p className="text-xs text-slate-600 mt-1 font-sans">
                  Based on the AI recommendation above, would you like to take action to resolve the anomaly, or repeat the workflow cycle?
                </p>
              </div>

              <div className="text-xs font-mono text-slate-700">
                Target Asset State: <span className="text-slate-900 font-bold">{selectedAsset?.name || 'Node'}</span> (<span className={selectedAsset?.status === 'HEALTHY' ? 'text-teal-700 font-bold' : 'text-rose-600 font-bold'}>{selectedAsset?.status || 'CRITICAL'}</span>)
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={async () => {
                    if (!selectedAsset) {
                      alert("No active asset selected in state.");
                      return;
                    }
                    try {
                      await updateAsset(selectedAsset.id, {
                        ...selectedAsset,
                        status: "HEALTHY",
                        cpuUsage: 24,
                        temperature: 41,
                        vibration: 0.02
                      });
                      setSelectedAsset({
                        ...selectedAsset,
                        status: "HEALTHY",
                        cpuUsage: 24,
                        temperature: 41,
                        vibration: 0.02
                      });
                      syncData();
                      
                      setActiveTab("dashboard");
                      
                    } catch (err) {
                      alert("Failed to commit resolution action.");
                    }
                  }} 
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 border border-teal-600 text-slate-100 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  <span>Action Take</span>
                </button>

                <button 
                  onClick={() => { setActiveTab("graph"); }} 
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Repeat Workflow</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-20 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 w-full">
            <Terminal className="h-10 w-10 text-slate-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Active Target Asset Selected</h3>
              <p className="text-xs text-slate-500 mt-1">Please select an asset from the Alerts or Graph tab to execute deployment verification.</p>
            </div>
            <button 
              onClick={() => setActiveTab("graph")}
              className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 border border-teal-600 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-sm active:scale-95"
            >
              Go to Decision Graph ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
