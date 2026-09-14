import React from "react";

export default function MonitoringTab({ assets }) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Live Telemetry Ingestion Center</h2>
          <p className="text-xs text-slate-400">Real-time sensor data streaming directly from registered database asset nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
        {assets.map((asset, index) => {
          const frequencies = ["10 Hz", "25 Hz", "50 Hz", "75 Hz", "100 Hz"];
          const currentFreq = frequencies[(asset.id || index) % frequencies.length];
          
          return (
            <div key={asset.id} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-3 shadow-sm w-full">
              <div className="flex justify-between items-start w-full">
                <div>
                  <span className="font-semibold text-sm text-slate-200 block">{asset.name}</span>
                  <span className="text-xs text-slate-400 uppercase font-mono">ID: NODE-{asset.id} • Type: {asset.type}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  asset.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400' : 
                  asset.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {asset.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#141B2B] p-2.5 rounded-lg border border-[#25324A] w-full font-mono">
                <div><span className="text-slate-400">CPU Load:</span> <b className="text-slate-200">{asset.cpuUsage ?? 0}%</b></div>
                <div><span className="text-slate-400">Memory:</span> <b className="text-slate-200">{asset.memoryUsage ?? 0}%</b></div>
                <div><span className="text-slate-400">Temp:</span> <b className="text-slate-200">{asset.temperature ?? 0}°C</b></div>
                <div><span className="text-slate-400">Vibration:</span> <b className="text-slate-200">{asset.vibration ?? 0} g</b></div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-[#1E293B] w-full">
                <span>Polling Stream: Active</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> {currentFreq}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}