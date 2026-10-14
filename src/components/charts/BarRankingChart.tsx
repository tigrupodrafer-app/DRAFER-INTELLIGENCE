import React from "react";
import { BusinessFormulas } from "../../services/formulas";

interface RankingItem {
  name: string;
  revenue: number;
  target?: number;
  achievementPct?: number;
  ordersCount?: number;
}

interface BarRankingChartProps {
  data: RankingItem[];
  title?: string;
  subtitle?: string;
}

export const BarRankingChart: React.FC<BarRankingChartProps> = ({ data, title, subtitle }) => {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Sem dados</div>;
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.revenue, d.target || 0))) * 1.1;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3.5">
        {data.map((item, idx) => {
          const pct = Math.min((item.revenue / maxVal) * 100, 100);
          const targetPct = item.target ? Math.min((item.target / maxVal) * 100, 100) : 0;
          const isOverTarget = item.achievementPct !== undefined ? item.achievementPct >= 100 : false;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-4 text-slate-400 font-mono text-[11px] font-semibold">{idx + 1}º</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {BusinessFormulas.formatCurrency(item.revenue)}
                  </span>
                  {item.achievementPct !== undefined && (
                    <span
                      className={`text-[11px] font-medium ${
                        isOverTarget ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {item.achievementPct.toFixed(1)}% meta
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar with target pin */}
              <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverTarget ? "bg-blue-600" : "bg-slate-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                {targetPct > 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                    style={{ left: `${targetPct}%` }}
                    title={`Meta: ${BusinessFormulas.formatCurrency(item.target || 0)}`}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
