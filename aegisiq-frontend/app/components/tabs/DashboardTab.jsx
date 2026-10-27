"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

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
    { name: "Nominal", value: healthyCount, color: "#0d6963" },
    { name: "Warning", value: warningCount, color: "#d97706" },
    { name: "Critical", value: criticalCount, color: "#e11d48" },
  ];

  const [telemetryTrend, setTelemetryTrend] = useState([
    { time: "21:00", val: 42 },
    { time: "21:10", val: 46 },
    { time: "21:20", val: 55 },
    { time: "21:30", val: 48 },
    { time: "21:40", val: 62 },
    { time: "21:50", val: 54 },
    { time: "22:00", val: 45 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTrend((prev) =>
        prev.map((item) => ({
          ...item,
          val: Math.max(20, Math.min(80, item.val + (Math.floor(Math.random() * 7) - 3))),
        }))
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 w-full text-[#1e293b]">
      <div className="w-full">
        <h1 className="text-base font-bold text-[#1e293b] tracking-tight">
          Industrial Telemetry & Operational Health
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Real-time sensor monitoring across 50+ asset parameters and AI decision engines.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 w-full">
        {[
          { title: "Fleet Nodes", val: totalAssetsCount.toString(), desc: "Registered Nodes" },
          { title: "System SLA", val: `${systemHealthPercentage}%`, desc: "Operating Bound" },
          { title: "Active Faults", val: faultyAssets.length.toString(), desc: faultyAssets.length > 0 ? "Requires Review" : "All Nominal", alert: faultyAssets.length > 0 },
          { title: "Avg Temperature", val: `${avgTemp}°C`, desc: "Threshold < 65°C" },
          { title: "Downtime Cut", val: "25%", desc: "AI Decision Twin" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-300 p-4 rounded-xl space-y-1.5 shadow-[4px_4px_12px_rgba(163,177,198,0.15)] hover:border-[#0d6963]/40 transition-all">
            <span className="text-xs text-slate-600 block font-medium">{kpi.title}</span>
            <div className={`text-xl font-bold font-mono tracking-tight ${kpi.alert ? 'text-amber-700' : 'text-[#1e293b]'}`}>{kpi.val}</div>
            <span className="text-[11px] text-slate-500 block pt-1 border-t border-slate-200">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Middle Section: Waveform & Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        <div className="lg:col-span-8 bg-white border border-slate-300 rounded-xl p-5 space-y-3 shadow-[4px_4px_12px_rgba(163,177,198,0.15)]">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 w-full">
            <div>
              <span className="text-xs font-bold text-[#1e293b]">Live Telemetry Ingestion (50+ Parameters)</span>
              <span className="text-[11px] text-slate-600 block mt-0.5">Aggregated Compute Load & Thermal Metrics</span>
            </div>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrend}>
                <defs>
                  <linearGradient id="seaBlueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d6963" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d6963" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "8px", fontSize: "11px", color: "#1e293b", boxShadow: "4px 4px 10px rgba(163,177,198,0.2)" }} />
                <Area type="monotone" dataKey="val" stroke="#0d6963" strokeWidth={2} fillOpacity={1} fill="url(#seaBlueGlow)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-300 rounded-xl p-5 flex flex-col justify-between shadow-[4px_4px_12px_rgba(163,177,198,0.15)]">
          <span className="text-xs font-bold text-[#1e293b]">Fleet Distribution</span>
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
              <span className="text-lg font-bold text-[#1e293b] font-mono">{totalAssetsCount}</span>
              <span className="text-[9px] text-slate-600 uppercase block font-mono">Nodes</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 w-full text-xs">
            {dynamicDistributionData.map((d, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 p-2 rounded-lg flex flex-col justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-700 text-[11px] font-medium">{d.name}</span>
                </div>
                <span className="text-[#1e293b] font-bold text-sm mt-1 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 w-full">
        {[
          { label: "Vibration Sensor", val: "0.03 g", status: "Harmonic Stable" },
          { label: "Hydraulic Pressure", val: "4.2 Bar", status: "Nominal Range" },
          { label: "Motor Current", val: "18.4 A", status: "Continuous Flow" },
          { label: "Turbine RPM", val: "2,840 RPM", status: "Continuous Speed" },
          { label: "Acoustic Decibel", val: "44.1 dB", status: "Standard Noise" },
          { label: "Failover Headroom", val: "94.2%", status: "Safe Redundancy" },
        ].map((gauge, idx) => (
          <div key={idx} className="bg-white border border-slate-300 p-3.5 rounded-xl space-y-1 shadow-[4px_4px_12px_rgba(163,177,198,0.15)] hover:border-[#0d6963]/40 transition-all">
            <span className="text-[11px] text-slate-600 font-medium block truncate">{gauge.label}</span>
            <div className="text-sm font-semibold text-[#1e293b] font-mono">{gauge.val}</div>
            <span className="text-[10px] text-slate-500 block">{gauge.status}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        <div className="bg-white border border-slate-300 rounded-xl p-5 space-y-3 shadow-[4px_4px_12px_rgba(163,177,198,0.15)] w-full">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 w-full">
            <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Priority Alerts</h3>
            <button onClick={() => setActiveTab("alerts")} className="text-[11px] text-[#0d6963] font-semibold hover:underline cursor-pointer">View All →</button>
          </div>

          {faultyAssets.length === 0 ? (
            <div className="text-xs text-slate-600 py-6 text-center w-full">No active alerts registered.</div>
          ) : (
            <div className="divide-y divide-slate-200 w-full">
              {faultyAssets.slice(0, 3).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs w-full">
                  <div>
                    <span className="font-medium text-[#1e293b] block">{item.name}</span>
                    <span className="text-[11px] text-slate-600">Node: {item.type} • Temperature: {item.temperature || 44}°C</span>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase ${
                    item.status === 'CRITICAL' ? 'text-rose-600' : 'text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-5 space-y-3 shadow-[4px_4px_12px_rgba(163,177,198,0.15)] w-full">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 w-full">
            <h3 className="text-xs font-bold text-[#1e293b] uppercase tracking-wider">Fleet Inventory</h3>
            <button onClick={() => setActiveTab("assets")} className="text-[11px] text-[#0d6963] font-semibold hover:underline cursor-pointer">Manage Fleet →</button>
          </div>

            {assets.length === 0 ? (
            <div className="text-xs text-slate-600 py-6 text-center w-full">No assets registered.</div>
          ) : (
            <div className="divide-y divide-slate-200 w-full">
              {assets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="py-2.5 flex items-center justify-between text-xs w-full">
                  <div>
                    <span className="font-medium text-[#1e293b] block">{asset.name}</span>
                    <span className="text-[11px] text-slate-600">Type: {asset.type}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-600">Load: <b className="text-[#1e293b] font-mono">{asset.cpuUsage || 0}%</b></span>
                    <span className={`text-[10px] font-semibold uppercase ${
                      asset.status === 'HEALTHY' ? 'text-[#0d6963]' : 'text-amber-700'
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
