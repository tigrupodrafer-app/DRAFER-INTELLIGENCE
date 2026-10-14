import React, { useEffect, useState, useMemo } from "react";
import { useFilters } from "../../context/FilterContext";
import { useAuth } from "../../context/AuthContext";
import {
  dataProvider,
  BusinessFormulas,
  ExportService,
} from "../../services";
import {
  SalesItem34,
  SALES_FIELD_DEFINITIONS,
  FieldDefinition,
} from "../../types/sales34Fields";
import {
  Search,
  Download,
  SlidersHorizontal,
  RotateCcw,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  Check,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";

interface SalesByProductViewProps {
  onOpenFormulaModal: () => void;
}

type GroupByOption = "none" | "NOVO_GRUPO" | "Nome Cliente" | "NOME_EMPRESA" | "Nome Vendedor";

export const SalesByProductView: React.FC<SalesByProductViewProps> = ({ onOpenFormulaModal }) => {
  const { filters } = useFilters();
  const { isSensitiveDataMasked } = useAuth();
  const [items, setItems] = useState<SalesItem34[]>([]);
  const [loading, setLoading] = useState(true);

  // Column visibility state
  const [columns, setColumns] = useState<FieldDefinition[]>(SALES_FIELD_DEFINITIONS);
  const [columnPickerOpen, setColumnPickerOpen] = useState(false);

  // Grouping & Sorting
  const [groupBy, setGroupBy] = useState<GroupByOption>("none");
  const [sortField, setSortField] = useState<keyof SalesItem34>("Valor Total");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Local search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Toast / notification feedback
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getSalesItems(filters).then(data => {
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  // Handle column visibility toggling
  const toggleColumn = (key: keyof SalesItem34) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, defaultVisible: !col.defaultVisible } : col))
    );
  };

  const showAllColumns = () => {
    setColumns(prev => prev.map(c => ({ ...c, defaultVisible: true })));
  };

  const restoreDefaultColumns = () => {
    setColumns(SALES_FIELD_DEFINITIONS);
    setGroupBy("none");
    setSortField("Valor Total");
    setSortDirection("desc");
    showNotification("Visualização restaurada para os padrões originais.");
  };

  // Filter & Search
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        item["Nome do Produto"].toLowerCase().includes(q) ||
        item["Código do Produto"].toLowerCase().includes(q) ||
        item["Nome Cliente"].toLowerCase().includes(q) ||
        item["Número documentos"].toLowerCase().includes(q) ||
        item.NOVO_GRUPO.toLowerCase().includes(q) ||
        item["Nome Vendedor"].toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  // Sort
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredItems, sortField, sortDirection]);

  // Derived Indicators for the whole selection
  const totalValorTotal = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Valor Total"], 0), [sortedItems]);
  const totalVendido = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Total Vendido"], 0), [sortedItems]);
  const totalCusto = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Custo Total"], 0), [sortedItems]);
  const totalLucro = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Valor Lucro"], 0), [sortedItems]);
  const totalKg = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Quantidade Kg"], 0), [sortedItems]);
  const totalPecas = useMemo(() => sortedItems.reduce((acc, it) => acc + it["Quantidade de peças"], 0), [sortedItems]);

  const globalMargemPct = totalVendido > 0 ? (totalLucro / totalVendido) * 100 : 0;
  const precoMedioKg = totalKg > 0 ? totalVendido / totalKg : 0;

  // Grouping logic
  const groupedData = useMemo(() => {
    if (groupBy === "none") return null;

    const groups = new Map<string, SalesItem34[]>();
    for (const item of sortedItems) {
      const keyVal = String(item[groupBy] || "Outros");
      if (!groups.has(keyVal)) {
        groups.set(keyVal, []);
      }
      groups.get(keyVal)!.push(item);
    }

    return Array.from(groups.entries()).map(([groupName, groupItems]) => {
      const subTotalValorTotal = groupItems.reduce((sum, i) => sum + i["Valor Total"], 0);
      const subTotalVendido = groupItems.reduce((sum, i) => sum + i["Total Vendido"], 0);
      const subTotalCusto = groupItems.reduce((sum, i) => sum + i["Custo Total"], 0);
      const subTotalLucro = groupItems.reduce((sum, i) => sum + i["Valor Lucro"], 0);
      const subTotalKg = groupItems.reduce((sum, i) => sum + i["Quantidade Kg"], 0);
      const subTotalPecas = groupItems.reduce((sum, i) => sum + i["Quantidade de peças"], 0);
      const subMargemPct = subTotalVendido > 0 ? (subTotalLucro / subTotalVendido) * 100 : 0;
      const sharePct = totalVendido > 0 ? (subTotalVendido / totalVendido) * 100 : 0;

      return {
        groupName,
        items: groupItems,
        subTotalValorTotal,
        subTotalVendido,
        subTotalCusto,
        subTotalLucro,
        subTotalKg,
        subTotalPecas,
        subMargemPct,
        sharePct,
      };
    });
  }, [sortedItems, groupBy, totalVendido]);

  // Visible columns
  const visibleColumns = columns.filter(c => c.defaultVisible);

  // Sorting trigger
  const handleSort = (fieldKey: keyof SalesItem34) => {
    if (sortField === fieldKey) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(fieldKey);
      setSortDirection("desc");
    }
  };

  // Export functions
  const handleExportCsv = () => {
    ExportService.exportToCsv(
      "DRAFER_Vendas_Por_Produto_34Campos",
      sortedItems,
      columns.map(c => ({ key: c.key, label: c.key }))
    );
    showNotification("Planilha CSV exportada com sucesso (codificação UTF-8 BOM).");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Vendas por Produto (34 Campos do ERP)
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Prioritário
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tabela analítica preservando fielmente os 34 campos nativos do banco Firebird 5.0 corporativo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Column Picker Modal Trigger */}
          <button
            onClick={() => setColumnPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Colunas ({visibleColumns.length}/34)</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs px-3 py-2 rounded-md animate-in fade-in duration-200">
          {notification}
        </div>
      )}

      {/* Derived Indicators Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Valor Total Faturado</div>
          <div className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCompactCurrency(totalValorTotal)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bruto c/ impostos</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Total Vendido Líquido</div>
          <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {BusinessFormulas.formatCompactCurrency(totalVendido)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Após descontos acordados</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Custo Total (CPV/CMV)</div>
          <div className="text-base font-bold font-mono text-slate-700 dark:text-slate-300 mt-1">
            {isSensitiveDataMasked() ? "••••••" : BusinessFormulas.formatCompactCurrency(totalCusto)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Custo apurado dos itens</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Valor Lucro (Contribuição)</div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {isSensitiveDataMasked() ? "••••••" : BusinessFormulas.formatCompactCurrency(totalLucro)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Total Vendido - Custo</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Margem de Lucro (%)</div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {isSensitiveDataMasked() ? "••••" : `${globalMargemPct.toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Rentabilidade bruta</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Preço Médio (Kg)</div>
          <div className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {BusinessFormulas.formatCurrency(precoMedioKg)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Respeitando unidade KG</div>
        </div>
      </div>

      {/* Control bar: Local search, Grouping, Reset */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Local quick search */}
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar SKU, produto, cliente, NF..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full placeholder:text-slate-400 text-xs"
            />
          </div>

          {/* Grouping selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Agrupar por:</span>
            <select
              value={groupBy}
              onChange={e => setGroupBy(e.target.value as GroupByOption)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="none">Nenhum (Tabela Analítica Plana)</option>
              <option value="NOVO_GRUPO">Grupo de Produto</option>
              <option value="Nome Cliente">Cliente</option>
              <option value="NOME_EMPRESA">Empresa / Filial</option>
              <option value="Nome Vendedor">Vendedor Titular</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Formula doc button */}
          <button
            onClick={onOpenFormulaModal}
            className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium transition-colors px-2 py-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Fórmulas e Regras</span>
          </button>

          {/* Restore default view */}
          <button
            onClick={restoreDefaultColumns}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Restaurar colunas e ordenação padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* Main Analytical Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[620px] relative">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {visibleColumns.map(col => {
                  const isSorted = sortField === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-3 py-2.5 whitespace-nowrap cursor-pointer select-none hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      <div className={`inline-flex items-center gap-1 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}>
                        <span>{col.label}</span>
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-2.5 h-2.5 text-slate-400 opacity-50" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {/* Grouped View with Subtotals */}
              {groupedData ? (
                groupedData.map((group, gIdx) => (
                  <React.Fragment key={gIdx}>
                    {/* Group Header Row */}
                    <tr className="bg-blue-50/70 dark:bg-blue-950/30 font-semibold border-t-2 border-blue-200 dark:border-blue-900">
                      <td colSpan={visibleColumns.length} className="px-3 py-2 text-blue-900 dark:text-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" />
                            {group.groupName} ({group.items.length} itens faturados)
                          </span>
                          <span className="font-mono text-xs">
                            Total Vendido: {BusinessFormulas.formatCurrency(group.subTotalVendido)} · Margem: {group.subMargemPct.toFixed(1)}% · Share: {group.sharePct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Group Rows */}
                    {group.items.map((row, rIdx) => (
                      <tr
                        key={row.id || rIdx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                      >
                        {visibleColumns.map(col => renderCell(row, col, isSensitiveDataMasked()))}
                      </tr>
                    ))}

                    {/* Group Subtotal Row */}
                    <tr className="bg-slate-100/60 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                      {visibleColumns.map((col, cIdx) => {
                        if (cIdx === 0) return <td key={col.key} className="px-3 py-2 text-left font-mono">Subtotal {group.groupName}:</td>;
                        if (col.key === "Valor Total") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums">{BusinessFormulas.formatCurrency(group.subTotalValorTotal)}</td>;
                        if (col.key === "Total Vendido") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums text-blue-600 dark:text-blue-400">{BusinessFormulas.formatCurrency(group.subTotalVendido)}</td>;
                        if (col.key === "Custo Total") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums">{isSensitiveDataMasked() ? "••••" : BusinessFormulas.formatCurrency(group.subTotalCusto)}</td>;
                        if (col.key === "Valor Lucro") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums text-emerald-600">{isSensitiveDataMasked() ? "••••" : BusinessFormulas.formatCurrency(group.subTotalLucro)}</td>;
                        if (col.key === "Quantidade Kg") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums">{BusinessFormulas.formatNumber(group.subTotalKg)} kg</td>;
                        if (col.key === "Quantidade de peças") return <td key={col.key} className="px-3 py-2 text-right font-mono tabular-nums">{group.subTotalPecas} pç</td>;
                        return <td key={col.key} className="px-3 py-2"></td>;
                      })}
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                /* Flat Table Rows */
                sortedItems.map((row, rIdx) => (
                  <tr
                    key={row.id || rIdx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                  >
                    {visibleColumns.map(col => renderCell(row, col, isSensitiveDataMasked()))}
                  </tr>
                ))
              )}

              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-4 py-8 text-center text-slate-500">
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Total Footer */}
            {sortedItems.length > 0 && (
              <tfoot className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-t-2 border-slate-300 dark:border-slate-700 sticky bottom-0">
                <tr>
                  {visibleColumns.map((col, idx) => {
                    if (idx === 0) return <td key={col.key} className="px-3 py-2.5 text-left font-mono">TOTAIS GERAIS:</td>;
                    if (col.key === "Valor Total") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums">{BusinessFormulas.formatCurrency(totalValorTotal)}</td>;
                    if (col.key === "Total Vendido") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums text-blue-600 dark:text-blue-400">{BusinessFormulas.formatCurrency(totalVendido)}</td>;
                    if (col.key === "Custo Total") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums">{isSensitiveDataMasked() ? "••••" : BusinessFormulas.formatCurrency(totalCusto)}</td>;
                    if (col.key === "Valor Lucro") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums text-emerald-600">{isSensitiveDataMasked() ? "••••" : BusinessFormulas.formatCurrency(totalLucro)}</td>;
                    if (col.key === "Quantidade Kg") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums">{BusinessFormulas.formatNumber(totalKg)} kg</td>;
                    if (col.key === "Quantidade de peças") return <td key={col.key} className="px-3 py-2.5 text-right font-mono tabular-nums">{totalPecas} pç</td>;
                    return <td key={col.key} className="px-3 py-2.5"></td>;
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Exibindo <span className="font-semibold text-slate-700 dark:text-slate-300">{sortedItems.length}</span> registros faturados · {visibleColumns.length} colunas ativas
          </div>
          <div className="flex items-center gap-3">
            <span>Nota: Quantidades com unidades distintas (KG vs PC vs MT) não são somadas indistintamente</span>
          </div>
        </div>
      </div>

      {/* Column Picker Modal */}
      {columnPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Gerenciador de Colunas (34 Campos do ERP)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selecione quais dos 34 campos originais do Firebird devem ser exibidos na tabela analítica.
                </p>
              </div>
              <button
                onClick={() => setColumnPickerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  {visibleColumns.length} de 34 colunas selecionadas
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={showAllColumns}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Selecionar Todas
                  </button>
                  <span>·</span>
                  <button
                    onClick={restoreDefaultColumns}
                    className="text-xs text-slate-500 hover:underline font-medium"
                  >
                    Restaurar Padrão (13)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {columns.map(col => (
                  <label
                    key={col.key}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      col.defaultVisible
                        ? "border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-slate-100"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={col.defaultVisible}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="truncate">
                      <div className="font-medium truncate">{col.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{col.key}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center text-xs">
              <span className="text-slate-500">Configuração salva no estado da sessão</span>
              <button
                onClick={() => setColumnPickerOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-xs shadow-xs"
              >
                Aplicar e Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to render cell with formatting based on field definition
function renderCell(row: SalesItem34, col: FieldDefinition, isMasked: boolean) {
  const rawVal = row[col.key];

  let formatted = String(rawVal ?? "-");

  if (col.type === "currency") {
    if (isMasked && (col.key === "Custo Total" || col.key === "Valor Lucro")) {
      formatted = "••••••";
    } else {
      formatted = BusinessFormulas.formatCurrency(Number(rawVal));
    }
  } else if (col.type === "number") {
    formatted = BusinessFormulas.formatNumber(Number(rawVal));
    if (col.unit) formatted += ` ${col.unit}`;
  } else if (col.type === "date") {
    formatted = BusinessFormulas.formatDate(String(rawVal));
  }

  // Badges & semantics
  if (col.key === "Classificacao") {
    return (
      <td key={col.key} className="px-3 py-2 whitespace-nowrap text-center">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
            rawVal === "Curva A"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              : rawVal === "Curva B"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {formatted}
        </span>
      </td>
    );
  }

  if (col.key === "UND") {
    return (
      <td key={col.key} className="px-3 py-2 whitespace-nowrap text-center">
        <span className="font-mono font-semibold text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
          {formatted}
        </span>
      </td>
    );
  }

  const isNumeric = col.type === "currency" || col.type === "number";

  return (
    <td
      key={col.key}
      className={`px-3 py-2 whitespace-nowrap ${
        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
      } ${isNumeric ? "font-mono tabular-nums" : ""}`}
    >
      {formatted}
    </td>
  );
}
