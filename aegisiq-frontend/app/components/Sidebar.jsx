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
      className="object-contain h-[75px] w-[340px]"
      priority
    />
  </div>
);

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 bg-[#0d6963] border-r border-[#0a524d] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 select-none overflow-hidden text-white">
      <div>
        {/* Brand Header Block without any border line */}
        <div className="h-16 px-2 bg-[#0d6963] flex items-center justify-center">
          <BrandLogo />
        </div>

        <div className="px-3 py-2 space-y-1.5 text-xs">
          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-teal-200/90 uppercase tracking-wider font-mono">
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
                    ? "bg-white text-[#0d6963] font-semibold shadow-md border border-white" 
                    : "text-white hover:bg-[#0a524d] border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#0d6963]' : 'text-white'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-2 pb-1 px-3 text-[10px] font-semibold text-teal-200/90 uppercase tracking-wider font-mono">
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
                    ? "bg-white text-[#0d6963] font-semibold shadow-md border border-white" 
                    : "text-white hover:bg-[#0a524d] border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#0d6963]' : 'text-white'}`} />
                  <span>{nav.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Left User Profile Section replacing Cluster Active */}
      <div className="p-3.5 border-t border-[#0a524d] bg-[#0a524d]/40 flex items-center space-x-3 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-white text-[#0d6963] font-bold flex items-center justify-center text-xs shadow-sm shrink-0">
          S
        </div>
        <div className="flex flex-col truncate">
          <span className="text-xs font-semibold text-white truncate">Sabariswaran M</span>
          <span className="text-[10px] text-teal-200 font-mono">Full Stack Engineer</span>
        </div>
      </div>
    </aside>
  );
}
