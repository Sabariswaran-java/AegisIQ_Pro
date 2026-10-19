import React, { useState } from "react";
import { Plus, Edit3, Trash2, Server } from "lucide-react";
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
    <div className="space-y-5 w-full">
      <div className="flex justify-between items-center w-full border-b border-[#1E293B] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Enterprise Asset Inventory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Core registry & metadata management across industrial asset fleet.</p>
        </div>
        <button onClick={() => setShowAssetModal(true)} className="px-3.5 py-2 bg-[#1B2538] hover:bg-[#253450] border border-[#2E3F5E] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
          <Plus className="h-3.5 w-3.5" /> <span>Add Asset Node</span>
        </button>
      </div>

      {/* Industrial Data Table View */}
      <div className="bg-[#0E131F] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#131A29]/50 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Node Type</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs font-mono">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">No asset nodes registered in inventory.</td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#131A29]/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      <Server className="h-3.5 w-3.5 text-slate-400" />
                      {asset.name}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{asset.type}</td>
                    <td className="py-3 px-4">
                      <span className={`uppercase font-bold ${
                        asset.status === 'HEALTHY' ? 'text-emerald-400' : 
                        asset.status === 'WARNING' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button onClick={() => setEditingAsset(asset)} className="text-slate-400 hover:text-white p-1 transition cursor-pointer" title="Edit Node">
                        <Edit3 className="h-3.5 w-3.5 inline" />
                      </button>
                      <button onClick={() => handleDeleteAsset(asset.id)} className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer" title="Delete Node">
                        <Trash2 className="h-3.5 w-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
