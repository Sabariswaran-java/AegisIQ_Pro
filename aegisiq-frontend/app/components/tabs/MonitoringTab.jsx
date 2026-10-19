import React from "react";
import { Activity, Radio, Cpu, HardDrive, Thermometer, Zap } from "lucide-react";

export default function MonitoringTab({ assets }) {
  return (
    <div className="space-y-5 w-full">
      <div className="flex justify-between items-center w-full border-b border-[#1E293B] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            Live Telemetry Ingestion Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time sensor data streaming directly from registered database asset nodes.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono bg-[#131A29] border border-[#22304A] px-3 py-1.5 rounded-lg text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Active Stream Hz: Dynamic</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {assets.map((asset, index) => {
          const frequencies = ["10 Hz", "25 Hz", "50 Hz", "75 Hz", "100 Hz"];
          const currentFreq = frequencies[(asset.id || index) % frequencies.length];
          
          return (
            <div key={asset.id} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-4 shadow-sm w-full relative overflow-hidden">
              <div className="flex justify-between items-start w-full">
                <div>
                  <span className="font-semibold text-sm text-slate-100 block">{asset.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">NODE-{asset.id} • {asset.type}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  asset.status === 'HEALTHY' ? 'text-emerald-400' : 
                  asset.status === 'WARNING' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {asset.status}
                </span>
              </div>

              {/* High Density Professional Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-[#131A29] p-3 rounded-lg border border-[#22304A] w-full font-mono">
                <div className="flex items-center justify-between pr-2 border-r border-[#22304A]">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Cpu className="h-3 w-3 text-slate-500"/> CPU</span> 
                  <b className="text-slate-100">{asset.cpuUsage ?? 0}%</b>
                </div>
                <div className="flex items-center justify-between pl-1">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><HardDrive className="h-3 w-3 text-slate-500"/> Mem</span> 
                  <b className="text-slate-100">{asset.memoryUsage ?? 0}%</b>
                </div>
                <div className="flex items-center justify-between pr-2 border-r border-[#22304A] pt-2 border-t border-[#22304A]">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Thermometer className="h-3 w-3 text-slate-500"/> Temp</span> 
                  <b className="text-slate-100">{asset.temperature ?? 0}°C</b>
                </div>
                <div className="flex items-center justify-between pl-1 pt-2 border-t border-[#22304A]">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]"><Zap className="h-3 w-3 text-slate-500"/> Vib</span> 
                  <b className="text-slate-100">{asset.vibration ?? 0} g</b>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono pt-1 border-t border-[#1E293B] w-full">
                <span>Polling: <strong className="text-emerald-400 font-medium">Active</strong></span>
                <span className="bg-[#141B2B] px-2 py-0.5 rounded border border-[#22304A] text-slate-300 font-semibold">{currentFreq}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
