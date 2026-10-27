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
    <div className="space-y-5 w-full text-[#1e293b]">
      <div className="flex justify-between items-center w-full border-b border-slate-300/85 pb-3">
        <div>
          <h2 className="text-base font-bold text-[#1e293b] tracking-tight flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#0d6963] animate-pulse" />
            Live Telemetry Ingestion Center
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Real-time sensor data streaming directly from registered database asset nodes.</p>
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
            <div key={asset.id} className="bg-[#e2eeef] border border-white/80 p-4 rounded-xl space-y-3.5 shadow-[4px_4px_14px_rgba(163,177,198,0.3),-4px_-4px_14px_rgba(255,255,255,0.7)] w-full">
              {/* Header - No duplicate top status */}
              <div className="flex justify-between items-center w-full">
                <div>
                  <span className="font-semibold text-sm text-[#1e293b] block">{asset.name}</span>
                  <span className="text-[11px] text-slate-600 font-mono mt-0.5 block">TYPE: {asset.type}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#d4e3e5] border border-white/80 px-2 py-1 rounded text-[10px] font-mono text-[#0d6963] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0d6963] animate-pulse"></span>
                  <span>STREAM ACTIVE</span>
                </div>
              </div>

              {/* Real Industrial Live Metrics Row */}
              <div className="grid grid-cols-3 gap-2 bg-[#d4e3e5] border border-white/80 p-2.5 rounded-lg text-xs font-mono shadow-[inset_2px_2px_5px_rgba(163,177,198,0.2)]">
                <div>
                  <span className="text-[10px] text-slate-600 block">TEMP</span>
                  <span className="text-[#1e293b] font-bold">{telemetry.temp}°C</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">VIB</span>
                  <span className="text-[#1e293b] font-bold">{telemetry.vib} g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">LOAD</span>
                  <span className="text-[#1e293b] font-bold">{telemetry.load}%</span>
                </div>
              </div>

              {/* Single Bottom Status Row */}
              <div className="pt-2.5 border-t border-slate-300/70 flex justify-between items-center text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Activity className="h-3.5 w-3.5 text-slate-600" /> Sensor Stream
                </span>
                <span>
                  Status:{" "}
                  <strong
                    className={`uppercase ${
                      asset.status === "HEALTHY"
                        ? "text-[#0d6963]"
                        : asset.status === "WARNING"
                        ? "text-amber-700"
                        : "text-rose-600"
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
