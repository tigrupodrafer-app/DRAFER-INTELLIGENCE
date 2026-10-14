import React, { useState } from "react";
import { BusinessFormulas } from "../../services/formulas";

interface DonutItem {
  name: string;
  value: number;
  sharePct: number;
}

interface DonutShareChartProps {
  data: DonutItem[];
  title?: string;
  subtitle?: string;
}

const PALETTE = ["#2563eb", "#0284c7", "#0d9488", "#10b981", "#6366f1", "#8b5cf6"];

export const DonutShareChart: React.FC<DonutShareChartProps> = ({ data, title, subtitle }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;
  const total = data.reduce((acc, d) => acc + d.value, 0);

  // Calculate SVG stroke dashes for donut
  const radius = 60;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;
  const segments = data.map((item, idx) => {
    const strokeDash = (item.value / total) * circumference;
    const strokeOffset = -cumulativeAngle;
    cumulativeAngle += strokeDash;
    const color = PALETTE[idx % PALETTE.length];
    return { ...item, strokeDash, strokeOffset, color };
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            {segments.map((seg, idx) => (
              <circle
                key={idx}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${seg.strokeDash} ${circumference}`}
                strokeDashoffset={seg.strokeOffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 font-medium">Total Fat.</span>
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
              {BusinessFormulas.formatCompactCurrency(total)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-1.5 text-xs">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1 rounded-sm transition-colors cursor-pointer ${
                hoveredIdx === idx ? "bg-slate-100 dark:bg-slate-800" : ""
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-700 dark:text-slate-300 truncate">{seg.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0 ml-2">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{seg.sharePct.toFixed(1)}%</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                  {BusinessFormulas.formatCompactCurrency(seg.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
