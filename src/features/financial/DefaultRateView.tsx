import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { AlertTriangle, Download, ShieldAlert, CheckCircle2, UserX } from "lucide-react";
import { ReceivableItem } from "../../types";

export const DefaultRateView: React.FC = () => {
  const { filters } = useFilters();
  const [items, setItems] = useState<ReceivableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getReceivables(filters).then(res => {
      if (mounted) {
        setItems(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const overdueItems = items.filter(r => r.status === "Vencido");
  const totalCarteira = items.reduce((acc, r) => acc + r.saldoEmAberto, 0);
  const totalVencido = overdueItems.reduce((acc, r) => acc + r.saldoEmAberto, 0);
  const defaultRatePct = totalCarteira > 0 ? (totalVencido / totalCarteira) * 100 : 0;

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Inadimplencia_Titulos_Vencidos", overdueItems);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Gestão de Inadimplência & Títulos Críticos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoramento de títulos vencidos, cálculo de juros e multas contratuais e priorização de cobrança.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Vencidos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Índice Global de Inadimplência</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {defaultRatePct.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Títulos vencidos / Carteira total</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Montante em Atraso</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCurrency(totalVencido)}
          </div>
          <div className="text-[10px] text-rose-500 mt-0.5 font-semibold">{overdueItems.length} duplicatas vencidas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Encargos Calculados (Juros + Multas)</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {BusinessFormulas.formatCurrency(overdueItems.reduce((acc, r) => acc + r.juros + r.multas, 0))}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Atualização financeira diária</div>
        </div>
      </div>

      {/* Overdue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">Cliente Inadimplente</th>
                <th className="px-3 py-2.5">Empresa</th>
                <th className="px-3 py-2.5">Título / NF</th>
                <th className="px-3 py-2.5 text-center">Vencimento</th>
                <th className="px-3 py-2.5 text-center">Dias Atraso</th>
                <th className="px-3 py-2.5 text-right">Valor Original</th>
                <th className="px-3 py-2.5 text-right">Juros + Multa</th>
                <th className="px-3 py-2.5 text-right">Saldo Atualizado</th>
                <th className="px-3 py-2.5 text-center">Faixa Aging</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {overdueItems.map(r => (
                <tr key={r.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors">
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-900 dark:text-slate-100">
                    <div>{r.cliente}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.cnpjCpf}</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-600 dark:text-slate-400">{r.empresa}</td>
                  <td className="px-3 py-2.5 font-sans">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{r.numeroTitulo}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({r.documentoOrigem})</span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-rose-600 font-bold tabular-nums">
                    {BusinessFormulas.formatDate(r.vencimento)}
                  </td>
                  <td className="px-3 py-2.5 text-center tabular-nums font-bold text-rose-600">
                    {r.diasAtraso} dias
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {BusinessFormulas.formatCurrency(r.valorOriginal)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-amber-600 font-semibold">
                    +{BusinessFormulas.formatCurrency(r.juros + r.multas)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-rose-600 dark:text-rose-400">
                    {BusinessFormulas.formatCurrency(r.saldoEmAberto)}
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                      {r.faixaAging}
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
