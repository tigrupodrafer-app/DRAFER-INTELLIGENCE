import React, { useEffect, useState } from "react";
import { Search, X, BarChart3, TrendingUp, DollarSign, FileText, Settings, ShieldCheck, ChevronRight } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Módulos" | "Comercial" | "Financeiro" | "Relatórios" | "Administração";
  viewId: string;
  icon: any;
}

const COMMAND_ITEMS: CommandItem[] = [
  { id: "cmd-1", title: "Dashboard Executivo", category: "Módulos", viewId: "dashboard", icon: BarChart3 },
  { id: "cmd-2", title: "Vendas por Produto (34 Campos do ERP)", category: "Comercial", viewId: "sales_product", icon: TrendingUp },
  { id: "cmd-3", title: "Vendas por Cliente (Curva ABC & Crédito)", category: "Comercial", viewId: "sales_client", icon: TrendingUp },
  { id: "cmd-4", title: "Vendas por Vendedor & Metas", category: "Comercial", viewId: "sales_rep", icon: TrendingUp },
  { id: "cmd-5", title: "Vendas por Empresa (Filiais)", category: "Comercial", viewId: "sales_company", icon: TrendingUp },
  { id: "cmd-6", title: "Análise de Margens & Markup", category: "Comercial", viewId: "sales_margins", icon: TrendingUp },
  { id: "cmd-7", title: "DRE Gerencial Consolidado", category: "Financeiro", viewId: "dre", icon: DollarSign },
  { id: "cmd-8", title: "Contas a Receber & Aging", category: "Financeiro", viewId: "financial_receivables", icon: DollarSign },
  { id: "cmd-9", title: "Contas a Pagar & Centros de Custo", category: "Financeiro", viewId: "financial_payables", icon: DollarSign },
  { id: "cmd-10", title: "Fluxo de Caixa Realizado e Projetado", category: "Financeiro", viewId: "financial_cashflow", icon: DollarSign },
  { id: "cmd-11", title: "Simulador de Cenários Financeiros", category: "Financeiro", viewId: "financial_scenarios", icon: DollarSign },
  { id: "cmd-12", title: "Análise de Inadimplência", category: "Financeiro", viewId: "financial_default", icon: DollarSign },
  { id: "cmd-13", title: "Construtor Dinâmico de Relatórios", category: "Relatórios", viewId: "report_builder", icon: FileText },
  { id: "cmd-14", title: "Relatórios Salvos & Modelos", category: "Relatórios", viewId: "saved_reports", icon: FileText },
  { id: "cmd-15", title: "Usuários e Matriz de Permissões", category: "Administração", viewId: "admin_users", icon: Settings },
  { id: "cmd-16", title: "Empresas do Grupo Drafer", category: "Administração", viewId: "admin_companies", icon: Settings },
  { id: "cmd-17", title: "Catálogo de Fórmulas e Regras de Negócio", category: "Administração", viewId: "admin_catalog", icon: Settings },
  { id: "cmd-18", title: "Status da Integração Firebird 5.0", category: "Administração", viewId: "admin_integrations", icon: Settings },
  { id: "cmd-19", title: "Trilha de Auditoria & Conformidade", category: "Administração", viewId: "admin_audit", icon: ShieldCheck },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (viewId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = COMMAND_ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Navegue rapidamente ou digite o nome de um módulo... (Ex: Vendas, DRE, Receber)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full py-3.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none placeholder:text-slate-400"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              Nenhum módulo encontrado para "{query}"
            </div>
          ) : (
            filtered.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.viewId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
          <span>Pressione ESC para fechar</span>
          <span>Dica: Ctrl+K abre a busca a qualquer momento</span>
        </div>
      </div>
    </div>
  );
};
