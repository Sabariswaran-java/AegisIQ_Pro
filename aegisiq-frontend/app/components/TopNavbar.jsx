import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Bell, X } from "lucide-react";

export default function TopNavbar({ searchQuery, setSearchQuery, syncData, isSyncing, assets }) {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const faultyAssets = assets.filter((a) => a.status === "WARNING" || a.status === "CRITICAL");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(`${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`);
    };
    updateTime();
    const timerInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <header className="border-b border-[#1E293B] bg-[#0E131F] px-6 h-14 flex items-center justify-between sticky top-0 z-50 shadow-md w-full shrink-0">
      <div className="flex items-center space-x-2.5 bg-[#141B2B] border border-[#25324A] px-3.5 py-1.5 rounded-lg w-80 focus-within:border-slate-500 transition">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets, telemetry parameters..." 
          className="bg-transparent focus:outline-none w-full text-xs text-slate-200 placeholder:text-slate-500" 
        />
      </div>

      <div className="flex items-center space-x-3 text-xs shrink-0">
        <button onClick={syncData} className="px-3 py-1.5 rounded-lg border border-[#25324A] bg-[#141B2B] hover:bg-[#1B2538] text-slate-300 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none">
          <RefreshCw className={`h-3 w-3 text-slate-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <div className="px-3 py-1.5 border border-[#25324A] bg-[#141B2B] rounded-lg text-slate-400 text-xs font-mono">
          {currentDateTime || "Loading..."}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotificationPopup(!showNotificationPopup)}
            className="p-2 rounded-lg border border-[#25324A] bg-[#141B2B] text-slate-400 hover:text-white relative transition cursor-pointer focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            {faultyAssets.length > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {faultyAssets.length}
              </span>
            )}
          </button>

          {showNotificationPopup && (
            <div className="absolute right-0 mt-2 w-72 bg-[#141B2B] border border-[#2E3F5E] rounded-xl shadow-2xl p-3 z-50 space-y-2">
              <div className="flex justify-between items-center border-b border-[#25324A] pb-1.5 text-xs font-semibold text-slate-200">
                <span>Active Alerts ({faultyAssets.length})</span>
                <button onClick={() => setShowNotificationPopup(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="h-3 w-3" /></button>
              </div>
              {faultyAssets.length === 0 ? (
                <div className="text-xs text-emerald-400 py-2 text-center">All assets nominal</div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                  {faultyAssets.map((item) => (
                    <div key={item.id} className="p-2 bg-[#0E131F] rounded-lg border border-[#25324A] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-slate-200 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.type}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                        item.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
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

        <div className="flex items-center space-x-2 pl-2 border-l border-[#25324A]">
          <div className="h-7 w-7 rounded-lg bg-[#1B2538] border border-[#2E3F5E] text-slate-200 font-semibold flex items-center justify-center text-xs">
            S
          </div>
          <span className="text-xs font-medium text-slate-200">Sabari</span>
        </div>
      </div>
    </header>
  );
}
