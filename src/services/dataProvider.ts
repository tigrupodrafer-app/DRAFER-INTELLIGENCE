/**
 * DRAFER Intelligence - Camada de Abstração de Serviços de Dados
 * Permite alternar entre dados simulados (MockDataProvider) e a futura API REST FastAPI (ApiDataProvider)
 */

import {
  SalesItem34,
  DreLineItem,
  DreSummaryKpis,
  ReceivableItem,
  PayableItem,
  CashFlowDay,
  ScenarioParameters,
  FinancialSummaryKpis,
  SavedReportModel,
  ReportFieldCatalogItem,
  UserProfile,
  EnterpriseBranch,
  IntegrationStatus,
  AuditLogItem,
  GlobalFilters,
} from "../types";

export interface DashboardMetrics {
  grossRevenue: number;
  custos?: number;
  netRevenue?: number;
  grossProfit: number;
  grossMarginPct: number;
  netResult?: number;
  netMarginPct?: number;
  totalReceivables?: number;
  totalPayables?: number;
  overdueReceivables?: number;
  overduePayables?: number;
  projectedCashBalance?: number;
  averageTicket?: number;
  totalVolumeKg?: number;
  totalPieces?: number;
  activeClientsCount?: number;
  monthlySalesTrend: { month: string; currentYear: number; previousYear?: number; target?: number }[];
  revenueVsCostsTrend: { month: string; revenue: number; costs: number; profit: number }[];
  profitByCompany: { company: string; code: string; revenue: number; profit: number; margin: number }[];
  productCategoryShare: { name: string; value: number; sharePct: number }[];
  topSalesReps: { name: string; revenue: number; target?: number; achievementPct?: number; ordersCount?: number }[];
  receivablesAging: { bucket: string; amount: number; count: number }[];
  payablesAging: { bucket: string; amount: number; count: number }[];
  managerialResultTrend: { month: string; grossRevenue?: number; ebitda?: number; netResult?: number }[];
  source?: string;
}

export interface IDataProvider {
  readonly providerName?: string;
  // Dashboard Executivo
  getDashboardMetrics(filters: GlobalFilters): Promise<DashboardMetrics>;

  // Inteligência Comercial
  getSalesItems(filters: GlobalFilters): Promise<SalesItem34[]>;
  getSalesByClient(filters: GlobalFilters): Promise<any[]>;
  getSalesByRep(filters: GlobalFilters): Promise<any[]>;
  getSalesByCompany(filters: GlobalFilters): Promise<any[]>;
  getMarginAnalysis(filters: GlobalFilters): Promise<any[]>;

  // DRE Gerencial
  getDreStatement(year: number, periodType: "monthly" | "quarterly" | "annual", companyId: string, eliminateIntercompany: boolean): Promise<{
    periods: string[];
    lines: DreLineItem[];
    summary: DreSummaryKpis;
  }>;

  // Gestão Financeira
  getReceivables(filters: GlobalFilters): Promise<ReceivableItem[]>;
  getPayables(filters: GlobalFilters): Promise<PayableItem[]>;
  getCashFlow(filters: GlobalFilters, timeframe: "daily" | "weekly" | "monthly"): Promise<CashFlowDay[]>;
  getScenarioProjections(params: ScenarioParameters): Promise<{
    months: string[];
    baseCash: number[];
    projectedCash: number[];
    inflows: number[];
    outflows: number[];
  }>;
  getFinancialSummary(filters: GlobalFilters): Promise<FinancialSummaryKpis>;

  // Construtor de Relatórios
  getFieldCatalog(): Promise<ReportFieldCatalogItem[]>;
  getSavedReports(): Promise<SavedReportModel[]>;
  saveReport(report: SavedReportModel): Promise<SavedReportModel>;
  deleteReport(id: string): Promise<boolean>;

  // Administração
  getUsers(): Promise<UserProfile[]>;
  getCompanies(): Promise<EnterpriseBranch[]>;
  getIntegrationStatus(): Promise<IntegrationStatus>;
  getAuditLogs(): Promise<AuditLogItem[]>;
  triggerSync(): Promise<{ success: boolean; message: string }>;
}
