import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ShieldCheck } from "lucide-react";

const telemetryTrend = [
  { time: "21:00", val: 42 },
  { time: "21:10", val: 46 },
  { time: "21:20", val: 55 },
  { time: "21:30", val: 48 },
  { time: "21:40", val: 62 },
  { time: "21:50", val: 54 },
  { time: "22:00", val: 45 },
];

export default function DashboardTab({ assets, setActiveTab }) {
  const totalAssetsCount = assets.length;
  const healthyAssets = assets.filter((a) => a.status === "HEALTHY");
  const warningAssets = assets.filter((a) => a.status === "WARNING");
  const criticalAssets = assets.filter((a) => a.status === "CRITICAL");
  const faultyAssets = [...criticalAssets, ...warningAssets];

  const healthyCount = healthyAssets.length;
  const warningCount = warningAssets.length;
  const criticalCount = criticalAssets.length;

  const avgTemp = totalAssetsCount > 0 
    ? (assets.reduce((acc, curr) => acc + (Number(curr.temperature) || 42), 0) / totalAssetsCount).toFixed(1)
    : "42.0";

  const systemHealthPercentage = totalAssetsCount > 0 
    ? ((healthyCount / totalAssetsCount) * 100).toFixed(1)
    : "100.0";

  const dynamicDistributionData = [
    { name: "Nominal", value: healthyCount, color: "#22c55e" },
    { name: "Warning", value: warningCount, color: "#eab308" },
    { name: "Critical", value: criticalCount, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="w-full">
        <h1 className="text-base font-bold text-white tracking-tight">
          Industrial Telemetry & Operational Health
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time sensor monitoring across 50+ asset parameters and AI decision engines.
        </p>
      </div>

      {/* 5 Matte Professional KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 w-full">
        {[
          { title: "Fleet Nodes", val: totalAssetsCount.toString(), desc: "Registered Nodes" },
          { title: "System SLA", val: `${systemHealthPercentage}%`, desc: "Operating Bound" },
          { title: "Active Faults", val: faultyAssets.length.toString(), desc: faultyAssets.length > 0 ? "Requires Review" : "All Nominal" },
          { title: "Avg Temperature", val: `${avgTemp}°C`, desc: "Threshold < 65°C" },
          { title: "Downtime Cut", val: "25%", desc: "AI Decision Twin" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-1.5 shadow-sm">
            <span className="text-xs text-slate-400 block font-medium">{kpi.title}</span>
            <div className="text-xl font-bold text-white font-mono tracking-tight">{kpi.val}</div>
            <span className="text-[11px] text-slate-500 block pt-1 border-t border-[#161F30]">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Middle Section: Waveform & Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        <div className="lg:col-span-8 bg-[#0E131F] border border-[#1E293B] rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-3 w-full">
            <div>
              <span className="text-xs font-bold text-white">Live Telemetry Ingestion (50+ Parameters)</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Aggregated Compute Load & Thermal Metrics</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium font-mono">Dynamic Streaming</span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrend}>
                <defs>
                  <linearGradient id="slateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#141B2B", borderColor: "#25324A", borderRadius: "8px", fontSize: "11px", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="val" stroke="#94A3B8" strokeWidth={2} fillOpacity={1} fill="url(#slateGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0E131F] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-white">Fleet Distribution</span>
          <div className="h-36 w-full relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dynamicDistributionData} innerRadius={46} outerRadius={62} paddingAngle={4} dataKey="value">
                  {dynamicDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-lg font-bold text-white font-mono">{totalAssetsCount}</span>
              <span className="text-[9px] text-slate-500 uppercase block font-mono">Nodes</span>
            </div>
          </div>
          <div className="space-y-1.5 text-xs pt-2 border-t border-[#1E293B] w-full">
            {dynamicDistributionData.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-slate-400 w-full">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span>{d.name}</span>
                </div>
                <span className="font-medium text-slate-200 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parameter Gauges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 w-full">
        {[
          { label: "Vibration Sensor", val: "0.03 g", status: "Harmonic Stable" },
          { label: "Hydraulic Pressure", val: "4.2 Bar", status: "Nominal Range" },
          { label: "Motor Current", val: "18.4 A", status: "Continuous Flow" },
          { label: "Turbine RPM", val: "2,840 RPM", status: "Continuous Speed" },
          { label: "Acoustic Decibel", val: "44.1 dB", status: "Standard Noise" },
          { label: "Failover Headroom", val: "94.2%", status: "Safe Redundancy" },
        ].map((gauge, idx) => (
          <div key={idx} className="bg-[#0E131F] border border-[#1E293B] p-3.5 rounded-xl space-y-1 shadow-sm">
            <span className="text-[11px] text-slate-400 font-medium block truncate">{gauge.label}</span>
            <div className="text-sm font-semibold text-white font-mono">{gauge.val}</div>
            <span className="text-[10px] text-slate-500 block">{gauge.status}</span>
          </div>
        ))}
      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-[#0E131F] border border-[#1E293B] rounded-xl p-5 space-y-3 shadow-sm w-full">
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-2.5 w-full">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Priority Alerts</h3>
            <button onClick={() => setActiveTab("alerts")} className="text-[11px] text-slate-400 hover:text-white hover:underline cursor-pointer">View All →</button>
          </div>

          {faultyAssets.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center w-full">No active alerts registered.</div>
          ) : (
            <div className="space-y-2 w-full">
              {faultyAssets.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-[#141B2B] border border-[#25324A] rounded-lg flex items-center justify-between text-xs w-full">
                  <div>
                    <span className="font-medium text-slate-200 block">{item.name}</span>
                    <span className="text-[11px] text-slate-400">Node: {item.type} • Temperature: {item.temperature || 44}°C</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                    item.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#0E131F] border border-[#1E293B] rounded-xl p-5 space-y-3 shadow-sm w-full">
          <div className="flex justify-between items-center border-b border-[#1E293B] pb-2.5 w-full">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fleet Inventory</h3>
            <button onClick={() => setActiveTab("assets")} className="text-[11px] text-slate-400 hover:text-white hover:underline cursor-pointer">Manage Fleet →</button>
          </div>

          {assets.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center w-full">No assets registered.</div>
          ) : (
            <div className="space-y-2 w-full">
              {assets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="p-3 bg-[#141B2B] border border-[#25324A] rounded-lg flex items-center justify-between text-xs w-full">
                  <div>
                    <span className="font-medium text-slate-200 block">{asset.name}</span>
                    <span className="text-[11px] text-slate-400">Type: {asset.type}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-400">Load: <b className="text-slate-200 font-mono">{asset.cpuUsage || 0}%</b></span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      asset.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}