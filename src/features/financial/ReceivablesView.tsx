import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { ReceivableItem, FinancialStatus } from "../../types";
import {
  Wallet,
  Download,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  History,
  X,
  PlusCircle,
} from "lucide-react";

export const ReceivablesView: React.FC = () => {
  const { filters } = useFilters();
  const [items, setItems] = useState<ReceivableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItemHistory, setSelectedItemHistory] = useState<ReceivableItem | null>(null);

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

  const filtered = items.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.cliente.toLowerCase().includes(q) && !r.numeroTitulo.toLowerCase().includes(q) && !r.documentoOrigem.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalEmAberto = filtered.reduce((acc, r) => acc + r.saldoEmAberto, 0);
  const totalVencido = filtered.filter(r => r.status === "Vencido").reduce((acc, r) => acc + r.saldoEmAberto, 0);
  const totalAVencer = filtered.filter(r => r.status === "Em aberto" || r.status === "Parcialmente recebido").reduce((acc, r) => acc + r.saldoEmAberto, 0);
  const defaultRatePct = totalEmAberto > 0 ? (totalVencido / totalEmAberto) * 100 : 0;

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Contas_A_Receber", filtered);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Contas a Receber & Gestão de Crédito
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Controle de duplicatas, liquidações parciais, aging de títulos e régua de cobrança.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Títulos</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Saldo Total a Receber</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCurrency(totalEmAberto)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{filtered.length} títulos ativos</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">A Vencer (Adimplente)</div>
          <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {BusinessFormulas.formatCurrency(totalAVencer)}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Dentro do prazo contratual</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Valores Vencidos</div>
          <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {BusinessFormulas.formatCurrency(totalVencido)}
          </div>
          <div className="text-[10px] text-rose-500 font-semibold mt-0.5">Exige ação de cobrança</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Índice de Inadimplência</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {defaultRatePct.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Meta corporativa: &lt; 2.5%</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar cliente, NF ou título..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full placeholder:text-slate-400 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="Em aberto">Em aberto</option>
              <option value="Parcialmente recebido">Parcialmente recebido</option>
              <option value="Recebido">Recebido</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">Cliente / Documento</th>
                <th className="px-3 py-2.5">Empresa</th>
                <th className="px-3 py-2.5">Título / Parcela</th>
                <th className="px-3 py-2.5 text-center">Emissão</th>
                <th className="px-3 py-2.5 text-center">Vencimento</th>
                <th className="px-3 py-2.5 text-right">Valor Original</th>
                <th className="px-3 py-2.5 text-right">Valor Recebido</th>
                <th className="px-3 py-2.5 text-right">Juros/Multa</th>
                <th className="px-3 py-2.5 text-right">Saldo em Aberto</th>
                <th className="px-3 py-2.5 text-center">Status</th>
                <th className="px-3 py-2.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-sans">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{r.cliente}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Doc: {r.documentoOrigem} · {r.cnpjCpf}</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-600 dark:text-slate-400">
                    {r.empresa}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{r.numeroTitulo}</div>
                    <div className="text-[10px] text-slate-400">Parc. {r.numeroParcela}</div>
                  </td>
                  <td className="px-3 py-2.5 text-center tabular-nums text-slate-600 dark:text-slate-400">
                    {BusinessFormulas.formatDate(r.emissao)}
                  </td>
                  <td className="px-3 py-2.5 text-center tabular-nums">
                    <span className={r.status === "Vencido" ? "text-rose-600 font-bold" : "text-slate-700 dark:text-slate-300"}>
                      {BusinessFormulas.formatDate(r.vencimento)}
                    </span>
                    {r.diasAtraso > 0 && (
                      <div className="text-[10px] text-rose-500 font-sans">({r.diasAtraso}d atraso)</div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {BusinessFormulas.formatCurrency(r.valorOriginal)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                    {BusinessFormulas.formatCurrency(r.valorRecebido)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-500">
                    {r.juros + r.multas > 0 ? BusinessFormulas.formatCurrency(r.juros + r.multas) : "-"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {BusinessFormulas.formatCurrency(r.saldoEmAberto)}
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      r.status === "Recebido"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : r.status === "Vencido"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : r.status === "Parcialmente recebido"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    {r.historicoLiquidacoes && r.historicoLiquidacoes.length > 0 ? (
                      <button
                        onClick={() => setSelectedItemHistory(r)}
                        className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium text-[11px] underline flex items-center gap-1 mx-auto"
                      >
                        <History className="w-3 h-3" />
                        Histórico ({r.historicoLiquidacoes.length})
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Sem baixas</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Liquidation History Modal */}
      {selectedItemHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Histórico de Liquidações e Baixas
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  Título {selectedItemHistory.numeroTitulo} · {selectedItemHistory.cliente}
                </div>
              </div>
              <button
                onClick={() => setSelectedItemHistory(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4 text-xs font-mono">
              {selectedItemHistory.historicoLiquidacoes?.map((liq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {BusinessFormulas.formatCurrency(liq.valor)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">{liq.forma} · {liq.banco}</div>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {BusinessFormulas.formatDate(liq.data)}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedItemHistory(null)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md font-medium text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
