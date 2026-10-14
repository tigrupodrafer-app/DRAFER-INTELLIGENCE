import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { Percent, TrendingUp, AlertCircle, CheckCircle2, Download, Search } from "lucide-react";

export const MarginAnalysisView: React.FC = () => {
  const { filters } = useFilters();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<"all" | "Crítica" | "Adequada" | "Excelente">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getMarginAnalysis(filters).then(res => {
      if (mounted) {
        setItems(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const filtered = items.filter(it => {
    if (filterTier !== "all" && it.statusMargem !== filterTier) return false;
    if (search && !it.produto.toLowerCase().includes(search.toLowerCase()) && !it.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const criticalCount = items.filter(it => it.statusMargem === "Crítica").length;
  const adequateCount = items.filter(it => it.statusMargem === "Adequada").length;
  const excellentCount = items.filter(it => it.statusMargem === "Excelente").length;

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Analise_Margens_Rentabilidade", filtered);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Análise de Margens & Rentabilidade (Markup)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoramento de margem de contribuição individual, sensibilidade de custos e markups praticados.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Planilha</span>
        </button>
      </div>

      {/* Tier Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFilterTier(filterTier === "Crítica" ? "all" : "Crítica")}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            filterTier === "Crítica"
              ? "border-rose-400 bg-rose-50/50 dark:bg-rose-950/30"
              : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Margem Crítica (&lt; 15%)</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {criticalCount} <span className="text-xs font-normal text-slate-500 font-sans">itens faturados</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Produtos com retorno abaixo do custo de capital</div>
        </button>

        <button
          onClick={() => setFilterTier(filterTier === "Adequada" ? "all" : "Adequada")}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            filterTier === "Adequada"
              ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
              : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Margem Adequada (15% a 28%)</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {adequateCount} <span className="text-xs font-normal text-slate-500 font-sans">itens faturados</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Operação saudável dentro do orçamento</div>
        </button>

        <button
          onClick={() => setFilterTier(filterTier === "Excelente" ? "all" : "Excelente")}
          className={`p-3.5 rounded-lg border text-left transition-all ${
            filterTier === "Excelente"
              ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30"
              : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Margem Alta (&gt; 28%)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {excellentCount} <span className="text-xs font-normal text-slate-500 font-sans">itens faturados</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Produtos de alto valor agregado e especiais</div>
        </button>
      </div>

      {/* Margin analytical table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">SKU / Produto</th>
                <th className="px-3 py-2.5">Grupo</th>
                <th className="px-3 py-2.5 text-center">Unidade</th>
                <th className="px-3 py-2.5 text-right">Qtd.</th>
                <th className="px-3 py-2.5 text-right">Preço Médio</th>
                <th className="px-3 py-2.5 text-right">Total Vendido</th>
                <th className="px-3 py-2.5 text-right">Custo Total</th>
                <th className="px-3 py-2.5 text-right">Lucro Bruto</th>
                <th className="px-3 py-2.5 text-right">Markup %</th>
                <th className="px-3 py-2.5 text-right">Margem %</th>
                <th className="px-3 py-2.5 text-center">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-sans">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{item.produto}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-600 dark:text-slate-400">{item.grupo}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-slate-500">{item.und}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{BusinessFormulas.formatNumber(item.quantidade)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {BusinessFormulas.formatCurrency(item.precoMedioUnitario)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {BusinessFormulas.formatCurrency(item.totalVendido)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    {BusinessFormulas.formatCurrency(item.custoTotal)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    {BusinessFormulas.formatCurrency(item.valorLucro)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {item.markup.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums">
                    <span className={item.margemPct < 15 ? "text-rose-600" : item.margemPct < 28 ? "text-blue-600" : "text-emerald-600"}>
                      {item.margemPct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.statusMargem === "Crítica"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : item.statusMargem === "Adequada"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}>
                      {item.statusMargem}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
