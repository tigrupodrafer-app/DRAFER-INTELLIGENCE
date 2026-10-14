import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import { Building2, Download, TrendingUp } from "lucide-react";

export const SalesByCompanyView: React.FC = () => {
  const { filters } = useFilters();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getSalesByCompany(filters).then(res => {
      if (mounted) {
        setCompanies(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  const handleExport = () => {
    ExportService.exportToCsv("DRAFER_Vendas_Por_Empresa", companies);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Vendas por Empresa (Filiais do Grupo Drafer)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comparativo de faturamento, rentabilidade e notas emitidas por filial.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {companies.map((c, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-900">
                  {c.cod}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[170px]">{c.empresa}</div>
                  <div className="text-[10px] text-slate-400">Filial {c.cod}</div>
                </div>
              </div>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Faturamento:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{BusinessFormulas.formatCurrency(c.totalVendido)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Lucro Bruto:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{BusinessFormulas.formatCurrency(c.valorLucro)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Margem:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{c.margemPct.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Volume:</span>
                <span className="text-slate-600 dark:text-slate-400">{BusinessFormulas.formatNumber(c.pesoKg)} kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
