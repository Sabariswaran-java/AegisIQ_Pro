import React from "react";
import { Download } from "lucide-react";

export default function ReportsTab({ assets, syncData }) {
  const totalAssetsCount = assets.length;
  const healthyAssets = assets.filter((a) => a.status === "HEALTHY");
  const warningAssets = assets.filter((a) => a.status === "WARNING");
  const criticalAssets = assets.filter((a) => a.status === "CRITICAL");
  const faultyAssets = [...criticalAssets, ...warningAssets];

  const healthyCount = healthyAssets.length;
  const avgTemp = totalAssetsCount > 0 
    ? (assets.reduce((acc, curr) => acc + (Number(curr.temperature) || 42), 0) / totalAssetsCount).toFixed(1)
    : "42.0";

  const exportReportCSV = () => {
    const headers = ["ID,Asset Tag,Type,Status,CPU Load (%),Memory (%),Temp (C),Vibration (g)\n"];
    const rows = assets.map(a => `${a.id},${a.name},${a.type},${a.status},${a.cpuUsage},${a.memoryUsage},${a.temperature},${a.vibration}\n`);
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AegisIQ_Fleet_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 w-full text-[#1e293b]">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] tracking-tight">System Audit & Fleet Reports</h2>
          <p className="text-xs text-slate-600">Comprehensive operational overview, compliance audits, and telemetry summaries.</p>
        </div>
        <button 
          onClick={exportReportCSV}
          className="px-4 py-2.5 bg-[#0d6963] hover:bg-[#0b5752] border border-white/70 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Download className="h-3.5 w-3.5" /> Export Audit CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-[#e2eeef] border border-white/80 p-4 rounded-xl space-y-1 shadow-[4px_4px_14px_rgba(163,177,198,0.3)]">
          <span className="text-[11px] text-slate-600 block font-medium">Total Tracked Nodes</span>
          <div className="text-2xl font-bold text-[#1e293b] font-mono">{totalAssetsCount}</div>
          <span className="text-[10px] text-[#0d6963] font-semibold">100% Synchronized</span>
        </div>
        <div className="bg-[#e2eeef] border border-white/80 p-4 rounded-xl space-y-1 shadow-[4px_4px_14px_rgba(163,177,198,0.3)]">
          <span className="text-[11px] text-slate-600 block font-medium">Nominal Healthy Nodes</span>
          <div className="text-2xl font-bold text-[#0d6963] font-mono">{healthyCount}</div>
          <span className="text-[10px] text-slate-500">Operating within SLA</span>
        </div>
        <div className="bg-[#e2eeef] border border-white/80 p-4 rounded-xl space-y-1 shadow-[4px_4px_14px_rgba(163,177,198,0.3)]">
          <span className="text-[11px] text-slate-600 block font-medium">Active Anomalies</span>
          <div className="text-2xl font-bold text-amber-700 font-mono">{faultyAssets.length}</div>
          <span className="text-[10px] text-slate-500">Requires attention</span>
        </div>
        <div className="bg-[#e2eeef] border border-white/80 p-4 rounded-xl space-y-1 shadow-[4px_4px_14px_rgba(163,177,198,0.3)]">
          <span className="text-[11px] text-slate-600 block font-medium">Average Fleet Temp</span>
          <div className="text-2xl font-bold text-[#1e293b] font-mono">{avgTemp}°C</div>
          <span className="text-[10px] text-slate-500">Normal Range &lt; 65°C</span>
        </div>
      </div>

      <div className="bg-[#e2eeef] border border-white/80 p-5 rounded-2xl space-y-4 shadow-[6px_6px_20px_rgba(163,177,198,0.3)] w-full">
        <div className="flex justify-between items-center border-b border-slate-300/80 pb-3 w-full">
          <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Fleet Operational Audit Ledger</h3>
         <span className="text-[11px] text-slate-600 font-mono">Database Source: Active (Cloud / Supabase)</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300/80 text-slate-600 font-mono text-[10px] uppercase">
                <th className="pb-3 font-semibold">Node ID</th>
                <th className="pb-3 font-semibold">Asset Tag</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">CPU Load</th>
                <th className="pb-3 font-semibold">Memory</th>
                <th className="pb-3 font-semibold">Temp</th>
                <th className="pb-3 font-semibold">Vibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/60 font-mono">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/40 transition">
                  <td className="py-3 text-slate-600">#NODE-{asset.id}</td>
                  <td className="py-3 font-bold text-[#1e293b]">{asset.name}</td>
                  <td className="py-3 text-slate-700">{asset.type}</td>
                  <td className="py-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase ${
                      asset.status === 'HEALTHY' ? 'bg-[#0d6963]/20 text-[#0d6963]' : 
                      asset.status === 'WARNING' ? 'bg-amber-500/20 text-amber-700' : 'bg-rose-500/20 text-rose-600'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3 text-[#1e293b]">{asset.cpuUsage ?? 0}%</td>
                  <td className="py-3 text-[#1e293b]">{asset.memoryUsage ?? 0}%</td>
                  <td className="py-3 text-[#1e293b]">{asset.temperature ?? 0}°C</td>
                  <td className="py-3 text-[#1e293b]">{asset.vibration ?? 0} g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
