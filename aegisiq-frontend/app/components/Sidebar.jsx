import React from "react";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket } from "lucide-react";

const BrandLogo = () => (
  <div className="flex items-center space-x-3 px-1 py-1">
    <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-[#1E293B] border border-[#334155] shadow-sm shrink-0">
      <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="48" cy="48" r="36" stroke="#38BDF8" strokeWidth="8" fill="none" />
        <line x1="68" y1="68" x2="88" y2="88" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" />
        <text x="47" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="32" fontWeight="900" fontFamily="sans-serif" letterSpacing="-1">AI</text>
      </svg>
    </div>

    <div className="flex flex-col justify-center">
      <div className="flex items-center leading-tight">
        <span className="text-[13px] font-black tracking-widest text-white">
          AEGIS<span className="text-[#38BDF8] ml-0.5">IQ</span>
        </span>
      </div>
      <span className="text-[7.5px] tracking-[0.2em] text-slate-400 font-mono font-bold uppercase mt-0.5 block">
        AUTONOMOUS RELIABILITY OS
      </span>
    </div>
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-56 bg-[#0B0F17] border-r border-[#1E293B] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none overflow-hidden">
      <div>
        {/* Brand Header */}
        <div className="p-3 border-b border-[#1E293B] bg-[#080C14]">
          <BrandLogo />
        </div>

        {/* Navigation List - Fits screen without scrolling */}
        <div className="p-2 space-y-0.5 text-xs">
          
          {/* SECTION 1: PLATFORM */}
          <div className="px-2.5 pt-2 pb-1 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider font-mono">
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer outline-none focus:outline-none transition-all ${
                  isActive 
                    ? "bg-[#162032] text-[#38BDF8] font-semibold border border-[#2563EB]/40 shadow-sm" 
                    : "text-slate-400 hover:bg-[#111726] hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
                  <span className="text-[12px]">{nav.label}</span>
                </div>
              </button>
            );
          })}

          {/* SECTION 2: AI INTELLIGENCE */}
          <div className="pt-3 pb-1 px-2.5 text-[9.5px] font-bold text-slate-500 uppercase tracking-wider font-mono">
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer outline-none focus:outline-none transition-all ${
                  isActive 
                    ? "bg-[#162032] text-[#38BDF8] font-semibold border border-[#2563EB]/40 shadow-sm" 
                    : "text-slate-400 hover:bg-[#111726] hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
                  <span className="text-[12px]">{nav.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Status Box */}
      <div className="p-3 border-t border-[#1E293B] bg-[#080C14] text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-300 font-medium text-[11px]">Cluster Active</span>
        </div>
        <span className="text-[9.5px] text-slate-500 font-mono mt-0.5 block">Telemetry: Dynamic Hz</span>
      </div>
    </aside>
  );
}
