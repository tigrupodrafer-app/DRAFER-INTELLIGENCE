/**
 * DRAFER Intelligence - Tipos de Administração, Perfis, Empresas, Auditoria e Integrações
 */

export type UserRole =
  | "Superadmin"
  | "Administrador BI"
  | "Diretoria"
  | "Financeiro"
  | "Comercial"
  | "Gestor de Filial";

export interface UserPermission {
  module:
    | "dashboard"
    | "commercial_sales"
    | "commercial_margins"
    | "dre"
    | "financial_receivables"
    | "financial_payables"
    | "financial_cashflow"
    | "report_builder"
    | "admin_users"
    | "admin_integrations"
    | "admin_audit";
  canView: boolean;
  canExport: boolean;
  canEdit: boolean;
  maskSensitiveData?: boolean; // mascara custos, margens e CPF/CNPJ
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  allowedCompanies: string[]; // ['*'] para todas ou ['EMP-01', 'EMP-02']
  avatar?: string;
  department: string;
  status: "Ativo" | "Inativo";
  lastLogin: string;
}

export interface EnterpriseBranch {
  id: string;
  code: string;
  name: string;
  legalName: string;
  cnpj: string;
  city: string;
  state: string;
  group: string;
  isHeadquarter: boolean;
  active: boolean;
}

export interface IntegrationStatus {
  sourceName: string;
  databaseEngine: string;
  host: string;
  databaseFile: string;
  driver: string;
  lastSyncTime: string;
  status: "online" | "syncing" | "warning" | "error";
  totalRecordsProcessed: number;
  syncDurationSeconds: number;
  errorCount: number;
  lastErrorMessage?: string;
  pipelineSteps: {
    step: string;
    status: "success" | "running" | "waiting";
    records: number;
    details: string;
  }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: "LOGIN" | "VIEW_DRE" | "EXPORT_SALES_CSV" | "EXPORT_FINANCIAL" | "BUILD_REPORT" | "UPDATE_PERMISSION" | "CHANGE_SCENARIO";
  module: string;
  details: string;
  ipAddress: string;
  severity: "info" | "warning" | "security";
}
