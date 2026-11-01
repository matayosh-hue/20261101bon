import React from "react";

interface BonsaiVisualProps {
  type: string;
  level: number;
  water: number;
  fertilizer: number;
  status: string;
}

export default function BonsaiVisual({ type, level, water, fertilizer, status }: BonsaiVisualProps) {
  // Determine color scheme based on type and health status
  const isHealthy = water > 35 && fertilizer > 30;
  const isWithering = water <= 15 || status === "withering";
  const isDry = water <= 35 && water > 15;
  const isHungry = fertilizer <= 30 && fertilizer > 10;

  // Leaves color determination
  let leafColor = "#2e7d32"; // Rich green
  let leafAccentColor = "#4caf50";
  let flowerColor = "#ff80ab"; // For Cherry blossom

  const typeLower = type.toLowerCase();
  
  if (typeLower.includes("松") || typeLower.includes("pine") || typeLower.includes("juniper") || typeLower.includes("真柏")) {
    if (isHealthy) {
      leafColor = "#1b5e20"; // Dark evergreen green
      leafAccentColor = "#2e7d32";
    } else if (isDry) {
      leafColor = "#4e6a4f"; // Pale dry green
      leafAccentColor = "#668c68";
    } else if (isWithering) {
      leafColor = "#8d6e63"; // Brownish dead needles
      leafAccentColor = "#a1887f";
    } else {
      leafColor = "#3d8b40";
      leafAccentColor = "#5bb35e";
    }
  } else if (typeLower.includes("紅葉") || typeLower.includes("maple") || typeLower.includes("もみじ")) {
    // Maple: Gorgeous autumn colors (Healthy is vibrant red/orange)
    if (isHealthy) {
      leafColor = "#c62828"; // Vibrant crimson red
      leafAccentColor = "#ef5350";
    } else if (isDry) {
      leafColor = "#9e5d3d"; // Muted brownish orange
      leafAccentColor = "#bf7c58";
    } else if (isWithering) {
      leafColor = "#5d4037"; // Dark dried brown
      leafAccentColor = "#7d5a50";
    } else {
      leafColor = "#e65100"; // Autumn orange
      leafAccentColor = "#ff9800";
    }
  } else if (typeLower.includes("桜") || typeLower.includes("cherry") || typeLower.includes("さくら")) {
    // Cherry blossom: Pink blossoms or green leaves
    if (isHealthy) {
      leafColor = "#f48fb1"; // Beautiful soft pink petals
      leafAccentColor = "#f06292";
      flowerColor = "#e91e63";
    } else if (isDry) {
      leafColor = "#f8bbd0"; // Faded dry pink
      leafAccentColor = "#f48fb1";
      flowerColor = "#f06292";
    } else if (isWithering) {
      leafColor = "#d7ccc8"; // Fallen petals / dry brown
      leafAccentColor = "#bcaaa4";
      flowerColor = "#8d6e63";
    } else {
      leafColor = "#f48fb1";
      leafAccentColor = "#f06292";
      flowerColor = "#e91e63";
    }
  } else if (typeLower.includes("梅") || typeLower.includes("plum")) {
    // Plum: Deep magenta flowers
    if (isHealthy) {
      leafColor = "#ad1457"; // Deep magenta plum blossoms
      leafAccentColor = "#d81b60";
    } else if (isWithering) {
      leafColor = "#7d5a50";
      leafAccentColor = "#bcaaa4";
    } else {
      leafColor = "#c2185b";
      leafAccentColor = "#e91e63";
    }
  }

  // Trunk color
  const trunkColor = isWithering ? "#5d4037" : "#4e342e"; // Greyish brown if dead
  const secondaryTrunk = isWithering ? "#7d5a50" : "#5d4037";

  // Dynamic sizing of the canopy based on Bonsai Level
  // Level affects branch complexity and scale
  const scale = 0.8 + Math.min(level * 0.1, 0.6);

  // Define unique paths for each type to give distinct silhouettes
  const isPineOrJuniper = typeLower.includes("松") || typeLower.includes("pine") || typeLower.includes("juniper") || typeLower.includes("真柏");
  const isMaple = typeLower.includes("紅葉") || typeLower.includes("maple") || typeLower.includes("もみじ");
  const isCherry = typeLower.includes("桜") || typeLower.includes("cherry") || typeLower.includes("さくら") || typeLower.includes("梅") || typeLower.includes("plum");

  return (
    <div id="bonsai-visual-container" className="relative w-full h-80 flex items-center justify-center bg-radial from-slate-50 to-slate-100 rounded-2xl border border-slate-200/60 overflow-hidden shadow-inner">
      {/* Background Ambience Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft sun beam if healthy or sunny */}
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-amber-200/20 blur-3xl" />
        {/* Little falling petals for cherry blossoms, or glowing green spores for pine */}
        {isHealthy && isCherry && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-2 h-2 rounded-full bg-pink-300/60 animate-bounce top-12 left-1/3 blur-[1px]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-pink-200/50 animate-pulse top-24 left-2/3 blur-[1px]" />
            <div className="absolute w-2.5 h-2 top-36 left-1/4 bg-pink-300/40 rounded-tr-lg rounded-bl-lg transform rotate-45 animate-pulse" />
          </div>
        )}
        {isHealthy && isPineOrJuniper && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/40 top-16 left-1/4 animate-pulse" />
            <div className="absolute w-1 h-1 rounded-full bg-emerald-400/40 top-28 left-3/4 animate-pulse" />
          </div>
        )}
        {/* Water drops indicator if dry */}
        {isDry && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-sky-50 px-2 py-1 rounded-full border border-sky-100 text-xs text-sky-600 font-medium animate-pulse shadow-sm">
            💧 水が少なめじゃ
          </div>
        )}
        {isHungry && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 text-xs text-amber-600 font-medium animate-pulse shadow-sm">
            🌱 栄養を欲しておる
          </div>
        )}
        {isWithering && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-full border border-red-100 text-xs text-red-600 font-semibold animate-bounce shadow-md">
            ⚠️ 枯れる寸前じゃ！
          </div>
        )}
      </div>

      <svg
        id="bonsai-svg"
        viewBox="0 0 300 300"
        className="w-72 h-72 drop-shadow-xl transition-all duration-700"
        style={{ transform: `scale(${scale})` }}
      >
        <defs>
          {/* Pot gradients */}
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4e342e" />
            <stop offset="80%" stopColor="#3e2723" />
            <stop offset="100%" stopColor="#27120f" />
          </linearGradient>
          {/* Leaves radial gradients */}
          <radialGradient id="leafGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor={leafAccentColor} />
            <stop offset="100%" stopColor={leafColor} />
          </radialGradient>
          {/* Shari/Deadwood gradient for Juniper */}
          <linearGradient id="shariGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#efebe9" />
            <stop offset="100%" stopColor="#d7ccc8" />
          </linearGradient>
          {/* Soft shadow for the pot */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="5" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* --- Pot and Soil Base (盆栽の鉢と土) --- */}
        <g id="pot-group" filter="url(#shadow)">
          {/* Table Surface */}
          <line x1="40" y1="260" x2="260" y2="260" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="260" x2="250" y2="260" stroke="#94a3b8" strokeWidth="1" />

          {/* Pot Feet */}
          <rect x="75" y="245" width="20" height="10" rx="3" fill="#111827" />
          <rect x="205" y="245" width="20" height="10" rx="3" fill="#111827" />

          {/* Pot Main Body */}
          <path d="M 60,215 L 240,215 L 225,245 L 75,245 Z" fill="url(#potGrad)" stroke="#111827" strokeWidth="2" />
          {/* Pot Rim */}
          <rect x="52" y="208" width="196" height="8" rx="4" fill="#4b5563" stroke="#111827" strokeWidth="1.5" />
          
          {/* Soil / Moss Bed */}
          <path d="M 58,210 Q 150,200 242,210 Q 150,215 58,210" fill="url(#soilGrad)" />
          {/* Moss Patch (Greenery on soil) */}
          {isHealthy && (
            <path d="M 80,210 Q 110,201 135,208 Q 170,202 205,210 Q 150,214 80,210" fill="#558b2f" opacity="0.85" />
          )}
        </g>

        {/* --- Trunk (幹) --- */}
        <g id="trunk-group">
          {/* Juniper Shari (Jin/Deadwood effect for Juniper style) */}
          {typeLower.includes("juniper") || typeLower.includes("真柏") ? (
            <>
              {/* Dynamic winding Trunk with Shari */}
              <path
                d="M 150,210 C 130,170 180,140 135,110 C 120,100 110,110 100,100"
                stroke={trunkColor}
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 148,205 C 133,172 175,145 140,118"
                stroke="url(#shariGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isPineOrJuniper ? (
            /* Pine: Rugged, curved and powerful classic Moyogi trunk */
            <path
              d="M 150,210 C 130,165 175,135 140,95 C 125,80 140,70 135,50"
              stroke={trunkColor}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              className="transition-colors duration-1000"
            />
          ) : isMaple ? (
            /* Maple: Graceful, delicate, upright branching */
            <path
              d="M 150,210 C 145,160 165,130 150,90 C 140,75 145,55 145,40"
              stroke={trunkColor}
              strokeWidth="13"
              strokeLinecap="round"
              fill="none"
              className="transition-colors duration-1000"
            />
          ) : (
            /* Cherry / Default: Graceful, expanding */
            <path
              d="M 150,210 C 140,170 160,135 140,95 C 130,75 140,60 135,45"
              stroke={trunkColor}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              className="transition-colors duration-1000"
            />
          )}

          {/* Primary branches */}
          {/* First branch (Left) */}
          <path
            d="M 142,165 C 105,160 90,140 75,145"
            stroke={trunkColor}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Second branch (Right) */}
          <path
            d="M 152,145 C 185,140 200,120 215,125"
            stroke={trunkColor}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Back/Top branch */}
          <path
            d="M 140,110 C 120,95 105,80 90,90"
            stroke={trunkColor}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Level 3+ gets extra branch details */}
          {level >= 3 && (
            <>
              <path
                d="M 83,143 C 65,135 55,140 45,135"
                stroke={trunkColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 205,123 C 225,120 235,115 245,118"
                stroke={trunkColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 145,75 C 165,65 180,55 190,65"
                stroke={trunkColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}
        </g>

        {/* --- Leaves / Foliage Clouds (葉の塊・雲) --- */}
        <g id="foliage-group" className="transition-all duration-1000">
          {isPineOrJuniper ? (
            /* Pine: Needle cloud shapes */
            <>
              {/* Left Foliage Cloud */}
              <ellipse cx="70" cy="142" rx="30" ry="16" fill="url(#leafGrad)" />
              <ellipse cx="60" cy="138" rx="20" ry="12" fill="url(#leafGrad)" opacity="0.9" />
              <ellipse cx="80" cy="146" rx="20" ry="12" fill="url(#leafGrad)" opacity="0.9" />

              {/* Right Foliage Cloud */}
              <ellipse cx="220" cy="122" rx="32" ry="17" fill="url(#leafGrad)" />
              <ellipse cx="205" cy="118" rx="22" ry="12" fill="url(#leafGrad)" opacity="0.9" />
              <ellipse cx="232" cy="126" rx="22" ry="12" fill="url(#leafGrad)" opacity="0.9" />

              {/* Top-Left Foliage Cloud */}
              <ellipse cx="90" cy="85" rx="26" ry="14" fill="url(#leafGrad)" />

              {/* Crown Foliage (Top) */}
              <ellipse cx="135" cy="50" rx="36" ry="18" fill="url(#leafGrad)" />
              <ellipse cx="120" cy="46" rx="24" ry="14" fill="url(#leafGrad)" opacity="0.95" />
              <ellipse cx="150" cy="52" rx="24" ry="14" fill="url(#leafGrad)" opacity="0.95" />

              {level >= 3 && (
                <>
                  <ellipse cx="45" cy="133" rx="16" ry="9" fill="url(#leafGrad)" />
                  <ellipse cx="248" cy="116" rx="16" ry="9" fill="url(#leafGrad)" />
                  <ellipse cx="188" cy="62" rx="22" ry="12" fill="url(#leafGrad)" />
                </>
              )}
            </>
          ) : isMaple ? (
            /* Maple: Layered, star-leaf clump structures */
            <>
              {/* Left Foliage Clumps (Multiple overlapping circles) */}
              <circle cx="70" cy="145" r="22" fill="url(#leafGrad)" />
              <circle cx="55" cy="140" r="16" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="85" cy="148" r="16" fill="url(#leafGrad)" opacity="0.9" />

              {/* Right Foliage Clumps */}
              <circle cx="218" cy="125" r="24" fill="url(#leafGrad)" />
              <circle cx="202" cy="118" r="18" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="232" cy="130" r="18" fill="url(#leafGrad)" opacity="0.9" />

              {/* Top-Left */}
              <circle cx="88" cy="86" r="20" fill="url(#leafGrad)" />

              {/* Crown (Top) */}
              <circle cx="145" cy="45" r="28" fill="url(#leafGrad)" />
              <circle cx="125" cy="40" r="22" fill="url(#leafGrad)" opacity="0.95" />
              <circle cx="162" cy="48" r="22" fill="url(#leafGrad)" opacity="0.95" />

              {level >= 3 && (
                <>
                  <circle cx="43" cy="135" r="14" fill="url(#leafGrad)" />
                  <circle cx="246" cy="118" r="14" fill="url(#leafGrad)" />
                  <circle cx="190" cy="62" r="18" fill="url(#leafGrad)" />
                </>
              )}
            </>
          ) : (
            /* Cherry / Plum: Clouds of pink or magenta flower clusters */
            <>
              {/* Left Blossom Cloud */}
              <circle cx="72" cy="145" r="20" fill="url(#leafGrad)" />
              <circle cx="58" cy="138" r="15" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="84" cy="149" r="15" fill="url(#leafGrad)" opacity="0.9" />
              {/* Small accent flowers if healthy */}
              {isHealthy && <circle cx="72" cy="145" r="3" fill={flowerColor} />}
              {isHealthy && <circle cx="58" cy="138" r="2.5" fill={flowerColor} />}

              {/* Right Blossom Cloud */}
              <circle cx="216" cy="125" r="23" fill="url(#leafGrad)" />
              <circle cx="200" cy="118" r="17" fill="url(#leafGrad)" opacity="0.9" />
              <circle cx="230" cy="129" r="17" fill="url(#leafGrad)" opacity="0.9" />
              {isHealthy && <circle cx="216" cy="125" r="3.5" fill={flowerColor} />}
              {isHealthy && <circle cx="200" cy="118" r="2.5" fill={flowerColor} />}

              {/* Top-Left */}
              <circle cx="88" cy="88" r="18" fill="url(#leafGrad)" />

              {/* Crown */}
              <circle cx="140" cy="45" r="26" fill="url(#leafGrad)" />
              <circle cx="122" cy="38" r="20" fill="url(#leafGrad)" opacity="0.95" />
              <circle cx="156" cy="48" r="20" fill="url(#leafGrad)" opacity="0.95" />
              {isHealthy && <circle cx="140" cy="45" r="4" fill={flowerColor} />}
              {isHealthy && <circle cx="122" cy="38" r="3" fill={flowerColor} />}
              {isHealthy && <circle cx="156" cy="48" r="3" fill={flowerColor} />}

              {level >= 3 && (
                <>
                  <circle cx="43" cy="136" r="13" fill="url(#leafGrad)" />
                  <circle cx="244" cy="119" r="13" fill="url(#leafGrad)" />
                  <circle cx="190" cy="62" r="18" fill="url(#leafGrad)" />
                  {isHealthy && <circle cx="190" cy="62" r="3" fill={flowerColor} />}
                </>
              )}
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
