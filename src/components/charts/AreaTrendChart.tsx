import React, { useState } from "react";
import { BusinessFormulas } from "../../services/formulas";

interface AreaTrendItem {
  month: string;
  currentYear: number;
  previousYear?: number;
  target?: number;
}

interface AreaTrendChartProps {
  data: AreaTrendItem[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  data,
  title,
  subtitle,
  height = 240,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Sem dados disponíveis</div>;
  }

  const values = data.flatMap(d => [d.currentYear, d.previousYear || 0, d.target || 0]);
  const maxValue = Math.max(...values) * 1.15;
  const minValue = 0;

  const width = 640;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => height - paddingY - ((val - minValue) / (maxValue - minValue)) * chartHeight;

  // Generate SVG path for current year
  const pointsCurrent = data.map((d, i) => `${getX(i)},${getY(d.currentYear)}`).join(" ");
  const areaCurrent = `${pointsCurrent} L ${getX(data.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  // Generate SVG path for previous year
  const hasPrev = data.some(d => d.previousYear !== undefined);
  const pointsPrev = hasPrev ? data.map((d, i) => `${getX(i)},${getY(d.previousYear || 0)}`).join(" ") : "";

  // Generate SVG path for target
  const hasTarget = data.some(d => d.target !== undefined);
  const pointsTarget = hasTarget ? data.map((d, i) => `${getX(i)},${getY(d.target || 0)}`).join(" ") : "";

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block"></span>
              2024 Realizado
            </span>
            {hasPrev && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block"></span>
                2023 Anterior
              </span>
            )}
            {hasTarget && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-500 border-t border-dashed inline-block"></span>
                Meta Comercial
              </span>
            )}
          </div>
        </div>
      )}

      <div className="relative w-full overflow-hidden" style={{ height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + pct * chartHeight;
            const val = maxValue - pct * (maxValue - minValue);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/80"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 text-[9px] font-mono select-none"
                >
                  {BusinessFormulas.formatCompactCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Previous year line */}
          {hasPrev && (
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              points={pointsPrev}
            />
          )}

          {/* Target line */}
          {hasTarget && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              points={pointsTarget}
            />
          )}

          {/* Area fill */}
          <path d={areaCurrent} fill="url(#blueGradient)" />

          {/* Current line */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsCurrent}
          />

          {/* Points & Interactive crosshairs */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.currentYear);
            const isHovered = hoverIndex === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Vertical hover line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={height - paddingY}
                    stroke="#3b82f6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Invisible hover capture rect */}
                <rect
                  x={cx - chartWidth / (data.length * 2)}
                  y={paddingY}
                  width={chartWidth / data.length}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3.5}
                  className="fill-white dark:fill-slate-900 stroke-blue-600 transition-all"
                  strokeWidth="2"
                />

                {/* X Axis Labels */}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-slate-500 dark:fill-slate-400 text-[10px] select-none font-medium"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-900 text-white rounded-md p-2.5 shadow-lg border border-slate-700 text-xs text-left"
            style={{
              left: `${Math.min(Math.max(getX(hoverIndex) - 60, 10), width - 150)}px`,
              top: `${Math.max(getY(data[hoverIndex].currentYear) - 70, 5)}px`,
            }}
          >
            <div className="font-semibold text-slate-300 pb-1 mb-1 border-b border-slate-800">
              {data[hoverIndex].month} / 2024
            </div>
            <div className="space-y-0.5 font-mono">
              <div className="flex justify-between gap-3 text-blue-400 font-semibold">
                <span>Realizado:</span>
                <span>{BusinessFormulas.formatCurrency(data[hoverIndex].currentYear)}</span>
              </div>
              {data[hoverIndex].target && (
                <div className="flex justify-between gap-3 text-amber-400">
                  <span>Meta:</span>
                  <span>{BusinessFormulas.formatCurrency(data[hoverIndex].target)}</span>
                </div>
              )}
              {data[hoverIndex].previousYear && (
                <div className="flex justify-between gap-3 text-slate-400">
                  <span>Ano Ant.:</span>
                  <span>{BusinessFormulas.formatCurrency(data[hoverIndex].previousYear)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
