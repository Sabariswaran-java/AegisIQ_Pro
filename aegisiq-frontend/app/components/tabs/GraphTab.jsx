                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">TYPE: {asset.type}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    asset.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    asset.status === 'WARNING' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 font-mono pt-2 border-t border-slate-200/60">
                  <div className="flex justify-between"><span>CPU Load:</span> <b className="text-slate-900">{asset.cpuUsage ?? 0}%</b></div>
                  <div className="flex justify-between"><span>Temperature:</span> <b className="text-slate-900">{asset.temperature ?? 0}°C</b></div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between border-t border-slate-200/40 mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isTarget || isImpacted ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                    <span>{isTarget ? "Primary Focus Node" : isImpacted ? "Cascading Failure Path" : "Connected Gateway"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
