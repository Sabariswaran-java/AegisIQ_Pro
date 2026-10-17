import React from "react";
import Image from "next/image";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket } from "lucide-react";

const BrandLogo = () => (
  <div className="flex items-center justify-start px-1">
    <Image 
      src="/AegisIQ logo.png" 
      alt="AegisIQ Logo" 
      width={180} 
      height={50} 
      className="object-contain h-auto w-full max-w-[170px]"
      priority
    />
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 bg-[#0d1424] border-r border-[#1a233a] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none overflow-hidden">
      <div>
        {/* Fixed Top Left Logo Area - Exact Height h-14 to match TopNavbar */}
        <div className="h-14 px-3.5 border-b border-[#1a233a] bg-[#0b0f19] flex items-center">
          <BrandLogo />
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1 text-xs">
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
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
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
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

          <div className="pt-3 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
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
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
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
