/**
 * DRAFER Intelligence - Definição dos 34 campos originais de Vendas por Produto
 * Mapeamento fiel do esquema extraído do ERP corporativo (Firebird 5.0).
 */

export interface SalesItem34 {
  // 1. Código do Produto
  "Código do Produto": string;
  // 2. Nome do Produto
  "Nome do Produto": string;
  // 3. NOVO_GRUPO
  NOVO_GRUPO: string;
  // 4. NOVO_SUB_GRUPO
  NOVO_SUB_GRUPO: string;
  // 5. UND (Unidade de Medida: KG, PC, MT, CJ, UN)
  UND: "KG" | "PC" | "MT" | "CJ" | "UN";
  // 6. DATA (Formato DD/MM/AAAA ou ISO YYYY-MM-DD para ordenação interna)
  DATA: string;
  // 7. Número documentos (Número da Nota Fiscal / Pedido)
  "Número documentos": string;
  // 8. Nome Cliente (Razão Social do Cliente)
  "Nome Cliente": string;
  // 9. CNPJ/CPF (Dado anonimizado/simulado para conformidade LGPD)
  "CNPJ/CPF": string;
  // 10. Grupo Cadastral
  "Grupo Cadastral": string;
  // 11. CIDADE
  CIDADE: string;
  // 12. Estado (UF)
  Estado: string;
  // 13. Cidade Entrega
  "Cidade Entrega": string;
  // 14. Estado Entrega
  "Estado Entrega": string;
  // 15. COD_EMPRESA
  COD_EMPRESA: string;
  // 16. NOME_EMPRESA
  NOME_EMPRESA: string;
  // 17. Dispositivos Fiscal (CFOP / Situação Tributária)
  "Dispositivos Fiscal": string;
  // 18. Peso Bruto (kg)
  "Peso Bruto": number;
  // 19. Quantidade faturada na unidade do item
  Quantidade: number;
  // 20. Valor Total (Valor bruto faturado)
  "Valor Total": number;
  // 21. Custo Total (CPV / CMV apurado)
  "Custo Total": number;
  // 22. Total Vendido (Valor líquido após deduções comerciais)
  "Total Vendido": number;
  // 23. Valor Lucro (Total Vendido - Custo Total)
  "Valor Lucro": number;
  // 24. Nome Vendedor (Responsável comercial da conta)
  "Nome Vendedor": string;
  // 25. NOME_VENDEDOR_ITEM (Vendedor que emitiu o item específico)
  NOME_VENDEDOR_ITEM: string;
  // 26. Item (Número sequencial do item no documento)
  Item: number;
  // 27. Número da carga (Romaneio de transporte)
  "Número da carga": string;
  // 28. Nome da Carga (Identificação da rota ou transportadora)
  "Nome da Carga": string;
  // 29. Comprimento padrão (especificação física em mm ou m)
  "Comprimento padrão": string;
  // 30. Quantidade de peças
  "Quantidade de peças": number;
  // 31. Grupo análise de crédito (Classificação de risco de crédito: A, B, C, D)
  "Grupo análise de crédito": "Risco Baixo (A)" | "Risco Moderado (B)" | "Risco Controlado (C)" | "Risco Alto (D)";
  // 32. Quantidade Kg
  "Quantidade Kg": number;
  // 33. Valor Frete (Rateio de frete da entrega)
  "Valor Frete": number;
  // 34. Classificacao (Curva ABC / Curva de Giro: A, B, C)
  Classificacao: "Curva A" | "Curva B" | "Curva C";

  // Identificador interno do registro no data warehouse
  id?: string;
}

export const SALES_34_FIELD_KEYS: (keyof SalesItem34)[] = [
  "Código do Produto",
  "Nome do Produto",
  "NOVO_GRUPO",
  "NOVO_SUB_GRUPO",
  "UND",
  "DATA",
  "Número documentos",
  "Nome Cliente",
  "CNPJ/CPF",
  "Grupo Cadastral",
  "CIDADE",
  "Estado",
  "Cidade Entrega",
  "Estado Entrega",
  "COD_EMPRESA",
  "NOME_EMPRESA",
  "Dispositivos Fiscal",
  "Peso Bruto",
  "Quantidade",
  "Valor Total",
  "Custo Total",
  "Total Vendido",
  "Valor Lucro",
  "Nome Vendedor",
  "NOME_VENDEDOR_ITEM",
  "Item",
  "Número da carga",
  "Nome da Carga",
  "Comprimento padrão",
  "Quantidade de peças",
  "Grupo análise de crédito",
  "Quantidade Kg",
  "Valor Frete",
  "Classificacao"
];

export interface FieldDefinition {
  key: keyof SalesItem34;
  label: string;
  type: "string" | "number" | "currency" | "date" | "badge";
  align: "left" | "right" | "center";
  defaultVisible: boolean;
  canAggregate: boolean;
  unit?: string;
  description: string;
}

export const SALES_FIELD_DEFINITIONS: FieldDefinition[] = [
  { key: "Código do Produto", label: "Cód. Prod.", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Código SKU do produto no ERP" },
  { key: "Nome do Produto", label: "Nome do Produto", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Descrição cadastral do item" },
  { key: "NOVO_GRUPO", label: "Grupo", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Macro categoria do produto" },
  { key: "NOVO_SUB_GRUPO", label: "Subgrupo", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Subcategoria técnica do produto" },
  { key: "UND", label: "UND", type: "badge", align: "center", defaultVisible: true, canAggregate: false, description: "Unidade de medida faturada" },
  { key: "DATA", label: "Data", type: "date", align: "center", defaultVisible: true, canAggregate: false, description: "Data de emissão da nota fiscal" },
  { key: "Número documentos", label: "Nº Doc.", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Número da NF-e / Pedido" },
  { key: "Nome Cliente", label: "Cliente", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Razão social do cliente faturado" },
  { key: "CNPJ/CPF", label: "CNPJ/CPF", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Documento fiscal do cliente (mascarado para proteção)" },
  { key: "Grupo Cadastral", label: "Grp. Cadastral", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Segmento cadastral do cliente" },
  { key: "CIDADE", label: "Cidade", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Município do cliente" },
  { key: "Estado", label: "UF", type: "badge", align: "center", defaultVisible: true, canAggregate: false, description: "Unidade Federativa do cliente" },
  { key: "Cidade Entrega", label: "Cid. Entrega", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Município de destino da mercadoria" },
  { key: "Estado Entrega", label: "UF Entrega", type: "badge", align: "center", defaultVisible: false, canAggregate: false, description: "UF de destino da entrega" },
  { key: "COD_EMPRESA", label: "Cód. Emp.", type: "string", align: "center", defaultVisible: false, canAggregate: false, description: "Código da filial emitente" },
  { key: "NOME_EMPRESA", label: "Empresa", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Nome da empresa/filial do Grupo Drafer" },
  { key: "Dispositivos Fiscal", label: "Disp. Fiscal", type: "string", align: "center", defaultVisible: false, canAggregate: false, description: "CFOP e enquadramento tributário" },
  { key: "Peso Bruto", label: "Peso Bruto", type: "number", align: "right", defaultVisible: false, canAggregate: true, unit: "kg", description: "Peso bruto total do carregamento" },
  { key: "Quantidade", label: "Qtd. Faturada", type: "number", align: "right", defaultVisible: true, canAggregate: false, description: "Quantidade na unidade do produto (Atenção: não somar unidades divergentes)" },
  { key: "Valor Total", label: "Valor Total", type: "currency", align: "right", defaultVisible: true, canAggregate: true, description: "Valor bruto do faturamento (com IPI/ST quando aplicável)" },
  { key: "Custo Total", label: "Custo Total", type: "currency", align: "right", defaultVisible: true, canAggregate: true, description: "Custo das mercadorias vendidas (CMV/CPV)" },
  { key: "Total Vendido", label: "Total Vendido", type: "currency", align: "right", defaultVisible: true, canAggregate: true, description: "Receita comercial líquida de descontos de vendas" },
  { key: "Valor Lucro", label: "Valor Lucro", type: "currency", align: "right", defaultVisible: true, canAggregate: true, description: "Margem de contribuição em R$ (Total Vendido - Custo Total)" },
  { key: "Nome Vendedor", label: "Vendedor", type: "string", align: "left", defaultVisible: true, canAggregate: false, description: "Representante comercial titular da conta" },
  { key: "NOME_VENDEDOR_ITEM", label: "Vend. Item", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Vendedor que lançou a linha do item" },
  { key: "Item", label: "Item", type: "string", align: "center", defaultVisible: false, canAggregate: false, description: "Sequencial da linha na NF" },
  { key: "Número da carga", label: "Nº Carga", type: "string", align: "center", defaultVisible: false, canAggregate: false, description: "Número do romaneio de expedição" },
  { key: "Nome da Carga", label: "Nome Carga", type: "string", align: "left", defaultVisible: false, canAggregate: false, description: "Identificação da rota de transporte" },
  { key: "Comprimento padrão", label: "Comp. Padrão", type: "string", align: "center", defaultVisible: false, canAggregate: false, description: "Comprimento industrial especificado" },
  { key: "Quantidade de peças", label: "Qtd. Peças", type: "number", align: "right", defaultVisible: true, canAggregate: true, unit: "pç", description: "Contagem física de peças" },
  { key: "Grupo análise de crédito", label: "Risco Crédito", type: "badge", align: "center", defaultVisible: false, canAggregate: false, description: "Classificação do risco de crédito do cliente" },
  { key: "Quantidade Kg", label: "Qtd. (Kg)", type: "number", align: "right", defaultVisible: true, canAggregate: true, unit: "kg", description: "Peso total faturado em quilogramas" },
  { key: "Valor Frete", label: "Valor Frete", type: "currency", align: "right", defaultVisible: false, canAggregate: true, description: "Valor de frete rateado para o item" },
  { key: "Classificacao", label: "Curva ABC", type: "badge", align: "center", defaultVisible: true, canAggregate: false, description: "Classificação de relevância ABC" }
];
