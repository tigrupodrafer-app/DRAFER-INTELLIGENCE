import React from "react";
import { BusinessFormulas } from "../../services/formulas";

interface ComparisonBarItem {
  company: string;
  code: string;
  revenue: number;
  profit: number;
  margin: number;
}

interface ComparisonBarChartProps {
  data: ComparisonBarItem[];
  title?: string;
  subtitle?: string;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  data,
  title,
  subtitle,
}) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.revenue)) * 1.1;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block"></span>
              Faturamento
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block"></span>
              Lucro Bruto
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.map((item, idx) => {
          const revPct = Math.min((item.revenue / maxVal) * 100, 100);
          const profPct = Math.min((item.profit / maxVal) * 100, 100);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.company}
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  Margem: {item.margin.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-1">
                {/* Revenue bar */}
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-xs overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-xs transition-all duration-500"
                      style={{ width: `${revPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 w-24 text-right shrink-0">
                    {BusinessFormulas.formatCompactCurrency(item.revenue)}
                  </span>
                </div>

                {/* Profit bar */}
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-xs overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-xs transition-all duration-500"
                      style={{ width: `${profPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 w-24 text-right shrink-0">
                    {BusinessFormulas.formatCompactCurrency(item.profit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
