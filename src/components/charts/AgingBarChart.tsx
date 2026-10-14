import React from "react";
import { BusinessFormulas } from "../../services/formulas";

interface AgingItem {
  bucket: string;
  amount: number;
  count: number;
}

interface AgingBarChartProps {
  data: AgingItem[];
  title?: string;
  subtitle?: string;
  type?: "receivables" | "payables";
}

export const AgingBarChart: React.FC<AgingBarChartProps> = ({
  data,
  title,
  subtitle,
  type = "receivables",
}) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.amount)) * 1.15;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
        {data.map((item, idx) => {
          const isOverdue = item.bucket !== "A vencer";
          const barHeightPct = maxVal > 0 ? Math.max((item.amount / maxVal) * 100, 4) : 4;

          const colorClass = !isOverdue
            ? "bg-blue-600"
            : idx === 1
            ? "bg-amber-500"
            : idx === 2
            ? "bg-amber-600"
            : "bg-rose-600";

          return (
            <div
              key={idx}
              className="flex flex-col items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-center"
            >
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                {item.bucket}
              </div>

              {/* Vertical mini bar */}
              <div className="w-full h-16 flex items-end justify-center py-1">
                <div
                  className={`w-4/5 max-w-[32px] rounded-t-sm transition-all duration-500 ${colorClass}`}
                  style={{ height: `${barHeightPct}%` }}
                />
              </div>

              <div className="mt-1 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {BusinessFormulas.formatCompactCurrency(item.amount)}
              </div>
              <div className="text-[10px] text-slate-400">
                {item.count} títulos
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
