import React, { useState, useEffect } from "react";
import { Radio, Activity } from "lucide-react";

export default function MonitoringTab({ assets }) {
  // Simulating real-time telemetry sensor values for SCADA stream
  const [liveSensors, setLiveSensors] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      assets.forEach((asset) => {
        updated[asset.id] = {
          temp: ((Number(asset.temperature) || 40) + (Math.random() * 2 - 1)).toFixed(1),
          vib: Math.max(0, ((Number(asset.vibration) || 0.05) + (Math.random() * 0.02 - 0.01))).toFixed(2),
          load: Math.min(100, Math.max(0, Math.round((Number(asset.cpuUsage) || 15) + (Math.random() * 4 - 2))))
        };
      });
      setLiveSensors(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [assets]);

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
        {assets.map((asset) => {
          const telemetry = liveSensors[asset.id] || {
            temp: asset.temperature || 0,
            vib: asset.vibration || 0,
            load: asset.cpuUsage || 0
          };

          return (
            <div key={asset.id} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-3.5 shadow-sm w-full">
              {/* Header - No duplicate top status */}
              <div className="flex justify-between items-center w-full">
                <div>
                  <span className="font-semibold text-sm text-slate-100 block">{asset.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">TYPE: {asset.type}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#131A29] border border-[#22304A] px-2 py-1 rounded text-[10px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>STREAM ACTIVE</span>
                </div>
              </div>

              {/* Real Industrial Live Metrics Row */}
              <div className="grid grid-cols-3 gap-2 bg-[#131a2b] border border-[#1e293b] p-2.5 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">TEMP</span>
                  <span className="text-slate-100 font-bold">{telemetry.temp}°C</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">VIB</span>
                  <span className="text-slate-100 font-bold">{telemetry.vib} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">LOAD</span>
                  <span className="text-slate-100 font-bold">{telemetry.load}%</span>
                </div>
              </div>

              {/* Single Bottom Status Row */}
              <div className="pt-2.5 border-t border-[#1E293B] flex justify-between items-center text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Activity className="h-3.5 w-3.5 text-slate-400" /> Sensor Stream
                </span>
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
          );
        })}
      </div>
    </div>
  );
}
