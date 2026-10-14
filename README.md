# DRAFER Intelligence
## Plataforma Corporativa de Business Intelligence, Gestão Comercial e Inteligência Financeira

**DRAFER Intelligence** é uma plataforma corporativa desenvolvida para o **Grupo Drafer** com o propósito de transformar dados operacionais do ERP corporativo em inteligência de negócios, dashboards executivos em tempo real, relatórios gerenciais analíticos, DRE consolidado com eliminações intercompany, gestão de contas a pagar/receber e simulação preditiva de fluxo de caixa.

---

## 1. Arquitetura do Sistema & Futura Integração com Firebird 5.0

O ERP do Grupo Drafer opera sobre **Firebird 5.0 (x64)** hospedado em infraestrutura local. Para garantir alta disponibilidade, segurança e escalabilidade analítica sem onerar a base transacional do ERP, a plataforma foi concebida sob uma arquitetura desacoplada em 4 camadas:

```
[ ERP Local Firebird 5.0 ]  (Porta 3050 - DRAFER_ERP.FDB)
            │
            ▼ (Delta CDC via firebird-driver 1.10.3 / Python)
[ Serviço de Integração Python (FastAPI Engine) ]
            │
            ▼ (Carga Analítica / Transformação Star Schema)
[ PostgreSQL 16 Data Warehouse Analítico ]
            │
            ▼ (REST API / Bearer Auth / OpenAPI v3)
[ DRAFER Intelligence Frontend (React + TypeScript + Vite + Tailwind) ]
```

### Camada de Serviços Substituível & DRAFER Connector v2.3 (`src/services/`)
O frontend utiliza a interface `IDataProvider`, permitindo alternar de forma transparente entre:
- **`MockDataProvider`**: Provedor com dados determinísticos, integrados e realistas para homologação, validação de regras contábeis e testes de estresse (padrão autônomo na nuvem / AI Studio).
- **`ApiDataProvider`**: Cliente HTTP REST para consumo da API FastAPI (**DRAFER Connector v2.3**).
- **`src/services/adapters.ts`**: Adaptador estrito que normaliza os dados retornados pelo DRAFER Connector (`receita`, `custos`, `lucro_bruto`, `margem_bruta_percentual`, e o envelope `{ data: [...] }` com os 34 campos em snake_case) para a tipagem corporativa do BI.

### Proxy de Desenvolvimento Vite Local (Fase 2.4)
Para executar localmente contra a máquina corporativa com DRAFER Connector:
1. Configure o backend FastAPI escutando localmente em `http://127.0.0.1:8000`.
2. O servidor de desenvolvimento Vite (`vite.config.ts`) roteia chamadas `/api` diretamente para `http://127.0.0.1:8000`:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://127.0.0.1:8000',
       changeOrigin: true,
       secure: false,
     },
   }
   ```
3. Variáveis de ambiente (`.env.local`):
   ```env
   VITE_USE_REAL_API="true"
   VITE_API_URL="/api/v1"
   ```
*Nota de Segurança: O proxy aplica-se estritamente ao servidor de desenvolvimento local. A API não é exposta à internet, não requer CORS irrestrito e não utiliza túneis públicos.*

---

## 2. Módulos Implementados

### 1. Dashboard Executivo
- **12 Indicadores Chave**: Receita Bruta, Receita Líquida, Lucro Bruto, Margem Bruta (%), Resultado Líquido, Contas a Receber, Contas a Pagar, Valores Vencidos, Saldo de Caixa Projetado, Ticket Médio, Volume Vendido (kg/peças), Clientes Ativos.
- **8 Gráficos Interativos**: Evolução mensal das vendas, Receita vs Custos, Faturamento e Lucro por Empresa, Participação de Categorias (Donut), Ranking de Vendedores com atingimento de metas, Aging de Recebíveis, Aging de Obrigações, Evolução do EBITDA e Resultado Líquido.

### 2. Inteligência Comercial
- **Vendas por Produto (Prioritário)**: Tabela analítica com os **34 campos originais** do ERP Firebird:
  1. `Código do Produto`
  2. `Nome do Produto`
  3. `NOVO_GRUPO`
  4. `NOVO_SUB_GRUPO`
  5. `UND`
  6. `DATA`
  7. `Número documentos`
  8. `Nome Cliente`
  9. `CNPJ/CPF`
  10. `Grupo Cadastral`
  11. `CIDADE`
  12. `Estado`
  13. `Cidade Entrega`
  14. `Estado Entrega`
  15. `COD_EMPRESA`
  16. `NOME_EMPRESA`
  17. `Dispositivos Fiscal`
  18. `Peso Bruto`
  19. `Quantidade`
  20. `Valor Total`
  21. `Custo Total`
  22. `Total Vendido`
  23. `Valor Lucro`
  24. `Nome Vendedor`
  25. `NOME_VENDEDOR_ITEM`
  26. `Item`
  27. `Número da carga`
  28. `Nome da Carga`
  29. `Comprimento padrão`
  30. `Quantidade de peças`
  31. `Grupo análise de crédito`
  32. `Quantidade Kg`
  33. `Valor Frete`
  34. `Classificacao`
- Seletor dinâmico de colunas visíveis (exibir/ocultar qualquer uma das 34).
- Agrupamento com subtotais e totais por Grupo, Cliente, Empresa ou Vendedor.
- Exportação em CSV com codificação UTF-8 BOM para compatibilidade com o Excel no Brasil.
- Indicadores derivados (Margem %, Preço Médio por KG, Participação).
- **Vendas por Cliente**: Classificação Curva ABC (Pareto), limites de crédito e histórico.
- **Vendas por Vendedor**: Ranking de cotas, comissões e carteira de clientes.
- **Vendas por Empresa**: Comparativo de desempenho entre Matriz e Filiais.
- **Análise de Margens**: Separação de produtos por faixas (Crítica < 15%, Adequada 15-28%, Alta > 28%) e cálculo de markup.

### 3. DRE Gerencial
- Demonstrativo do Resultado estruturado em múltiplos níveis com expansão de contas sintéticas e analíticas.
- Visões: Mensal (Jan-Dez), Trimestral (Q1-Q4) e Comparativo Anual.
- Análise Vertical (AV % sobre Receita Líquida) e Análise Horizontal (AH %).
- Consolidação do Grupo Drafer com chave de **Eliminação Intercompany** (dedução de vendas cruzadas entre empresas do grupo).

### 4. Gestão Financeira
- **Contas a Receber**: Gestão de títulos, faixas de atraso (Aging), cálculo de juros/multas e histórico de liquidações parciais.
- **Contas a Pagar**: Programação de desembolso por fornecedor, categoria financeira e centro de custo.
- **Fluxo de Caixa**: Saldos diários realizados versus compromissos futuros projetados.
- **Simulador de Cenários**: Modelagem de estresse e sensibilidade (Cenários Conservador, Base, Otimista) com sliders de crescimento de vendas, inadimplência e prazos médios (PMR/PMP).
- **Inadimplência**: Painel dedicado para duplicatas vencidas e priorização de cobrança.

### 5. Construtor Dinâmico de Relatórios & Relatórios Salvos
- Ferramenta visual para seleção de fontes de dados, catálogo de campos tipados, ordenação, filtros combinados, agregações (soma, média, contagem) e exportação.
- Biblioteca de relatórios corporativos pré-configurados e compartilháveis.

### 6. Administração & Segurança (RBAC)
- Matriz de perfis: *Superadmin*, *Administrador BI*, *Diretoria*, *Financeiro*, *Comercial* e *Gestor de Filial*.
- Proteção de dados confidenciais e mascaramento de custos/margens conforme LGPD.
- Painel de status da sincronização local Firebird 5.0.
- Trilha de auditoria para rastreamento de acessos e exportações.
- Catálogo oficial documentado de todas as fórmulas de cálculo.

---

## 3. Estrutura de Pastas

```
├── src/
│   ├── components/
│   │   ├── charts/           # Gráficos SVG interativos (Tendência, Ranking, Donut, Aging)
│   │   ├── common/           # Header, Sidebar, GlobalFilterBar, KpiCard, CommandPalette, Modais
│   │   └── table/            # Tabela analítica corporativa com suporte aos 34 campos
│   ├── context/
│   │   ├── AuthContext.tsx   # Perfil ativo, simulação de papéis RBAC e autenticação
│   │   ├── FilterContext.tsx # Filtros globais reativos (Empresa, Data, Grupo, Vendedor)
│   │   └── ThemeContext.tsx  # Suporte a Modo Escuro e Claro
│   ├── features/
│   │   ├── admin/            # Usuários, Empresas, Catálogo de Indicadores, Integrações, Auditoria
│   │   ├── auth/             # Modal de Login corporativo demonstrativo
│   │   ├── dashboard/        # Dashboard Executivo com 12 KPIs e 8 gráficos
│   │   ├── dre/              # DRE Gerencial consolidado
│   │   ├── financial/        # Contas a Receber, Pagar, Fluxo de Caixa, Cenários, Inadimplência
│   │   ├── reports/          # Construtor Dinâmico de Relatórios e Relatórios Salvos
│   │   └── sales/            # Vendas por Produto (34 campos), Cliente, Vendedor, Empresa, Margens
│   ├── services/
│   │   ├── dataProvider.ts   # Interface do contrato IDataProvider
│   │   ├── mockDataProvider.ts # Dados simulados consistentes e integrados
│   │   ├── apiDataProvider.ts  # Cliente REST preparado para FastAPI
│   │   ├── formulas.ts       # Fórmulas centralizadas e catálogo de regras de negócio
│   │   └── exportService.ts  # Exportação de planilhas CSV com UTF-8 BOM
│   ├── types/                # Definições completas TypeScript (sales34Fields, dre, financial, etc.)
│   ├── App.tsx               # Roteador central e layout da aplicação
│   ├── main.tsx              # Ponto de entrada React 19
│   └── index.css             # Tailwind CSS e tipografia corporativa
```

---

## 4. Como Executar

```bash
# Instalação das dependências
npm install

# Execução em ambiente de desenvolvimento
npm run dev

# Compilação e verificação de tipos para produção
npm run build
```
