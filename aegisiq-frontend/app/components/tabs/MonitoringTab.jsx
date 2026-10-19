import React from "react";
import { Radio } from "lucide-react";

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-4 shadow-sm w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <span className="font-semibold text-sm text-slate-100 block">{asset.name}</span>
                <span className="text-xs text-slate-400 font-mono mt-0.5 block">TYPE: {asset.type}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                asset.status === 'HEALTHY' ? 'text-emerald-400' : 
                asset.status === 'WARNING' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {asset.status}
              </span>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Polling: <strong className="text-emerald-400">Active</strong></span>
              <span>
                Status:{" "}
                <strong
                  className={`uppercase ${
                    asset.status === "HEALTHY"
                      ? "text-emerald-400"
                      : asset.status === "WARNING"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {asset.status}
                </strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
