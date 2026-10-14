/**
 * DRAFER Intelligence - Implementação do Provedor de API Real (FastAPI)
 * Conecta à API REST corporativa (DRAFER Connector v2.3 / FastAPI)
 * com suporte a proxy Vite local (/api -> 127.0.0.1:8000), normalização de endpoints,
 * adaptadores snake_case -> 34 campos e fallback transparente.
 */

import { IDataProvider, DashboardMetrics } from "./dataProvider";
import { MockDataProvider } from "./mockDataProvider";
import { adaptDashboardMetrics, adaptSalesItems } from "./adapters";
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

export class ApiDataProvider implements IDataProvider {
  readonly providerName = "ApiDataProvider";
  private baseUrl: string;
  private fallbackMock = new MockDataProvider();

  constructor(customBaseUrl?: string) {
    let url = customBaseUrl || (import.meta as any).env?.VITE_API_URL || "/api/v1";
    // Normaliza removendo barras finais
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }
    this.baseUrl = url;
  }

  /**
   * Constrói a URL sem duplicar o prefixo /api/v1
   */
  public buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Prevenção estrita contra duplicação: se baseUrl já termina com /api/v1 e o endpoint inicia com /api/v1
    if (this.baseUrl.endsWith("/api/v1") && cleanEndpoint.startsWith("/api/v1")) {
      return `${this.baseUrl}${cleanEndpoint.slice("/api/v1".length)}`;
    }
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const fullUrl = this.buildUrl(endpoint);
    const res = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`DRAFER Connector Error: ${res.status} ${res.statusText} em ${fullUrl}`);
    }
    return res.json();
  }

  // --------------------------------------------------------------------------
  // Dashboard Executivo (com adaptador para DRAFER Connector v2.3)
  // --------------------------------------------------------------------------
  async getDashboardMetrics(filters: GlobalFilters): Promise<DashboardMetrics> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      const raw = await this.fetchJson<any>(`/dashboard/metrics?${params}`);
      return adaptDashboardMetrics(raw);
    } catch (err) {
      console.warn("[ApiDataProvider] Falha ao consultar /dashboard/metrics, acionando fallback seguro:", err);
      const fallback = await this.fallbackMock.getDashboardMetrics(filters);
      return {
        ...fallback,
        source: "MOCK (Fallback Local)",
      };
    }
  }

  // --------------------------------------------------------------------------
  // Inteligência Comercial (com adaptador dos 34 campos para DRAFER Connector)
  // --------------------------------------------------------------------------
  async getSalesItems(filters: GlobalFilters): Promise<SalesItem34[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      const raw = await this.fetchJson<any>(`/sales/items?${params}`);
      return adaptSalesItems(raw);
    } catch (err) {
      console.warn("[ApiDataProvider] Falha ao consultar /sales/items, acionando fallback seguro:", err);
      return this.fallbackMock.getSalesItems(filters);
    }
  }

  async getSalesByClient(filters: GlobalFilters): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<any[]>(`/sales/by-client?${params}`);
    } catch (err) {
      return this.fallbackMock.getSalesByClient(filters);
    }
  }

  async getSalesByRep(filters: GlobalFilters): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<any[]>(`/sales/by-rep?${params}`);
    } catch (err) {
      return this.fallbackMock.getSalesByRep(filters);
    }
  }

  async getSalesByCompany(filters: GlobalFilters): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<any[]>(`/sales/by-company?${params}`);
    } catch (err) {
      return this.fallbackMock.getSalesByCompany(filters);
    }
  }

  async getMarginAnalysis(filters: GlobalFilters): Promise<any[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<any[]>(`/sales/margins?${params}`);
    } catch (err) {
      return this.fallbackMock.getMarginAnalysis(filters);
    }
  }

  // --------------------------------------------------------------------------
  // DRE Gerencial
  // --------------------------------------------------------------------------
  async getDreStatement(
    year: number,
    periodType: "monthly" | "quarterly" | "annual",
    companyId: string,
    eliminateIntercompany: boolean
  ): Promise<{ periods: string[]; lines: DreLineItem[]; summary: DreSummaryKpis }> {
    try {
      return await this.fetchJson(
        `/dre?year=${year}&periodType=${periodType}&companyId=${companyId}&eliminateIntercompany=${eliminateIntercompany}`
      );
    } catch (err) {
      return this.fallbackMock.getDreStatement(year, periodType, companyId, eliminateIntercompany);
    }
  }

  // --------------------------------------------------------------------------
  // Gestão Financeira
  // --------------------------------------------------------------------------
  async getReceivables(filters: GlobalFilters): Promise<ReceivableItem[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<ReceivableItem[]>(`/financial/receivables?${params}`);
    } catch (err) {
      return this.fallbackMock.getReceivables(filters);
    }
  }

  async getPayables(filters: GlobalFilters): Promise<PayableItem[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<PayableItem[]>(`/financial/payables?${params}`);
    } catch (err) {
      return this.fallbackMock.getPayables(filters);
    }
  }

  async getCashFlow(filters: GlobalFilters, timeframe: "daily" | "weekly" | "monthly"): Promise<CashFlowDay[]> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<CashFlowDay[]>(`/financial/cashflow?timeframe=${timeframe}&${params}`);
    } catch (err) {
      return this.fallbackMock.getCashFlow(filters, timeframe);
    }
  }

  async getScenarioProjections(params: ScenarioParameters): Promise<{
    months: string[];
    baseCash: number[];
    projectedCash: number[];
    inflows: number[];
    outflows: number[];
  }> {
    try {
      return await this.fetchJson(`/financial/scenarios`, {
        method: "POST",
        body: JSON.stringify(params),
      });
    } catch (err) {
      return this.fallbackMock.getScenarioProjections(params);
    }
  }

  async getFinancialSummary(filters: GlobalFilters): Promise<FinancialSummaryKpis> {
    try {
      const params = new URLSearchParams(filters as any).toString();
      return await this.fetchJson<FinancialSummaryKpis>(`/financial/summary?${params}`);
    } catch (err) {
      return this.fallbackMock.getFinancialSummary(filters);
    }
  }

  // --------------------------------------------------------------------------
  // Construtor Dinâmico de Relatórios
  // --------------------------------------------------------------------------
  async getFieldCatalog(): Promise<ReportFieldCatalogItem[]> {
    try {
      return await this.fetchJson<ReportFieldCatalogItem[]>(`/reports/catalog`);
    } catch (err) {
      return this.fallbackMock.getFieldCatalog();
    }
  }

  async getSavedReports(): Promise<SavedReportModel[]> {
    try {
      return await this.fetchJson<SavedReportModel[]>(`/reports/saved`);
    } catch (err) {
      return this.fallbackMock.getSavedReports();
    }
  }

  async saveReport(report: SavedReportModel): Promise<SavedReportModel> {
    try {
      return await this.fetchJson<SavedReportModel>(`/reports/saved`, {
        method: "POST",
        body: JSON.stringify(report),
      });
    } catch (err) {
      return this.fallbackMock.saveReport(report);
    }
  }

  async deleteReport(id: string): Promise<boolean> {
    try {
      const res = await this.fetchJson<{ success: boolean }>(`/reports/saved/${id}`, { method: "DELETE" });
      return res.success;
    } catch (err) {
      return this.fallbackMock.deleteReport(id);
    }
  }

  // --------------------------------------------------------------------------
  // Administração & Integração Firebird
  // --------------------------------------------------------------------------
  async getUsers(): Promise<UserProfile[]> {
    try {
      return await this.fetchJson<UserProfile[]>(`/admin/users`);
    } catch (err) {
      return this.fallbackMock.getUsers();
    }
  }

  async getCompanies(): Promise<EnterpriseBranch[]> {
    try {
      return await this.fetchJson<EnterpriseBranch[]>(`/admin/companies`);
    } catch (err) {
      return this.fallbackMock.getCompanies();
    }
  }

  async getIntegrationStatus(): Promise<IntegrationStatus> {
    try {
      return await this.fetchJson<IntegrationStatus>(`/admin/integrations/status`);
    } catch (err) {
      return this.fallbackMock.getIntegrationStatus();
    }
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    try {
      return await this.fetchJson<AuditLogItem[]>(`/admin/audit-logs`);
    } catch (err) {
      return this.fallbackMock.getAuditLogs();
    }
  }

  async triggerSync(): Promise<{ success: boolean; message: string }> {
    try {
      return await this.fetchJson<{ success: boolean; message: string }>(`/admin/integrations/sync`, { method: "POST" });
    } catch (err) {
      return this.fallbackMock.triggerSync();
    }
  }
}
