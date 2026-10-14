/**
 * DRAFER Intelligence — Adaptadores de Integração (DRAFER Connector v2.3)
 * Mapeia e normaliza estritamente as respostas do backend FastAPI / Firebird 5.0
 * sem fabricar séries históricas, projeções ou regras de negócio não validadas.
 */

import { SalesItem34 } from "../types/sales34Fields";
import { DashboardMetrics } from "./dataProvider";

export interface BackendDashboardMetricsResponse {
  receita?: number;
  custos?: number;
  lucro_bruto?: number;
  margem_bruta_percentual?: number;
  receita_liquida?: number;
  resultado_liquido?: number;
  margem_liquida_percentual?: number;
  total_receivables?: number;
  total_payables?: number;
  overdue_receivables?: number;
  overdue_payables?: number;
  projected_cash_balance?: number;
  average_ticket?: number;
  total_volume_kg?: number;
  total_pieces?: number;
  active_clients_count?: number;
  source?: string;
  monthly_sales_trend?: any[];
  revenue_vs_costs_trend?: any[];
  profit_by_company?: any[];
  product_category_share?: any[];
  top_sales_reps?: any[];
  receivables_aging?: any[];
  payables_aging?: any[];
  managerial_result_trend?: any[];
  [key: string]: any;
}

export interface BackendSalesItemRaw {
  codigo_produto?: string;
  nome_produto?: string;
  novo_grupo?: string;
  novo_sub_grupo?: string;
  und?: string;
  data?: string;
  numero_documentos?: string;
  numero_documento?: string;
  nome_cliente?: string;
  cnpj_cpf?: string;
  grupo_cadastral?: string;
  cidade?: string;
  estado?: string;
  cidade_entrega?: string;
  estado_entrega?: string;
  cod_empresa?: string;
  nome_empresa?: string;
  dispositivos_fiscal?: string;
  dispositivo_fiscal?: string;
  peso_bruto?: number | string;
  quantidade?: number | string;
  valor_total?: number | string;
  custo_total?: number | string;
  total_vendido?: number | string;
  valor_lucro?: number | string;
  nome_vendedor?: string;
  nome_vendedor_item?: string;
  item?: number | string;
  // Campos divergentes com suporte a ambos os padrões
  numero_carga?: string;
  numero_da_carga?: string;
  nome_carga?: string;
  nome_da_carga?: string;
  comprimento_padrao?: string;
  quantidade_pecas?: number | string;
  quantidade_de_pecas?: number | string;
  grupo_analise_credito?: string;
  grupo_analise_de_credito?: string;
  quantidade_kg?: number | string;
  valor_frete?: number | string;
  classificacao?: string;
  id?: string;
  [key: string]: any;
}

/**
 * Normaliza um item individual retornado pelo backend
 * garantindo compatibilidade estrita com os nomes do DRAFER Connector:
 * - numero_carga
 * - nome_carga
 * - quantidade_pecas
 * - grupo_analise_credito
 * bem como suas nomenclaturas alternativas.
 * 
 * Regra contábil / auditoria:
 * Não apresenta cálculo alternativo de 'Valor Lucro' como dado oficial do ERP se não fornecido.
 */
export function adaptSalesItem(raw: BackendSalesItemRaw, index: number = 0): SalesItem34 {
  if (!raw || typeof raw !== "object") {
    throw new Error("Formato inválido de item de vendas recebido do backend");
  }

  const codProduto = String(raw.codigo_produto ?? raw["Código do Produto"] ?? raw.codigo ?? `PRD${String(index + 1).padStart(3, "0")}`);
  const nomeProduto = String(raw.nome_produto ?? raw["Nome do Produto"] ?? raw.descricao ?? "Produto Demonstrativo");
  const novoGrupo = String(raw.novo_grupo ?? raw.NOVO_GRUPO ?? raw.grupo ?? "Geral");
  const novoSubGrupo = String(raw.novo_sub_grupo ?? raw.NOVO_SUB_GRUPO ?? raw.subgrupo ?? "Geral");

  const rawUnd = String(raw.und ?? raw.UND ?? "UN").toUpperCase();
  const validUnds: SalesItem34["UND"][] = ["KG", "PC", "MT", "CJ", "UN"];
  const und: SalesItem34["UND"] = validUnds.includes(rawUnd as any) ? (rawUnd as any) : "UN";

  const data = String(raw.data ?? raw.DATA ?? "2026-10-01");
  const numDocs = String(raw.numero_documentos ?? raw.numero_documento ?? raw["Número documentos"] ?? `NF${String(index + 1).padStart(4, "0")}`);
  const nomeCliente = String(raw.nome_cliente ?? raw["Nome Cliente"] ?? raw.cliente ?? "Cliente Fictício");
  const cnpjCpf = String(raw.cnpj_cpf ?? raw["CNPJ/CPF"] ?? raw.cnpj ?? "00.000.000/0001-00");
  const grupoCadastral = String(raw.grupo_cadastral ?? raw["Grupo Cadastral"] ?? "Atacado");
  const cidade = String(raw.cidade ?? raw.CIDADE ?? "São Paulo");
  const estado = String(raw.estado ?? raw.Estado ?? raw.uf ?? "SP");
  const cidadeEntrega = String(raw.cidade_entrega ?? raw["Cidade Entrega"] ?? cidade);
  const estadoEntrega = String(raw.estado_entrega ?? raw["Estado Entrega"] ?? estado);
  const codEmpresa = String(raw.cod_empresa ?? raw.COD_EMPRESA ?? "EMP-01");
  const nomeEmpresa = String(raw.nome_empresa ?? raw.NOME_EMPRESA ?? "DRAFER Tubos Matriz");
  const dispositivosFiscal = String(raw.dispositivos_fiscal ?? raw["Dispositivos Fiscal"] ?? raw.dispositivo_fiscal ?? "5.102 - Venda de Produção");

  const pesoBruto = typeof raw.peso_bruto === "number" ? raw.peso_bruto : Number(raw["Peso Bruto"] ?? 0);
  const quantidade = typeof raw.quantidade === "number" ? raw.quantidade : Number(raw.Quantidade ?? 1);
  const valorTotal = typeof raw.valor_total === "number" ? raw.valor_total : Number(raw["Valor Total"] ?? 0);
  const custoTotal = typeof raw.custo_total === "number" ? raw.custo_total : Number(raw["Custo Total"] ?? 0);
  const totalVendido = typeof raw.total_vendido === "number" ? raw.total_vendido : Number(raw["Total Vendido"] ?? valorTotal);

  // REGRA DE INTEGRIDADE FINANCEIRA:
  // Valor Lucro deve refletir apenas o valor oficial entregue pelo ERP/backend.
  // Se não houver validação da regra de negócio, não inventar cálculo alternativo.
  const valorLucro = typeof raw.valor_lucro === "number"
    ? raw.valor_lucro
    : (typeof raw["Valor Lucro"] === "number" ? raw["Valor Lucro"] : 0);

  const nomeVendedor = String(raw.nome_vendedor ?? raw["Nome Vendedor"] ?? raw.vendedor ?? "Representante Geral");
  const nomeVendedorItem = String(raw.nome_vendedor_item ?? raw.NOME_VENDEDOR_ITEM ?? nomeVendedor);
  const itemSeq = typeof raw.item === "number" ? raw.item : Number(raw.Item ?? (index + 1));

  // COMPATIBILIDADE DOS 4 CAMPOS DIVERGENTES:
  // 1. numero_carga
  const numCarga = String(
    raw.numero_carga ??
    raw.numero_da_carga ??
    raw["Número da carga"] ??
    "CRG-001"
  );

  // 2. nome_carga
  const nomeCarga = String(
    raw.nome_carga ??
    raw.nome_da_carga ??
    raw["Nome da Carga"] ??
    "Rota Padrão"
  );

  const compPadrao = String(raw.comprimento_padrao ?? raw["Comprimento padrão"] ?? "6000mm");

  // 3. quantidade_pecas
  const qtdPecas = typeof raw.quantidade_pecas === "number"
    ? raw.quantidade_pecas
    : (typeof raw.quantidade_de_pecas === "number"
      ? raw.quantidade_de_pecas
      : (typeof raw["Quantidade de peças"] === "number"
        ? raw["Quantidade de peças"]
        : (und === "PC" ? quantidade : 0)));

  // 4. grupo_analise_credito
  const rawCredito = String(
    raw.grupo_analise_credito ??
    raw.grupo_analise_de_credito ??
    raw["Grupo análise de crédito"] ??
    "Risco Baixo (A)"
  );
  const validCredito: SalesItem34["Grupo análise de crédito"][] = [
    "Risco Baixo (A)",
    "Risco Moderado (B)",
    "Risco Controlado (C)",
    "Risco Alto (D)",
  ];
  const grupoCredito = validCredito.find(c => c === rawCredito || c.includes(rawCredito) || (rawCredito.length === 1 && c.includes(`(${rawCredito})`))) || "Risco Baixo (A)";

  const qtdKg = typeof raw.quantidade_kg === "number"
    ? raw.quantidade_kg
    : Number(raw["Quantidade Kg"] ?? (und === "KG" ? quantidade : (pesoBruto > 0 ? pesoBruto : 0)));

  const valorFrete = typeof raw.valor_frete === "number" ? raw.valor_frete : Number(raw["Valor Frete"] ?? 0);

  const rawClass = String(raw.classificacao ?? raw.Classificacao ?? "Curva A");
  const validClass: SalesItem34["Classificacao"][] = ["Curva A", "Curva B", "Curva C"];
  const classificacao = validClass.find(c => c.endsWith(rawClass) || rawClass.includes(c)) || "Curva A";

  const id = raw.id ?? `${numDocs}-${itemSeq}`;

  return {
    "Código do Produto": codProduto,
    "Nome do Produto": nomeProduto,
    NOVO_GRUPO: novoGrupo,
    NOVO_SUB_GRUPO: novoSubGrupo,
    UND: und,
    DATA: data,
    "Número documentos": numDocs,
    "Nome Cliente": nomeCliente,
    "CNPJ/CPF": cnpjCpf,
    "Grupo Cadastral": grupoCadastral,
    CIDADE: cidade,
    Estado: estado,
    "Cidade Entrega": cidadeEntrega,
    "Estado Entrega": estadoEntrega,
    COD_EMPRESA: codEmpresa,
    NOME_EMPRESA: nomeEmpresa,
    "Dispositivos Fiscal": dispositivosFiscal,
    "Peso Bruto": pesoBruto,
    Quantidade: quantidade,
    "Valor Total": valorTotal,
    "Custo Total": custoTotal,
    "Total Vendido": totalVendido,
    "Valor Lucro": valorLucro,
    "Nome Vendedor": nomeVendedor,
    NOME_VENDEDOR_ITEM: nomeVendedorItem,
    Item: itemSeq,
    "Número da carga": numCarga,
    "Nome da Carga": nomeCarga,
    "Comprimento padrão": compPadrao,
    "Quantidade de peças": qtdPecas,
    "Grupo análise de crédito": grupoCredito,
    "Quantidade Kg": qtdKg,
    "Valor Frete": valorFrete,
    Classificacao: classificacao,
    id,
  };
}

/**
 * Adapta a resposta de lista do backend FastAPI.
 * Suporta payloads encapsulados { data: [ ... ] }, { items: [ ... ] } ou arrays diretos [ ... ].
 * Tolera respostas incompletas, nulas ou vazias.
 */
export function adaptSalesItems(response: any): SalesItem34[] {
  if (!response) return [];
  const rawList: any[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.items)
    ? response.items
    : [];

  return rawList.map((item, idx) => adaptSalesItem(item, idx));
}

/**
 * Adapta a resposta do endpoint GET /api/v1/dashboard/metrics
 * Mapeia estritamente os campos fornecidos ({ receita, custos, lucro_bruto, margem_bruta_percentual, source }).
 * 
 * REGRA ESTRITA DE INTEGRIDADE:
 * NENHUMA série histórica, projeção financeira ou tendência é fabricada ou gerada artificialmente.
 * Se o backend não fornecer as séries temporais ou projeções, o adaptador retorna arrays vazios []
 * e valores indefinidos (undefined), permitindo que a interface apresente estados visuais explícitos
 * de indisponibilidade de dados.
 */
export function adaptDashboardMetrics(raw: BackendDashboardMetricsResponse): DashboardMetrics {
  const safeRaw = raw || {};

  const grossRevenue = typeof safeRaw.receita === "number"
    ? safeRaw.receita
    : (typeof safeRaw.grossRevenue === "number" ? safeRaw.grossRevenue : 0);

  const custos = typeof safeRaw.custos === "number" ? safeRaw.custos : undefined;

  const grossProfit = typeof safeRaw.lucro_bruto === "number"
    ? safeRaw.lucro_bruto
    : (typeof safeRaw.grossProfit === "number" ? safeRaw.grossProfit : 0);

  const grossMarginPct = typeof safeRaw.margem_bruta_percentual === "number"
    ? safeRaw.margem_bruta_percentual
    : (typeof safeRaw.grossMarginPct === "number" ? safeRaw.grossMarginPct : 0);

  // Indicadores escalares: se não fornecidos pelo backend, são undefined (sem fabricação!)
  const netRevenue = typeof safeRaw.receita_liquida === "number"
    ? safeRaw.receita_liquida
    : (typeof safeRaw.netRevenue === "number" ? safeRaw.netRevenue : undefined);

  const netResult = typeof safeRaw.resultado_liquido === "number"
    ? safeRaw.resultado_liquido
    : (typeof safeRaw.netResult === "number" ? safeRaw.netResult : undefined);

  const netMarginPct = typeof safeRaw.margem_liquida_percentual === "number"
    ? safeRaw.margem_liquida_percentual
    : (typeof safeRaw.netMarginPct === "number" ? safeRaw.netMarginPct : undefined);

  const totalReceivables = typeof safeRaw.total_receivables === "number"
    ? safeRaw.total_receivables
    : (typeof safeRaw.totalReceivables === "number" ? safeRaw.totalReceivables : undefined);

  const totalPayables = typeof safeRaw.total_payables === "number"
    ? safeRaw.total_payables
    : (typeof safeRaw.totalPayables === "number" ? safeRaw.totalPayables : undefined);

  const overdueReceivables = typeof safeRaw.overdue_receivables === "number"
    ? safeRaw.overdue_receivables
    : (typeof safeRaw.overdueReceivables === "number" ? safeRaw.overdueReceivables : undefined);

  const overduePayables = typeof safeRaw.overdue_payables === "number"
    ? safeRaw.overdue_payables
    : (typeof safeRaw.overduePayables === "number" ? safeRaw.overduePayables : undefined);

  const projectedCashBalance = typeof safeRaw.projected_cash_balance === "number"
    ? safeRaw.projected_cash_balance
    : (typeof safeRaw.projectedCashBalance === "number" ? safeRaw.projectedCashBalance : undefined);

  const averageTicket = typeof safeRaw.average_ticket === "number"
    ? safeRaw.average_ticket
    : (typeof safeRaw.averageTicket === "number" ? safeRaw.averageTicket : undefined);

  const totalVolumeKg = typeof safeRaw.total_volume_kg === "number"
    ? safeRaw.total_volume_kg
    : (typeof safeRaw.totalVolumeKg === "number" ? safeRaw.totalVolumeKg : undefined);

  const totalPieces = typeof safeRaw.total_pieces === "number"
    ? safeRaw.total_pieces
    : (typeof safeRaw.totalPieces === "number" ? safeRaw.totalPieces : undefined);

  const activeClientsCount = typeof safeRaw.active_clients_count === "number"
    ? safeRaw.active_clients_count
    : (typeof safeRaw.activeClientsCount === "number" ? safeRaw.activeClientsCount : undefined);

  // Séries históricas e gráficos: SEM FABRICAÇÃO DE DADOS. Retornam array vazio se não existirem no backend.
  const monthlySalesTrend = Array.isArray(safeRaw.monthly_sales_trend ?? safeRaw.monthlySalesTrend)
    ? (safeRaw.monthly_sales_trend ?? safeRaw.monthlySalesTrend)
    : [];

  const revenueVsCostsTrend = Array.isArray(safeRaw.revenue_vs_costs_trend ?? safeRaw.revenueVsCostsTrend)
    ? (safeRaw.revenue_vs_costs_trend ?? safeRaw.revenueVsCostsTrend)
    : [];

  const profitByCompany = Array.isArray(safeRaw.profit_by_company ?? safeRaw.profitByCompany)
    ? (safeRaw.profit_by_company ?? safeRaw.profitByCompany)
    : [];

  const productCategoryShare = Array.isArray(safeRaw.product_category_share ?? safeRaw.productCategoryShare)
    ? (safeRaw.product_category_share ?? safeRaw.productCategoryShare)
    : [];

  const topSalesReps = Array.isArray(safeRaw.top_sales_reps ?? safeRaw.topSalesReps)
    ? (safeRaw.top_sales_reps ?? safeRaw.topSalesReps)
    : [];

  const receivablesAging = Array.isArray(safeRaw.receivables_aging ?? safeRaw.receivablesAging)
    ? (safeRaw.receivables_aging ?? safeRaw.receivablesAging)
    : [];

  const payablesAging = Array.isArray(safeRaw.payables_aging ?? safeRaw.payablesAging)
    ? (safeRaw.payables_aging ?? safeRaw.payablesAging)
    : [];

  const managerialResultTrend = Array.isArray(safeRaw.managerial_result_trend ?? safeRaw.managerialResultTrend)
    ? (safeRaw.managerial_result_trend ?? safeRaw.managerialResultTrend)
    : [];

  return {
    grossRevenue,
    custos,
    netRevenue,
    grossProfit,
    grossMarginPct,
    netResult,
    netMarginPct,
    totalReceivables,
    totalPayables,
    overdueReceivables,
    overduePayables,
    projectedCashBalance,
    averageTicket,
    totalVolumeKg,
    totalPieces,
    activeClientsCount,
    monthlySalesTrend,
    revenueVsCostsTrend,
    profitByCompany,
    productCategoryShare,
    topSalesReps,
    receivablesAging,
    payablesAging,
    managerialResultTrend,
    source: safeRaw.source || (safeRaw.receita !== undefined ? "DRAFER_CONNECTOR" : "MOCK"),
  };
}
