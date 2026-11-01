import React, { useState } from "react";
import { X, Plus, Info } from "lucide-react";
import { BONSAI_PRESETS } from "../data/presets";
import { Bonsai } from "../types";

interface AddBonsaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newBonsai: Omit<Bonsai, "id" | "createdAt" | "lastWateredAt" | "lastFertilizedAt">) => void;
}

export default function AddBonsaiModal({ isOpen, onClose, onAdd }: AddBonsaiModalProps) {
  const [name, setName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(BONSAI_PRESETS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      type: selectedPreset.japaneseName,
      level: 1,
      experience: 0,
      water: 80, // 初期水分
      fertilizer: 60, // 初期肥料
      sunlight: selectedPreset.preferredSunlight,
      wind: selectedPreset.preferredWind,
      status: "healthy"
    });
    
    setName("");
    onClose();
  };

  return (
    <div id="add-bonsai-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-800">新しい盆栽を迎える</h3>
            <p className="text-sm text-slate-500">育てたいお好みの品種を選び、名づけをしてあげましょう。</p>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Name input */}
          <div className="space-y-2">
            <label id="bonsai-name-label" className="block text-sm font-semibold text-slate-700">
              盆栽の名前 <span className="text-red-500">*</span>
            </label>
            <input
              id="bonsai-name-input"
              type="text"
              required
              placeholder="例: 松五郎, 小春, 翠 (みどり)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 placeholder:text-slate-400 transition-all text-base"
              maxLength={20}
            />
          </div>

          {/* Preset selection cards */}
          <div className="space-y-3">
            <label id="bonsai-type-label" className="block text-sm font-semibold text-slate-700">
              品種を選択する
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BONSAI_PRESETS.map((preset) => {
                const isSelected = selectedPreset.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-base font-bold ${isSelected ? "text-emerald-800" : "text-slate-800"}`}>
                        {preset.japaneseName}
                      </span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {preset.description}
                    </p>
                    <div className="flex gap-2 mt-4 text-[11px] font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                        ☀️ {preset.preferredSunlight === "sunny" ? "日向好む" : "半日陰好む"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                        💨 {preset.preferredWind === "good" ? "風通し良好" : "通常風通し"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Preset Details Info card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 text-xs text-slate-600 leading-relaxed">
            <Info className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-slate-700">【お世話のアドバイス】</p>
              <p className="mt-1">
                {selectedPreset.japaneseName}は、お世話（水やり・肥料）を怠ると1日あたり
                <span className="text-amber-600 font-semibold">水分が約{selectedPreset.waterLossRate}%</span>、
                <span className="text-emerald-600 font-semibold">肥料が約{selectedPreset.fertilizerLossRate}%</span>
                ずつ減少します。水分や栄養が枯渇しないよう、定期的に様子を見てケアを施してください。
              </p>
            </div>
          </div>

          {/* Footer inside form */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              id="cancel-add-btn"
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-200"
            >
              キャンセル
            </button>
            <button
              id="confirm-add-btn"
              type="submit"
              className="flex-1 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> 盆栽を迎える
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
