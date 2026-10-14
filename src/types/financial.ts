/**
 * DRAFER Intelligence - Modelos Financeiros: Contas a Receber, Pagar, Fluxo de Caixa e Cenários
 */

export type FinancialStatus = "Em aberto" | "Parcialmente recebido" | "Recebido" | "Vencido" | "Cancelado";
export type PayableStatus = "Em aberto" | "Parcialmente pago" | "Pago" | "Vencido" | "Cancelado";

export interface ReceivableItem {
  id: string;
  cliente: string;
  cnpjCpf: string;
  empresa: string;
  empresaCod: string;
  documentoOrigem: string;
  numeroTitulo: string;
  numeroParcela: string;
  emissao: string;
  vencimento: string;
  valorOriginal: number;
  valorRecebido: number;
  descontos: number;
  juros: number;
  multas: number;
  saldoEmAberto: number;
  dataRecebimento?: string;
  status: FinancialStatus;
  diasAtraso: number;
  faixaAging: "A vencer" | "1-30 dias" | "31-60 dias" | "61-90 dias" | "> 90 dias";
  historicoLiquidacoes?: {
    data: string;
    valor: number;
    forma: string;
    banco: string;
  }[];
}

export interface PayableItem {
  id: string;
  fornecedor: string;
  cnpjCpf: string;
  empresa: string;
  empresaCod: string;
  documentoOrigem: string;
  numeroTitulo: string;
  parcela: string;
  emissao: string;
  vencimento: string;
  valorOriginal: number;
  valorPago: number;
  saldoPendente: number;
  dataPagamento?: string;
  categoriaFinanceira: string;
  centroCusto: string;
  status: PayableStatus;
  diasAtraso: number;
  faixaAging: "A vencer" | "1-30 dias" | "31-60 dias" | "61-90 dias" | "> 90 dias";
}

export interface CashFlowDay {
  data: string;
  saldoInicial: number;
  entradasRealizadas: number;
  saidasRealizadas: number;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoFinal: number;
  saldoProjetado: number;
}

export interface ScenarioParameters {
  name: "Conservador" | "Base" | "Otimista" | "Personalizado";
  salesGrowthPct: number;      // e.g. -5% to +20%
  defaultRatePct: number;      // Inadimplência esperada %
  averageDelayDays: number;    // Atraso médio em dias
  expensesGrowthPct: number;   // Variação de custos/despesas %
  paymentTermsDays: number;    // Prazo médio de pagamento (PMP)
  receivableTermsDays: number; // Prazo médio de recebimento (PMR)
}

export interface FinancialSummaryKpis {
  totalReceivables: number;
  receivablesOverdue: number;
  receivablesToMature: number;
  totalPayables: number;
  payablesOverdue: number;
  payablesToMature: number;
  netWorkingCapital: number; // Capital de Giro Líquido
  projectedCash30Days: number;
  currentDefaultRatePct: number;
  agingBuckets: {
    bucket: string;
    receivables: number;
    payables: number;
  }[];
}
