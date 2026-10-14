import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { Search, Download, ShieldAlert, Award, ArrowUpDown } from "lucide-react";

export const SalesByClientView: React.FC = () => {
  const { filters } = useFilters();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getSalesByClient(filters).then(res => {
      if (mounted) {
        setClients(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const filtered = clients.filter(c =>
    c.cliente.toLowerCase().includes(search.toLowerCase()) ||
    c.cidade.toLowerCase().includes(search.toLowerCase()) ||
    c.estado.toLowerCase().includes(search.toLowerCase())
  );

  const totalFat = clients.reduce((acc, c) => acc + c.totalVendido, 0);

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Vendas_Por_Cliente_ABC", filtered);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Vendas por Cliente (Curva ABC & Crédito)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Classificação Pareto, representatividade na receita e monitoramento de risco cadastral.
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

      {/* Search and stats bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Pesquisar cliente ou município..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full placeholder:text-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-500">Carteira: {filtered.length} clientes faturados</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">Total: {BusinessFormulas.formatCurrency(totalFat)}</span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">Razão Social do Cliente</th>
                <th className="px-3 py-2.5 text-center">Curva ABC</th>
                <th className="px-3 py-2.5">Localização</th>
                <th className="px-3 py-2.5 text-center">Risco de Crédito</th>
                <th className="px-3 py-2.5 text-right">Pedidos</th>
                <th className="px-3 py-2.5 text-right">Volume (Kg)</th>
                <th className="px-3 py-2.5 text-right">Faturamento Total</th>
                <th className="px-3 py-2.5 text-right">Lucro Bruto</th>
                <th className="px-3 py-2.5 text-right">Margem %</th>
                <th className="px-3 py-2.5 text-right">Share %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((c, idx) => {
                const share = totalFat > 0 ? (c.totalVendido / totalFat) * 100 : 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                      <div>{c.cliente}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.cnpj}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.curvaAbc === "Curva A"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : c.curvaAbc === "Curva B"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        {c.curvaAbc}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                      {c.cidade} / {c.estado}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {c.riscoCredito}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums">{c.pedidosCount}</td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums">{BusinessFormulas.formatNumber(c.pesoTotalKg)} kg</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {BusinessFormulas.formatCurrency(c.totalVendido)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {BusinessFormulas.formatCurrency(c.valorLucro)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {c.margemPct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-500">
                      {share.toFixed(1)}%
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
