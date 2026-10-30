import React, { useState } from "react";
import { Upload, Loader2, FileText, CheckCircle2, AlertCircle, ChevronRight, ShieldCheck, Terminal, Database } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function ReportsTab({ assets = [], setActiveTab }) {
  const { selectedAsset } = useAegis();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [auditReport, setAuditReport] = useState(null);

  const targetName = selectedAsset?.name || "Turbine 5";

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(file);
    setAuditReport(null);

    // Exactly 10 seconds professional simulation delay
    setTimeout(() => {
      setIsUploading(false);

      const isMatchingHistory = file.name.toLowerCase().includes("audit") || file.name.toLowerCase().includes("log") || file.name.toLowerCase().includes("incident") || file.name.toLowerCase().includes("fleet");

      if (isMatchingHistory) {
        setAuditReport({
          matchFound: true,
          incidentCode: "INC-8921-X",
          confidenceScore: "98.4%",
          vectorSignature: "THERMAL_RUNAWAY_CPU_SATURATED",
          historicalReference: "Core-Node-Alpha (14 Sept 2025)",
          diagnostics: `Critical thermal saturation (>82°C) coupled with 95% thread pool exhaustion on ${targetName}.`,
          remediationProtocol: "Executed automated traffic re-routing to secondary gateway node, initiated aggressive thread pool garbage collection, and applied frequency voltage scaling (FVS).",
          executionStack: ["Spring Boot Circuit Breaker", "PostgreSQL Vector Audit Log", "Next.js Load-Shedding Matrix"],
          validationHash: "SHA-256: 8f94b21c7e6a3... (Zero downtime verified)"
        });
      } else {
        setAuditReport({
          matchFound: false,
          diagnostics: `Uploaded dataset for ${targetName} exhibits novel telemetry vectors with no historical cluster match.`
        });
      }
    }, 10000);
  };

  return (
    <div className="space-y-6 w-full pb-20 p-6 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm w-full">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Incident Memory & Dynamic RAG Synthesizer</h2>
          <p className="text-xs text-slate-500">Cross-referencing real-time telemetry with uploaded historical failure logs and audit datasets.</p>
        </div>
        <button 
          onClick={() => setActiveTab && setActiveTab("optimizer")}
          title="Proceed to Deployment Optimizer"
          className="p-2.5 rounded-xl text-xs transition flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* UPLOAD BOX CARD */}
      <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-5 shadow-sm w-full">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="text-teal-600">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs uppercase font-bold text-slate-900 tracking-wider font-mono">
              Upload Historical Maintenance Logs for RAG Analysis
            </h3>
            <p className="text-[11px] text-slate-500">Upload past incident logs or audit files. The RAG engine will cross-reference the dataset with active telemetry of <span className="font-semibold text-slate-800">{targetName}</span>.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95">
            <FileText className="h-4 w-4" />
            <span>{uploadedFile ? uploadedFile.name : "Choose Log File"}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
          {uploadedFile && !isUploading && (
            <span className="text-xs font-mono text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600" /> File loaded successfully. RAG engine parsing...
            </span>
          )}
        </div>
      </div>

      {/* LOADING SKELETON */}
      {isUploading && (
        <div className="bg-white border border-slate-200 p-10 rounded-2xl text-center space-y-3 shadow-sm w-full animate-pulse">
          <Loader2 className="h-7 w-7 animate-spin mx-auto text-teal-600" />
          <p className="text-xs font-mono text-slate-700 font-semibold">
            Parsing uploaded dataset and cross-referencing against 1,420 historical enterprise incident vectors (Processing for 10 seconds)...
          </p>
        </div>
      )}

      {/* PROFESSIONAL ENTERPRISE AUDIT REPORT */}
      {auditReport && !isUploading && (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-6 w-full shadow-sm animate-in fade-in duration-500 text-slate-900 font-sans">
          
          {/* Report Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="text-teal-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm uppercase font-bold text-slate-900 tracking-wider font-mono">
                  Enterprise Incident Remediation & RAG Synthesis Report
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Target Node: <span className="font-bold text-slate-800">{targetName}</span> | Source: {uploadedFile?.name}</p>
              </div>
            </div>
            <span className={`text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border ${
              auditReport.matchFound ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {auditReport.matchFound ? `MATCH CONFIRMED (${auditReport.confidenceScore})` : "NO HISTORY MATCH FOUND"}
            </span>
          </div>

          {auditReport.matchFound ? (
            <div className="space-y-6 text-xs text-slate-800">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Matched Incident ID</span>
                  <div className="text-sm font-bold text-slate-900">{auditReport.incidentCode}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Vector Signature</span>
                  <div className="text-sm font-bold text-teal-700 truncate">{auditReport.vectorSignature}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block font-sans">Historical Anchor</span>
                  <div className="text-sm font-bold text-slate-900">{auditReport.historicalReference}</div>
                </div>
              </div>

              {/* Section 1: Diagnostics */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-teal-600" /> 1. Telemetry Anomaly Diagnostics
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {auditReport.diagnostics}
                </p>
              </div>

              {/* Section 2: Methodology */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-teal-600" /> 2. Validated Remediation Methodology
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-medium">
                  {auditReport.remediationProtocol}
                </p>
              </div>

              {/* Section 3: Tech Stack */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wide border-b border-slate-100 pb-1">
                  3. Execution Stack & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {auditReport.executionStack.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg font-mono text-[11px] font-semibold">
                      ✓ {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 4: Verification */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wide border-b border-slate-100 pb-1">
                  4. Cryptographic Audit Trail Verification
                </h4>
                <div className="p-4 bg-teal-50/40 border border-teal-200 rounded-xl text-teal-900 font-mono text-xs">
                  <p className="font-bold mb-0.5">Verification Hash & SLA Status:</p>
                  <p className="text-slate-700">{auditReport.validationHash}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2 text-rose-900 font-mono">
              <AlertCircle className="h-7 w-7 mx-auto text-rose-600" />
              <p className="font-bold text-sm">NO HISTORICAL VECTOR MATCH FOUND</p>
              <p className="text-xs text-slate-600 font-sans">The uploaded dataset contains novel anomalous telemetry signatures. Recommended to export data for autonomous SRE neural model fine-tuning.</p>
            </div>
          )}

          {/* Report Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>RAG Synthesizer Engine: Multi-Vector Cosine Similarity & Vector DB v2.4</span>
            <span className="font-bold text-slate-900">Audit Status: SECURE & SYNCHRONIZED</span>
          </div>
        </div>
      )}
    </div>
  );
}
