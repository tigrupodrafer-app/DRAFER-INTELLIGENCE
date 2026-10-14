import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { Award, Target, TrendingUp, Download, UserCheck } from "lucide-react";

export const SalesByRepView: React.FC = () => {
  const { filters } = useFilters();
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getSalesByRep(filters).then(res => {
      if (mounted) {
        setReps(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Vendas_Por_Vendedor", reps);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Vendas por Vendedor (Desempenho Comercial)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acompanhamento de metas de faturamento, margem média praticada e carteira de clientes ativos.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Rep Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reps.map((r, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                  {idx + 1}º
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{r.vendedor}</div>
                  <div className="text-[10px] text-slate-400">{r.clientesAtivos} clientes ativos</div>
                </div>
              </div>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Total Faturado:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{BusinessFormulas.formatCurrency(r.totalVendido)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Lucro Gerado:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{BusinessFormulas.formatCurrency(r.valorLucro)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Margem Média:</span>
                <span className="font-semibold">{r.margemPct.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Ticket Médio:</span>
                <span className="text-slate-700 dark:text-slate-300">{BusinessFormulas.formatCurrency(r.ticketMedio)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">Representante Comercial</th>
                <th className="px-3 py-2.5 text-right">Pedidos Faturados</th>
                <th className="px-3 py-2.5 text-right">Clientes Ativos</th>
                <th className="px-3 py-2.5 text-right">Volume (Kg)</th>
                <th className="px-3 py-2.5 text-right">Total Faturado</th>
                <th className="px-3 py-2.5 text-right">Lucro Bruto</th>
                <th className="px-3 py-2.5 text-right">Margem Média %</th>
                <th className="px-3 py-2.5 text-right">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {reps.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    {r.vendedor}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.pedidos}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.clientesAtivos}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{BusinessFormulas.formatNumber(r.pesoKg)} kg</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {BusinessFormulas.formatCurrency(r.totalVendido)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                    {BusinessFormulas.formatCurrency(r.valorLucro)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {r.margemPct.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-400">
                    {BusinessFormulas.formatCurrency(r.ticketMedio)}
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
