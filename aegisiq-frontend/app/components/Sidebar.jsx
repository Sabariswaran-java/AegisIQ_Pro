import React from "react";
import Image from "next/image";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket } from "lucide-react";

const BrandLogo = () => (
  <div className="flex items-center justify-start w-full px-1">
    <Image 
      src="/AegisIQ logo.png" 
      alt="AegisIQ Logo" 
      width={600} 
      height={100} 
      className="object-contain h-140 w-[180px] object-contain"
      priority
    />
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 bg-[#d4e3e5] border-r border-slate-300/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none overflow-hidden text-[#1e293b]">
      <div>
        {/* DevTools measurement-ku match agura Brand Header Block */}
        <div className="h-14 px-3 border-b border-slate-300/80 bg-[#d4e3e5] flex items-center justify-start">
          <BrandLogo />
        </div>

        <div className="p-3 space-y-1 text-xs">
          <div className="px-3 pt-3 pb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
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
                    ? "bg-[#0d6963] text-white font-semibold shadow-md shadow-[#0d6963]/30 border border-white/60" 
                    : "text-slate-700 hover:bg-[#e2eeef] hover:text-[#1e293b] border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 pb-1 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
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
                    ? "bg-[#0d6963] text-white font-semibold shadow-md shadow-[#0d6963]/30 border border-white/60" 
                    : "text-slate-700 hover:bg-[#e2eeef] hover:text-[#1e293b] border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 border-t border-slate-300/80 bg-[#e2eeef] text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-[#0d6963] animate-pulse"></span>
          <span className="text-[#1e293b] font-medium">Cluster Active</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono mt-0.5 block">Telemetry: Dynamic Hz</span>
      </div>
    </aside>
  );
}
