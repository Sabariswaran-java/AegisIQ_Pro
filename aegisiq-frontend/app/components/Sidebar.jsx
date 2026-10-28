"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LayoutDashboard, Database, Activity, Bell, FileText, GitFork, Cpu, Sliders, HelpCircle, History, Rocket, Settings, User, Shield, X } from "lucide-react";

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
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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

      {/* Bottom Left Clean SVG User Profile & Interactive Settings Section */}
      <div className="p-3.5 border-t border-[#0a524d] bg-[#0a524d]/40 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 truncate">
          <div className="text-white flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-teal-100" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white truncate">Sabariswaran M</span>
          </div>
        </div>
        <button 
          onClick={() => setShowSettingsModal(true)} 
          className="p-1.5 hover:bg-white/10 rounded-lg text-teal-100 hover:text-white transition cursor-pointer"
          title="Open Settings & Account"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Professional Settings & User Details Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-[#1e293b]">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold tracking-wider text-[#0d6963] flex items-center gap-2">
                <Settings className="h-4 w-4" /> USER SETTINGS & PREFERENCES
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#0d6963] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    SM
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#1e293b] block">Sabariswaran M</span>
                    <span className="text-slate-500 font-mono text-[11px]">sabariswaran@aegisiq.enterprise</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                  <div>Role: <b className="text-[#1e293b]">Full Stack Lead</b></div>
                  <div>Node Cluster: <b className="text-[#0d6963]">Active (US-East)</b></div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider block">System Configurations</span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                    <span className="font-medium text-slate-700">Real-Time Telemetry Streaming</span>
                    <input type="checkbox" defaultChecked className="accent-[#0d6963] h-4 w-4 cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                    <span className="font-medium text-slate-700">AI Predictive Maintenance Alerts</span>
                    <input type="checkbox" defaultChecked className="accent-[#0d6963] h-4 w-4 cursor-pointer" />
                  </label>
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                    <span className="font-medium text-slate-700">High Contrast Glassmorphism UI</span>
                    <input type="checkbox" className="accent-[#0d6963] h-4 w-4 cursor-pointer" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider block">Security & Access</span>
                <div className="flex gap-2">
                  <button onClick={() => alert("Enterprise Token Rotated Successfully!")} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <Shield className="h-3.5 w-3.5 text-[#0d6963]" /> Rotate Auth Token
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400">AegisIQ Core v2.4.0</span>
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 bg-[#0d6963] hover:bg-[#0b5752] text-white font-bold rounded-xl transition cursor-pointer shadow-md">
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
