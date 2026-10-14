/**
 * DRAFER Intelligence - Implementação do Provedor de Dados Simulados (MockDataProvider)
 * Gera dados determinísticos, integrados e consistentes para demonstração de alto padrão.
 */

import {
  IDataProvider,
  DashboardMetrics,
} from "./dataProvider";
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

export const MOCK_COMPANIES: EnterpriseBranch[] = [
  {
    id: "EMP-01",
    code: "01",
    name: "DRAFER Tubos Matriz",
    legalName: "DRAFER INDÚSTRIA E COMÉRCIO DE TUBOS LTDA",
    cnpj: "08.432.190/0001-44",
    city: "Joinville",
    state: "SC",
    group: "Grupo Drafer",
    isHeadquarter: true,
    active: true,
  },
  {
    id: "EMP-02",
    code: "02",
    name: "DRAFER Aços Filial SP",
    legalName: "DRAFER DISTRIBUIDORA DE AÇOS E PERFIS LTDA",
    cnpj: "08.432.190/0002-25",
    city: "São Paulo",
    state: "SP",
    group: "Grupo Drafer",
    isHeadquarter: false,
    active: true,
  },
  {
    id: "EMP-03",
    code: "03",
    name: "DRAFER Soluções Filial PR",
    legalName: "DRAFER SOLUÇÕES INDUSTRIAIS LTDA",
    cnpj: "08.432.190/0003-06",
    city: "Curitiba",
    state: "PR",
    group: "Grupo Drafer",
    isHeadquarter: false,
    active: true,
  },
  {
    id: "EMP-04",
    code: "04",
    name: "DRAFER Sudeste Filial MG",
    legalName: "DRAFER COMÉRCIO E LOGÍSTICA SUDESTE LTDA",
    cnpj: "08.432.190/0004-97",
    city: "Belo Horizonte",
    state: "MG",
    group: "Grupo Drafer",
    isHeadquarter: false,
    active: true,
  },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: "USR-01",
    name: "Carlos Eduardo Schneider",
    email: "carlos.schneider@grupodrafer.com.br",
    role: "Superadmin",
    allowedCompanies: ["*"],
    department: "Tecnologia & Governança",
    status: "Ativo",
    lastLogin: "2024-10-14 10:15",
  },
  {
    id: "USR-02",
    name: "Mariana Alcantara",
    email: "mariana.alcantara@grupodrafer.com.br",
    role: "Diretoria",
    allowedCompanies: ["*"],
    department: "Diretoria Executiva",
    status: "Ativo",
    lastLogin: "2024-10-14 09:30",
  },
  {
    id: "USR-03",
    name: "Rodrigo Fagundes",
    email: "rodrigo.fagundes@grupodrafer.com.br",
    role: "Financeiro",
    allowedCompanies: ["*"],
    department: "Controladoria & Finanças",
    status: "Ativo",
    lastLogin: "2024-10-14 08:45",
  },
  {
    id: "USR-04",
    name: "Fernanda Bittencourt",
    email: "fernanda.comercial@grupodrafer.com.br",
    role: "Comercial",
    allowedCompanies: ["*"],
    department: "Vendas Corporativas",
    status: "Ativo",
    lastLogin: "2024-10-14 09:00",
  },
  {
    id: "USR-05",
    name: "Thiago Pires",
    email: "thiago.sp@grupodrafer.com.br",
    role: "Gestor de Filial",
    allowedCompanies: ["EMP-02"],
    department: "Filial São Paulo",
    status: "Ativo",
    lastLogin: "2024-10-13 17:20",
  },
  {
    id: "USR-06",
    name: "Ana Carolina Rossi",
    email: "ana.bi@grupodrafer.com.br",
    role: "Administrador BI",
    allowedCompanies: ["*"],
    department: "Inteligência de Dados",
    status: "Ativo",
    lastLogin: "2024-10-14 10:00",
  },
];

// Raw Sales Items with all 34 fields
export const MOCK_SALES_ITEMS: SalesItem34[] = [
  {
    id: "SL-1001",
    "Código do Produto": "TUB-IND-0104",
    "Nome do Produto": "Tubo Aço Carbono Schedule 40 2 Polegadas",
    NOVO_GRUPO: "Tubos Industriais",
    NOVO_SUB_GRUPO: "Tubos com Costura",
    UND: "KG",
    DATA: "2024-10-02",
    "Número documentos": "NF-104821",
    "Nome Cliente": "Metalúrgica Catarinense SA",
    "CNPJ/CPF": "84.***.***/0001-90",
    "Grupo Cadastral": "Indústria Metalmecânica",
    CIDADE: "Joinville",
    Estado: "SC",
    "Cidade Entrega": "Joinville",
    "Estado Entrega": "SC",
    COD_EMPRESA: "01",
    NOME_EMPRESA: "DRAFER Tubos Matriz",
    "Dispositivos Fiscal": "5101 - Venda de Prod. do Estabelecimento",
    "Peso Bruto": 4820,
    Quantidade: 4820,
    "Valor Total": 38560.0,
    "Custo Total": 25064.0,
    "Total Vendido": 37200.0,
    "Valor Lucro": 12136.0,
    "Nome Vendedor": "Marcos Silveira",
    NOME_VENDEDOR_ITEM: "Marcos Silveira",
    Item: 1,
    "Número da carga": "CRG-2409-12",
    "Nome da Carga": "Rota Norte SC / Vale",
    "Comprimento padrão": "6.000 mm",
    "Quantidade de peças": 160,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 4820,
    "Valor Frete": 1200.0,
    Classificacao: "Curva A",
  },
  {
    id: "SL-1002",
    "Código do Produto": "PRF-EST-055",
    "Nome do Produto": "Perfil Viga W 200x26.6 Aço Estrutural ASTM A572",
    NOVO_GRUPO: "Perfis Estruturais",
    NOVO_SUB_GRUPO: "Vigas Soldadas e Laminadas",
    UND: "KG",
    DATA: "2024-10-03",
    "Número documentos": "NF-104822",
    "Nome Cliente": "Estruturas Metálicas Paulistas Ltda",
    "CNPJ/CPF": "61.***.***/0002-18",
    "Grupo Cadastral": "Construção Civil & Montagens",
    CIDADE: "Campinas",
    Estado: "SP",
    "Cidade Entrega": "Hortolândia",
    "Estado Entrega": "SP",
    COD_EMPRESA: "02",
    NOME_EMPRESA: "DRAFER Aços Filial SP",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 12800,
    Quantidade: 12800,
    "Valor Total": 108800.0,
    "Custo Total": 76160.0,
    "Total Vendido": 105000.0,
    "Valor Lucro": 28840.0,
    "Nome Vendedor": "Juliana Prado",
    NOME_VENDEDOR_ITEM: "Juliana Prado",
    Item: 1,
    "Número da carga": "CRG-2409-15",
    "Nome da Carga": "Rota Macro Campinas & RMC",
    "Comprimento padrão": "12.000 mm",
    "Quantidade de peças": 40,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 12800,
    "Valor Frete": 3400.0,
    Classificacao: "Curva A",
  },
  {
    id: "SL-1003",
    "Código do Produto": "CHP-XAD-008",
    "Nome do Produto": "Chapa Piso Xadrez Aço SAE 1020 4.75mm (3/16)",
    NOVO_GRUPO: "Chapas Laminadas",
    NOVO_SUB_GRUPO: "Chapas Piso",
    UND: "KG",
    DATA: "2024-10-04",
    "Número documentos": "NF-104825",
    "Nome Cliente": "Caldeiraria & Equipamentos Sul Brasil",
    "CNPJ/CPF": "04.***.***/0001-52",
    "Grupo Cadastral": "Caldeiraria Pesada",
    CIDADE: "São José dos Pinhais",
    Estado: "PR",
    "Cidade Entrega": "Araucária",
    "Estado Entrega": "PR",
    COD_EMPRESA: "03",
    NOME_EMPRESA: "DRAFER Soluções Filial PR",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 5400,
    Quantidade: 5400,
    "Valor Total": 44820.0,
    "Custo Total": 31374.0,
    "Total Vendido": 43500.0,
    "Valor Lucro": 12126.0,
    "Nome Vendedor": "Ricardo Neves",
    NOME_VENDEDOR_ITEM: "Ricardo Neves",
    Item: 1,
    "Número da carga": "CRG-2409-18",
    "Nome da Carga": "Rota Grande Curitiba",
    "Comprimento padrão": "3.000 x 1.200 mm",
    "Quantidade de peças": 30,
    "Grupo análise de crédito": "Risco Moderado (B)",
    "Quantidade Kg": 5400,
    "Valor Frete": 1500.0,
    Classificacao: "Curva B",
  },
  {
    id: "SL-1004",
    "Código do Produto": "VAL-ESF-300",
    "Nome do Produto": "Válvula Esfera Flangeada ANSI 150 Inox 316 4 Pol.",
    NOVO_GRUPO: "Válvulas Industriais",
    NOVO_SUB_GRUPO: "Válvulas Esfera",
    UND: "PC",
    DATA: "2024-10-05",
    "Número documentos": "NF-104828",
    "Nome Cliente": "Mineração & Siderurgia Vale das Minas",
    "CNPJ/CPF": "19.***.***/0001-30",
    "Grupo Cadastral": "Mineração e Fertilizantes",
    CIDADE: "Belo Horizonte",
    Estado: "MG",
    "Cidade Entrega": "Congonhas",
    "Estado Entrega": "MG",
    COD_EMPRESA: "04",
    NOME_EMPRESA: "DRAFER Sudeste Filial MG",
    "Dispositivos Fiscal": "6102 - Venda Interestadual",
    "Peso Bruto": 450,
    Quantidade: 18,
    "Valor Total": 59400.0,
    "Custo Total": 35640.0,
    "Total Vendido": 58000.0,
    "Valor Lucro": 22360.0,
    "Nome Vendedor": "Camila Guimarães",
    NOME_VENDEDOR_ITEM: "Camila Guimarães",
    Item: 1,
    "Número da carga": "CRG-2409-22",
    "Nome da Carga": "Rota Quadrilátero Ferrífero",
    "Comprimento padrão": "Padrão ANSI B16.10",
    "Quantidade de peças": 18,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 450,
    "Valor Frete": 850.0,
    Classificacao: "Curva A",
  },
  {
    id: "SL-1005",
    "Código do Produto": "CNX-FOR-045",
    "Nome do Produto": "Curva 90 Graus Raio Longo Sch 40 A234 WPB 3 Pol.",
    NOVO_GRUPO: "Conexões Forjadas",
    NOVO_SUB_GRUPO: "Conexões Tubulares",
    UND: "PC",
    DATA: "2024-10-06",
    "Número documentos": "NF-104830",
    "Nome Cliente": "Agroindustrial Centro-Oeste Equipamentos",
    "CNPJ/CPF": "22.***.***/0003-88",
    "Grupo Cadastral": "Agronegócio & Alimentos",
    CIDADE: "Ribeirão Preto",
    Estado: "SP",
    "Cidade Entrega": "Ribeirão Preto",
    "Estado Entrega": "SP",
    COD_EMPRESA: "02",
    NOME_EMPRESA: "DRAFER Aços Filial SP",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 620,
    Quantidade: 120,
    "Valor Total": 21600.0,
    "Custo Total": 12960.0,
    "Total Vendido": 20800.0,
    "Valor Lucro": 7840.0,
    "Nome Vendedor": "Juliana Prado",
    NOME_VENDEDOR_ITEM: "Juliana Prado",
    Item: 2,
    "Número da carga": "CRG-2409-25",
    "Nome da Carga": "Rota Interior Paulista",
    "Comprimento padrão": "Norma ASME B16.9",
    "Quantidade de peças": 120,
    "Grupo análise de crédito": "Risco Moderado (B)",
    "Quantidade Kg": 620,
    "Valor Frete": 600.0,
    Classificacao: "Curva B",
  },
  {
    id: "SL-1006",
    "Código do Produto": "BAR-TRF-025",
    "Nome do Produto": "Barra Redonda Trefilada SAE 1045 Ø 1.1/2 Pol.",
    NOVO_GRUPO: "Barras Trefiladas",
    NOVO_SUB_GRUPO: "Barras Redondas",
    UND: "KG",
    DATA: "2024-10-07",
    "Número documentos": "NF-104835",
    "Nome Cliente": "Usinagem de Precisão Blumenau Ltda",
    "CNPJ/CPF": "79.***.***/0001-11",
    "Grupo Cadastral": "Usinagem & Ferramentaria",
    CIDADE: "Blumenau",
    Estado: "SC",
    "Cidade Entrega": "Blumenau",
    "Estado Entrega": "SC",
    COD_EMPRESA: "01",
    NOME_EMPRESA: "DRAFER Tubos Matriz",
    "Dispositivos Fiscal": "5101 - Venda Prod. Estabelecimento",
    "Peso Bruto": 3100,
    Quantidade: 3100,
    "Valor Total": 27900.0,
    "Custo Total": 18135.0,
    "Total Vendido": 26800.0,
    "Valor Lucro": 8665.0,
    "Nome Vendedor": "Marcos Silveira",
    NOME_VENDEDOR_ITEM: "Marcos Silveira",
    Item: 1,
    "Número da carga": "CRG-2409-28",
    "Nome da Carga": "Rota Vale do Itajaí",
    "Comprimento padrão": "6.000 mm",
    "Quantidade de peças": 45,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 3100,
    "Valor Frete": 750.0,
    Classificacao: "Curva B",
  },
  {
    id: "SL-1007",
    "Código do Produto": "TUB-IND-0200",
    "Nome do Produto": "Tubo Mecânico Laminado ST 52 Ø 180x140mm",
    NOVO_GRUPO: "Tubos Industriais",
    NOVO_SUB_GRUPO: "Tubos Mecânicos Sem Costura",
    UND: "KG",
    DATA: "2024-10-08",
    "Número documentos": "NF-104840",
    "Nome Cliente": "Hidráulica & Automação Betim",
    "CNPJ/CPF": "25.***.***/0002-40",
    "Grupo Cadastral": "Sistemas Hidráulicos",
    CIDADE: "Betim",
    Estado: "MG",
    "Cidade Entrega": "Contagem",
    "Estado Entrega": "MG",
    COD_EMPRESA: "04",
    NOME_EMPRESA: "DRAFER Sudeste Filial MG",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 6800,
    Quantidade: 6800,
    "Valor Total": 81600.0,
    "Custo Total": 54672.0,
    "Total Vendido": 79500.0,
    "Valor Lucro": 24828.0,
    "Nome Vendedor": "Camila Guimarães",
    NOME_VENDEDOR_ITEM: "Camila Guimarães",
    Item: 1,
    "Número da carga": "CRG-2409-30",
    "Nome da Carga": "Rota RMBH / Contagem",
    "Comprimento padrão": "5.500 mm",
    "Quantidade de peças": 22,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 6800,
    "Valor Frete": 2100.0,
    Classificacao: "Curva A",
  },
  {
    id: "SL-1008",
    "Código do Produto": "PRF-EST-080",
    "Nome do Produto": "Cantoneira Laminada Abas Iguais 2 x 1/4 Pol. ASTM A36",
    NOVO_GRUPO: "Perfis Estruturais",
    NOVO_SUB_GRUPO: "Cantoneiras e Barras Chata",
    UND: "MT",
    DATA: "2024-10-09",
    "Número documentos": "NF-104842",
    "Nome Cliente": "Serralheria & Estruturas Maringá",
    "CNPJ/CPF": "75.***.***/0001-99",
    "Grupo Cadastral": "Serralherias e Revendas",
    CIDADE: "Maringá",
    Estado: "PR",
    "Cidade Entrega": "Maringá",
    "Estado Entrega": "PR",
    COD_EMPRESA: "03",
    NOME_EMPRESA: "DRAFER Soluções Filial PR",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 1850,
    Quantidade: 380,
    "Valor Total": 14440.0,
    "Custo Total": 9819.0,
    "Total Vendido": 14100.0,
    "Valor Lucro": 4281.0,
    "Nome Vendedor": "Ricardo Neves",
    NOME_VENDEDOR_ITEM: "Ricardo Neves",
    Item: 1,
    "Número da carga": "CRG-2409-33",
    "Nome da Carga": "Rota Norte Paranaense",
    "Comprimento padrão": "6.000 mm",
    "Quantidade de peças": 63,
    "Grupo análise de crédito": "Risco Controlado (C)",
    "Quantidade Kg": 1850,
    "Valor Frete": 520.0,
    Classificacao: "Curva C",
  },
  {
    id: "SL-1009",
    "Código do Produto": "TUB-IND-0105",
    "Nome do Produto": "Tubo Galvanizado a Fogo NBR 5580 1.1/2 Pol.",
    NOVO_GRUPO: "Tubos Industriais",
    NOVO_SUB_GRUPO: "Tubos Galvanizados",
    UND: "PC",
    DATA: "2024-10-10",
    "Número documentos": "NF-104845",
    "Nome Cliente": "Construtora Horizonte Belo Ltda",
    "CNPJ/CPF": "17.***.***/0001-05",
    "Grupo Cadastral": "Construção Civil & Montagens",
    CIDADE: "Belo Horizonte",
    Estado: "MG",
    "Cidade Entrega": "Nova Lima",
    "Estado Entrega": "MG",
    COD_EMPRESA: "04",
    NOME_EMPRESA: "DRAFER Sudeste Filial MG",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 2940,
    Quantidade: 140,
    "Valor Total": 32200.0,
    "Custo Total": 21896.0,
    "Total Vendido": 31500.0,
    "Valor Lucro": 9604.0,
    "Nome Vendedor": "Camila Guimarães",
    NOME_VENDEDOR_ITEM: "Camila Guimarães",
    Item: 1,
    "Número da carga": "CRG-2409-35",
    "Nome da Carga": "Rota RMBH / Nova Lima",
    "Comprimento padrão": "6.000 mm",
    "Quantidade de peças": 140,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 2940,
    "Valor Frete": 920.0,
    Classificacao: "Curva B",
  },
  {
    id: "SL-1010",
    "Código do Produto": "CHP-XAD-012",
    "Nome do Produto": "Chapa Fina a Quente SAE 1008 3.00mm (1/8)",
    NOVO_GRUPO: "Chapas Laminadas",
    NOVO_SUB_GRUPO: "Chapas Lisas Quente",
    UND: "KG",
    DATA: "2024-10-11",
    "Número documentos": "NF-104850",
    "Nome Cliente": "Estruturas Metálicas Paulistas Ltda",
    "CNPJ/CPF": "61.***.***/0002-18",
    "Grupo Cadastral": "Construção Civil & Montagens",
    CIDADE: "Campinas",
    Estado: "SP",
    "Cidade Entrega": "Hortolândia",
    "Estado Entrega": "SP",
    COD_EMPRESA: "02",
    NOME_EMPRESA: "DRAFER Aços Filial SP",
    "Dispositivos Fiscal": "5102 - Venda de Mercadoria Terceiros",
    "Peso Bruto": 8900,
    Quantidade: 8900,
    "Valor Total": 66750.0,
    "Custo Total": 46057.5,
    "Total Vendido": 64800.0,
    "Valor Lucro": 18742.5,
    "Nome Vendedor": "Juliana Prado",
    NOME_VENDEDOR_ITEM: "Juliana Prado",
    Item: 1,
    "Número da carga": "CRG-2409-38",
    "Nome da Carga": "Rota RMC & Campinas",
    "Comprimento padrão": "3.000 x 1.500 mm",
    "Quantidade de peças": 52,
    "Grupo análise de crédito": "Risco Baixo (A)",
    "Quantidade Kg": 8900,
    "Valor Frete": 2300.0,
    Classificacao: "Curva A",
  },
];

export const MOCK_RECEIVABLES: ReceivableItem[] = [
  {
    id: "REC-2024-001",
    cliente: "Estruturas Metálicas Paulistas Ltda",
    cnpjCpf: "61.***.***/0002-18",
    empresa: "DRAFER Aços Filial SP",
    empresaCod: "02",
    documentoOrigem: "NF-104822",
    numeroTitulo: "TIT-88910",
    numeroParcela: "01/03",
    emissao: "2024-10-03",
    vencimento: "2024-11-03",
    valorOriginal: 35000.0,
    valorRecebido: 35000.0,
    descontos: 0,
    juros: 0,
    multas: 0,
    saldoEmAberto: 0,
    dataRecebimento: "2024-11-01",
    status: "Recebido",
    diasAtraso: 0,
    faixaAging: "A vencer",
    historicoLiquidacoes: [
      { data: "2024-11-01", valor: 35000.0, forma: "TED Corporativa", banco: "Itaú BBA" },
    ],
  },
  {
    id: "REC-2024-002",
    cliente: "Estruturas Metálicas Paulistas Ltda",
    cnpjCpf: "61.***.***/0002-18",
    empresa: "DRAFER Aços Filial SP",
    empresaCod: "02",
    documentoOrigem: "NF-104822",
    numeroTitulo: "TIT-88910",
    numeroParcela: "02/03",
    emissao: "2024-10-03",
    vencimento: "2024-12-03",
    valorOriginal: 35000.0,
    valorRecebido: 0,
    descontos: 0,
    juros: 0,
    multas: 0,
    saldoEmAberto: 35000.0,
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "REC-2024-003",
    cliente: "Metalúrgica Catarinense SA",
    cnpjCpf: "84.***.***/0001-90",
    empresa: "DRAFER Tubos Matriz",
    empresaCod: "01",
    documentoOrigem: "NF-104821",
    numeroTitulo: "TIT-88905",
    numeroParcela: "01/02",
    emissao: "2024-10-02",
    vencimento: "2024-10-25",
    valorOriginal: 18600.0,
    valorRecebido: 10000.0,
    descontos: 0,
    juros: 150.0,
    multas: 0,
    saldoEmAberto: 8750.0,
    dataRecebimento: "2024-10-27",
    status: "Parcialmente recebido",
    diasAtraso: 0,
    faixaAging: "A vencer",
    historicoLiquidacoes: [
      { data: "2024-10-27", valor: 10000.0, forma: "Boleto Bancário", banco: "Bradesco Empresas" },
    ],
  },
  {
    id: "REC-2024-004",
    cliente: "Serralheria & Estruturas Maringá",
    cnpjCpf: "75.***.***/0001-99",
    empresa: "DRAFER Soluções Filial PR",
    empresaCod: "03",
    documentoOrigem: "NF-104610",
    numeroTitulo: "TIT-87420",
    numeroParcela: "01/01",
    emissao: "2024-08-15",
    vencimento: "2024-09-15",
    valorOriginal: 14100.0,
    valorRecebido: 0,
    descontos: 0,
    juros: 423.0,
    multas: 282.0,
    saldoEmAberto: 14805.0,
    status: "Vencido",
    diasAtraso: 29,
    faixaAging: "1-30 dias",
  },
  {
    id: "REC-2024-005",
    cliente: "Caldeiraria & Equipamentos Sul Brasil",
    cnpjCpf: "04.***.***/0001-52",
    empresa: "DRAFER Soluções Filial PR",
    empresaCod: "03",
    documentoOrigem: "NF-104825",
    numeroTitulo: "TIT-88915",
    numeroParcela: "01/02",
    emissao: "2024-10-04",
    vencimento: "2024-11-04",
    valorOriginal: 21750.0,
    valorRecebido: 0,
    descontos: 0,
    juros: 0,
    multas: 0,
    saldoEmAberto: 21750.0,
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "REC-2024-006",
    cliente: "Mineração & Siderurgia Vale das Minas",
    cnpjCpf: "19.***.***/0001-30",
    empresa: "DRAFER Sudeste Filial MG",
    empresaCod: "04",
    documentoOrigem: "NF-104828",
    numeroTitulo: "TIT-88920",
    numeroParcela: "01/02",
    emissao: "2024-10-05",
    vencimento: "2024-11-05",
    valorOriginal: 29000.0,
    valorRecebido: 0,
    descontos: 0,
    juros: 0,
    multas: 0,
    saldoEmAberto: 29000.0,
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "REC-2024-007",
    cliente: "Construtora Vale do Aço SA",
    cnpjCpf: "33.***.***/0001-77",
    empresa: "DRAFER Sudeste Filial MG",
    empresaCod: "04",
    documentoOrigem: "NF-104100",
    numeroTitulo: "TIT-86100",
    numeroParcela: "02/02",
    emissao: "2024-07-10",
    vencimento: "2024-08-10",
    valorOriginal: 19800.0,
    valorRecebido: 0,
    descontos: 0,
    juros: 1188.0,
    multas: 396.0,
    saldoEmAberto: 21384.0,
    status: "Vencido",
    diasAtraso: 65,
    faixaAging: "61-90 dias",
  },
];

export const MOCK_PAYABLES: PayableItem[] = [
  {
    id: "PAG-2024-001",
    fornecedor: "Gerdau Aços Longos SA",
    cnpjCpf: "33.***.***/0001-20",
    empresa: "DRAFER Tubos Matriz",
    empresaCod: "01",
    documentoOrigem: "NFe-99812",
    numeroTitulo: "DUP-55101",
    parcela: "01/03",
    emissao: "2024-09-20",
    vencimento: "2024-10-20",
    valorOriginal: 125000.0,
    valorPago: 125000.0,
    saldoPendente: 0,
    dataPagamento: "2024-10-18",
    categoriaFinanceira: "Matéria-Prima / Bobinas",
    centroCusto: "Produção Tubos",
    status: "Pago",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "PAG-2024-002",
    fornecedor: "Usiminas Siderúrgicas de MG",
    cnpjCpf: "60.***.***/0001-35",
    empresa: "DRAFER Aços Filial SP",
    empresaCod: "02",
    documentoOrigem: "NFe-88124",
    numeroTitulo: "DUP-66205",
    parcela: "02/03",
    emissao: "2024-09-15",
    vencimento: "2024-11-15",
    valorOriginal: 180000.0,
    valorPago: 0,
    saldoPendente: 180000.0,
    categoriaFinanceira: "Mercadorias para Revenda",
    centroCusto: "Estoque SP",
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "PAG-2024-003",
    fornecedor: "Transportadora RodoNaves Sul Ltda",
    cnpjCpf: "44.***.***/0001-55",
    empresa: "DRAFER Soluções Filial PR",
    empresaCod: "03",
    documentoOrigem: "CTe-33109",
    numeroTitulo: "FRE-1049",
    parcela: "01/01",
    emissao: "2024-10-01",
    vencimento: "2024-10-28",
    valorOriginal: 14500.0,
    valorPago: 0,
    saldoPendente: 14500.0,
    categoriaFinanceira: "Fretes e Logística de Entrega",
    centroCusto: "Logística PR",
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "PAG-2024-004",
    fornecedor: "Companhia Elétrica Celesc / Enel",
    cnpjCpf: "08.***.***/0001-99",
    empresa: "DRAFER Tubos Matriz",
    empresaCod: "01",
    documentoOrigem: "FAT-77291",
    numeroTitulo: "EN-2024-10",
    parcela: "01/01",
    emissao: "2024-10-01",
    vencimento: "2024-10-25",
    valorOriginal: 38400.0,
    valorPago: 0,
    saldoPendente: 38400.0,
    categoriaFinanceira: "Energia Elétrica Industrial",
    centroCusto: "Fábrica Joinville",
    status: "Em aberto",
    diasAtraso: 0,
    faixaAging: "A vencer",
  },
  {
    id: "PAG-2024-005",
    fornecedor: "ArcelorMittal Brasil SA",
    cnpjCpf: "17.***.***/0001-12",
    empresa: "DRAFER Sudeste Filial MG",
    empresaCod: "04",
    documentoOrigem: "NFe-44019",
    numeroTitulo: "DUP-44019",
    parcela: "01/02",
    emissao: "2024-08-25",
    vencimento: "2024-09-25",
    valorOriginal: 48000.0,
    valorPago: 0,
    saldoPendente: 48000.0,
    categoriaFinanceira: "Mercadorias para Revenda",
    centroCusto: "Estoque MG",
    status: "Vencido",
    diasAtraso: 19,
    faixaAging: "1-30 dias",
  },
];

export const MOCK_REPORT_CATALOG: ReportFieldCatalogItem[] = [
  { id: "cod_prod", name: "Código do Produto", label: "Cód. Produto", dataType: "string", source: "sales", allowedAggregations: ["count", "countDistinct"], description: "Código SKU do produto", isFilterable: true, isGroupable: true },
  { id: "nome_prod", name: "Nome do Produto", label: "Nome do Produto", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Descrição cadastral do item", isFilterable: true, isGroupable: true },
  { id: "grupo", name: "NOVO_GRUPO", label: "Grupo", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Categoria de produto", isFilterable: true, isGroupable: true },
  { id: "subgrupo", name: "NOVO_SUB_GRUPO", label: "Subgrupo", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Subcategoria técnica", isFilterable: true, isGroupable: true },
  { id: "und", name: "UND", label: "Unidade", dataType: "string", source: "sales", allowedAggregations: ["count"], description: "Unidade de medida faturada", isFilterable: true, isGroupable: true },
  { id: "data_venda", name: "DATA", label: "Data Venda", dataType: "date", source: "sales", allowedAggregations: ["min", "max"], description: "Data de emissão da NF", isFilterable: true, isGroupable: true },
  { id: "cliente", name: "Nome Cliente", label: "Cliente", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Razão social do cliente", isFilterable: true, isGroupable: true },
  { id: "empresa", name: "NOME_EMPRESA", label: "Empresa", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Filial do Grupo Drafer", isFilterable: true, isGroupable: true },
  { id: "vendedor", name: "Nome Vendedor", label: "Vendedor", dataType: "string", source: "sales", allowedAggregations: ["countDistinct"], description: "Representante comercial", isFilterable: true, isGroupable: true },
  { id: "valor_total", name: "Valor Total", label: "Valor Total (R$)", dataType: "currency", source: "sales", allowedAggregations: ["sum", "avg", "min", "max"], description: "Faturamento bruto do item", isFilterable: true, isGroupable: false },
  { id: "custo_total", name: "Custo Total", label: "Custo Total (R$)", dataType: "currency", source: "sales", allowedAggregations: ["sum", "avg"], description: "Custo das mercadorias vendidas", isFilterable: true, isGroupable: false },
  { id: "total_vendido", name: "Total Vendido", label: "Total Vendido (R$)", dataType: "currency", source: "sales", allowedAggregations: ["sum", "avg", "min", "max"], description: "Receita comercial líquida de descontos", isFilterable: true, isGroupable: false },
  { id: "valor_lucro", name: "Valor Lucro", label: "Valor Lucro (R$)", dataType: "currency", source: "sales", allowedAggregations: ["sum", "avg"], description: "Margem de contribuição (Total Vendido - Custo)", isFilterable: true, isGroupable: false },
  { id: "qtd_kg", name: "Quantidade Kg", label: "Peso Faturado (Kg)", dataType: "number", source: "sales", allowedAggregations: ["sum", "avg"], description: "Peso total faturado em quilogramas", isFilterable: true, isGroupable: false },
  { id: "rec_cliente", name: "cliente", label: "Cliente (Recebíveis)", dataType: "string", source: "receivables", allowedAggregations: ["countDistinct"], description: "Sacado do título", isFilterable: true, isGroupable: true },
  { id: "rec_valor", name: "valorOriginal", label: "Valor Título", dataType: "currency", source: "receivables", allowedAggregations: ["sum", "avg"], description: "Valor nominal do título", isFilterable: true, isGroupable: false },
  { id: "rec_saldo", name: "saldoEmAberto", label: "Saldo em Aberto", dataType: "currency", source: "receivables", allowedAggregations: ["sum", "avg"], description: "Saldo pendente a receber", isFilterable: true, isGroupable: false },
  { id: "rec_status", name: "status", label: "Status Recebível", dataType: "string", source: "receivables", allowedAggregations: ["count"], description: "Situação do título a receber", isFilterable: true, isGroupable: true },
];

export const MOCK_SAVED_REPORTS: SavedReportModel[] = [
  {
    id: "REP-001",
    title: "Vendas por Grupo com Margem e Lucro",
    description: "Visão consolidada de faturamento e margem agrupada por grupo de produto com ordenação por lucro decrescente.",
    dataSource: "sales",
    selectedFields: ["NOVO_GRUPO", "Total Vendido", "Custo Total", "Valor Lucro", "Quantidade Kg"],
    columnsConfig: [
      { field: "NOVO_GRUPO", label: "Grupo de Produto", width: 220 },
      { field: "Total Vendido", label: "Total Vendido (R$)", aggregation: "sum" },
      { field: "Custo Total", label: "Custo (R$)", aggregation: "sum" },
      { field: "Valor Lucro", label: "Lucro Bruto (R$)", aggregation: "sum", sort: "desc" },
      { field: "Quantidade Kg", label: "Volume (Kg)", aggregation: "sum" },
    ],
    filters: [],
    groupBy: "NOVO_GRUPO",
    isShared: true,
    createdBy: "Carlos Eduardo Schneider",
    createdAt: "2024-09-10",
    updatedAt: "2024-10-12",
    tags: ["Comercial", "Margem", "Executivo"],
  },
  {
    id: "REP-002",
    title: "Curva ABC de Clientes com Análise de Risco",
    description: "Clientes com maior representatividade no faturamento, cruzados com classificação de risco de crédito.",
    dataSource: "sales",
    selectedFields: ["Nome Cliente", "Classificacao", "Grupo análise de crédito", "Total Vendido", "Valor Lucro"],
    columnsConfig: [
      { field: "Nome Cliente", label: "Razão Social" },
      { field: "Classificacao", label: "Curva ABC" },
      { field: "Grupo análise de crédito", label: "Risco de Crédito" },
      { field: "Total Vendido", label: "Faturamento (R$)", aggregation: "sum", sort: "desc" },
      { field: "Valor Lucro", label: "Lucro (R$)", aggregation: "sum" },
    ],
    filters: [],
    groupBy: "Nome Cliente",
    isShared: true,
    createdBy: "Mariana Alcantara",
    createdAt: "2024-09-22",
    updatedAt: "2024-10-10",
    tags: ["Clientes", "Crédito", "ABC"],
  },
  {
    id: "REP-003",
    title: "Aging de Títulos Vencidos por Empresa",
    description: "Contas a receber com vencimento estourado agrupadas por filial e faixa de atraso.",
    dataSource: "receivables",
    selectedFields: ["empresa", "cliente", "numeroTitulo", "vencimento", "saldoEmAberto", "faixaAging"],
    columnsConfig: [
      { field: "empresa", label: "Filial" },
      { field: "cliente", label: "Cliente" },
      { field: "numeroTitulo", label: "Título" },
      { field: "vencimento", label: "Vencimento" },
      { field: "saldoEmAberto", label: "Saldo Vencido (R$)", aggregation: "sum", sort: "desc" },
      { field: "faixaAging", label: "Faixa de Atraso" },
    ],
    filters: [
      { id: "f1", field: "status", operator: "equals", value: "Vencido" }
    ],
    groupBy: "empresa",
    isShared: false,
    createdBy: "Rodrigo Fagundes",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-14",
    tags: ["Financeiro", "Inadimplência", "Cobrança"],
  },
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-801",
    timestamp: "2024-10-14 10:14:22",
    userId: "USR-01",
    userName: "Carlos Eduardo Schneider",
    userRole: "Superadmin",
    action: "LOGIN",
    module: "Autenticação",
    details: "Acesso autenticado com perfil Superadmin via rede local segura",
    ipAddress: "192.168.10.104",
    severity: "info",
  },
  {
    id: "AUD-802",
    timestamp: "2024-10-14 09:42:15",
    userId: "USR-02",
    userName: "Mariana Alcantara",
    userRole: "Diretoria",
    action: "VIEW_DRE",
    module: "DRE Gerencial",
    details: "Consulta consolidada do Grupo Drafer com eliminação intercompany ativada",
    ipAddress: "192.168.10.15",
    severity: "info",
  },
  {
    id: "AUD-803",
    timestamp: "2024-10-14 09:12:00",
    userId: "USR-04",
    userName: "Fernanda Bittencourt",
    userRole: "Comercial",
    action: "EXPORT_SALES_CSV",
    module: "Vendas por Produto",
    details: "Exportação de 10 registros de vendas com os 34 campos",
    ipAddress: "192.168.10.88",
    severity: "security",
  },
  {
    id: "AUD-804",
    timestamp: "2024-10-13 16:30:11",
    userId: "USR-03",
    userName: "Rodrigo Fagundes",
    userRole: "Financeiro",
    action: "CHANGE_SCENARIO",
    module: "Fluxo de Caixa",
    details: "Simulação de cenário conservador com ajuste de inadimplência para 3.5%",
    ipAddress: "192.168.10.52",
    severity: "info",
  },
];

export class MockDataProvider implements IDataProvider {
  readonly providerName = "MockDataProvider";

  async getDashboardMetrics(filters: GlobalFilters): Promise<DashboardMetrics> {
    // Computes aggregate numbers dynamically matching mock data
    const items = await this.getSalesItems(filters);
    const receivables = await this.getReceivables(filters);
    const payables = await this.getPayables(filters);

    const grossRevenue = items.reduce((acc, it) => acc + it["Valor Total"], 0) || 448510.0;
    const netRevenue = items.reduce((acc, it) => acc + it["Total Vendido"], 0) || 435700.0;
    const grossProfit = items.reduce((acc, it) => acc + it["Valor Lucro"], 0) || 128604.5;
    const grossMarginPct = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 29.5;
    
    // Net result considering administrative / sales / taxes
    const netResult = grossProfit * 0.48; // ~48% do lucro bruto
    const netMarginPct = netRevenue > 0 ? (netResult / netRevenue) * 100 : 14.1;

    const totalReceivables = receivables.reduce((acc, r) => acc + r.saldoEmAberto, 0);
    const overdueReceivables = receivables
      .filter(r => r.status === "Vencido")
      .reduce((acc, r) => acc + r.saldoEmAberto, 0);

    const totalPayables = payables.reduce((acc, p) => acc + p.saldoPendente, 0);
    const overduePayables = payables
      .filter(p => p.status === "Vencido")
      .reduce((acc, p) => acc + p.saldoPendente, 0);

    const totalVolumeKg = items.reduce((acc, it) => acc + it["Quantidade Kg"], 0);
    const totalPieces = items.reduce((acc, it) => acc + it["Quantidade de peças"], 0);
    const uniqueDocs = new Set(items.map(it => it["Número documentos"])).size || 1;
    const averageTicket = netRevenue / uniqueDocs;
    const activeClientsCount = new Set(items.map(it => it["Nome Cliente"])).size;

    return {
      grossRevenue,
      netRevenue,
      grossProfit,
      grossMarginPct,
      netResult,
      netMarginPct,
      totalReceivables,
      totalPayables,
      overdueReceivables,
      overduePayables,
      projectedCashBalance: 1248500.0,
      averageTicket,
      totalVolumeKg,
      totalPieces,
      activeClientsCount,
      monthlySalesTrend: [
        { month: "Jan", currentYear: 380000, previousYear: 320000, target: 360000 },
        { month: "Fev", currentYear: 410000, previousYear: 345000, target: 390000 },
        { month: "Mar", currentYear: 450000, previousYear: 390000, target: 420000 },
        { month: "Abr", currentYear: 435000, previousYear: 380000, target: 430000 },
        { month: "Mai", currentYear: 490000, previousYear: 410000, target: 460000 },
        { month: "Jun", currentYear: 520000, previousYear: 440000, target: 480000 },
        { month: "Jul", currentYear: 510000, previousYear: 455000, target: 500000 },
        { month: "Ago", currentYear: 540000, previousYear: 470000, target: 520000 },
        { month: "Set", currentYear: 565000, previousYear: 490000, target: 530000 },
        { month: "Out", currentYear: 580000, previousYear: 505000, target: 550000 },
      ],
      revenueVsCostsTrend: [
        { month: "Mai", revenue: 490000, costs: 343000, profit: 147000 },
        { month: "Jun", revenue: 520000, costs: 364000, profit: 156000 },
        { month: "Jul", revenue: 510000, costs: 357000, profit: 153000 },
        { month: "Ago", revenue: 540000, costs: 378000, profit: 162000 },
        { month: "Set", revenue: 565000, costs: 395500, profit: 169500 },
        { month: "Out", revenue: 580000, costs: 406000, profit: 174000 },
      ],
      profitByCompany: [
        { company: "DRAFER Tubos Matriz", code: "01", revenue: 2150000, profit: 645000, margin: 30.0 },
        { company: "DRAFER Aços Filial SP", code: "02", revenue: 1780000, profit: 516200, margin: 29.0 },
        { company: "DRAFER Soluções Filial PR", code: "03", revenue: 980000, profit: 274400, margin: 28.0 },
        { company: "DRAFER Sudeste Filial MG", code: "04", revenue: 890000, profit: 267000, margin: 30.0 },
      ],
      productCategoryShare: [
        { name: "Tubos Industriais", value: 2450000, sharePct: 42.2 },
        { name: "Perfis Estruturais", value: 1680000, sharePct: 29.0 },
        { name: "Chapas Laminadas", value: 890000, sharePct: 15.3 },
        { name: "Válvulas & Conexões", value: 520000, sharePct: 9.0 },
        { name: "Barras Trefiladas", value: 260000, sharePct: 4.5 },
      ],
      topSalesReps: [
        { name: "Juliana Prado", revenue: 1650000, target: 1500000, achievementPct: 110.0, ordersCount: 84 },
        { name: "Marcos Silveira", revenue: 1480000, target: 1400000, achievementPct: 105.7, ordersCount: 92 },
        { name: "Camila Guimarães", revenue: 1320000, target: 1300000, achievementPct: 101.5, ordersCount: 71 },
        { name: "Ricardo Neves", revenue: 1150000, target: 1200000, achievementPct: 95.8, ordersCount: 65 },
      ],
      receivablesAging: [
        { bucket: "A vencer", amount: 1845000, count: 142 },
        { bucket: "1-30 dias", amount: 145000, count: 18 },
        { bucket: "31-60 dias", amount: 68000, count: 7 },
        { bucket: "61-90 dias", amount: 42000, count: 4 },
        { bucket: "> 90 dias", amount: 28000, count: 3 },
      ],
      payablesAging: [
        { bucket: "A vencer", amount: 1420000, count: 98 },
        { bucket: "1-30 dias", amount: 89000, count: 11 },
        { bucket: "31-60 dias", amount: 32000, count: 3 },
        { bucket: "61-90 dias", amount: 14000, count: 1 },
        { bucket: "> 90 dias", amount: 0, count: 0 },
      ],
      managerialResultTrend: [
        { month: "Mai", grossRevenue: 490000, ebitda: 98000, netResult: 70500 },
        { month: "Jun", grossRevenue: 520000, ebitda: 104000, netResult: 74800 },
        { month: "Jul", grossRevenue: 510000, ebitda: 102000, netResult: 73400 },
        { month: "Ago", grossRevenue: 540000, ebitda: 113400, netResult: 81600 },
        { month: "Set", grossRevenue: 565000, ebitda: 124300, netResult: 89500 },
        { month: "Out", grossRevenue: 580000, ebitda: 127600, netResult: 91800 },
      ],
      source: "MOCK",
    };
  }

  async getSalesItems(filters: GlobalFilters): Promise<SalesItem34[]> {
    return MOCK_SALES_ITEMS.filter(item => {
      if (filters.companyId && filters.companyId !== "all" && item.COD_EMPRESA !== filters.companyId.replace("EMP-", "")) {
        return false;
      }
      if (filters.group && filters.group !== "all" && item.NOVO_GRUPO !== filters.group) {
        return false;
      }
      if (filters.repId && filters.repId !== "all" && !item["Nome Vendedor"].includes(filters.repId)) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          item["Nome do Produto"].toLowerCase().includes(q) ||
          item["Código do Produto"].toLowerCase().includes(q) ||
          item["Nome Cliente"].toLowerCase().includes(q) ||
          item["Número documentos"].toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }

  async getSalesByClient(filters: GlobalFilters): Promise<any[]> {
    const items = await this.getSalesItems(filters);
    const clientMap = new Map<string, any>();

    for (const item of items) {
      const name = item["Nome Cliente"];
      if (!clientMap.has(name)) {
        clientMap.set(name, {
          cliente: name,
          cnpj: item["CNPJ/CPF"],
          cidade: item.CIDADE,
          estado: item.Estado,
          curvaAbc: item.Classificacao,
          riscoCredito: item["Grupo análise de crédito"],
          totalVendido: 0,
          valorLucro: 0,
          pesoTotalKg: 0,
          pedidosCount: 0,
        });
      }
      const entry = clientMap.get(name)!;
      entry.totalVendido += item["Total Vendido"];
      entry.valorLucro += item["Valor Lucro"];
      entry.pesoTotalKg += item["Quantidade Kg"];
      entry.pedidosCount += 1;
    }

    return Array.from(clientMap.values()).map(c => ({
      ...c,
      margemPct: c.totalVendido > 0 ? (c.valorLucro / c.totalVendido) * 100 : 0,
    })).sort((a, b) => b.totalVendido - a.totalVendido);
  }

  async getSalesByRep(filters: GlobalFilters): Promise<any[]> {
    const items = await this.getSalesItems(filters);
    const repMap = new Map<string, any>();

    for (const item of items) {
      const rep = item["Nome Vendedor"];
      if (!repMap.has(rep)) {
        repMap.set(rep, {
          vendedor: rep,
          totalVendido: 0,
          valorLucro: 0,
          pesoKg: 0,
          pedidos: 0,
          clientes: new Set<string>(),
        });
      }
      const entry = repMap.get(rep)!;
      entry.totalVendido += item["Total Vendido"];
      entry.valorLucro += item["Valor Lucro"];
      entry.pesoKg += item["Quantidade Kg"];
      entry.pedidos += 1;
      entry.clientes.add(item["Nome Cliente"]);
    }

    return Array.from(repMap.values()).map(r => ({
      vendedor: r.vendedor,
      totalVendido: r.totalVendido,
      valorLucro: r.valorLucro,
      margemPct: r.totalVendido > 0 ? (r.valorLucro / r.totalVendido) * 100 : 0,
      pesoKg: r.pesoKg,
      pedidos: r.pedidos,
      clientesAtivos: r.clientes.size,
      ticketMedio: r.pedidos > 0 ? r.totalVendido / r.pedidos : 0,
    })).sort((a, b) => b.totalVendido - a.totalVendido);
  }

  async getSalesByCompany(filters: GlobalFilters): Promise<any[]> {
    const items = await this.getSalesItems(filters);
    const compMap = new Map<string, any>();

    for (const item of items) {
      const emp = item.NOME_EMPRESA;
      if (!compMap.has(emp)) {
        compMap.set(emp, {
          empresa: emp,
          cod: item.COD_EMPRESA,
          totalVendido: 0,
          custoTotal: 0,
          valorLucro: 0,
          pesoKg: 0,
          notasFiscais: 0,
        });
      }
      const e = compMap.get(emp)!;
      e.totalVendido += item["Total Vendido"];
      e.custoTotal += item["Custo Total"];
      e.valorLucro += item["Valor Lucro"];
      e.pesoKg += item["Quantidade Kg"];
      e.notasFiscais += 1;
    }

    return Array.from(compMap.values()).map(c => ({
      ...c,
      margemPct: c.totalVendido > 0 ? (c.valorLucro / c.totalVendido) * 100 : 0,
    })).sort((a, b) => b.totalVendido - a.totalVendido);
  }

  async getMarginAnalysis(filters: GlobalFilters): Promise<any[]> {
    const items = await this.getSalesItems(filters);
    return items.map(item => {
      const margemPct = item["Total Vendido"] > 0 ? (item["Valor Lucro"] / item["Total Vendido"]) * 100 : 0;
      const markup = item["Custo Total"] > 0 ? (item["Total Vendido"] / item["Custo Total"] - 1) * 100 : 0;
      const precoMedioUnitario = item.Quantidade > 0 ? item["Total Vendido"] / item.Quantidade : 0;
      return {
        id: item.id,
        produto: item["Nome do Produto"],
        sku: item["Código do Produto"],
        grupo: item.NOVO_GRUPO,
        und: item.UND,
        quantidade: item.Quantidade,
        totalVendido: item["Total Vendido"],
        custoTotal: item["Custo Total"],
        valorLucro: item["Valor Lucro"],
        margemPct,
        markup,
        precoMedioUnitario,
        statusMargem: margemPct < 15 ? "Crítica" : margemPct < 28 ? "Adequada" : "Excelente",
      };
    }).sort((a, b) => b.valorLucro - a.valorLucro);
  }

  async getDreStatement(
    year: number,
    periodType: "monthly" | "quarterly" | "annual",
    companyId: string,
    eliminateIntercompany: boolean
  ): Promise<{ periods: string[]; lines: DreLineItem[]; summary: DreSummaryKpis }> {
    let periods: string[] = [];
    if (periodType === "monthly") {
      periods = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Total Ano"];
    } else if (periodType === "quarterly") {
      periods = ["1º Tri (Q1)", "2º Tri (Q2)", "3º Tri (Q3)", "4º Tri (Q4)", "Total Ano"];
    } else {
      periods = ["2023 Realizado", "2024 Projetado", "Variação %"];
    }

    const isConsolidated = !companyId || companyId === "all";

    // Receita Bruta base por empresa ou consolidada do Grupo
    let baseGross = 5800000;
    if (companyId === "EMP-01" || companyId === "01") {
      baseGross = 2150000;
    } else if (companyId === "EMP-02" || companyId === "02") {
      baseGross = 1780000;
    } else if (companyId === "EMP-03" || companyId === "03") {
      baseGross = 980000;
    } else if (companyId === "EMP-04" || companyId === "04") {
      baseGross = 890000;
    }

    // Regra Contábil de Eliminação Intercompany:
    // Aplica-se ESTRITAMENTE ao Grupo Consolidado ('all').
    // Em demonstrativos individuais de filiais, transações legais entre empresas do grupo permanecem para fins fiscais/contábeis locais.
    const intercompanyEliminatedTotal = (isConsolidated && eliminateIntercompany) ? 384000.0 : 0;
    const grossAfterIntercompany = baseGross - intercompanyEliminatedTotal;

    const deductionsRate = 0.165; // ICMS, PIS, COFINS médios
    const netRevenue = grossAfterIntercompany * (1 - deductionsRate);
    const cmvRate = 0.64;
    // No consolidado, o custo intercompany da filial compradora também é eliminado na mesma proporção do faturamento intercompany
    const grossProfit = netRevenue * (1 - cmvRate);
    const salesExpenses = netRevenue * 0.085;
    const adminExpenses = netRevenue * 0.075;
    const otherExpenses = netRevenue * 0.02;
    const ebitda = grossProfit - salesExpenses - adminExpenses - otherExpenses;
    const finResult = -netRevenue * 0.015; // Juros bancários líquidos negativos
    const lair = ebitda + finResult;
    const taxes = lair * 0.25; // IRPJ/CSLL
    const netResult = lair - taxes;

    // Helper to generate monthly distribution
    const makeMonthly = (annualTotal: number) => {
      const weights = [0.075, 0.078, 0.085, 0.082, 0.088, 0.091, 0.089, 0.094, 0.092, 0.095, 0.080, 0.051];
      const res: Record<string, number> = {};
      let sum = 0;
      periods.forEach((p, idx) => {
        if (p === "Total Ano") {
          res[p] = sum;
        } else if (periodType === "monthly") {
          const val = annualTotal * weights[idx];
          res[p] = Math.round(val);
          sum += res[p];
        } else if (periodType === "quarterly") {
          const qVal = annualTotal * 0.25;
          res[p] = Math.round(qVal);
          sum += res[p];
        } else {
          res[p] = Math.round(annualTotal);
        }
      });
      return res;
    };

    const lines: DreLineItem[] = [
      {
        id: "dre-1",
        code: "1.0",
        name: "1. RECEITA OPERACIONAL BRUTA",
        level: 1,
        type: "addition",
        isBold: true,
        values: makeMonthly(grossAfterIntercompany),
        children: [
          { id: "dre-1-1", code: "1.1", name: "Venda de Produtos Fabricados (Tubos e Conexões)", values: makeMonthly(grossAfterIntercompany * 0.58) },
          { id: "dre-1-2", code: "1.2", name: "Revenda de Mercadorias (Perfis, Chapas, Válvulas)", values: makeMonthly(grossAfterIntercompany * 0.42) },
        ],
      },
      {
        id: "dre-2",
        code: "2.0",
        name: "2. (-) DEDUÇÕES DA RECEITA BRUTA",
        level: 1,
        type: "deduction",
        isBold: false,
        values: makeMonthly(grossAfterIntercompany * deductionsRate),
        children: [
          { id: "dre-2-1", code: "2.1", name: "Impostos sobre Vendas (ICMS, PIS, COFINS)", isNegative: true, values: makeMonthly(grossAfterIntercompany * 0.145) },
          { id: "dre-2-2", code: "2.2", name: "Devoluções e Cancelamentos de Vendas", isNegative: true, values: makeMonthly(grossAfterIntercompany * 0.02) },
        ],
      },
      {
        id: "dre-3",
        code: "3.0",
        name: "3. (=) RECEITA OPERACIONAL LÍQUIDA",
        level: 1,
        type: "subtotal",
        isBold: true,
        isHighlight: true,
        values: makeMonthly(netRevenue),
      },
      {
        id: "dre-4",
        code: "4.0",
        name: "4. (-) CUSTOS DAS VENDAS (CPV / CMV)",
        level: 1,
        type: "deduction",
        isBold: false,
        values: makeMonthly(netRevenue * cmvRate),
        children: [
          { id: "dre-4-1", code: "4.1", name: "Matéria-Prima Consumida (Bobinas e Chapas)", isNegative: true, values: makeMonthly(netRevenue * 0.45) },
          { id: "dre-4-2", code: "4.2", name: "Custo de Mercadorias para Revenda", isNegative: true, values: makeMonthly(netRevenue * 0.12) },
          { id: "dre-4-3", code: "4.3", name: "Mão de Obra Direta e Energia Fabril", isNegative: true, values: makeMonthly(netRevenue * 0.07) },
        ],
      },
      {
        id: "dre-5",
        code: "5.0",
        name: "5. (=) LUCRO BRUTO GERENCIAL",
        level: 1,
        type: "subtotal",
        isBold: true,
        isHighlight: true,
        values: makeMonthly(grossProfit),
      },
      {
        id: "dre-6",
        code: "6.0",
        name: "6. (-) DESPESAS OPERACIONAIS",
        level: 1,
        type: "deduction",
        isBold: false,
        values: makeMonthly(salesExpenses + adminExpenses + otherExpenses),
        children: [
          { id: "dre-6-1", code: "6.1", name: "Despesas com Vendas (Fretes de Saída e Comissões)", isNegative: true, values: makeMonthly(salesExpenses) },
          { id: "dre-6-2", code: "6.2", name: "Despesas Gerais e Administrativas (Pessoal e Ocupação)", isNegative: true, values: makeMonthly(adminExpenses) },
          { id: "dre-6-3", code: "6.3", name: "Outras Despesas e Perdas Operacionais", isNegative: true, values: makeMonthly(otherExpenses) },
        ],
      },
      {
        id: "dre-7",
        code: "7.0",
        name: "7. (=) RESULTADO OPERACIONAL (EBITDA / LAJIDA)",
        level: 1,
        type: "subtotal",
        isBold: true,
        isHighlight: true,
        values: makeMonthly(ebitda),
      },
      {
        id: "dre-8",
        code: "8.0",
        name: "8. (+/-) RESULTADO FINANCEIRO LÍQUIDO",
        level: 1,
        type: "deduction",
        values: makeMonthly(finResult),
        children: [
          { id: "dre-8-1", code: "8.1", name: "Receitas Financeiras e Rendimentos de Aplicações", values: makeMonthly(netRevenue * 0.008) },
          { id: "dre-8-2", code: "8.2", name: "Despesas Financeiras e Juros de Empréstimos", isNegative: true, values: makeMonthly(netRevenue * 0.023) },
        ],
      },
      {
        id: "dre-9",
        code: "9.0",
        name: "9. (=) RESULTADO ANTES DOS TRIBUTOS (LAIR)",
        level: 1,
        type: "subtotal",
        isBold: true,
        values: makeMonthly(lair),
      },
      {
        id: "dre-10",
        code: "10.0",
        name: "10. (-) TRIBUTOS SOBRE O LUCRO (IRPJ / CSLL)",
        level: 1,
        type: "deduction",
        values: makeMonthly(taxes),
      },
      {
        id: "dre-11",
        code: "11.0",
        name: "11. (=) RESULTADO LÍQUIDO DO EXERCÍCIO",
        level: 1,
        type: "total",
        isBold: true,
        isHighlight: true,
        values: makeMonthly(netResult),
      },
    ];

    const summary: DreSummaryKpis = {
      grossRevenue: grossAfterIntercompany,
      netRevenue,
      grossProfit,
      grossMarginPct: netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0,
      ebitda,
      ebitdaMarginPct: netRevenue > 0 ? (ebitda / netRevenue) * 100 : 0,
      netResult,
      netMarginPct: netRevenue > 0 ? (netResult / netRevenue) * 100 : 0,
      intercompanyEliminatedTotal,
    };

    return { periods, lines, summary };
  }

  async getReceivables(filters: GlobalFilters): Promise<ReceivableItem[]> {
    return MOCK_RECEIVABLES.filter(r => {
      if (filters.companyId && filters.companyId !== "all" && r.empresaCod !== filters.companyId.replace("EMP-", "")) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!r.cliente.toLowerCase().includes(q) && !r.numeroTitulo.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  async getPayables(filters: GlobalFilters): Promise<PayableItem[]> {
    return MOCK_PAYABLES.filter(p => {
      if (filters.companyId && filters.companyId !== "all" && p.empresaCod !== filters.companyId.replace("EMP-", "")) {
        return false;
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.fornecedor.toLowerCase().includes(q) && !p.numeroTitulo.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  async getCashFlow(filters: GlobalFilters, timeframe: "daily" | "weekly" | "monthly"): Promise<CashFlowDay[]> {
    const days: CashFlowDay[] = [];
    let runningBalance = 1248500;

    for (let i = 1; i <= 30; i++) {
      const dayStr = `2024-10-${String(i).padStart(2, "0")}`;
      const isPast = i <= 14;
      const entradasReal = isPast ? Math.round(25000 + (Math.sin(i) * 12000)) : 0;
      const saidasReal = isPast ? Math.round(20000 + (Math.cos(i) * 10000)) : 0;
      const entradasPrev = !isPast ? Math.round(28000 + (Math.sin(i) * 15000)) : 0;
      const saidasPrev = !isPast ? Math.round(22000 + (Math.cos(i) * 11000)) : 0;

      const dailyDelta = isPast ? (entradasReal - saidasReal) : (entradasPrev - saidasPrev);
      runningBalance += dailyDelta;

      days.push({
        data: dayStr,
        saldoInicial: runningBalance - dailyDelta,
        entradasRealizadas: entradasReal,
        saidasRealizadas: saidasReal,
        entradasPrevistas: entradasPrev,
        saidasPrevistas: saidasPrev,
        saldoFinal: isPast ? runningBalance : 0,
        saldoProjetado: runningBalance,
      });
    }

    return days;
  }

  async getScenarioProjections(params: ScenarioParameters): Promise<{
    months: string[];
    baseCash: number[];
    projectedCash: number[];
    inflows: number[];
    outflows: number[];
  }> {
    const months = ["Nov/24", "Dez/24", "Jan/25", "Fev/25", "Mar/25", "Abr/25"];
    let baseRunning = 1250000;
    let projRunning = 1250000;

    const baseCash: number[] = [];
    const projectedCash: number[] = [];
    const inflows: number[] = [];
    const outflows: number[] = [];

    const growthMultiplier = 1 + params.salesGrowthPct / 100;
    const defaultDeduction = 1 - params.defaultRatePct / 100;
    const expenseMultiplier = 1 + params.expensesGrowthPct / 100;

    for (let i = 0; i < months.length; i++) {
      const baseIn = 550000 * Math.pow(1.02, i);
      const baseOut = 440000 * Math.pow(1.015, i);
      baseRunning += (baseIn - baseOut);
      baseCash.push(Math.round(baseRunning));

      const projIn = baseIn * growthMultiplier * defaultDeduction;
      const projOut = baseOut * expenseMultiplier;
      projRunning += (projIn - projOut);
      projectedCash.push(Math.round(projRunning));
      inflows.push(Math.round(projIn));
      outflows.push(Math.round(projOut));
    }

    return { months, baseCash, projectedCash, inflows, outflows };
  }

  async getFinancialSummary(filters: GlobalFilters): Promise<FinancialSummaryKpis> {
    const recs = await this.getReceivables(filters);
    const pays = await this.getPayables(filters);

    const totalReceivables = recs.reduce((sum, r) => sum + r.saldoEmAberto, 0);
    const receivablesOverdue = recs.filter(r => r.status === "Vencido").reduce((sum, r) => sum + r.saldoEmAberto, 0);
    const receivablesToMature = totalReceivables - receivablesOverdue;

    const totalPayables = pays.reduce((sum, p) => sum + p.saldoPendente, 0);
    const payablesOverdue = pays.filter(p => p.status === "Vencido").reduce((sum, p) => sum + p.saldoPendente, 0);
    const payablesToMature = totalPayables - payablesOverdue;

    const defaultRate = totalReceivables > 0 ? (receivablesOverdue / totalReceivables) * 100 : 0;

    return {
      totalReceivables,
      receivablesOverdue,
      receivablesToMature,
      totalPayables,
      payablesOverdue,
      payablesToMature,
      netWorkingCapital: totalReceivables - totalPayables,
      projectedCash30Days: 1395000.0,
      currentDefaultRatePct: defaultRate,
      agingBuckets: [
        { bucket: "A vencer", receivables: receivablesToMature, payables: payablesToMature },
        { bucket: "1-30 dias", receivables: 14805, payables: 48000 },
        { bucket: "31-60 dias", receivables: 0, payables: 0 },
        { bucket: "61-90 dias", receivables: 21384, payables: 0 },
        { bucket: "> 90 dias", receivables: 0, payables: 0 },
      ],
    };
  }

  async getFieldCatalog(): Promise<ReportFieldCatalogItem[]> {
    return MOCK_REPORT_CATALOG;
  }

  async getSavedReports(): Promise<SavedReportModel[]> {
    return MOCK_SAVED_REPORTS;
  }

  async saveReport(report: SavedReportModel): Promise<SavedReportModel> {
    const existingIndex = MOCK_SAVED_REPORTS.findIndex(r => r.id === report.id);
    if (existingIndex >= 0) {
      MOCK_SAVED_REPORTS[existingIndex] = { ...report, updatedAt: new Date().toISOString().slice(0, 10) };
      return MOCK_SAVED_REPORTS[existingIndex];
    } else {
      const newRep = { ...report, id: `REP-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) };
      MOCK_SAVED_REPORTS.unshift(newRep);
      return newRep;
    }
  }

  async deleteReport(id: string): Promise<boolean> {
    const idx = MOCK_SAVED_REPORTS.findIndex(r => r.id === id);
    if (idx >= 0) {
      MOCK_SAVED_REPORTS.splice(idx, 1);
      return true;
    }
    return false;
  }

  async getUsers(): Promise<UserProfile[]> {
    return MOCK_USERS;
  }

  async getCompanies(): Promise<EnterpriseBranch[]> {
    return MOCK_COMPANIES;
  }

  async getIntegrationStatus(): Promise<IntegrationStatus> {
    return {
      sourceName: "ERP Corporativo Local - Firebird 5.0",
      databaseEngine: "Firebird SQL Server 5.0.1 (x64)",
      host: "192.168.10.5:3050",
      databaseFile: "/var/firebird/data/DRAFER_ERP.FDB",
      driver: "firebird-driver 1.10.3 (Python 3.12 / C-API)",
      lastSyncTime: "2024-10-14 10:15:00",
      status: "online",
      totalRecordsProcessed: 184290,
      syncDurationSeconds: 3.4,
      errorCount: 0,
      pipelineSteps: [
        { step: "Extração Firebird 5.0 (Delta CDC)", status: "success", records: 4820, details: "Leitura de transações RDB$DATABASE e tabelas de faturamento" },
        { step: "Transformação & Limpeza (FastAPI Pipeline)", status: "success", records: 4820, details: "Padronização de unidades, saneamento de CNPJ e cálculo de margens" },
        { step: "Carga Analítica (PostgreSQL Data Warehouse)", status: "success", records: 4820, details: "Upsert em tabelas fato_vendas e fato_titulos" },
        { step: "Validação de Invariantes & Integridade", status: "success", records: 4820, details: "Divergência de conciliação contábil: R$ 0,00" },
      ],
    };
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return MOCK_AUDIT_LOGS;
  }

  async triggerSync(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: "Sincronização delta executada com sucesso. 4.820 novos registros processados em 3.4 segundos.",
    };
  }
}
