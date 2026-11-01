import React from "react";
import { BookOpen, Calendar, Sun, Wind, Droplets, Flame, MessageSquare, Quote } from "lucide-react";
import { DiaryEntry } from "../types";
import { SUNLIGHT_LABELS, WIND_LABELS } from "../data/presets";

interface DiaryListProps {
  diaries: DiaryEntry[];
}

export default function DiaryList({ diaries }: DiaryListProps) {
  if (diaries.length === 0) {
    return (
      <div id="empty-diary-list" className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-500">
        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-medium">まだお世話日記がありません。</p>
        <p className="text-xs text-slate-400 mt-1">今日の状態やお世話の内容を記録して、最初の日記を書きましょう。</p>
      </div>
    );
  }

  // Sort diaries by newest first
  const sortedDiaries = [...diaries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div id="diary-list" className="space-y-6">
      {sortedDiaries.map((entry) => {
        const sunInfo = SUNLIGHT_LABELS[entry.sunlight];
        const windInfo = WIND_LABELS[entry.wind];

        return (
          <div
            key={entry.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-4 hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
          >
            {/* Upper Badge & Date info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{entry.date}</span>
              </div>
              
              {/* Care markers */}
              <div className="flex items-center gap-1.5">
                {entry.watered && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold">
                    <Droplets className="w-3 h-3" /> 水やり済
                  </span>
                )}
                {entry.fertilized && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
                    <Flame className="w-3 h-3" /> 肥料済
                  </span>
                )}
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="text-base font-bold text-slate-800">{entry.title}</h4>
              <p className="text-sm text-slate-600 mt-1.5 whitespace-pre-wrap leading-relaxed">
                {entry.content || <span className="text-slate-400 italic">本文の記述はありません。お世話と環境の記録を行いました。</span>}
              </p>
            </div>

            {/* Environmental badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
              <span className={`px-2 py-1 rounded-lg border ${sunInfo?.color || ""}`}>
                ☀️ {sunInfo?.label}
              </span>
              <span className={`px-2 py-1 rounded-lg border ${windInfo?.color || ""}`}>
                💨 {windInfo?.label}
              </span>
            </div>

            {/* AI Advisor Bubble (盆栽マスターからの金言) */}
            {entry.aiComment && (
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 mt-4 relative">
                <div className="absolute top-2 right-4 text-emerald-100 pointer-events-none">
                  <Quote className="w-10 h-10 transform rotate-180" />
                </div>
                <div className="flex items-start gap-3">
                  {/* Master avatar (Old wise master illustration) */}
                  <div className="w-10 h-10 rounded-full bg-emerald-600/90 flex items-center justify-center shrink-0 border border-emerald-500 shadow-sm text-lg select-none">
                    👴
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">AI盆栽マスター</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs text-emerald-900 leading-relaxed font-medium italic">
                      {entry.aiComment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
