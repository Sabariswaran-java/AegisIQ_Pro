import React from "react";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket } from "lucide-react";

const BrandLogo = () => (
  <div className="flex items-center space-x-3 px-1 py-1.5">
    <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-[#0ea5e9] border border-[#38bdf8]/30 shadow-lg shadow-[#0ea5e9]/25 shrink-0">
      <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="48" cy="48" r="36" stroke="#FFFFFF" strokeWidth="8" fill="none" />
        <line x1="68" y1="68" x2="88" y2="88" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        <text x="47" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">AI</text>
      </svg>
    </div>

    <div className="flex flex-col justify-center">
      <div className="flex items-center leading-tight">
        <span className="text-[14px] font-black tracking-widest text-white">
          AEGIS<span className="text-[#38bdf8] ml-0.5">IQ</span>
        </span>
      </div>
      <span className="text-[8px] tracking-[0.2em] text-slate-400 font-mono font-bold uppercase mt-1 block">
        AUTONOMOUS RELIABILITY OS
      </span>
    </div>
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 bg-[#0d1424] border-r border-[#1a233a] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none">
      <div>
        <div className="p-3.5 border-b border-[#1a233a] bg-[#0b0f19]">
          <BrandLogo />
        </div>

        <div className="p-3 space-y-1 text-xs overflow-y-auto max-h-[calc(100vh-140px)]">
          <div className="px-3 pt-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Platform
          </div>
          {[
            { id: "dashboard", label: "Overview", icon: LayoutDashboard },
            { id: "assets", label: "Asset Fleet", icon: Database },
            { id: "monitoring", label: "Live Telemetry", icon: Activity },
            { id: "alerts", label: "Incidents & Alerts", icon: Bell },
            { id: "reports", label: "Reports", icon: FileText },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                  isActive 
                    ? "bg-[#0ea5e9] text-white font-semibold shadow-lg shadow-[#0ea5e9]/25 border border-[#38bdf8]/30" 
                    : "text-slate-400 hover:bg-[#131a2b] hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-5 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            AI Intelligence
          </div>
          {[
            { id: "graph", label: "Decision Graph", icon: GitFork },
            { id: "twin", label: "Decision Twin", icon: Cpu },
            { id: "scenario", label: "What-If Simulation", icon: Sliders },
            { id: "explainable", label: "Explainable AI", icon: HelpCircle },
            { id: "memory", label: "Incident Memory", icon: History },
            { id: "deploy", label: "Deployment Optimizer", icon: Rocket },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                  isActive 
                    ? "bg-[#0ea5e9] text-white font-semibold shadow-lg shadow-[#0ea5e9]/25 border border-[#38bdf8]/30" 
                    : "text-slate-400 hover:bg-[#131a2b] hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 border-t border-[#1a233a] bg-[#0b0f19] text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-300 font-medium">Cluster Active</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Telemetry: Dynamic Hz</span>
      </div>
    </aside>
  );
}
