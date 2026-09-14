import React from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, ChevronRight, ShieldAlert } from "lucide-react";
import { useAegis } from "../../context/AegisContext";

export default function AlertsTab({ assets, setActiveTab }) {
  const { setSelectedAsset, setWorkflowState } = useAegis();

  // 1. Priority Sorting Logic (Critical first, then Warning, sorted by load/temp)
  const warningAssets = assets.filter((a) => a.status === "WARNING");
  const criticalAssets = assets.filter((a) => a.status === "CRITICAL");
  const faultyAssets = [...criticalAssets, ...warningAssets].sort((a, b) => {
    let scoreA = a.status === 'CRITICAL' ? 100 : 50;
    let scoreB = b.status === 'CRITICAL' ? 100 : 50;
    if ((a.temperature || 0) > 65) scoreA += 30;
    if ((b.temperature || 0) > 65) scoreB += 30;
    return scoreB - scoreA;
  });

  const warningCount = warningAssets.length;
  const criticalCount = criticalAssets.length;
  const healthyCount = assets.filter((a) => a.status === "HEALTHY").length;
  const totalAssetsCount = assets.length;

  const systemHealthPercentage = totalAssetsCount > 0 
    ? ((healthyCount / totalAssetsCount) * 100).toFixed(1)
    : "100.0";

  // Track resolved/acknowledged IDs in component state for sequential locking
  const [acknowledgedIds, setAcknowledgedIds] = React.useState([]);

  // 2. Handle Acknowledge: Navigates directly to Decision Graph tab with selected asset
  const handleAcknowledge = (asset) => {
    setAcknowledgedIds(prev => [...prev, asset.id]);
    setSelectedAsset(asset);
    setWorkflowState({ acknowledged: true });
    setActiveTab("graph");
  };

  return (
    <div className="space-y-6 w-full pb-12">
      <div className="w-full">
        <h2 className="text-base font-bold text-white tracking-tight">Active Incidents & Priority Workflow</h2>
        <p className="text-xs text-slate-400">Strict sequential triage: Resolve high-priority critical anomalies before downstream asset acknowledgment unlocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="bg-[#0E131F] border border-[#1E293B] p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Critical Alerts</span>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-white font-mono">{criticalCount}</div>
            <span className="text-[10px] text-slate-500 mb-1">Immediate action req.</span>
          </div>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">System Warnings</span>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-white font-mono">{warningCount}</div>
            <span className="text-[10px] text-slate-500 mb-1">Observation needed</span>
          </div>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-5 rounded-xl space-y-1 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Overall Fleet SLA</span>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-bold text-white font-mono">{systemHealthPercentage}%</div>
            <span className="text-[10px] text-slate-500 mb-1">Operational Health</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#1E293B] pb-2">Faulty Assets Action Required</h3>
        {faultyAssets.length === 0 ? (
          <div className="bg-[#0E131F] border border-[#1E293B] p-10 rounded-xl flex flex-col items-center justify-center text-center space-y-3 w-full">
            <ShieldCheck className="h-10 w-10 text-emerald-500" />
            <div>
              <span className="text-sm font-bold text-white block">All Systems Nominal</span>
              <span className="text-xs text-slate-400">No active alerts or incidents detected across the fleet.</span>
            </div>
          </div>
        ) : (
          faultyAssets.map((asset, index) => {
            let issueDesc = "Multiple threshold anomalies detected.";
            if (asset.cpuUsage > 85) issueDesc = `Compute load critically high at ${asset.cpuUsage}%. Potential bottleneck.`;
            else if (asset.temperature > 65) issueDesc = `Thermal threshold exceeded (${asset.temperature}°C). Cooling mechanism check required.`;
            else if (asset.vibration > 0.05) issueDesc = `Abnormal harmonic vibration detected (${asset.vibration}g).`;

            // Sequential priority logic: Only the first unacknowledged asset is active
            const isResolved = acknowledgedIds.includes(asset.id);
            const firstUnresolvedIndex = faultyAssets.findIndex(a => !acknowledgedIds.includes(a.id));
            const isCurrentPriority = index === firstUnresolvedIndex;

            const cardBorderClass = isResolved 
              ? 'border-l-emerald-500/80 bg-[#0E131F]/50 opacity-70' 
              : isCurrentPriority 
              ? 'border-l-rose-500 bg-[#0E131F] shadow-lg ring-1 ring-rose-500/40' 
              : 'border-l-[#334155] bg-[#0E131F] opacity-60';

            return (
              <div 
                key={asset.id} 
                className={`border-l-4 border-[#1E293B] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4 transition-all duration-300 w-full ${cardBorderClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg mt-0.5 shrink-0 ${isResolved ? 'bg-emerald-500/10 text-emerald-400' : asset.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {isResolved ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{asset.name}</h3>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide ${asset.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {asset.status}
                      </span>
                      {/* Changed Priority Badge from Blue to Slate/Charcoal */}
                      <span className="text-[9px] bg-[#141B2B] text-slate-300 border border-[#2E3F5E] px-2 py-0.5 rounded font-mono font-bold">
                        PRIORITY #{index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300 font-medium">Diagnostics:</strong> {issueDesc} Immediate inspection recommended.
                    </p>
                    <div className="flex gap-4 text-[10px] font-mono text-slate-500 pt-1 flex-wrap">
                      <span>ID: NODE-{asset.id}</span>
                      <span>Type: {asset.type}</span>
                      <span>Temp: {asset.temperature ?? 0}°C</span>
                      <span>Load: {asset.cpuUsage ?? 0}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons with Sequential Locking & Navigation to Graph Tab */}
                <div className="flex md:flex-col gap-2 min-w-[160px] shrink-0">
                  <button 
                    onClick={() => setActiveTab("explainable")} 
                    disabled={!isCurrentPriority && !isResolved}
                    className={`px-4 py-2 border text-xs font-semibold rounded-lg transition text-center w-full flex items-center justify-center gap-1.5 ${
                      isResolved 
                        ? 'bg-[#141B2B] border-[#1E293B] text-slate-500 cursor-default'
                        : isCurrentPriority
                        ? 'bg-[#141B2B] hover:bg-[#1E293B] border-rose-500/50 text-slate-200 cursor-pointer'
                        : 'bg-[#141B2B] border-[#1E293B] text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    <span>Analyze Root Cause</span>
                  </button>

                  <button 
                    onClick={() => handleAcknowledge(asset)} 
                    disabled={!isCurrentPriority && !isResolved}
                    className={`px-4 py-2 border text-xs font-semibold rounded-lg transition text-center w-full flex items-center justify-center gap-1.5 ${
                      isResolved 
                        ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400 cursor-default'
                        : isCurrentPriority
                        // Changed Acknowledge & Fix button from bright blue to sleek dark slate/zinc with subtle hover
                        ? 'bg-[#1B2538] hover:bg-[#253450] border-[#2E3F5E] text-slate-100 cursor-pointer shadow-md'
                        : 'bg-[#141B2B] border-[#1E293B] text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Resolved & Cleared</span>
                      </>
                    ) : isCurrentPriority ? (
                      <>
                        <span>Acknowledge & Fix</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5 text-slate-600" />
                        <span>Locked (Complete P#{firstUnresolvedIndex + 1})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}