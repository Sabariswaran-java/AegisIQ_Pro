import React, { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { createAsset, updateAsset, deleteAsset } from "../../services/api";

export default function AssetsTab({ assets, syncData }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const filteredAssets = assets.filter((asset) => {
    const query = searchQuery.toLowerCase();
    return (
      asset.name?.toLowerCase().includes(query) ||
      asset.type?.toLowerCase().includes(query) ||
      asset.status?.toLowerCase().includes(query)
    );
  });

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const assetName = formData.get("name") || formData.get("assetTag");

    const newAsset = {
      name: assetName ? String(assetName).trim() : "Unnamed-Node",
      type: formData.get("type") || "TURBINE_PUMP",
      status: formData.get("status") || "HEALTHY",
      cpuUsage: Number(formData.get("cpuUsage")) || 0,
      memoryUsage: Number(formData.get("memoryUsage")) || 0,
      temperature: Number(formData.get("temperature")) || 0,
      vibration: Number(formData.get("vibration")) || 0
    };

    try {
      await createAsset(newAsset);
      setShowAssetModal(false);
      syncData();
    } catch (error) {
      console.error("Failed to add asset:", error);
      alert("Error adding asset to database!");
    }
  };

  const handleUpdateAsset = async (e, id) => {
    e.preventDefault();
    if (!id) return;
    
    const formData = new FormData(e.target);
    const updatedData = {
      name: String(formData.get("name") || "").trim(),
      type: formData.get("type"),
      status: formData.get("status"),
      cpuUsage: Math.min(100, Math.max(0, Number(formData.get("cpuUsage")) || 0)),
      memoryUsage: Math.min(100, Math.max(0, Number(formData.get("memoryUsage")) || 0)),
      temperature: Math.min(200, Math.max(-50, Number(formData.get("temperature")) || 0)),
      vibration: Math.min(10, Math.max(0, Number(formData.get("vibration")) || 0))
    };

    try {
      await updateAsset(id, updatedData);
      setEditingAsset(null);
      syncData();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update asset node.");
    }
  };

  const handleDeleteAsset = async (id) => {
    if (confirm("Decommission this asset node?")) {
      try {
        await deleteAsset(id);
        syncData();
      } catch {
        alert("Operation failed.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white">Enterprise Asset Inventory</h2>
          <p className="text-xs text-slate-400">50+ parameter telemetry tracking across registered fleet.</p>
        </div>
        <button onClick={() => setShowAssetModal(true)} className="px-3.5 py-2 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> <span>Add Asset Node</span>
        </button>
      </div>

      {/* Assets Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-[#0E131F] border border-[#1E293B] p-4 rounded-xl space-y-3 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-sm text-slate-200 block">{asset.name}</span>
                <span className="text-xs text-slate-400">Type: {asset.type}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                  asset.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400' : 
                  asset.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {asset.status}
                </span>
                <button onClick={() => setEditingAsset(asset)} className="text-slate-400 hover:text-white p-1 cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDeleteAsset(asset.id)} className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#141B2B] p-2.5 rounded-lg border border-[#25324A]">
              <div><span className="text-slate-400">Load:</span> <b className="text-slate-200 font-mono">{asset.cpuUsage ?? 0}%</b></div>
              <div><span className="text-slate-400">Memory:</span> <b className="text-slate-200 font-mono">{asset.memoryUsage ?? 0}%</b></div>
              <div><span className="text-slate-400">Temp:</span> <b className="text-slate-200 font-mono">{asset.temperature ?? 0}°C</b></div>
              <div><span className="text-slate-400">Vibration:</span> <b className="text-slate-200 font-mono">{asset.vibration ?? 0} g</b></div>
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 REGISTER NEW ASSET MODAL */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white tracking-wider">REGISTER NEW ASSET</h3>
              <button onClick={() => setShowAssetModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">ASSET TAG</label>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="e.g. Turbine-Pump-02" 
                  required 
                  autoComplete="off"
                  className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">NODE TYPE</label>
                  <select name="type" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="TURBINE_PUMP" className="bg-[#131A29] text-white">TURBINE_PUMP</option>
                    <option value="STEAM_BOILER" className="bg-[#131A29] text-white">STEAM_BOILER</option>
                    <option value="COMPRESSOR" className="bg-[#131A29] text-white">COMPRESSOR</option>
                    <option value="SERVER" className="bg-[#131A29] text-white">SERVER</option>
                    <option value="DATABASE" className="bg-[#131A29] text-white">DATABASE</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">STATUS</label>
                  <select name="status" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="HEALTHY" className="bg-[#131A29] text-white">HEALTHY</option>
                    <option value="WARNING" className="bg-[#131A29] text-white">WARNING</option>
                    <option value="CRITICAL" className="bg-[#131A29] text-white">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">CPU LOAD (%) [0-100]</label>
                  <input name="cpuUsage" type="number" min="0" max="100" placeholder="e.g. 45" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">MEMORY (%) [0-100]</label>
                  <input name="memoryUsage" type="number" min="0" max="100" placeholder="e.g. 50" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">TEMP (°C) [-50 to 200]</label>
                  <input name="temperature" type="number" step="0.1" min="-50" max="200" placeholder="e.g. 44" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">VIBRATION (G) [0 to 10]</label>
                  <input name="vibration" type="number" step="0.01" min="0" max="10" placeholder="e.g. 0.03" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer transition">
                  SAVE ASSET NODE
                </button>
                <button type="button" onClick={() => setShowAssetModal(false)} className="px-6 py-3 bg-[#131A29] hover:bg-[#1A2336] border border-[#22304A] text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✏️ EDIT ASSET MODAL */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white tracking-wider">EDIT ASSET NODE</h3>
              <button onClick={() => setEditingAsset(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={(e) => handleUpdateAsset(e, editingAsset.id)} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">ASSET TAG</label>
                <input name="name" defaultValue={editingAsset?.name} type="text" required autoComplete="off" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">NODE TYPE</label>
                  <select name="type" defaultValue={editingAsset?.type} className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="TURBINE_PUMP" className="bg-[#131A29] text-white">TURBINE_PUMP</option>
                    <option value="STEAM_BOILER" className="bg-[#131A29] text-white">STEAM_BOILER</option>
                    <option value="COMPRESSOR" className="bg-[#131A29] text-white">COMPRESSOR</option>
                    <option value="SERVER" className="bg-[#131A29] text-white">SERVER</option>
                    <option value="DATABASE" className="bg-[#131A29] text-white">DATABASE</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">STATUS</label>
                  <select name="status" defaultValue={editingAsset?.status} className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="HEALTHY" className="bg-[#131A29] text-white">HEALTHY</option>
                    <option value="WARNING" className="bg-[#131A29] text-white">WARNING</option>
                    <option value="CRITICAL" className="bg-[#131A29] text-white">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">CPU LOAD (%) [0-100]</label>
                  <input name="cpuUsage" defaultValue={editingAsset?.cpuUsage} type="number" min="0" max="100" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">MEMORY (%) [0-100]</label>
                  <input name="memoryUsage" defaultValue={editingAsset?.memoryUsage} type="number" min="0" max="100" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">TEMP (°C) [-50 to 200]</label>
                  <input name="temperature" defaultValue={editingAsset?.temperature} type="number" step="0.1" min="-50" max="200" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">VIBRATION (G) [0 to 10]</label>
                  <input name="vibration" defaultValue={editingAsset?.vibration} type="number" step="0.01" min="0" max="10" className="w-full bg-[#131A29] border border-[#22304A] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer transition">
                  UPDATE ASSET NODE
                </button>
                <button type="button" onClick={() => setEditingAsset(null)} className="px-6 py-3 bg-[#131A29] hover:bg-[#1A2336] border border-[#22304A] text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}