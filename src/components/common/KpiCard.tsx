import React from "react";
import { TrendingUp, TrendingDown, HelpCircle, LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  changePct?: number;
  isPositiveGood?: boolean;
  unit?: string;
  formulaInfo?: string;
  icon?: LucideIcon;
  onClickFormula?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  changePct,
  isPositiveGood = true,
  unit,
  formulaInfo,
  icon: Icon,
  onClickFormula,
}) => {
  const isPositive = (changePct ?? 0) >= 0;
  const isGood = isPositiveGood ? isPositive : !isPositive;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
        <span className="font-medium truncate">{title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {formulaInfo && onClickFormula && (
            <button
              onClick={onClickFormula}
              title={`Ver fórmula: ${formulaInfo}`}
              className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono tabular-nums">
          {value}
          {unit && <span className="text-xs font-normal text-slate-500 ml-1 font-sans">{unit}</span>}
        </div>

        {changePct !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums shrink-0 ${
              isGood ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>
              {isPositive ? "+" : ""}
              {changePct.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
