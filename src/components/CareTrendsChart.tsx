import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Droplets, Flame, Activity, TrendingUp, Info, CheckCircle2 } from "lucide-react";
import { Bonsai, DiaryEntry, CareHistoryPoint } from "../types";

interface CareTrendsChartProps {
  bonsai: Bonsai;
  diaries: DiaryEntry[];
}

export default function CareTrendsChart({ bonsai, diaries }: CareTrendsChartProps) {
  const [viewMode, setViewMode] = useState<"level" | "actions">("level");

  // Generate 7-day chronological sequence ending with today
  const last7DaysData = React.useMemo(() => {
    const points: Array<{
      dateStr: string;
      displayDate: string;
      water: number;
      fertilizer: number;
      watered: boolean;
      fertilized: boolean;
    }> = [];

    const now = new Date();
    // Build array for past 6 days + today (total 7 days)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const displayDate = `${month}/${day}`;

      // Check if there are diaries on this date for this bonsai
      const diaryOnDay = diaries.find(
        (entry) => entry.bonsaiId === bonsai.id && entry.date === dateStr
      );

      // Check if bonsai has explicit history point
      const historyPoint = bonsai.history?.find((h) => h.date === dateStr);

      let watered = diaryOnDay?.watered ?? false;
      let fertilized = diaryOnDay?.fertilized ?? false;
      if (historyPoint) {
        watered = watered || historyPoint.watered;
        fertilized = fertilized || historyPoint.fertilized;
      }

      // Estimate or retrieve water & fertilizer levels
      let water = bonsai.water;
      let fertilizer = bonsai.fertilizer;

      if (historyPoint) {
        water = historyPoint.water;
        fertilizer = historyPoint.fertilizer;
      } else if (i === 0) {
        // Today
        water = bonsai.water;
        fertilizer = bonsai.fertilizer;
      } else {
        // Simulated curve based on days ago & care diaries
        // Days before today had progressive dry down if not watered
        const decayPerDay = 15;
        const fertDecayPerDay = 10;
        const daysFromNow = i;
        
        // Base calculation from current state
        if (watered) {
          water = Math.min(100, 85 + Math.floor(Math.random() * 15));
        } else {
          // If watered today/recently, earlier days were drying down
          water = Math.max(20, Math.min(100, bonsai.water + (daysFromNow % 3) * decayPerDay - 10));
        }

        if (fertilized) {
          fertilizer = Math.min(100, 90 + Math.floor(Math.random() * 10));
        } else {
          fertilizer = Math.max(25, Math.min(100, bonsai.fertilizer + (daysFromNow % 4) * fertDecayPerDay - 5));
        }
      }

      // Check if lastWateredAt happened on this date
      if (bonsai.lastWateredAt) {
        const lastWaterDate = new Date(bonsai.lastWateredAt).toISOString().split("T")[0];
        if (lastWaterDate === dateStr) {
          watered = true;
        }
      }
      if (bonsai.lastFertilizedAt) {
        const lastFertDate = new Date(bonsai.lastFertilizedAt).toISOString().split("T")[0];
        if (lastFertDate === dateStr) {
          fertilized = true;
        }
      }

      points.push({
        dateStr,
        displayDate: i === 0 ? `今日 (${displayDate})` : displayDate,
        water: Math.min(100, Math.max(0, Math.round(water))),
        fertilizer: Math.min(100, Math.max(0, Math.round(fertilizer))),
        watered,
        fertilized,
      });
    }

    return points;
  }, [bonsai, diaries]);

  // Aggregate 7-day stats
  const totalWateredDays = last7DaysData.filter((d) => d.watered).length;
  const totalFertilizedDays = last7DaysData.filter((d) => d.fertilized).length;
  const avgWater = Math.round(
    last7DaysData.reduce((acc, curr) => acc + curr.water, 0) / last7DaysData.length
  );
  const avgFertilizer = Math.round(
    last7DaysData.reduce((acc, curr) => acc + curr.fertilizer, 0) / last7DaysData.length
  );

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/60 text-xs space-y-2 max-w-xs">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700/60 pb-1.5 font-bold">
            <span className="text-slate-300">{label}</span>
            <span className="text-[10px] text-slate-400">{dataItem.dateStr}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                水分量:
              </span>
              <span className="font-extrabold">{dataItem.water}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                肥料量:
              </span>
              <span className="font-extrabold">{dataItem.fertilizer}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
            {dataItem.watered ? (
              <span className="inline-flex items-center gap-0.5 text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60">
                💧 水やり実施
              </span>
            ) : (
              <span className="text-slate-500">水やりなし</span>
            )}
            {dataItem.fertilized ? (
              <span className="inline-flex items-center gap-0.5 text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                🌱 肥料補給済
              </span>
            ) : (
              <span className="text-slate-500">肥料なし</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="care-trends-chart-card"
      className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs space-y-6"
    >
      {/* Header with Title and Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              「{bonsai.name}」の過去7日間のお世話推移
            </h3>
            <p className="text-xs text-slate-500">
              水分量・肥料レベルと水やり実施履歴を可視化しています
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("level")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "level"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            推移グラフ (%)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("actions")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              viewMode === "actions"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            日別ケア達成表
          </button>
        </div>
      </div>

      {/* 7-Day Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Water care count */}
        <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-sky-700">
              <Droplets className="w-3.5 h-3.5 text-sky-500" /> 水やり回数
            </span>
            <span className="text-[10px] text-sky-600">過去7日</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-sky-900">{totalWateredDays}</span>
            <span className="text-xs text-sky-600 font-bold">/ 7日</span>
          </div>
        </div>

        {/* Fertilizer care count */}
        <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-indigo-700">
              <Flame className="w-3.5 h-3.5 text-indigo-500" /> 肥料補給回数
            </span>
            <span className="text-[10px] text-indigo-600">過去7日</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-indigo-900">{totalFertilizedDays}</span>
            <span className="text-xs text-indigo-600 font-bold">/ 7日</span>
          </div>
        </div>

        {/* Avg Water */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
          <div className="text-slate-500 text-[11px] font-semibold">
            7日間平均水分
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-800">{avgWater}%</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {avgWater >= 50 ? "潤い良好" : "やや乾燥"}
            </span>
          </div>
        </div>

        {/* Avg Fertilizer */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
          <div className="text-slate-500 text-[11px] font-semibold">
            7日間平均肥料
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-800">{avgFertilizer}%</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {avgFertilizer >= 40 ? "栄養充実" : "追肥推奨"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph or Table View */}
      {viewMode === "level" ? (
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={last7DaysData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Sky blue gradient for water */}
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Indigo gradient for fertilizer */}
                  <linearGradient id="fertGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                  formatter={(value) => {
                    return value === "water" ? "水分量 (%)" : "肥料量 (%)";
                  }}
                />

                {/* Reference line for warning levels */}
                <ReferenceLine
                  y={35}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: "水枯れ警戒線 (35%)",
                    fill: "#d97706",
                    fontSize: 10,
                    position: "insideBottomLeft",
                  }}
                />

                {/* Area for Water */}
                <Area
                  type="monotone"
                  dataKey="water"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#waterGradient)"
                  activeDot={{ r: 6, fill: "#0284c7", stroke: "#ffffff", strokeWidth: 2 }}
                />

                {/* Area for Fertilizer */}
                <Area
                  type="monotone"
                  dataKey="fertilizer"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#fertGradient)"
                  activeDot={{ r: 6, fill: "#6366f1", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sky-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                水分量（好適域: 40%〜90%）
              </span>
              <span className="flex items-center gap-1 text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                肥料量（好適域: 35%〜80%）
              </span>
            </div>
            <span className="text-amber-700 font-medium">
              ⚠️ 水分35%以下で乾燥警告、肥料30%以下で栄養不足
            </span>
          </div>
        </div>
      ) : (
        /* Action log view table */
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">日付</th>
                  <th className="py-2.5 px-3">水やり</th>
                  <th className="py-2.5 px-3">水分値</th>
                  <th className="py-2.5 px-3">肥料施肥</th>
                  <th className="py-2.5 px-3">肥料値</th>
                  <th className="py-2.5 px-3">状態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {last7DaysData.map((day) => {
                  const isHealthy = day.water > 35 && day.fertilizer > 30;
                  return (
                    <tr key={day.dateStr} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {day.displayDate}
                      </td>
                      <td className="py-2.5 px-3">
                        {day.watered ? (
                          <span className="inline-flex items-center gap-1 text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-sky-500" /> 実施
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        {day.water}%
                      </td>
                      <td className="py-2.5 px-3">
                        {day.fertilized ? (
                          <span className="inline-flex items-center gap-1 text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-indigo-500" /> 施肥
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        {day.fertilizer}%
                      </td>
                      <td className="py-2.5 px-3">
                        {isHealthy ? (
                          <span className="text-emerald-700 font-medium">健全</span>
                        ) : day.water <= 35 ? (
                          <span className="text-amber-600 font-medium">要水やり</span>
                        ) : (
                          <span className="text-indigo-600 font-medium">要肥料</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
