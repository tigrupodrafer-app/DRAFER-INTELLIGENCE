/**
 * DRAFER Intelligence - Estrutura do DRE Gerencial
 * Demonstrativo de Resultado com hierarquia contábil, análise vertical e horizontal,
 * suporte a consolidação e eliminação de transações intercompany.
 */

export type DrePeriodType = "monthly" | "quarterly" | "annual";

export interface DreSubItem {
  id: string;
  code: string;
  name: string;
  isNegative?: boolean;
  values: Record<string, number>; // chave: "2024-01", "2024-02", "Q1", "2024-Total", etc.
}

export interface DreLineItem {
  id: string;
  code: string;
  name: string;
  level: 1 | 2 | 3;
  type: "addition" | "deduction" | "subtotal" | "total";
  isBold?: boolean;
  isHighlight?: boolean;
  values: Record<string, number>; // por período
  children?: DreSubItem[];
  verticalAnalysis?: Record<string, number>; // % sobre Receita Líquida
  horizontalAnalysis?: Record<string, number>; // % variação em relação ao período base
}

export interface DreCompanyElimination {
  id: string;
  originCompanyId: string;
  destinationCompanyId: string;
  description: string;
  amount: number;
  period: string;
}

export interface DreSummaryKpis {
  grossRevenue: number;
  netRevenue: number;
  grossProfit: number;
  grossMarginPct: number;
  ebitda: number;
  ebitdaMarginPct: number;
  netResult: number;
  netMarginPct: number;
  intercompanyEliminatedTotal: number;
}
