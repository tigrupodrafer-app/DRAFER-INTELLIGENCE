import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { PayableItem, PayableStatus } from "../../types";
import { Receipt, Download, Search, AlertCircle, Building2, Tag } from "lucide-react";

export const PayablesView: React.FC = () => {
  const { filters } = useFilters();
  const [items, setItems] = useState<PayableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getPayables(filters).then(res => {
      if (mounted) {
        setItems(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const filtered = items.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.fornecedor.toLowerCase().includes(q) && !p.numeroTitulo.toLowerCase().includes(q) && !p.categoriaFinanceira.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const totalPendente = filtered.reduce((acc, p) => acc + p.saldoPendente, 0);
  const totalPago = filtered.reduce((acc, p) => acc + p.valorPago, 0);
  const totalVencido = filtered.filter(p => p.status === "Vencido").reduce((acc, p) => acc + p.saldoPendente, 0);

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Contas_A_Pagar", filtered);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Contas a Pagar & Gestão de Fornecedores
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Obrigações operacionais, centros de custo, categorias financeiras e programação de desembolso.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Obrigações</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Total de Obrigações Pendentes</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCurrency(totalPendente)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{filtered.length} títulos programados</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Total Liquidado no Período</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {BusinessFormulas.formatCurrency(totalPago)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Pagamentos efetuados</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Títulos Vencidos a Pagar</div>
          <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {BusinessFormulas.formatCurrency(totalVencido)}
          </div>
          <div className="text-[10px] text-rose-500 font-semibold mt-0.5">Prioridade de tesouraria</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Prazo Médio Pagamento (PMP)</div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            42 dias
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Condição média com siderúrgicas</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar fornecedor, categoria, centro de custo..."
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
              <option value="Pago">Pago</option>
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
                <th className="px-3 py-2.5">Fornecedor / Razão Social</th>
                <th className="px-3 py-2.5">Empresa</th>
                <th className="px-3 py-2.5">Documento / Título</th>
                <th className="px-3 py-2.5">Categoria Financeira</th>
                <th className="px-3 py-2.5">Centro de Custo</th>
                <th className="px-3 py-2.5 text-center">Vencimento</th>
                <th className="px-3 py-2.5 text-right">Valor Original</th>
                <th className="px-3 py-2.5 text-right">Valor Pago</th>
                <th className="px-3 py-2.5 text-right">Saldo Pendente</th>
                <th className="px-3 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 font-sans">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.fornecedor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.cnpjCpf}</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-600 dark:text-slate-400">
                    {p.empresa}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{p.numeroTitulo}</div>
                    <div className="text-[10px] text-slate-400 font-sans">Doc: {p.documentoOrigem} (Parc. {p.parcela})</div>
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-700 dark:text-slate-300">
                    {p.categoriaFinanceira}
                  </td>
                  <td className="px-3 py-2.5 font-sans text-slate-500">
                    {p.centroCusto}
                  </td>
                  <td className="px-3 py-2.5 text-center tabular-nums">
                    <span className={p.status === "Vencido" ? "text-rose-600 font-bold" : "text-slate-700 dark:text-slate-300"}>
                      {BusinessFormulas.formatDate(p.vencimento)}
                    </span>
                    {p.diasAtraso > 0 && (
                      <div className="text-[10px] text-rose-500 font-sans">({p.diasAtraso}d atraso)</div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {BusinessFormulas.formatCurrency(p.valorOriginal)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                    {BusinessFormulas.formatCurrency(p.valorPago)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {BusinessFormulas.formatCurrency(p.saldoPendente)}
                  </td>
                  <td className="px-3 py-2.5 text-center font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.status === "Pago"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : p.status === "Vencido"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}>
                      {p.status}
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
