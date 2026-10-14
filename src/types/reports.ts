/**
 * DRAFER Intelligence - Modelos para o Construtor Dinâmico de Relatórios e Relatórios Salvos
 */

export type DataSourceType = "sales" | "receivables" | "payables" | "dre";

export interface ReportFieldCatalogItem {
  id: string;
  name: string;
  label: string;
  dataType: "string" | "number" | "currency" | "date" | "boolean";
  source: DataSourceType;
  allowedAggregations: ("sum" | "avg" | "count" | "countDistinct" | "min" | "max")[];
  description: string;
  isFilterable: boolean;
  isGroupable: boolean;
}

export interface ReportFilterRule {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greaterThan" | "lessThan" | "between" | "in";
  value: string | number | [string | number, string | number];
}

export interface ReportColumnConfig {
  field: string;
  label?: string;
  aggregation?: "sum" | "avg" | "count" | "countDistinct" | "none";
  sort?: "asc" | "desc" | "none";
  width?: number;
}

export interface SavedReportModel {
  id: string;
  title: string;
  description: string;
  dataSource: DataSourceType;
  selectedFields: string[];
  columnsConfig: ReportColumnConfig[];
  filters: ReportFilterRule[];
  groupBy?: string;
  sortBy?: { field: string; direction: "asc" | "desc" };
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}
