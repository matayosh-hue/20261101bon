import React from "react";
import { Droplets, Flame, Sun, Wind, ChevronRight, Award, History, Clock } from "lucide-react";
import { Bonsai } from "../types";
import BonsaiVisual from "./BonsaiVisual";
import { SUNLIGHT_LABELS, WIND_LABELS } from "../data/presets";

interface BonsaiCardProps {
  bonsai: Bonsai;
  onTimeAdvance: () => void;
  onQuickWater: () => void;
  onQuickFertilize: () => void;
}

export default function BonsaiCard({ bonsai, onTimeAdvance, onQuickWater, onQuickFertilize }: BonsaiCardProps) {
  // Experience Progress Percent
  const expNeeded = bonsai.level * 100;
  const expPercent = Math.min((bonsai.experience / expNeeded) * 100, 100);

  // Health Status Badges based on water / fertilizer
  const getStatusBadge = () => {
    if (bonsai.water <= 15) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200 animate-pulse">枯死寸前</span>;
    }
    if (bonsai.water <= 35) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">水枯れ気味</span>;
    }
    if (bonsai.fertilizer <= 30) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">栄養不足</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">健康・良好</span>;
  };

  // Helper for last cared time
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "未実施";
    const date = new Date(timeStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div id={`bonsai-card-${bonsai.id}`} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-6">
      {/* Name and Level Ribbon */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bonsai.type}</span>
          <h2 className="text-xl font-black text-slate-800 leading-tight">{bonsai.name}</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100 text-emerald-800">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-extrabold">Lv.{bonsai.level}</span>
        </div>
      </div>

      {/* Main Bonsai visual renderer */}
      <BonsaiVisual
        type={bonsai.type}
        level={bonsai.level}
        water={bonsai.water}
        fertilizer={bonsai.fertilizer}
        status={bonsai.status}
      />

      {/* Status Info (Level up Exp & Health Badge) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">お世話状態</span>
          {getStatusBadge()}
        </div>

        {/* Experience Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>熟練度 (経験値)</span>
            <span>{bonsai.experience} / {expNeeded} EXP</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Core status indicators: Water & Fertilizer */}
      <div className="grid grid-cols-2 gap-4">
        {/* Water status card */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-500" /> 水分量
            </span>
            <span className="text-xs font-extrabold text-slate-800">{bonsai.water}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                bonsai.water <= 35 ? "bg-amber-500 animate-pulse" : "bg-sky-500"
              }`}
              style={{ width: `${bonsai.water}%` }}
            />
          </div>
        </div>

        {/* Fertilizer status card */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-indigo-500" /> 肥料
            </span>
            <span className="text-xs font-extrabold text-slate-800">{bonsai.fertilizer}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                bonsai.fertilizer <= 30 ? "bg-amber-500 animate-pulse" : "bg-indigo-500"
              }`}
              style={{ width: `${bonsai.fertilizer}%` }}
            />
          </div>
        </div>
      </div>

      {/* Environmental current placement */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-semibold">
        <div className="flex items-center gap-1">
          <Sun className="w-3.5 h-3.5 text-slate-400" />
          <span>配置: {SUNLIGHT_LABELS[bonsai.sunlight]?.label.split("（")[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-slate-400" />
          <span>風通し: {WIND_LABELS[bonsai.wind]?.label.split("（")[0]}</span>
        </div>
      </div>

      {/* History details */}
      <div className="space-y-1 text-[10px] font-semibold text-slate-400 border-t border-slate-100 pt-3">
        <div className="flex justify-between">
          <span>最後にお水をあげた時間:</span>
          <span>{formatTime(bonsai.lastWateredAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>最後に肥料をあげた時間:</span>
          <span>{formatTime(bonsai.lastFertilizedAt)}</span>
        </div>
      </div>

      {/* Advance simulation / quick care buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onTimeAdvance}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Clock className="w-4 h-4 text-emerald-400" /> 1日時間を進める (状態が変化)
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onQuickWater}
            className="py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            お水やり
          </button>
          <button
            onClick={onQuickFertilize}
            className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            肥料やり
          </button>
        </div>
      </div>
    </div>
  );
}
