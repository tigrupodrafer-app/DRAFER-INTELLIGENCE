import React from "react";
import { useFilters } from "../../context/FilterContext";
import { Filter, RotateCcw, Calendar, Building2, Layers, Search, User } from "lucide-react";
import { MOCK_COMPANIES } from "../../services/mockDataProvider";

export const GlobalFilterBar: React.FC = () => {
  const { filters, updateFilter, resetFilters, datePreset, setDatePreset } = useFilters();

  const isFiltered =
    filters.companyId !== "all" ||
    filters.group !== "all" ||
    filters.repId !== "all" ||
    filters.searchQuery !== "" ||
    datePreset !== "Este Mês (Out/24)";

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        {/* Enterprise Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Empresa:</span>
          <select
            value={filters.companyId}
            onChange={e => updateFilter("companyId", e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Todas as Filiais (Consolidado)</option>
            {MOCK_COMPANIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Preset */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Período:</span>
          <select
            value={datePreset}
            onChange={e => setDatePreset(e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Este Mês (Out/24)">Outubro / 2024 (Atual)</option>
            <option value="Mês Anterior (Set/24)">Setembro / 2024</option>
            <option value="Últimos 90 Dias">Últimos 90 Dias (Ago-Out)</option>
            <option value="Ano 2024">Ano Completo 2024</option>
          </select>
        </div>

        {/* Product Group */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Grupo:</span>
          <select
            value={filters.group}
            onChange={e => updateFilter("group", e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Grupos</option>
            <option value="Tubos Industriais">Tubos Industriais</option>
            <option value="Perfis Estruturais">Perfis Estruturais</option>
            <option value="Chapas Laminadas">Chapas Laminadas</option>
            <option value="Válvulas Industriais">Válvulas Industriais</option>
            <option value="Conexões Forjadas">Conexões Forjadas</option>
            <option value="Barras Trefiladas">Barras Trefiladas</option>
          </select>
        </div>

        {/* Sales Rep */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Vendedor:</span>
          <select
            value={filters.repId}
            onChange={e => updateFilter("repId", e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Todos os Vendedores</option>
            <option value="Juliana Prado">Juliana Prado</option>
            <option value="Marcos Silveira">Marcos Silveira</option>
            <option value="Camila Guimarães">Camila Guimarães</option>
            <option value="Ricardo Neves">Ricardo Neves</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1 min-w-[170px]">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <input
            type="text"
            placeholder="Filtrar nesta tela..."
            value={filters.searchQuery}
            onChange={e => updateFilter("searchQuery", e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full placeholder:text-slate-400 text-xs"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {isFiltered && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpar Filtros
        </button>
      )}
    </div>
  );
};
