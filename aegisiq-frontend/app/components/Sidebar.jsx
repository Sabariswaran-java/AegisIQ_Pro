import React from "react";
import Image from "next/image";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket } from "lucide-react";

const BrandLogo = () => (
  <div className="flex items-center justify-center w-full px-2 py-0.5">
    <Image 
      src="/AegisIQ logo.png" 
      alt="AegisIQ Logo" 
      width={600} 
      height={100} 
      className="object-contain h-[80px] w-[350px]"
      priority
    />
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 bg-[#0d6963] border-r border-[#0a524d] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none overflow-hidden text-white">
      <div>
        {/* Brand Header Block with Sidebar Background */}
        <div className="h-16 px-2 border-b border-[#0a524d] bg-[#0d6963] flex items-center justify-center">
          <BrandLogo />
        </div>

        <div className="p-3 space-y-1 text-xs">
          <div className="px-3 pt-3 pb-1 text-[10px] font-semibold text-teal-200/80 uppercase tracking-wider font-mono">
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
                    ? "bg-white text-[#0d6963] font-semibold shadow-md border border-white" 
                    : "text-teal-50 hover:bg-[#0a524d] hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#0d6963]' : 'text-teal-200'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 pb-1 px-3 text-[10px] font-semibold text-teal-200/80 uppercase tracking-wider font-mono">
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
                    ? "bg-white text-[#0d6963] font-semibold shadow-md border border-white" 
                    : "text-teal-50 hover:bg-[#0a524d] hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#0d6963]' : 'text-teal-200'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3.5 border-t border-[#0a524d] bg-[#0a524d]/50 text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-medium">Cluster Active</span>
        </div>
        <span className="text-[10px] text-teal-200 font-mono mt-0.5 block">Telemetry: Dynamic Hz</span>
      </div>
    </aside>
  );
}
