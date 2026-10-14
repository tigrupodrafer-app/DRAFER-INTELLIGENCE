import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { DreLineItem, DreSummaryKpis, DrePeriodType } from "../../types";
import {
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronRight,
  Percent,
  CheckCircle2,
  Building,
  Layers,
  ArrowRightLeft,
  Info,
} from "lucide-react";
import { MOCK_COMPANIES } from "../../services/mockDataProvider";

export const DreManagerialView: React.FC = () => {
  const { filters } = useFilters();
  const [periodType, setPeriodType] = useState<DrePeriodType>("monthly");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [eliminateIntercompany, setEliminateIntercompany] = useState<boolean>(true);
  const [showVerticalAnalysis, setShowVerticalAnalysis] = useState<boolean>(true);
  const [expandedLines, setExpandedLines] = useState<Record<string, boolean>>({
    "dre-1": true,
    "dre-2": false,
    "dre-4": true,
    "dre-6": false,
    "dre-8": false,
  });

  const [dreData, setDreData] = useState<{
    periods: string[];
    lines: DreLineItem[];
    summary: DreSummaryKpis;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider
      .getDreStatement(2024, periodType, selectedCompany, eliminateIntercompany)
      .then(res => {
        if (mounted) {
          setDreData(res);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [periodType, selectedCompany, eliminateIntercompany]);

  const toggleExpand = (id: string) => {
    setExpandedLines(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    if (!dreData) return;
    const exportRows: any[] = [];
    dreData.lines.forEach(line => {
      const row: any = { "Conta / Descrição": line.name };
      dreData.periods.forEach(p => {
        row[p] = line.values[p] || 0;
      });
      exportRows.push(row);
      if (line.children) {
        line.children.forEach(sub => {
          const subRow: any = { "Conta / Descrição": `  └─ ${sub.name}` };
          dreData.periods.forEach(p => {
            subRow[p] = sub.values[p] || 0;
          });
          exportRows.push(subRow);
        });
      }
    });
    ExportService.exportToCsv("DRAFER_DRE_Gerencial_2024", exportRows);
  };

  if (loading || !dreData) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  // Net Revenue reference for Vertical Analysis (AV %)
  const netRevenueLine = dreData.lines.find(l => l.code === "3.0");

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              DRE Gerencial Consolidado
            </h1>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
              Exercício 2024
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Demonstrativo do resultado do exercício com suporte a consolidação do Grupo Drafer e eliminações intercompany.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar DRE</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setPeriodType("monthly")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                periodType === "monthly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Mensal (Jan-Dez)
            </button>
            <button
              onClick={() => setPeriodType("quarterly")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                periodType === "quarterly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Trimestral (Q1-Q4)
            </button>
            <button
              onClick={() => setPeriodType("annual")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                periodType === "annual"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Comparativo Anual
            </button>
          </div>

          {/* Company Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Escopo:</span>
            <select
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Grupo Drafer (Consolidado)</option>
              {MOCK_COMPANIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Elimination Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 select-none">
            <input
              type="checkbox"
              checked={eliminateIntercompany}
              onChange={e => setEliminateIntercompany(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Eliminação Intercompany (-8%)
            </span>
          </label>

          {/* Vertical Analysis Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 select-none">
            <input
              type="checkbox"
              checked={showVerticalAnalysis}
              onChange={e => setShowVerticalAnalysis(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Análise Vertical (AV %)
            </span>
          </label>
        </div>
      </div>

      {/* Elimination Banner if Active */}
      {eliminateIntercompany && dreData.summary.intercompanyEliminatedTotal > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            <span>
              <strong>Eliminações de Operações Intercompany Ativas:</strong> R$ {BusinessFormulas.formatCompactCurrency(dreData.summary.intercompanyEliminatedTotal)} em transações cruzadas entre a Matriz e as Filiais SP/PR/MG foram deduzidas para evitar bitributação e faturamento fantasma na consolidação.
            </span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Receita Líquida Consolidada</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCompactCurrency(dreData.summary.netRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Base 100% da DRE</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Lucro Bruto (Margem)</div>
          <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {BusinessFormulas.formatCompactCurrency(dreData.summary.grossProfit)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 font-mono">
            {dreData.summary.grossMarginPct.toFixed(1)}% Margem Bruta
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">EBITDA / LAJIDA</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {BusinessFormulas.formatCompactCurrency(dreData.summary.ebitda)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
            {dreData.summary.ebitdaMarginPct.toFixed(1)}% Margem EBITDA
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Resultado Líquido do Ano</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCompactCurrency(dreData.summary.netResult)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 font-mono">
            {dreData.summary.netMarginPct.toFixed(1)}% Margem Líquida
          </div>
        </div>
      </div>

      {/* DRE Hierarchical Statement Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2.5 min-w-[280px]">Estrutura de Contas Gerenciais</th>
                {dreData.periods.map(p => (
                  <th key={p} className="px-3 py-2.5 text-right font-mono min-w-[100px]">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {dreData.lines.map(line => {
                const isSubtotal = line.type === "subtotal" || line.type === "total";
                const isExpanded = !!expandedLines[line.id];
                const hasChildren = line.children && line.children.length > 0;

                return (
                  <React.Fragment key={line.id}>
                    {/* Main Line */}
                    <tr
                      className={`transition-colors ${
                        line.isHighlight
                          ? "bg-blue-50/70 dark:bg-blue-950/30 font-bold text-slate-900 dark:text-slate-100"
                          : line.isBold
                          ? "bg-slate-50/60 dark:bg-slate-800/40 font-semibold text-slate-900 dark:text-slate-100"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <td className="px-3 py-2 font-sans">
                        <div className="flex items-center gap-1.5">
                          {hasChildren ? (
                            <button
                              onClick={() => toggleExpand(line.id)}
                              className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>
                          ) : (
                            <span className="w-4 inline-block" />
                          )}
                          <span className={line.isBold ? "font-bold" : "font-medium"}>
                            {line.name}
                          </span>
                        </div>
                      </td>

                      {dreData.periods.map(p => {
                        const val = line.values[p] || 0;
                        const netVal = netRevenueLine?.values[p] || 1;
                        const avPct = (val / netVal) * 100;

                        return (
                          <td key={p} className="px-3 py-2 text-right tabular-nums">
                            <div>{BusinessFormulas.formatCurrency(val)}</div>
                            {showVerticalAnalysis && (
                              <div className="text-[10px] text-slate-400 font-normal">
                                {avPct.toFixed(1)}% AV
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Expanded Children Lines */}
                    {hasChildren &&
                      isExpanded &&
                      line.children!.map(child => (
                        <tr
                          key={child.id}
                          className="bg-slate-50/30 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 text-[11px]"
                        >
                          <td className="px-3 py-1.5 pl-8 font-sans">
                            <span className="text-slate-400 mr-1.5">└─</span>
                            <span>{child.name}</span>
                          </td>
                          {dreData.periods.map(p => {
                            const val = child.values[p] || 0;
                            const netVal = netRevenueLine?.values[p] || 1;
                            const avPct = (val / netVal) * 100;
                            return (
                              <td key={p} className="px-3 py-1.5 text-right tabular-nums">
                                <div>{BusinessFormulas.formatCurrency(val)}</div>
                                {showVerticalAnalysis && (
                                  <div className="text-[9px] text-slate-400 font-normal">
                                    {avPct.toFixed(1)}%
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
