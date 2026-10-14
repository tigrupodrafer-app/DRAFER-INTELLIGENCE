import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { CashFlowDay } from "../../types";
import { Wallet, Download, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";

export const CashFlowView: React.FC = () => {
  const { filters } = useFilters();
  const [days, setDays] = useState<CashFlowDay[]>([]);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getCashFlow(filters, timeframe).then(res => {
      if (mounted) {
        setDays(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters, timeframe]);

  const initialBalance = days.length > 0 ? days[0].saldoInicial : 1248500;
  const currentBalance = days.find(d => d.saldoFinal > 0)?.saldoFinal || 1320000;
  const projectedEndBalance = days.length > 0 ? days[days.length - 1].saldoProjetado : 1450000;

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Fluxo_De_Caixa", days);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Fluxo de Caixa Realizado & Projetado
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conciliação de saldos diários, entradas e saídas efetivadas versus previsões financeiras.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Fluxo</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Saldo Inicial do Mês (01/10)</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCurrency(initialBalance)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disponibilidade em contas bancárias</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Saldo Atual Conciliado</div>
          <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {BusinessFormulas.formatCurrency(currentBalance)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Operações realizadas até hoje</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Saldo Projetado em 30 Dias</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {BusinessFormulas.formatCurrency(projectedEndBalance)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Com base nos títulos a vencer</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2.5">Data</th>
                <th className="px-3 py-2.5 text-right">Saldo Inicial</th>
                <th className="px-3 py-2.5 text-right text-emerald-700 dark:text-emerald-400">Entradas Realiz.</th>
                <th className="px-3 py-2.5 text-right text-rose-700 dark:text-rose-400">Saídas Realiz.</th>
                <th className="px-3 py-2.5 text-right text-emerald-600">Entradas Prev.</th>
                <th className="px-3 py-2.5 text-right text-rose-600">Saídas Prev.</th>
                <th className="px-3 py-2.5 text-right">Saldo Final / Proj.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {days.map((d, idx) => {
                const isRealized = d.saldoFinal > 0;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isRealized ? "" : "bg-blue-50/20 dark:bg-blue-950/10 italic"
                    }`}
                  >
                    <td className="px-3 py-2 font-sans font-medium text-slate-800 dark:text-slate-200">
                      {BusinessFormulas.formatDate(d.data)}
                      {!isRealized && <span className="ml-1.5 text-[9px] text-blue-500 font-bold not-italic font-mono">(Previsto)</span>}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                      {BusinessFormulas.formatCurrency(d.saldoInicial)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-600 font-semibold">
                      {d.entradasRealizadas > 0 ? BusinessFormulas.formatCurrency(d.entradasRealizadas) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-rose-600 font-semibold">
                      {d.saidasRealizadas > 0 ? BusinessFormulas.formatCurrency(d.saidasRealizadas) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-500">
                      {d.entradasPrevistas > 0 ? BusinessFormulas.formatCurrency(d.entradasPrevistas) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-rose-500">
                      {d.saidasPrevistas > 0 ? BusinessFormulas.formatCurrency(d.saidasPrevistas) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {BusinessFormulas.formatCurrency(isRealized ? d.saldoFinal : d.saldoProjetado)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
