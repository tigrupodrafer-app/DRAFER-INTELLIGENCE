/**
 * DRAFER Intelligence - Fórmulas e Regras de Negócio Oficiais
 * Centralização rigorosa das métricas para evitar divergências e documentar a lógica do BI.
 */

export const BusinessFormulas = {
  formatCurrency(value: number): string {
    if (isNaN(value) || value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },

  formatCompactCurrency(value: number): string {
    if (isNaN(value) || value === null || value === undefined) return "R$ 0";
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1_000_000) {
      return `${sign}R$ ${(abs / 1_000_000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}M`;
    }
    if (abs >= 1_000) {
      return `${sign}R$ ${(abs / 1_000).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;
    }
    return this.formatCurrency(value);
  },

  formatPercent(value: number, isAlreadyRatio = false): string {
    if (isNaN(value) || value === null || value === undefined) return "0,0%";
    const ratio = isAlreadyRatio ? value : value / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(ratio);
  },

  formatNumber(value: number, decimals = 0): string {
    if (isNaN(value) || value === null || value === undefined) return "0";
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    // Check if format is YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [year, month, day] = dateStr.slice(0, 10).split("-");
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  },

  // -------------------------------------------------------------
  // FUNÇÕES MATEMÁTICAS EXPLICITAS DE AUDITORIA & HOMOLOGAÇÃO
  // -------------------------------------------------------------

  /**
   * Margem Bruta (%) sobre a Receita / Total Vendido
   * Margem = (Lucro Bruto / Receita) * 100
   * ATENÇÃO: Nunca confundir com Markup. Margem nunca ultrapassa 100%.
   */
  calculateMargemBruta(lucroBruto: number, receita: number): number {
    if (!receita || receita <= 0) return 0;
    return (lucroBruto / receita) * 100;
  },

  /**
   * Markup (%) sobre o Custo
   * Markup = ((Receita / Custo) - 1) * 100 = (Lucro Bruto / Custo) * 100
   * ATENÇÃO: O markup incide sobre a base de custo e pode ultrapassar 100%.
   */
  calculateMarkup(totalVendido: number, custoTotal: number): number {
    if (!custoTotal || custoTotal <= 0) return 0;
    return ((totalVendido / custoTotal) - 1) * 100;
  },

  /**
   * Prazo Médio de Recebimento (PMR) em dias
   * PMR = (Saldo Médio de Duplicatas a Receber / Faturamento Bruto do Período) * Dias do Período
   */
  calculatePMR(saldoContasAReceber: number, faturamentoBrutoPeriodo: number, diasPeriodo = 30): number {
    if (!faturamentoBrutoPeriodo || faturamentoBrutoPeriodo <= 0) return 0;
    return (saldoContasAReceber / faturamentoBrutoPeriodo) * diasPeriodo;
  },

  /**
   * Prazo Médio de Pagamento (PMP) em dias
   * PMP = (Saldo Médio de Fornecedores / Compras Brutas do Período) * Dias do Período
   */
  calculatePMP(saldoContasAPagar: number, comprasBrutasPeriodo: number, diasPeriodo = 30): number {
    if (!comprasBrutasPeriodo || comprasBrutasPeriodo <= 0) return 0;
    return (saldoContasAPagar / comprasBrutasPeriodo) * diasPeriodo;
  },

  /**
   * Índice de Inadimplência (%)
   * Inadimplência = (Títulos Vencidos / Total da Carteira a Receber) * 100
   */
  calculateInadimplencia(saldoVencido: number, saldoTotalCarteira: number): number {
    if (!saldoTotalCarteira || saldoTotalCarteira <= 0) return 0;
    return (saldoVencido / saldoTotalCarteira) * 100;
  },

  /**
   * EBITDA / LAJIDA Gerencial
   * EBITDA = Lucro Bruto - Despesas Comerciais - Despesas Administrativas (excluindo depreciações/amortizações)
   */
  calculateEbitda(lucroBruto: number, despesasComerciais: number, despesasAdministrativas: number, outrasDespesas = 0): number {
    return lucroBruto - despesasComerciais - despesasAdministrativas - outrasDespesas;
  },

  /**
   * Saldo em Aberto de Título Financeiro
   * Saldo = Valor Original - Valor Recebido/Pago - Descontos + Juros + Multas
   */
  calculateSaldoTitulo(valorOriginal: number, valorLiquidado: number, descontos = 0, juros = 0, multas = 0): number {
    const saldo = valorOriginal - valorLiquidado - descontos + juros + multas;
    return Math.max(0, Math.round(saldo * 100) / 100);
  },

  // Documented formulas
  catalog: [
    {
      name: "Receita Bruta (Faturamento Bruto)",
      formula: "Σ (Valor Total faturado nas Notas Fiscais emitidas)",
      description: "Valor total das vendas brutas com tributos e fretes destacados antes de devoluções e descontos incondicionais.",
      module: "Comercial & DRE"
    },
    {
      name: "Total Vendido (Receita Comercial)",
      formula: "Σ (Valor Total - Descontos Comerciais)",
      description: "Valor efetivo negociado no item com o cliente. Diferente do Valor Total bruto quando há abatimentos acordados.",
      module: "Vendas por Produto"
    },
    {
      name: "Receita Líquida",
      formula: "Receita Bruta - Deduções (Devoluções + ICMS + PIS + COFINS + IPI)",
      description: "Receita disponível após a tributação direta sobre o faturamento e eventuais cancelamentos de mercadorias.",
      module: "DRE Gerencial"
    },
    {
      name: "Valor Lucro (Margem de Contribuição Bruta)",
      formula: "Total Vendido - Custo Total (CMV / CPV)",
      description: "Sobras monetárias do produto para absorver despesas fixas da organização e gerar resultado líquido.",
      module: "Vendas por Produto"
    },
    {
      name: "Margem Bruta (%)",
      formula: "(Valor Lucro / Total Vendido) × 100",
      description: "Percentual de rentabilidade bruta em relação ao montante comercializado.",
      module: "Inteligência Comercial"
    },
    {
      name: "Preço Médio Unitário",
      formula: "Total Vendido / Quantidade (respeitando a mesma UND)",
      description: "Valor médio faturado por unidade física. IMPORTANTE: nunca somar quantidades de unidades divergentes (ex: KG com PC ou MT).",
      module: "Vendas por Produto"
    },
    {
      name: "Ticket Médio por Documento",
      formula: "Total Faturado / Quantidade de Documentos (Notas Fiscais)",
      description: "Média de faturamento por pedido / nota fiscal emitida.",
      module: "Dashboard Executivo"
    },
    {
      name: "Inadimplência (%)",
      formula: "(Contas a Receber com Vencimento Ultrapassado / Total da Carteira a Receber) × 100",
      description: "Proporção de títulos em aberto cujo prazo de vencimento já expirou sem liquidação.",
      module: "Gestão Financeira"
    },
    {
      name: "EBITDA / LAJIDA Gerencial",
      formula: "Lucro Bruto - Despesas com Vendas - Despesas Administrativas (excluindo depreciações)",
      description: "Lucro antes de Juros, Impostos, Depreciação e Amortização. Mede a geração genuína de caixa operacional.",
      module: "DRE Gerencial"
    },
    {
      name: "Eliminação Intercompany",
      formula: "Consolidado Grupo - Transações entre Filiais (Vendas internas, rateios entre CNPJs do grupo)",
      description: "Anula receitas e custos gerados por compras/vendas entre empresas do próprio grupo para evitar inflacionamento artificial do demonstrativo.",
      module: "DRE Gerencial"
    }
  ]
};
