import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Wallet,
  Sliders,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Database,
  Building2,
  Users,
  ShieldCheck,
  Calculator,
  Layers,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export type ViewKey =
  | "dashboard"
  | "sales_product"
  | "sales_client"
  | "sales_rep"
  | "sales_company"
  | "sales_margins"
  | "dre"
  | "financial_receivables"
  | "financial_payables"
  | "financial_cashflow"
  | "financial_scenarios"
  | "financial_default"
  | "report_builder"
  | "saved_reports"
  | "admin_users"
  | "admin_companies"
  | "admin_catalog"
  | "admin_integrations"
  | "admin_audit";

interface SidebarProps {
  currentView: ViewKey;
  onSelectView: (view: ViewKey) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpen,
  onCloseMobile,
}) => {
  const { canAccessModule } = useAuth();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    commercial: true,
    financial: true,
    admin: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navItem = (key: ViewKey, label: string, isPriority = false) => {
    const isActive = currentView === key;
    return (
      <button
        key={key}
        onClick={() => {
          onSelectView(key);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition-colors text-left ${
          isActive
            ? "bg-blue-600 text-white font-semibold shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        <span className="truncate">{label}</span>
        {isPriority && (
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
            isActive ? "bg-blue-800 text-blue-100" : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
          }`}>
            34 Campos
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              D
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans leading-none">
                DRAFER <span className="text-blue-600 dark:text-blue-400">Intelligence</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                Business Intelligence & Finance
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Main Dashboard */}
          <div>
            <button
              onClick={() => {
                onSelectView("dashboard");
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                currentView === "dashboard"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>1. Dashboard Executivo</span>
            </button>
          </div>

          {/* 2. Inteligência Comercial */}
          {canAccessModule("sales_product") && (
            <div className="space-y-1">
              <button
                onClick={() => toggleSection("commercial")}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  2. Inteligência Comercial
                </span>
                {expandedSections.commercial ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
              {expandedSections.commercial && (
                <div className="space-y-0.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {navItem("sales_product", "Vendas por Produto", true)}
                  {navItem("sales_client", "Vendas por Cliente")}
                  {navItem("sales_rep", "Vendas por Vendedor")}
                  {navItem("sales_company", "Vendas por Empresa")}
                  {navItem("sales_margins", "Análise de Margens")}
                </div>
              )}
            </div>
          )}

          {/* 3. DRE Gerencial */}
          {canAccessModule("dre") && (
            <div>
              <button
                onClick={() => {
                  onSelectView("dre");
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                  currentView === "dre"
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>3. DRE Gerencial</span>
              </button>
            </div>
          )}

          {/* 4. Gestão Financeira */}
          {canAccessModule("financial_receivables") && (
            <div className="space-y-1">
              <button
                onClick={() => toggleSection("financial")}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
              >
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  4. Gestão Financeira
                </span>
                {expandedSections.financial ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
              {expandedSections.financial && (
                <div className="space-y-0.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {navItem("financial_receivables", "Contas a Receber")}
                  {navItem("financial_payables", "Contas a Pagar")}
                  {navItem("financial_cashflow", "Fluxo de Caixa")}
                  {navItem("financial_scenarios", "Projeções Financeiras")}
                  {navItem("financial_default", "Inadimplência")}
                </div>
              )}
            </div>
          )}

          {/* 5. Construtor de Relatórios */}
          <div>
            <button
              onClick={() => {
                onSelectView("report_builder");
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                currentView === "report_builder"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>5. Construtor de Relatórios</span>
            </button>
          </div>

          {/* 6. Relatórios Salvos */}
          <div>
            <button
              onClick={() => {
                onSelectView("saved_reports");
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                currentView === "saved_reports"
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0" />
              <span>6. Relatórios Salvos</span>
            </button>
          </div>

          {/* 7. Administração */}
          <div className="space-y-1">
            <button
              onClick={() => toggleSection("admin")}
              className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                7. Administração
              </span>
              {expandedSections.admin ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
            {expandedSections.admin && (
              <div className="space-y-0.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                {navItem("admin_users", "Usuários e Permissões")}
                {navItem("admin_companies", "Empresas")}
                {navItem("admin_catalog", "Catálogo de Indicadores")}
                {navItem("admin_integrations", "Integrações (Firebird 5.0)")}
                {navItem("admin_audit", "Auditoria")}
              </div>
            )}
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Grupo Drafer</span>
            <span className="text-[10px] text-slate-400">v1.0-BI</span>
          </div>
          <div className="text-[10px] text-slate-400 truncate mt-0.5">
            4 Filiais Conectadas
          </div>
        </div>
      </aside>
    </>
  );
};
