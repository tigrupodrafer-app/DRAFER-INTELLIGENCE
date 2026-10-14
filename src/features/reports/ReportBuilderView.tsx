import React, { useEffect, useState, useMemo } from "react";
import { dataProvider, BusinessFormulas, ExportService } from "../../services";
import {
  DataSourceType,
  ReportFieldCatalogItem,
  ReportFilterRule,
  ReportColumnConfig,
  SavedReportModel,
} from "../../types/reports";
import {
  Sliders,
  Play,
  Save,
  Download,
  Plus,
  Trash2,
  Layers,
  ArrowUpDown,
  CheckCircle2,
  Database,
  Share2,
} from "lucide-react";

export const ReportBuilderView: React.FC = () => {
  const [catalog, setCatalog] = useState<ReportFieldCatalogItem[]>([]);
  const [selectedSource, setSelectedSource] = useState<DataSourceType>("sales");
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([
    "nome_prod",
    "grupo",
    "total_vendido",
    "custo_total",
    "valor_lucro",
    "qtd_kg"
  ]);

  const [filters, setFilters] = useState<ReportFilterRule[]>([]);
  const [groupBy, setGroupBy] = useState<string>("grupo");
  const [sortBy, setSortBy] = useState<{ field: string; direction: "asc" | "desc" }>({
    field: "total_vendido",
    direction: "desc",
  });

  const [reportTitle, setReportTitle] = useState("Novo Relatório Customizado");
  const [reportDescription, setReportDescription] = useState("Modelo construído interativamente via DRAFER Intelligence Builder.");
  const [isShared, setIsShared] = useState(true);

  // Preview data
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dataProvider.getFieldCatalog().then(res => setCatalog(res));
  }, []);

  // Filter catalog by selected source
  const availableFields = useMemo(() => {
    return catalog.filter(f => f.source === selectedSource);
  }, [catalog, selectedSource]);

  // Execute preview
  const handleRunPreview = async () => {
    setLoadingPreview(true);
    let rawItems: any[] = [];
    if (selectedSource === "sales") {
      rawItems = await dataProvider.getSalesItems({
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        companyId: "all",
        group: "all",
        subGroup: "all",
        clientId: "all",
        repId: "all",
        searchQuery: "",
      });
    } else if (selectedSource === "receivables") {
      rawItems = await dataProvider.getReceivables({} as any);
    } else {
      rawItems = await dataProvider.getPayables({} as any);
    }

    setPreviewData(rawItems.slice(0, 20));
    setLoadingPreview(false);
  };

  useEffect(() => {
    handleRunPreview();
  }, [selectedSource]);

  const toggleField = (fieldId: string) => {
    if (selectedFieldIds.includes(fieldId)) {
      if (selectedFieldIds.length > 1) {
        setSelectedFieldIds(prev => prev.filter(id => id !== fieldId));
      }
    } else {
      setSelectedFieldIds(prev => [...prev, fieldId]);
    }
  };

  const handleAddFilter = () => {
    const firstField = availableFields[0]?.id || "nome_prod";
    setFilters(prev => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        field: firstField,
        operator: "contains",
        value: "",
      },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleSaveReport = async () => {
    const newReport: SavedReportModel = {
      id: `REP-${Date.now()}`,
      title: reportTitle,
      description: reportDescription,
      dataSource: selectedSource,
      selectedFields: selectedFieldIds,
      columnsConfig: selectedFieldIds.map(fId => {
        const cat = catalog.find(c => c.id === fId);
        return {
          field: cat?.name || fId,
          label: cat?.label || fId,
          aggregation: cat?.allowedAggregations.includes("sum") ? "sum" : "none",
        };
      }),
      filters,
      groupBy: groupBy === "none" ? undefined : groupBy,
      sortBy,
      isShared,
      createdBy: "Carlos Eduardo Schneider",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      tags: ["Personalizado", selectedSource],
    };

    await dataProvider.saveReport(newReport);
    setSaveSuccessMsg(`Relatório "${reportTitle}" salvo com sucesso no catálogo de Relatórios Salvos!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleExportPreview = () => {
    ExportService.exportToCsv(`DRAFER_Relatorio_${selectedSource}`, previewData);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Construtor Dinâmico de Relatórios
            </h1>
            <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
              Visual Query Designer
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Crie relatórios corporativos combinando fontes de dados, catálogo de campos, agregações e filtros combinados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-md text-xs font-medium transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-blue-600" />
            <span>Executar Consulta</span>
          </button>

          <button
            onClick={handleSaveReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Modelo</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs px-3 py-2 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Step 1: Data Source & Metadata */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span>Fonte de Dados & Identificação</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Fonte Primária do ERP
            </label>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value as DataSourceType)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="sales">Vendas Analíticas (Faturamento de Itens)</option>
              <option value="receivables">Contas a Receber (Duplicatas & Títulos)</option>
              <option value="payables">Contas a Pagar (Obrigações & Fornecedores)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Nome do Relatório
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Descrição do Modelo
            </label>
            <textarea
              rows={2}
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isShared}
              onChange={e => setIsShared(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-slate-400" />
              Compartilhar com outros usuários do grupo
            </span>
          </label>
        </div>

        {/* Step 2: Field Catalog Picker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Catálogo de Campos Disponíveis ({selectedFieldIds.length} ativos)</span>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {availableFields.map(field => {
              const isSelected = selectedFieldIds.includes(field.id);
              return (
                <div
                  key={field.id}
                  onClick={() => toggleField(field.id)}
                  className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? "border-blue-300 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div>
                    <div className="font-semibold">{field.label}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{field.description}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
                      {field.dataType}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Combined Filters & Grouping */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Filtros & Agrupamentos</span>
            </div>
            <button
              onClick={handleAddFilter}
              className="text-blue-600 hover:text-blue-800 text-[11px] font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Adicionar Filtro
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Agrupamento (Subtotais)
              </label>
              <select
                value={groupBy}
                onChange={e => setGroupBy(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="none">Sem agrupamento</option>
                {availableFields.filter(f => f.isGroupable).map(f => (
                  <option key={f.id} value={f.name}>
                    Agrupar por {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic filter list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {filters.map(filt => (
                <div key={filt.id} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-xs">
                  <select
                    value={filt.field}
                    onChange={e => {
                      const val = e.target.value;
                      setFilters(prev => prev.map(f => f.id === filt.id ? { ...f, field: val } : f));
                    }}
                    className="bg-transparent font-medium text-slate-800 dark:text-slate-200 w-28 text-[11px] focus:outline-none"
                  >
                    {availableFields.filter(f => f.isFilterable).map(f => (
                      <option key={f.id} value={f.name}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    value={filt.operator}
                    onChange={e => {
                      const val = e.target.value as any;
                      setFilters(prev => prev.map(f => f.id === filt.id ? { ...f, operator: val } : f));
                    }}
                    className="bg-transparent text-slate-600 dark:text-slate-400 text-[11px] focus:outline-none"
                  >
                    <option value="equals">Igual a</option>
                    <option value="contains">Contém</option>
                    <option value="greaterThan">Maior que</option>
                    <option value="lessThan">Menor que</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Valor..."
                    value={String(filt.value)}
                    onChange={e => {
                      const val = e.target.value;
                      setFilters(prev => prev.map(f => f.id === filt.id ? { ...f, value: val } : f));
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[11px] flex-1 focus:outline-none"
                  />

                  <button
                    onClick={() => handleRemoveFilter(filt.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {filters.length === 0 && (
                <div className="text-[11px] text-slate-400 italic py-1">
                  Nenhum filtro condicional aplicado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pré-visualização dos Resultados ({previewData.length} registros simulados)
            </h3>
          </div>
          <button
            onClick={handleExportPreview}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Esta Visão</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                {selectedFieldIds.map(fId => {
                  const cat = catalog.find(c => c.id === fId);
                  return (
                    <th key={fId} className="px-3 py-2.5 whitespace-nowrap">
                      {cat?.label || fId}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {previewData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  {selectedFieldIds.map(fId => {
                    const cat = catalog.find(c => c.id === fId);
                    const rawVal = row[cat?.name || fId];
                    const isCurrency = cat?.dataType === "currency";
                    const isNumber = cat?.dataType === "number";

                    return (
                      <td
                        key={fId}
                        className={`px-3 py-2 whitespace-nowrap ${
                          isCurrency || isNumber ? "text-right tabular-nums" : "font-sans"
                        }`}
                      >
                        {isCurrency
                          ? BusinessFormulas.formatCurrency(Number(rawVal))
                          : isNumber
                          ? BusinessFormulas.formatNumber(Number(rawVal))
                          : String(rawVal ?? "-")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
