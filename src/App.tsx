import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FilterProvider } from "./context/FilterContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/common/Header";
import { Sidebar, ViewKey } from "./components/common/Sidebar";
import { GlobalFilterBar } from "./components/common/GlobalFilterBar";
import { DataBanner } from "./components/common/DataBanner";
import { FormulaModal } from "./components/common/FormulaModal";
import { CommandPalette } from "./components/common/CommandPalette";
import { LoginModal } from "./features/auth/LoginModal";

// Views
import { ExecutiveDashboard } from "./features/dashboard/ExecutiveDashboard";
import { SalesByProductView } from "./features/sales/SalesByProductView";
import { SalesByClientView } from "./features/sales/SalesByClientView";
import { SalesByRepView } from "./features/sales/SalesByRepView";
import { SalesByCompanyView } from "./features/sales/SalesByCompanyView";
import { MarginAnalysisView } from "./features/sales/MarginAnalysisView";
import { DreManagerialView } from "./features/dre/DreManagerialView";
import { ReceivablesView } from "./features/financial/ReceivablesView";
import { PayablesView } from "./features/financial/PayablesView";
import { CashFlowView } from "./features/financial/CashFlowView";
import { ScenarioSimulatorView } from "./features/financial/ScenarioSimulatorView";
import { DefaultRateView } from "./features/financial/DefaultRateView";
import { ReportBuilderView } from "./features/reports/ReportBuilderView";
import { SavedReportsView } from "./features/reports/SavedReportsView";
import { UsersPermissionsView } from "./features/admin/UsersPermissionsView";
import { CompaniesView } from "./features/admin/CompaniesView";
import { KpiCatalogView } from "./features/admin/KpiCatalogView";
import { IntegrationsView } from "./features/admin/IntegrationsView";
import { AuditLogsView } from "./features/admin/AuditLogsView";

const VIEW_CONFIG: Record<ViewKey, { module: string; title: string }> = {
  dashboard: { module: "1. Executivo", title: "Dashboard Executivo" },
  sales_product: { module: "2. Inteligência Comercial", title: "Vendas por Produto (34 Campos)" },
  sales_client: { module: "2. Inteligência Comercial", title: "Vendas por Cliente" },
  sales_rep: { module: "2. Inteligência Comercial", title: "Vendas por Vendedor" },
  sales_company: { module: "2. Inteligência Comercial", title: "Vendas por Empresa" },
  sales_margins: { module: "2. Inteligência Comercial", title: "Análise de Margens" },
  dre: { module: "3. DRE Gerencial", title: "Demonstrativo do Resultado do Exercício" },
  financial_receivables: { module: "4. Gestão Financeira", title: "Contas a Receber" },
  financial_payables: { module: "4. Gestão Financeira", title: "Contas a Pagar" },
  financial_cashflow: { module: "4. Gestão Financeira", title: "Fluxo de Caixa" },
  financial_scenarios: { module: "4. Gestão Financeira", title: "Projeções Financeiras" },
  financial_default: { module: "4. Gestão Financeira", title: "Inadimplência" },
  report_builder: { module: "5. Relatórios", title: "Construtor Dinâmico de Relatórios" },
  saved_reports: { module: "6. Relatórios", title: "Relatórios Salvos" },
  admin_users: { module: "7. Administração", title: "Usuários e Permissões" },
  admin_companies: { module: "7. Administração", title: "Empresas do Grupo Drafer" },
  admin_catalog: { module: "7. Administração", title: "Catálogo de Indicadores" },
  admin_integrations: { module: "7. Administração", title: "Integrações (Firebird 5.0)" },
  admin_audit: { module: "7. Administração", title: "Trilha de Auditoria" },
};

function MainApp() {
  const [currentView, setCurrentView] = useState<ViewKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formulaModalOpen, setFormulaModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { canAccessModule } = useAuth();

  const handleSelectView = (view: ViewKey) => {
    setCurrentView(view);
  };

  const currentInfo = VIEW_CONFIG[currentView] || { module: "Módulo", title: "DRAFER Intelligence" };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Persistent top demonstration notice */}
      <DataBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={handleSelectView}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            currentViewTitle={currentInfo.title}
            currentModule={currentInfo.module}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenFormulaModal={() => setFormulaModalOpen(true)}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            isSidebarOpen={sidebarOpen}
          />

          {/* Global Filter Bar */}
          <GlobalFilterBar />

          {/* View Container */}
          <main className="flex-1 overflow-y-auto">
            {currentView === "dashboard" && (
              <ExecutiveDashboard
                onOpenFormulaModal={() => setFormulaModalOpen(true)}
                onNavigateToView={(v: string) => setCurrentView(v as ViewKey)}
              />
            )}
            {currentView === "sales_product" && (
              <SalesByProductView onOpenFormulaModal={() => setFormulaModalOpen(true)} />
            )}
            {currentView === "sales_client" && <SalesByClientView />}
            {currentView === "sales_rep" && <SalesByRepView />}
            {currentView === "sales_company" && <SalesByCompanyView />}
            {currentView === "sales_margins" && <MarginAnalysisView />}
            {currentView === "dre" && <DreManagerialView />}
            {currentView === "financial_receivables" && <ReceivablesView />}
            {currentView === "financial_payables" && <PayablesView />}
            {currentView === "financial_cashflow" && <CashFlowView />}
            {currentView === "financial_scenarios" && <ScenarioSimulatorView />}
            {currentView === "financial_default" && <DefaultRateView />}
            {currentView === "report_builder" && <ReportBuilderView />}
            {currentView === "saved_reports" && (
              <SavedReportsView onOpenReportBuilder={() => setCurrentView("report_builder")} />
            )}
            {currentView === "admin_users" && <UsersPermissionsView />}
            {currentView === "admin_companies" && <CompaniesView />}
            {currentView === "admin_catalog" && <KpiCatalogView />}
            {currentView === "admin_integrations" && <IntegrationsView />}
            {currentView === "admin_audit" && <AuditLogsView />}
          </main>
        </div>
      </div>

      {/* Modals & Overlays */}
      <FormulaModal isOpen={formulaModalOpen} onClose={() => setFormulaModalOpen(false)} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectView={(v: string) => setCurrentView(v as ViewKey)}
      />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <MainApp />
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
