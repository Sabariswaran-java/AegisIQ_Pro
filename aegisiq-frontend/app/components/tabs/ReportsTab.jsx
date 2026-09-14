import React from "react";
import { Download } from "lucide-react";

export default function ReportsTab({ assets ,syncData}) {
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
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">System Audit & Fleet Reports</h2>
          <p className="text-xs text-slate-400">Comprehensive operational overview, compliance audits, and telemetry summaries.</p>
        </div>
        <button 
          onClick={exportReportCSV}
          className="px-4 py-2.5 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Download className="h-3.5 w-3.5" /> Export Audit CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Total Tracked Nodes</span>
          <div className="text-2xl font-bold text-white font-mono">{totalAssetsCount}</div>
          <span className="text-[10px] text-emerald-400">100% Synchronized</span>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Nominal Healthy Nodes</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{healthyCount}</div>
          <span className="text-[10px] text-slate-500">Operating within SLA</span>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Active Anomalies</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{faultyAssets.length}</div>
          <span className="text-[10px] text-slate-500">Requires attention</span>
        </div>
        <div className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Average Fleet Temp</span>
          <div className="text-2xl font-bold text-white font-mono">{avgTemp}°C</div>
          <span className="text-[10px] text-slate-500">Normal Range &lt; 65°C</span>
        </div>
      </div>

      <div className="bg-[#0E131F] border border-[#1E293B] p-5 rounded-2xl space-y-4 shadow-md w-full">
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 w-full">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fleet Operational Audit Ledger</h3>
          <span className="text-[11px] text-slate-400 font-mono">Database Source: Active (Port 8075)</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 font-mono text-[10px] uppercase">
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
            <tbody className="divide-y divide-[#161F30] font-mono">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#141B2B]/50 transition">
                  <td className="py-3 text-slate-400">#NODE-{asset.id}</td>
                  <td className="py-3 font-bold text-white">{asset.name}</td>
                  <td className="py-3 text-slate-300">{asset.type}</td>
                  <td className="py-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase ${
                      asset.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400' : 
                      asset.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-200">{asset.cpuUsage ?? 0}%</td>
                  <td className="py-3 text-slate-200">{asset.memoryUsage ?? 0}%</td>
                  <td className="py-3 text-slate-200">{asset.temperature ?? 0}°C</td>
                  <td className="py-3 text-slate-200">{asset.vibration ?? 0} g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}