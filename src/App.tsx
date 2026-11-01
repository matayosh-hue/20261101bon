import React, { useState, useEffect } from "react";
import { Sprout, Plus, BookOpen, Clock, AlertCircle, RefreshCw, Star, Info, HelpCircle } from "lucide-react";
import { Bonsai, DiaryEntry } from "./types";
import { BONSAI_PRESETS } from "./data/presets";
import BonsaiCard from "./components/BonsaiCard";
import DiaryForm from "./components/DiaryForm";
import DiaryList from "./components/DiaryList";
import AddBonsaiModal from "./components/AddBonsaiModal";
import NotificationToast from "./components/NotificationToast";
import CareTrendsChart from "./components/CareTrendsChart";

// Helper to get past date string (YYYY-MM-DD)
const getPastDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

// Initial seed data to give user a great starting experience
const INITIAL_BONSAIS: Bonsai[] = [
  {
    id: "bonsai-default-1",
    name: "松吉 (Matsukichi)",
    type: "黒松 (Black Pine)",
    level: 1,
    experience: 30,
    water: 75,
    fertilizer: 50,
    sunlight: "sunny",
    wind: "good",
    status: "healthy",
    createdAt: new Date().toISOString(),
    lastWateredAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    lastFertilizedAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    history: [
      { date: getPastDateStr(6), water: 45, fertilizer: 70, watered: true, fertilized: false },
      { date: getPastDateStr(5), water: 85, fertilizer: 65, watered: false, fertilized: false },
      { date: getPastDateStr(4), water: 70, fertilizer: 60, watered: false, fertilized: false },
      { date: getPastDateStr(3), water: 55, fertilizer: 85, watered: false, fertilized: true },
      { date: getPastDateStr(2), water: 40, fertilizer: 80, watered: true, fertilized: false },
      { date: getPastDateStr(1), water: 80, fertilizer: 70, watered: false, fertilized: false },
      { date: getPastDateStr(0), water: 75, fertilizer: 50, watered: true, fertilized: false },
    ]
  },
  {
    id: "bonsai-default-2",
    name: "小春 (Koharu)",
    type: "旭山桜 (Cherry Blossom)",
    level: 2,
    experience: 80,
    water: 40,
    fertilizer: 35,
    sunlight: "half-shade",
    wind: "normal",
    status: "healthy",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastWateredAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    lastFertilizedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    history: [
      { date: getPastDateStr(6), water: 80, fertilizer: 75, watered: true, fertilized: true },
      { date: getPastDateStr(5), water: 60, fertilizer: 65, watered: false, fertilized: false },
      { date: getPastDateStr(4), water: 45, fertilizer: 55, watered: true, fertilized: false },
      { date: getPastDateStr(3), water: 85, fertilizer: 50, watered: false, fertilized: false },
      { date: getPastDateStr(2), water: 65, fertilizer: 45, watered: false, fertilized: false },
      { date: getPastDateStr(1), water: 50, fertilizer: 40, watered: false, fertilized: false },
      { date: getPastDateStr(0), water: 40, fertilizer: 35, watered: false, fertilized: false },
    ]
  }
];

const INITIAL_DIARIES: DiaryEntry[] = [
  {
    id: "diary-default-1",
    bonsaiId: "bonsai-default-1",
    date: getPastDateStr(0),
    title: "我が家へようこそ！",
    content: "今日からこの黒松を育て始めます。名前は松吉にしました。鉢の緑苔もきれいで、これからどんな風に枝がのびるかとても楽しみです。",
    sunlight: "sunny",
    wind: "good",
    watered: true,
    fertilized: false,
    aiComment: "おお、素晴らしい黒松を迎え入れたのう！黒松はとにかく日当たりとそよ風を好む。今日のように日向で、風通しのよい場所に置いてやれば、力強く成長するぞ。これから毎日、愛情込めて見守ってやることじゃ。",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "diary-default-2",
    bonsaiId: "bonsai-default-1",
    date: getPastDateStr(2),
    title: "朝のたっぷり水やり",
    content: "鉢底から水が流れ出るまでたっぷりと灌水しました。風通しの良い棚の上に移動させました。",
    sunlight: "sunny",
    wind: "good",
    watered: true,
    fertilized: false,
    aiComment: "鉢底から抜けるほどの水やりは、土中の古い空気を押し出して新しい酸素を取り込む最高の手法じゃ！良い手並みじゃのう。",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export default function App() {
  const [bonsais, setBonsais] = useState<Bonsai[]>([]);
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [selectedBonsaiId, setSelectedBonsaiId] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState<{ show: boolean; bonsaiName: string; level: number } | null>(null);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const savedBonsais = localStorage.getItem("bonsai_care_list");
    const savedDiaries = localStorage.getItem("bonsai_care_diaries");

    if (savedBonsais) {
      const parsed = JSON.parse(savedBonsais) as Bonsai[];
      setBonsais(parsed);
      if (parsed.length > 0) {
        setSelectedBonsaiId(parsed[0].id);
      }
    } else {
      setBonsais(INITIAL_BONSAIS);
      setSelectedBonsaiId(INITIAL_BONSAIS[0].id);
      localStorage.setItem("bonsai_care_list", JSON.stringify(INITIAL_BONSAIS));
    }

    if (savedDiaries) {
      setDiaries(JSON.parse(savedDiaries));
    } else {
      setDiaries(INITIAL_DIARIES);
      localStorage.setItem("bonsai_care_diaries", JSON.stringify(INITIAL_DIARIES));
    }
  }, []);

  // Save bonsais change helper
  const saveBonsais = (updatedBonsais: Bonsai[]) => {
    setBonsais(updatedBonsais);
    localStorage.setItem("bonsai_care_list", JSON.stringify(updatedBonsais));
  };

  // Save diaries change helper
  const saveDiaries = (updatedDiaries: DiaryEntry[]) => {
    setDiaries(updatedDiaries);
    localStorage.setItem("bonsai_care_diaries", JSON.stringify(updatedDiaries));
  };

  const selectedBonsai = bonsais.find((b) => b.id === selectedBonsaiId);

  // Experience and Level Up checker logic
  const addExperienceAndCheckLevelUp = (bonsai: Bonsai, amount: number): Bonsai => {
    const updated = { ...bonsai };
    updated.experience += amount;
    const expNeeded = updated.level * 100;

    if (updated.experience >= expNeeded) {
      updated.experience = updated.experience - expNeeded;
      updated.level = Math.min(updated.level + 1, 5); // Max level 5
      setShowLevelUpAlert({ show: true, bonsaiName: updated.name, level: updated.level });
    }
    return updated;
  };

  // 1. Add Bonsai
  const handleAddBonsai = (newBonsaiData: Omit<Bonsai, "id" | "createdAt" | "lastWateredAt" | "lastFertilizedAt">) => {
    const id = `bonsai-${Date.now()}`;
    const initialHistory = [
      { date: getPastDateStr(6), water: 70, fertilizer: 60, watered: true, fertilized: false },
      { date: getPastDateStr(5), water: 75, fertilizer: 55, watered: false, fertilized: false },
      { date: getPastDateStr(4), water: 65, fertilizer: 70, watered: false, fertilized: true },
      { date: getPastDateStr(3), water: 55, fertilizer: 65, watered: true, fertilized: false },
      { date: getPastDateStr(2), water: 80, fertilizer: 60, watered: false, fertilized: false },
      { date: getPastDateStr(1), water: 70, fertilizer: 55, watered: false, fertilized: false },
      { date: getPastDateStr(0), water: newBonsaiData.water, fertilizer: newBonsaiData.fertilizer, watered: true, fertilized: false },
    ];
    const newBonsai: Bonsai = {
      ...newBonsaiData,
      id,
      createdAt: new Date().toISOString(),
      lastWateredAt: new Date().toISOString(),
      lastFertilizedAt: "",
      history: initialHistory,
    };
    const updated = [...bonsais, newBonsai];
    saveBonsais(updated);
    setSelectedBonsaiId(id);
  };

  // 2. Submit Diary and trigger Gemini AI Advisor
  const handleDiarySubmit = async (data: {
    title: string;
    content: string;
    sunlight: "sunny" | "half-shade" | "shade";
    wind: "good" | "normal" | "poor";
    watered: boolean;
    fertilized: boolean;
  }) => {
    if (!selectedBonsai) return;

    // Call server endpoint for AI Master advice
    let aiComment = "";
    try {
      const response = await fetch("/api/gemini/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bonsaiName: selectedBonsai.name,
          bonsaiType: selectedBonsai.type,
          water: selectedBonsai.water,
          fertilizer: selectedBonsai.fertilizer,
          sunlight: data.sunlight,
          wind: data.wind,
          diaryTitle: data.title,
          diaryContent: data.content,
          watered: data.watered,
          fertilized: data.fertilized
        })
      });

      if (response.ok) {
        const json = await response.json();
        aiComment = json.advice;
      } else {
        aiComment = "おや、頭が少しぼんやりしてしまって気の利いたアドバイスが出ぬわ。でもお前の愛情は、盆栽にしっかりと伝わっておるぞ！";
      }
    } catch (error) {
      console.error(error);
      aiComment = "おや、少しばかり風の便りが届きにくいようじゃな。しかし、お前のお世話への情熱は盆栽の緑をより深く輝かせておるぞ。";
    }

    // Create diary entry
    const newEntry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      bonsaiId: selectedBonsai.id,
      date: new Date().toISOString().split("T")[0],
      title: data.title,
      content: data.content,
      sunlight: data.sunlight,
      wind: data.wind,
      watered: data.watered,
      fertilized: data.fertilized,
      aiComment,
      createdAt: new Date().toISOString()
    };

    const updatedDiaries = [newEntry, ...diaries];
    saveDiaries(updatedDiaries);

    // Update Bonsai status and care history
    let updatedBonsai = { ...selectedBonsai };
    updatedBonsai.sunlight = data.sunlight;
    updatedBonsai.wind = data.wind;

    // Gain experience from caring and diary writing
    let expGained = 15; // base diary writing exp

    if (data.watered) {
      updatedBonsai.water = 100;
      updatedBonsai.lastWateredAt = new Date().toISOString();
      expGained += 20;
    }
    if (data.fertilized) {
      updatedBonsai.fertilizer = 100;
      updatedBonsai.lastFertilizedAt = new Date().toISOString();
      expGained += 25;
    }

    updatedBonsai = addExperienceAndCheckLevelUp(updatedBonsai, expGained);

    // Recalculate basic status
    if (updatedBonsai.water > 35 && updatedBonsai.fertilizer > 30) {
      updatedBonsai.status = "healthy";
    }

    // Append / update history for today
    const todayStr = new Date().toISOString().split("T")[0];
    const prevHistory = updatedBonsai.history ? [...updatedBonsai.history] : [];
    const todayIdx = prevHistory.findIndex((h) => h.date === todayStr);
    const newPoint = {
      date: todayStr,
      water: updatedBonsai.water,
      fertilizer: updatedBonsai.fertilizer,
      watered: data.watered || (todayIdx >= 0 && prevHistory[todayIdx].watered),
      fertilized: data.fertilized || (todayIdx >= 0 && prevHistory[todayIdx].fertilized),
    };
    if (todayIdx >= 0) {
      prevHistory[todayIdx] = newPoint;
    } else {
      prevHistory.push(newPoint);
    }
    updatedBonsai.history = prevHistory.slice(-14);

    const updatedBonsais = bonsais.map((b) => (b.id === selectedBonsai.id ? updatedBonsai : b));
    saveBonsais(updatedBonsais);
  };

  // 3. Time Advancement Simulation (1 Day passes)
  const handleAdvanceTime = () => {
    const updated = bonsais.map((bonsai) => {
      const up = { ...bonsai };
      
      // Determine rates of loss based on presets or match keywords
      const lowerType = up.type.toLowerCase();
      let waterLoss = 18;
      let fertLoss = 10;

      // Find customized rates if we can match preset
      const preset = BONSAI_PRESETS.find(p => up.type.includes(p.japaneseName.split(" (")[0]));
      if (preset) {
        waterLoss = preset.waterLossRate;
        fertLoss = preset.fertilizerLossRate;
      }

      // Environmental penalty
      // E.g. Pine likes sunny. If set to shade, it gets sad, water is retained but health is slightly affected or experience growth is slower
      // Maple dislikes sunny (burns leaves). If sunny, water loss is multiplied by 1.5!
      if (lowerType.includes("紅葉") || lowerType.includes("maple")) {
        if (up.sunlight === "sunny") {
          waterLoss = Math.round(waterLoss * 1.5);
        }
      }
      // Pines/Junipers like sunny, if shade water loss is slower but might grow mold (simulated health penalty)
      if (lowerType.includes("松") || lowerType.includes("pine") || lowerType.includes("juniper") || lowerType.includes("真柏")) {
        if (up.sunlight === "shade") {
          waterLoss = Math.round(waterLoss * 0.7); // water stays but sunlight lack
        }
      }

      // Wind penalty: Poor wind makes soil damp and stunts growth, normal wind is default, good wind accelerates slight evaporation but keeps healthy
      if (up.wind === "poor") {
        // bad wind
        waterLoss = Math.round(waterLoss * 0.8);
      }

      // Reduce levels
      up.water = Math.max(up.water - waterLoss, 0);
      up.fertilizer = Math.max(up.fertilizer - fertLoss, 0);

      // Determine new status
      if (up.water === 0) {
        up.status = "withering";
      } else if (up.water <= 20) {
        up.status = "withering";
      } else if (up.water <= 35) {
        up.status = "dry";
      } else if (up.fertilizer <= 20) {
        up.status = "hungry";
      } else {
        up.status = "healthy";
      }

      // Update history for today
      const todayStr = new Date().toISOString().split("T")[0];
      const prevH = up.history ? [...up.history] : [];
      const tIdx = prevH.findIndex((h) => h.date === todayStr);
      const updatedPoint = {
        date: todayStr,
        water: up.water,
        fertilizer: up.fertilizer,
        watered: tIdx >= 0 ? prevH[tIdx].watered : false,
        fertilized: tIdx >= 0 ? prevH[tIdx].fertilized : false,
      };
      if (tIdx >= 0) {
        prevH[tIdx] = updatedPoint;
      } else {
        prevH.push(updatedPoint);
      }
      up.history = prevH.slice(-14);

      // Gain small passive experience if kept healthy
      if (up.water > 35 && up.fertilizer > 30) {
        return addExperienceAndCheckLevelUp(up, 10);
      }
      return up;
    });

    saveBonsais(updated);
  };

  // 4. Quick Water action from card
  const handleQuickWater = () => {
    if (!selectedBonsai) return;
    const todayStr = new Date().toISOString().split("T")[0];
    const updated = bonsais.map((b) => {
      if (b.id === selectedBonsai.id) {
        const prevH = b.history ? [...b.history] : [];
        const tIdx = prevH.findIndex((h) => h.date === todayStr);
        const point = {
          date: todayStr,
          water: 100,
          fertilizer: b.fertilizer,
          watered: true,
          fertilized: tIdx >= 0 ? prevH[tIdx].fertilized : false,
        };
        if (tIdx >= 0) {
          prevH[tIdx] = point;
        } else {
          prevH.push(point);
        }

        const wateredBonsai = {
          ...b,
          water: 100,
          status: (b.fertilizer > 30 ? "healthy" : "hungry") as Bonsai["status"],
          lastWateredAt: new Date().toISOString(),
          history: prevH.slice(-14),
        };
        return addExperienceAndCheckLevelUp(wateredBonsai, 15);
      }
      return b;
    });
    saveBonsais(updated);
  };

  // 5. Quick Fertilize action from card
  const handleQuickFertilize = () => {
    if (!selectedBonsai) return;
    const todayStr = new Date().toISOString().split("T")[0];
    const updated = bonsais.map((b) => {
      if (b.id === selectedBonsai.id) {
        const prevH = b.history ? [...b.history] : [];
        const tIdx = prevH.findIndex((h) => h.date === todayStr);
        const point = {
          date: todayStr,
          water: b.water,
          fertilizer: 100,
          watered: tIdx >= 0 ? prevH[tIdx].watered : false,
          fertilized: true,
        };
        if (tIdx >= 0) {
          prevH[tIdx] = point;
        } else {
          prevH.push(point);
        }

        const fertilizedBonsai = {
          ...b,
          fertilizer: 100,
          status: (b.water > 35 ? "healthy" : "dry") as Bonsai["status"],
          lastFertilizedAt: new Date().toISOString(),
          history: prevH.slice(-14),
        };
        return addExperienceAndCheckLevelUp(fertilizedBonsai, 20);
      }
      return b;
    });
    saveBonsais(updated);
  };

  // Delete Bonsai helper
  const handleDeleteBonsai = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("この盆栽をお別れしますか？")) return;
    const updated = bonsais.filter((b) => b.id !== id);
    saveBonsais(updated);
    if (selectedBonsaiId === id && updated.length > 0) {
      setSelectedBonsaiId(updated[0].id);
    }
  };

  // Selected Bonsai's specific diaries
  const currentBonsaiDiaries = diaries.filter((d) => d.bonsaiId === selectedBonsaiId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-slate-900 text-white shadow-xl py-5 px-6 border-b border-slate-800 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 bg-radial from-emerald-500 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl border border-emerald-400/30 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5">
                デジタル盆栽園 <span className="text-emerald-400 font-medium text-sm border border-emerald-500/30 px-2 py-0.5 rounded-full">Bonsai Care</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">お世話のタイミング通知、環境記録、そしてAIマスターの本格指導</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="advance-time-header-btn"
              onClick={handleAdvanceTime}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="1日経過させて盆栽の成長と状態変化を観察します"
            >
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              1日時間を進める
            </button>
            <button
              id="add-bonsai-header-btn"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              新しい盆栽
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Bonsai Selector & Selected Details (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Bonsai Selector List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">私の盆栽棚</h3>
              <span className="text-xs font-bold text-slate-400">{bonsais.length}鉢</span>
            </div>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {bonsais.map((b) => {
                const isSelected = b.id === selectedBonsaiId;
                const isThirsty = b.water <= 35;
                const isHungry = b.fertilizer <= 30;

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBonsaiId(b.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/20"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-2xl select-none">
                        {b.type.includes("松") || b.type.includes("Pine") ? "🌲" : b.type.includes("桜") ? "🌸" : "🍁"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-800 truncate">{b.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400">Lv.{b.level}</span>
                          {isThirsty && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" title="水やりが必要" />
                          )}
                          {isHungry && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" title="肥料が必要" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions on shelf item */}
                    <button
                      onClick={(e) => handleDeleteBonsai(b.id, e)}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      title="お別れする"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Bonsai Care controls */}
          {selectedBonsai ? (
            <BonsaiCard
              bonsai={selectedBonsai}
              onTimeAdvance={handleAdvanceTime}
              onQuickWater={handleQuickWater}
              onQuickFertilize={handleQuickFertilize}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xs text-center text-slate-400">
              <Sprout className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold">盆栽がありません</p>
              <p className="text-xs mt-1">「新しい盆栽」ボタンから最初の一鉢を迎え入れましょう。</p>
            </div>
          )}
        </div>

        {/* Right Side: Diary Inputs, Warnings & Logs (8 cols) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {/* Notification Alerts */}
          <NotificationToast bonsais={bonsais} />

          {selectedBonsai ? (
            <>
              {/* 7-day care trends chart using recharts */}
              <CareTrendsChart
                bonsai={selectedBonsai}
                diaries={currentBonsaiDiaries}
              />

              {/* Care diary input form */}
              <DiaryForm
                bonsai={selectedBonsai}
                onSubmit={handleDiarySubmit}
              />

              {/* Header for Diaries list */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 shrink-0">
                <h3 className="text-sm font-extrabold text-slate-700 tracking-wider uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" /> 「{selectedBonsai.name}」の観察日記
                </h3>
                <span className="text-xs font-bold text-slate-400">{currentBonsaiDiaries.length}件の記録</span>
              </div>

              {/* Care diaries list */}
              <DiaryList diaries={currentBonsaiDiaries} />
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200/60 shadow-xs text-center text-slate-400 flex-1 flex flex-col items-center justify-center">
              <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-600">盆栽を選択してください</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                お世話や日記の記録、AIマスターからの特別な指導を受けるには、左側の盆栽棚からお世話したい盆栽を選択してください。
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Level Up Pop-up Dialog Alert */}
      {showLevelUpAlert && showLevelUpAlert.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              👑
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">LEVEL UP!</span>
              <h3 className="text-xl font-extrabold text-slate-800">
                {showLevelUpAlert.bonsaiName} が成長しました！
              </h3>
              <p className="text-sm text-slate-500">
                お世話と日記での愛情が実を結び、盆栽の格調が <span className="text-emerald-600 font-extrabold">Lv.{showLevelUpAlert.level}</span> に上昇しました。ビジュアルが豪華に変化します。
              </p>
            </div>
            <button
              onClick={() => setShowLevelUpAlert(null)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              誇らしく見守る
            </button>
          </div>
        </div>
      )}

      {/* New Bonsai Creator Modal */}
      <AddBonsaiModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBonsai}
      />

      {/* Humble Footer */}
      <footer className="bg-slate-950 text-slate-500 py-6 text-center text-xs border-t border-slate-900 shrink-0">
        <p>© 2026 デジタル盆栽育成園 Bonsai Care. すべての盆栽に、愛情を。</p>
      </footer>
    </div>
  );
}
