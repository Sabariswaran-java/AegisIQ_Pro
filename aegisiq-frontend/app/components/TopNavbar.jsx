"use client";
import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Bell, X } from "lucide-react";

export default function TopNavbar({ searchQuery, setSearchQuery, syncData, isSyncing, assets }) {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [localReloading, setLocalReloading] = useState(false);

  const faultyAssets = assets ? assets.filter((a) => a.status === "WARNING" || a.status === "CRITICAL") : [];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(`${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`);
    };
    updateTime();
    const timerInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const handleRefreshClick = () => {
    setLocalReloading(true);
    if (syncData) syncData();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 h-14 flex items-center justify-between sticky top-0 z-50 w-full shrink-0 text-[#1e293b] shadow-xs">
      <div className="flex items-center space-x-2.5 bg-[#f0f5f6] border border-slate-200 px-3.5 py-1.5 rounded-lg w-80 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.15)] focus-within:border-[#0d6963] transition">
        <Search className="h-3.5 w-3.5 text-slate-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets, telemetry parameters..." 
          className="bg-transparent focus:outline-none w-full text-xs text-[#1e293b] placeholder:text-slate-400" 
        />
      </div>

      <div className="flex items-center space-x-4 text-xs shrink-0">
        <button 
          onClick={handleRefreshClick} 
          disabled={localReloading || isSyncing} 
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-[#f0f5f6] hover:bg-slate-100 text-slate-700 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none shadow-[2px_2px_6px_rgba(163,177,198,0.2)]"
        >
          <RefreshCw className={`h-3 w-3 text-slate-600 ${localReloading || isSyncing ? 'animate-spin' : ''}`} />
          <span>{localReloading ? "Reloading..." : "Refresh"}</span>
        </button>

        <span className="text-slate-600 text-xs font-mono">
          {currentDateTime || "Loading..."}
        </span>

        <div className="relative">
          <button 
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-1.5 text-slate-600 hover:text-[#1e293b] relative transition cursor-pointer focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            {faultyAssets.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                {faultyAssets.length}
              </span>
            )}
          </button>

          {showNotificationPopup && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-[6px_6px_20px_rgba(163,177,198,0.3)] p-3 z-50 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 text-xs font-semibold text-[#1e293b]">
                <span>Active Alerts ({faultyAssets.length})</span>
                <button onClick={() => setShowNotificationPopup(false)} className="text-slate-400 hover:text-[#1e293b] cursor-pointer"><X className="h-3 w-3" /></button>
              </div>
              {faultyAssets.length === 0 ? (
                <div className="text-xs text-[#0d6963] py-2 text-center font-medium">All assets nominal</div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {faultyAssets.map((item) => (
                    <div key={item.id} className="py-1.5 border-b border-slate-100 last:border-none flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[#1e293b] block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.type}</span>
                      </div>
                      <span className={`text-[9px] font-semibold uppercase ${
                        item.status === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="h-7 w-7 rounded-lg bg-[#0d6963] text-white font-bold flex items-center justify-center text-xs shadow-sm">
            S
          </div>
          <span className="text-xs font-medium text-[#1e293b]">Sabari</span>
        </div>
      </div>
    </header>
  );
}
