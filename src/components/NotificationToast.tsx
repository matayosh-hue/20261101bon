import React from "react";
import { AlertTriangle, Droplets, Trash, Sparkles } from "lucide-react";
import { Bonsai } from "../types";

interface NotificationToastProps {
  bonsais: Bonsai[];
}

export default function NotificationToast({ bonsais }: NotificationToastProps) {
  const thirstyBonsais = bonsais.filter((b) => b.water <= 35);
  const hungryBonsais = bonsais.filter((b) => b.fertilizer <= 30);

  if (thirstyBonsais.length === 0 && hungryBonsais.length === 0) {
    return null;
  }

  return (
    <div id="notification-area" className="space-y-2 max-w-md w-full">
      {thirstyBonsais.map((bonsai) => (
        <div
          key={`water-alert-${bonsai.id}`}
          className="flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-md transition-all duration-300 animate-pulse"
        >
          <div className="p-1 bg-amber-100 rounded-lg text-amber-600 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900">
              「{bonsai.name}」がお水を欲しがっています！
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              現在の水分量は {bonsai.water}% です。乾燥しすぎると枯れる原因になります。すぐに水やりをしてあげましょう。
            </p>
          </div>
        </div>
      ))}

      {hungryBonsais.map((bonsai) => (
        <div
          key={`fert-alert-${bonsai.id}`}
          className="flex items-start gap-3 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-md transition-all duration-300 animate-pulse"
        >
          <div className="p-1 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-indigo-900">
              「{bonsai.name}」の栄養が不足しています！
            </h4>
            <p className="text-xs text-indigo-700 mt-1">
              肥料レベルが {bonsai.fertilizer}% です。元気な成長を促すために、肥料を与えて栄養補給をしてあげましょう。
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
