/**
 * DRAFER INTELLIGENCE — SUÍTE DE TESTES DE HOMOLOGAÇÃO TÉCNICA V1.1
 * Testes automatizados executáveis para validação matemática, integridade contábil,
 * integridade comercial (34 campos), segurança RBAC e contratos de integração.
 */

import { BusinessFormulas } from "../src/services/formulas";
import { MockDataProvider, MOCK_SALES_ITEMS, MOCK_RECEIVABLES, MOCK_PAYABLES } from "../src/services/mockDataProvider";
import { ApiDataProvider } from "../src/services/apiDataProvider";
import { adaptDashboardMetrics, adaptSalesItem, adaptSalesItems } from "../src/services/adapters";
import { SALES_34_FIELD_KEYS } from "../src/types/sales34Fields";

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEquals(actual: any, expected: any, message: string) {
  if (typeof actual === "number" && typeof expected === "number") {
    if (Math.abs(actual - expected) > 0.001) {
      throw new Error(`${message}: Esperado ${expected}, mas obteve ${actual}`);
    }
  } else if (actual !== expected) {
    throw new Error(`${message}: Esperado "${expected}", mas obteve "${actual}"`);
  }
}

async function runTest(suite: string, name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    results.push({ suite, name, passed: true });
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ suite, name, passed: false, error: err.message });
    console.error(`  ✗ [FAIL] ${name} -> ${err.message}`);
  }
}

export async function runHomologationSuite() {
  console.log("\n=======================================================");
  console.log("DRAFER INTELLIGENCE — INICIANDO HOMOLOGAÇÃO TÉCNICA V1.1");
  console.log("=======================================================\n");

  const provider = new MockDataProvider();

  // --------------------------------------------------------------------------
  // SUÍTE 1: INTEGRIDADE FINANCEIRA E CONTÁBIL (ETAPA 2)
  // --------------------------------------------------------------------------
  console.log("--- SUÍTE 1: INTEGRIDADE FINANCEIRA & FÓRMULAS CONTÁBEIS ---");

  await runTest("Financeiro", "Diferenciação rigorosa: Margem Bruta vs Markup", () => {
    const custo = 100.0;
    const venda = 150.0;
    const lucro = venda - custo; // 50.0

    const margem = BusinessFormulas.calculateMargemBruta(lucro, venda);
    const markup = BusinessFormulas.calculateMarkup(venda, custo);

    assertEquals(margem, 33.333, "Margem deve ser (50 / 150) * 100 = 33.333%");
    assertEquals(markup, 50.0, "Markup deve ser (50 / 100) * 100 = 50.0%");
    assert(margem !== markup, "Margem e Markup não podem ser confundidos!");
    assert(margem < 100, "Margem sobre a receita não pode exceder 100%");
  });

  await runTest("Financeiro", "Cálculo de Prazo Médio de Recebimento (PMR) e Pagamento (PMP)", () => {
    const contasAReceber = 400000;
    const faturamentoMes = 600000;
    const pmr = BusinessFormulas.calculatePMR(contasAReceber, faturamentoMes, 30);
    assertEquals(pmr, 20, "PMR deve ser (400.000 / 600.000) * 30 = 20 dias");

    const contasAPagar = 350000;
    const comprasMes = 300000;
    const pmp = BusinessFormulas.calculatePMP(contasAPagar, comprasMes, 30);
    assertEquals(pmp, 35, "PMP deve ser (350.000 / 300.000) * 30 = 35 dias");
  });

  await runTest("Financeiro", "Matemática de Saldo de Título: Valor Original, Baixas, Juros e Multas", () => {
    // Caso com liquidação parcial, juros e multas
    const saldo = BusinessFormulas.calculateSaldoTitulo(18600.0, 10000.0, 0, 150.0, 0);
    assertEquals(saldo, 8750.0, "Saldo deve ser 18.600 - 10.000 + 150 = 8.750,00");

    // Caso quitado integralmente
    const saldoQuitado = BusinessFormulas.calculateSaldoTitulo(35000.0, 35000.0, 0, 0, 0);
    assertEquals(saldoQuitado, 0.0, "Saldo quitado deve ser R$ 0,00");
  });

  await runTest("Financeiro", "Aging de Títulos: Partição disjunta e sem contagem dupla", async () => {
    const summary = await provider.getFinancialSummary({ companyId: "all" } as any);
    const recs = await provider.getReceivables({ companyId: "all" } as any);

    const totalCalculado = recs.reduce((acc, r) => acc + r.saldoEmAberto, 0);
    assertEquals(summary.totalReceivables, totalCalculado, "Soma de todos os títulos em aberto deve bater com totalReceivables");

    const sumBuckets = summary.agingBuckets.reduce((acc, b) => acc + b.receivables, 0);
    assertEquals(sumBuckets, summary.totalReceivables, "Soma das faixas de aging deve ser exatamente igual ao total de recebíveis");

    // Garantir que a vencer + vencidos = total
    assertEquals(summary.receivablesToMature + summary.receivablesOverdue, summary.totalReceivables, "A vencer + Vencidos deve ser exatamente igual ao Total da Carteira");
  });

  await runTest("Financeiro", "DRE: Regras contábeis de Eliminações Intercompany", async () => {
    // 1. Grupo Consolidado com Eliminação Ativa
    const dreConsolidadoComElim = await provider.getDreStatement(2024, "annual", "all", true);
    assert(dreConsolidadoComElim.summary.intercompanyEliminatedTotal > 0, "Consolidado com eliminação deve registrar deduções intercompany");

    // 2. Grupo Consolidado SEM Eliminação (visão bruta societária)
    const dreConsolidadoSemElim = await provider.getDreStatement(2024, "annual", "all", false);
    assertEquals(dreConsolidadoSemElim.summary.intercompanyEliminatedTotal, 0, "Consolidado sem eliminação deve ter zero de eliminação");
    assert(dreConsolidadoSemElim.summary.grossRevenue > dreConsolidadoComElim.summary.grossRevenue, "Faturamento societário bruto sem eliminação deve ser maior que o consolidado líquido");

    // 3. Filial Individual (EMP-01) - Eliminação NÃO PODE se aplicar a relatório individual
    const dreIndividual = await provider.getDreStatement(2024, "annual", "EMP-01", true);
    assertEquals(dreIndividual.summary.intercompanyEliminatedTotal, 0, "Relatório individual de filial não pode ter eliminação intercompany aplicada");
  });

  await runTest("Financeiro", "DRE: Conciliação vertical da estrutura de resultado", async () => {
    const dre = await provider.getDreStatement(2024, "annual", "all", true);
    const s = dre.summary;

    // Receita Líquida = Receita Bruta - Deduções
    assert(s.netRevenue < s.grossRevenue, "Receita líquida deve ser menor que a receita bruta");

    // Lucro Bruto = Receita Líquida - CMV
    assert(s.grossProfit < s.netRevenue, "Lucro bruto deve ser menor que a receita líquida");

    // EBITDA = Lucro Bruto - Despesas Operacionais
    assert(s.ebitda < s.grossProfit, "EBITDA deve ser menor que o lucro bruto");

    // Resultado Líquido = LAIR - Impostos
    assert(s.netResult < s.ebitda, "Resultado líquido após tributos deve ser menor que o EBITDA");
  });

  // --------------------------------------------------------------------------
  // SUÍTE 2: INTEGRIDADE COMERCIAL E OS 34 CAMPOS DO ERP (ETAPA 3)
  // --------------------------------------------------------------------------
  console.log("\n--- SUÍTE 2: INTEGRIDADE COMERCIAL & OS 34 CAMPOS DO ERP ---");

  await runTest("Comercial", "Validação estrita dos 34 campos obrigatórios em cada item", async () => {
    const items = await provider.getSalesItems({} as any);
    assert(items.length > 0, "A base de vendas deve conter itens");

    for (const item of items) {
      for (const key of SALES_34_FIELD_KEYS) {
        assert(key in item, `Item ${item.id} não possui o campo obrigatório "${key}"`);
      }
    }
  });

  await runTest("Comercial", "Segregação de Unidades Físicas distintas (KG vs PC vs MT)", async () => {
    const items = await provider.getSalesItems({} as any);

    const units = new Set(items.map(it => it.UND));
    assert(units.has("KG"), "Deve existir itens com UND = KG");
    assert(units.has("PC"), "Deve existir itens com UND = PC");

    // Verifica que a métrica de volume faturado total em KG usa exclusivamente o campo 'Quantidade Kg' e não soma 'Quantidade' genérica
    const totalKg = items.reduce((sum, it) => sum + it["Quantidade Kg"], 0);
    const somaQtdGenerica = items.reduce((sum, it) => sum + it.Quantidade, 0);

    assert(totalKg !== somaQtdGenerica, "A soma física de KG não pode ser igual à soma cega de 'Quantidade' em unidades divergentes!");
  });

  await runTest("Comercial", "Integridade da Margem e Lucro por Item: Total Vendido - Custo Total = Valor Lucro", async () => {
    const items = await provider.getSalesItems({} as any);

    for (const item of items) {
      const lucroEsperado = item["Total Vendido"] - item["Custo Total"];
      assertEquals(item["Valor Lucro"], lucroEsperado, `No item ${item.id}, Valor Lucro deve ser Total Vendido - Custo Total`);
    }
  });

  await runTest("Comercial", "Subtotais e agrupamentos correspondem à soma exata dos itens", async () => {
    const items = await provider.getSalesItems({} as any);
    const groups = new Map<string, typeof items>();

    for (const item of items) {
      const g = item.NOVO_GRUPO;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(item);
    }

    let somaSubtotais = 0;
    for (const [groupName, groupItems] of groups.entries()) {
      const subtotalGrupo = groupItems.reduce((acc, it) => acc + it["Total Vendido"], 0);
      somaSubtotais += subtotalGrupo;
    }

    const totalGeral = items.reduce((acc, it) => acc + it["Total Vendido"], 0);
    assertEquals(somaSubtotais, totalGeral, "A soma dos subtotais por grupo deve ser rigorosamente igual ao total geral");
  });

  // --------------------------------------------------------------------------
  // SUÍTE 3: SEGURANÇA E MATRIZ DE AUTORIZAÇÃO RBAC (ETAPA 4)
  // --------------------------------------------------------------------------
  console.log("\n--- SUÍTE 3: SEGURANÇA & MATRIZ DE AUTORIZAÇÃO (RBAC) ---");

  await runTest("Segurança", "Matriz de Perfis: Segregação de Módulos e Escopo de Dados", async () => {
    const users = await provider.getUsers();

    const superadmin = users.find(u => u.role === "Superadmin");
    const comercial = users.find(u => u.role === "Comercial");
    const gestorFilial = users.find(u => u.role === "Gestor de Filial");

    assert(superadmin !== undefined, "Perfil Superadmin deve existir");
    assert(comercial !== undefined, "Perfil Comercial deve existir");
    assert(gestorFilial !== undefined, "Perfil Gestor de Filial deve existir");

    // Escopo de empresas
    assertEquals(superadmin!.allowedCompanies[0], "*", "Superadmin deve ter acesso global (*)");
    assertEquals(gestorFilial!.allowedCompanies[0], "EMP-02", "Gestor de Filial deve ter escopo restrito à sua filial");
  });

  // --------------------------------------------------------------------------
  // SUÍTE 4: CONTRATOS DE INTEGRAÇÃO COM FIREBIRD & FASTAPI (ETAPA 5)
  // --------------------------------------------------------------------------
  console.log("\n--- SUÍTE 4: CONTRATOS DE INTEGRAÇÃO FASTAPI & FIREBIRD 5.0 ---");

  await runTest("Integração", "Compatibilidade de métodos do IDataProvider", async () => {
    // Garante que o MockDataProvider e a interface cumpram todos os requisitos de chamada
    const metrics = await provider.getDashboardMetrics({} as any);
    assert(metrics.grossRevenue > 0, "getDashboardMetrics deve retornar grossRevenue");
    assert(metrics.monthlySalesTrend.length > 0, "getDashboardMetrics deve retornar monthlySalesTrend");

    const status = await provider.getIntegrationStatus();
    assertEquals(status.status, "online", "Status de conexão com conector deve ser online");
    assert(status.totalRecordsProcessed > 0, "Contagem de registros processados deve ser positiva");

    const syncResult = await provider.triggerSync();
    assert(syncResult.success === true, "Disparo de sincronização delta deve responder sucesso");
  });

  // --------------------------------------------------------------------------
  // SUÍTE 5: DRAFER CONNECTOR v2.3 — HOMOLOGAÇÃO FASE 2.4.1
  // --------------------------------------------------------------------------
  console.log("\n--- SUÍTE 5: DRAFER CONNECTOR v2.3 — HOMOLOGAÇÃO FASE 2.4.1 ---");

  await runTest("Connector", "1. Integridade dos Indicadores: Mapeamento estrito sem fabricação de dados", () => {
    const rawMetrics = {
      receita: 15000.0,
      custos: 10500.0,
      lucro_bruto: 4500.0,
      margem_bruta_percentual: 30.0,
      source: "MOCK",
    };

    const adapted = adaptDashboardMetrics(rawMetrics);

    assertEquals(adapted.grossRevenue, 15000.0, "grossRevenue deve ser 15000.0");
    assertEquals(adapted.custos, 10500.0, "custos deve ser 10500.0");
    assertEquals(adapted.grossProfit, 4500.0, "grossProfit deve ser 4500.0");
    assertEquals(adapted.grossMarginPct, 30.0, "grossMarginPct deve ser 30.0%");
    assertEquals(adapted.source, "MOCK", "source deve ser preservado como MOCK");
  });

  await runTest("Connector", "2. Ausência de Séries Históricas: Adaptador não gera séries artificiais", () => {
    const rawMetrics = {
      receita: 15000.0,
      custos: 10500.0,
      lucro_bruto: 4500.0,
      margem_bruta_percentual: 30.0,
    };

    const adapted = adaptDashboardMetrics(rawMetrics);

    // Séries históricas não fornecidas devem ser rigorosamente arrays vazios, SEM dados inventados
    assertEquals(adapted.monthlySalesTrend.length, 0, "monthlySalesTrend deve ser vazio quando não fornecido");
    assertEquals(adapted.revenueVsCostsTrend.length, 0, "revenueVsCostsTrend deve ser vazio quando não fornecido");
    assertEquals(adapted.profitByCompany.length, 0, "profitByCompany deve ser vazio quando não fornecido");
    assertEquals(adapted.productCategoryShare.length, 0, "productCategoryShare deve ser vazio quando não fornecido");
    assertEquals(adapted.topSalesReps.length, 0, "topSalesReps deve ser vazio quando não fornecido");
    assertEquals(adapted.receivablesAging.length, 0, "receivablesAging deve ser vazio quando não fornecido");
    assertEquals(adapted.payablesAging.length, 0, "payablesAging deve ser vazio quando não fornecido");
    assertEquals(adapted.managerialResultTrend.length, 0, "managerialResultTrend deve ser vazio quando não fornecido");
  });

  await runTest("Connector", "3. Ausência de Projeções: Projeção financeira não é fabricada sem endpoint", () => {
    const rawMetrics = {
      receita: 15000.0,
      custos: 10500.0,
      lucro_bruto: 4500.0,
      margem_bruta_percentual: 30.0,
    };

    const adapted = adaptDashboardMetrics(rawMetrics);

    assert(adapted.projectedCashBalance === undefined, "projectedCashBalance deve ser undefined se não fornecido pelo conector");
    assert(adapted.netRevenue === undefined, "netRevenue deve ser undefined se não fornecido pelo conector");
    assert(adapted.netResult === undefined, "netResult deve ser undefined se não fornecido pelo conector");
  });

  await runTest("Connector", "4. Compatibilidade dos 4 Campos Divergentes: numero_carga, nome_carga, quantidade_pecas, grupo_analise_credito", () => {
    // Objeto utilizando EXATAMENTE as 4 chaves nativas do DRAFER Connector v2.3
    const itemNativoConnector = {
      codigo_produto: "PRD-TUB-100",
      nome_produto: "Tubo Industrial Din 2440",
      numero_carga: "CRG-8884",
      nome_carga: "Expresso Sul Joinville",
      quantidade_pecas: 50,
      grupo_analise_credito: "Risco Moderado (B)",
      und: "PC",
      quantidade: 50,
      valor_total: 7500.0,
    };

    const item = adaptSalesItem(itemNativoConnector);

    assertEquals(item["Número da carga"], "CRG-8884", "numero_carga deve mapear para 'Número da carga'");
    assertEquals(item["Nome da Carga"], "Expresso Sul Joinville", "nome_carga deve mapear para 'Nome da Carga'");
    assertEquals(item["Quantidade de peças"], 50, "quantidade_pecas deve mapear para 'Quantidade de peças'");
    assertEquals(item["Grupo análise de crédito"], "Risco Moderado (B)", "grupo_analise_credito deve mapear para 'Grupo análise de crédito'");

    // Objeto utilizando as nomenclaturas alternativas prévias do frontend
    const itemNomenclaturaAlternativa = {
      codigo_produto: "PRD-TUB-200",
      nome_produto: "Tubo Estrutural",
      numero_da_carga: "CRG-9999",
      nome_da_carga: "Rota Sudeste",
      quantidade_de_pecas: 80,
      grupo_analise_de_credito: "Risco Controlado (C)",
    };

    const itemAlt = adaptSalesItem(itemNomenclaturaAlternativa);

    assertEquals(itemAlt["Número da carga"], "CRG-9999", "numero_da_carga deve ser suportado");
    assertEquals(itemAlt["Nome da Carga"], "Rota Sudeste", "nome_da_carga deve ser suportado");
    assertEquals(itemAlt["Quantidade de peças"], 80, "quantidade_de_pecas deve ser suportado");
    assertEquals(itemAlt["Grupo análise de crédito"], "Risco Controlado (C)", "grupo_analise_de_credito deve ser suportado");
  });

  await runTest("Connector", "5. Integridade Estrita dos 34 Campos Oficiais do ERP Firebird", () => {
    const rawPayload = {
      data: [
        {
          codigo_produto: "PRD001",
          nome_produto: "Tubo Schedule 40",
          novo_grupo: "Tubos Carbono",
          novo_sub_grupo: "Schedule",
          und: "KG",
          data: "2026-10-01",
          numero_documentos: "NF0001",
          nome_cliente: "Metalúrgica Joinville",
          cnpj_cpf: "12.345.678/0001-90",
          grupo_cadastral: "Indústria",
          cidade: "Joinville",
          estado: "SC",
          cidade_entrega: "Joinville",
          estado_entrega: "SC",
          cod_empresa: "EMP-01",
          nome_empresa: "DRAFER Tubos Matriz",
          dispositivos_fiscal: "5.101 - Venda de Produção",
          peso_bruto: 250.0,
          quantidade: 250.0,
          valor_total: 4500.0,
          custo_total: 3100.0,
          total_vendido: 4500.0,
          valor_lucro: 1400.0,
          nome_vendedor: "Carlos Eduardo Silveira",
          nome_vendedor_item: "Carlos Eduardo Silveira",
          item: 1,
          numero_carga: "CRG-100",
          nome_carga: "Rota SC Norte",
          comprimento_padrao: "6000mm",
          quantidade_pecas: 10,
          grupo_analise_credito: "Risco Baixo (A)",
          quantidade_kg: 250.0,
          valor_frete: 120.0,
          classificacao: "Curva A",
        },
      ],
    };

    const items = adaptSalesItems(rawPayload);
    assertEquals(items.length, 1, "Deve extrair 1 item do envelope data: []");
    const item = items[0];

    // Validação estrita: todos os 34 campos devem existir exatamente conforme SALES_34_FIELD_KEYS
    assertEquals(SALES_34_FIELD_KEYS.length, 34, "Devem existir exatamente 34 campos oficiais no contrato do ERP");
    for (const key of SALES_34_FIELD_KEYS) {
      assert(key in item, `Campo obrigatório ausente no item adaptado: "${key}"`);
    }

    assertEquals(item["Código do Produto"], "PRD001", "Código do Produto");
    assertEquals(item["Nome do Produto"], "Tubo Schedule 40", "Nome do Produto");
    assertEquals(item.NOVO_GRUPO, "Tubos Carbono", "NOVO_GRUPO");
    assertEquals(item.UND, "KG", "UND");
    assertEquals(item["Valor Total"], 4500.0, "Valor Total");
    assertEquals(item["Custo Total"], 3100.0, "Custo Total");
    assertEquals(item["Total Vendido"], 4500.0, "Total Vendido");
    assertEquals(item["Valor Lucro"], 1400.0, "Valor Lucro oficial preservado");
  });

  await runTest("Connector", "6. Regra Financeira: Não apresentação de cálculo alternativo de Lucro sem validação", () => {
    // Se o backend/ERP NÃO fornecer valor_lucro oficial, o adaptador NÃO pode calcular artificialmente
    const itemSemLucro = adaptSalesItem({
      codigo_produto: "PRD-SEM-LUCRO",
      total_vendido: 5000.0,
      custo_total: 3500.0,
      // valor_lucro omitido intencionalmente
    });

    assertEquals(
      itemSemLucro["Valor Lucro"],
      0,
      "Valor Lucro não pode ser fabricado como (total_vendido - custo_total) se não validado pelo ERP"
    );
  });

  await runTest("Connector", "7. Identificação Clara de Dados MOCK vs Conexão Real", async () => {
    // 1. MockDataProvider deve explicitamente ter source: "MOCK"
    const mockMetrics = await provider.getDashboardMetrics({} as any);
    assertEquals(mockMetrics.source, "MOCK", "MockDataProvider deve marcar explicitamente source: MOCK");

    // 2. Adaptador deve preservar source: "MOCK" vindo do backend MOCK
    const adaptedMock = adaptDashboardMetrics({
      receita: 1000,
      source: "MOCK",
    });
    assertEquals(adaptedMock.source, "MOCK", "Adaptador deve preservar identificação source: MOCK");

    // 3. Adaptador com conector real sem marcação de mock
    const adaptedReal = adaptDashboardMetrics({
      receita: 25000,
      source: "FIREBIRD_5.0",
    });
    assertEquals(adaptedReal.source, "FIREBIRD_5.0", "Adaptador deve preservar origem FIREBIRD_5.0");
  });

  await runTest("Connector", "8. Resposta Incompleta do Backend: Resiliência e tolerância a falhas", () => {
    // Caso 1: Payload completamente vazio ({})
    const metricsVazio = adaptDashboardMetrics({} as any);
    assertEquals(metricsVazio.grossRevenue, 0, "grossRevenue em payload vazio deve ser 0");
    assertEquals(metricsVazio.grossProfit, 0, "grossProfit em payload vazio deve ser 0");
    assertEquals(metricsVazio.monthlySalesTrend.length, 0, "monthlySalesTrend em payload vazio deve ser []");

    // Caso 2: Payload parcial contendo apenas receita
    const metricsParcial = adaptDashboardMetrics({ receita: 12000.0 });
    assertEquals(metricsParcial.grossRevenue, 12000.0, "grossRevenue deve ser 12000.0");
    assert(metricsParcial.custos === undefined, "custos deve ser undefined");
    assert(metricsParcial.netRevenue === undefined, "netRevenue deve ser undefined");

    // Caso 3: Respostas nulas ou indefinidas para vendas
    const vendasNull = adaptSalesItems(null);
    assertEquals(vendasNull.length, 0, "adaptSalesItems(null) deve retornar []");

    const vendasObjVazio = adaptSalesItems({});
    assertEquals(vendasObjVazio.length, 0, "adaptSalesItems({}) deve retornar []");

    const vendasDataVazio = adaptSalesItems({ data: [] });
    assertEquals(vendasDataVazio.length, 0, "adaptSalesItems({ data: [] }) deve retornar []");
  });

  await runTest("Connector", "9. Construção de URLs e Prevenção de Duplicação de /api/v1", () => {
    const apiStandard = new ApiDataProvider("/api/v1");
    assertEquals(apiStandard.buildUrl("/dashboard/metrics"), "/api/v1/dashboard/metrics", "URL padrão sem duplicação");
    assertEquals(apiStandard.buildUrl("/api/v1/dashboard/metrics"), "/api/v1/dashboard/metrics", "Previne duplicação se endpoint já tiver /api/v1");

    const apiTrailingSlash = new ApiDataProvider("/api/v1/");
    assertEquals(apiTrailingSlash.buildUrl("/sales/items"), "/api/v1/sales/items", "Remove barra final de VITE_API_URL");

    const apiWithoutLeadingSlash = new ApiDataProvider("/api/v1");
    assertEquals(apiWithoutLeadingSlash.buildUrl("sales/items"), "/api/v1/sales/items", "Garante barra inicial no endpoint");
  });
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log("\n=======================================================");
  console.log(`TOTAL DE TESTES EXECUTADOS: ${total}`);
  console.log(`APROVADOS: ${passed}`);
  console.log(`FALHAS: ${failed}`);
  console.log("=======================================================\n");

  return { total, passed, failed, results };
}

// Execução direta em linha de comando via tsx
runHomologationSuite();
