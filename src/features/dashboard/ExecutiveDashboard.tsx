import React, { useEffect, useState } from "react";
import { useFilters } from "../../context/FilterContext";
import { dataProvider, DashboardMetrics, BusinessFormulas } from "../../services";
import { KpiCard } from "../../components/common/KpiCard";
import { AreaTrendChart } from "../../components/charts/AreaTrendChart";
import { BarRankingChart } from "../../components/charts/BarRankingChart";
import { ComparisonBarChart } from "../../components/charts/ComparisonBarChart";
import { DonutShareChart } from "../../components/charts/DonutShareChart";
import { AgingBarChart } from "../../components/charts/AgingBarChart";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Wallet,
  AlertTriangle,
  Receipt,
  Scale,
  Users,
  Package,
  Layers,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";

interface ExecutiveDashboardProps {
  onOpenFormulaModal: () => void;
  onNavigateToView: (viewKey: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onOpenFormulaModal,
  onNavigateToView,
}) => {
  const { filters } = useFilters();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    dataProvider.getDashboardMetrics(filters).then(res => {
      if (mounted) {
        setMetrics(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [filters]);

  if (loading || !metrics) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Componente para estado explícito de indisponibilidade de série histórica
  const EmptyChartPlaceholder: React.FC<{ title: string; subtitle: string; icon?: React.ElementType }> = ({
    title,
    subtitle,
    icon: Icon = BarChart3,
  }) => (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 my-4">
        <Icon className="w-7 h-7 text-slate-300 dark:text-slate-600 mb-1.5" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Série histórica não fornecida pelo conector
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Aguardando endpoint correspondente no DRAFER Connector.
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Dashboard Executivo
            </h1>
            {metrics.source && (
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                Fonte: {metrics.source}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visão estratégica consolidada de vendas, margens, resultado operacional e saúde financeira.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToView("sales_product")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
          >
            <span>Ver 34 Campos de Vendas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 12 Indicadores Principais (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* 1. Receita Bruta */}
        <KpiCard
          title="Receita Bruta"
          value={metrics.grossRevenue > 0 ? BusinessFormulas.formatCompactCurrency(metrics.grossRevenue) : "R$ 0,00"}
          subtitle="Faturamento total emitido"
          changePct={metrics.source === "MOCK" ? 12.4 : undefined}
          isPositiveGood={true}
          formulaInfo="Receita Bruta"
          onClickFormula={onOpenFormulaModal}
          icon={DollarSign}
        />

        {/* 2. Receita Líquida */}
        <KpiCard
          title="Receita Líquida"
          value={metrics.netRevenue !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.netRevenue) : "—"}
          subtitle={metrics.netRevenue !== undefined ? "Após devoluções e tributos" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 11.8 : undefined}
          isPositiveGood={true}
          formulaInfo="Receita Líquida"
          onClickFormula={onOpenFormulaModal}
          icon={TrendingUp}
        />

        {/* 3. Lucro Bruto */}
        <KpiCard
          title="Lucro Bruto"
          value={BusinessFormulas.formatCompactCurrency(metrics.grossProfit)}
          subtitle={metrics.custos !== undefined ? `Custos: ${BusinessFormulas.formatCompactCurrency(metrics.custos)}` : "Receita Líquida - CPV"}
          changePct={metrics.source === "MOCK" ? 9.6 : undefined}
          isPositiveGood={true}
          formulaInfo="Valor Lucro"
          onClickFormula={onOpenFormulaModal}
          icon={Layers}
        />

        {/* 4. Margem Bruta (%) */}
        <KpiCard
          title="Margem Bruta"
          value={`${metrics.grossMarginPct.toFixed(1)}%`}
          subtitle="Rentabilidade sobre faturamento"
          changePct={metrics.source === "MOCK" ? -0.8 : undefined}
          isPositiveGood={true}
          formulaInfo="Margem Bruta (%)"
          onClickFormula={onOpenFormulaModal}
          icon={Percent}
        />

        {/* 5. Resultado Líquido */}
        <KpiCard
          title="Resultado Líquido"
          value={metrics.netResult !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.netResult) : "—"}
          subtitle={metrics.netResult !== undefined && metrics.netMarginPct !== undefined ? `${metrics.netMarginPct.toFixed(1)}% margem líquida` : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 14.2 : undefined}
          isPositiveGood={true}
          formulaInfo="Resultado Líquido"
          onClickFormula={onOpenFormulaModal}
          icon={Scale}
        />

        {/* 6. Contas a Receber */}
        <KpiCard
          title="Contas a Receber"
          value={metrics.totalReceivables !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.totalReceivables) : "—"}
          subtitle={metrics.totalReceivables !== undefined ? "Carteira de clientes ativa" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 4.1 : undefined}
          isPositiveGood={true}
          onClickFormula={onOpenFormulaModal}
          icon={Wallet}
        />

        {/* 7. Contas a Pagar */}
        <KpiCard
          title="Contas a Pagar"
          value={metrics.totalPayables !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.totalPayables) : "—"}
          subtitle={metrics.totalPayables !== undefined ? "Obrigações com fornecedores" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 2.5 : undefined}
          isPositiveGood={false}
          onClickFormula={onOpenFormulaModal}
          icon={Receipt}
        />

        {/* 8. Valores Vencidos */}
        <KpiCard
          title="Valores Vencidos"
          value={metrics.overdueReceivables !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.overdueReceivables) : "—"}
          subtitle={metrics.overdueReceivables !== undefined ? "Títulos vencidos a receber" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? -15.2 : undefined}
          isPositiveGood={false}
          formulaInfo="Inadimplência (%)"
          onClickFormula={onOpenFormulaModal}
          icon={AlertTriangle}
        />

        {/* 9. Saldo Caixa Projetado */}
        <KpiCard
          title="Caixa Projetado"
          value={metrics.projectedCashBalance !== undefined ? BusinessFormulas.formatCompactCurrency(metrics.projectedCashBalance) : "—"}
          subtitle={metrics.projectedCashBalance !== undefined ? "Projeção para 30 dias" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 8.1 : undefined}
          isPositiveGood={true}
          onClickFormula={onOpenFormulaModal}
          icon={DollarSign}
        />

        {/* 10. Ticket Médio */}
        <KpiCard
          title="Ticket Médio"
          value={metrics.averageTicket !== undefined ? BusinessFormulas.formatCurrency(metrics.averageTicket) : "—"}
          subtitle={metrics.averageTicket !== undefined ? "Média por nota emitida" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 5.3 : undefined}
          isPositiveGood={true}
          formulaInfo="Ticket Médio por Documento"
          onClickFormula={onOpenFormulaModal}
          icon={Receipt}
        />

        {/* 11. Volume Vendido */}
        <KpiCard
          title="Volume Vendido"
          value={metrics.totalVolumeKg !== undefined ? BusinessFormulas.formatNumber(metrics.totalVolumeKg) : "—"}
          unit={metrics.totalVolumeKg !== undefined ? "kg" : undefined}
          subtitle={metrics.totalPieces !== undefined ? `${metrics.totalPieces} peças faturadas` : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 8.7 : undefined}
          isPositiveGood={true}
          formulaInfo="Preço Médio Unitário"
          onClickFormula={onOpenFormulaModal}
          icon={Package}
        />

        {/* 12. Clientes Ativos */}
        <KpiCard
          title="Clientes Ativos"
          value={metrics.activeClientsCount !== undefined ? metrics.activeClientsCount.toString() : "—"}
          subtitle={metrics.activeClientsCount !== undefined ? "Compras no período" : "Não fornecido pelo backend"}
          changePct={metrics.source === "MOCK" ? 10.0 : undefined}
          isPositiveGood={true}
          onClickFormula={onOpenFormulaModal}
          icon={Users}
        />
      </div>

      {/* Grid de Gráficos Executivos (8 Gráficos) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Evolução Mensal das Vendas */}
        {metrics.monthlySalesTrend && metrics.monthlySalesTrend.length > 0 ? (
          <AreaTrendChart
            title="Evolução Mensal das Vendas (Faturamento vs Metas)"
            subtitle="Comparativo mensal realizado em 2024 vs meta orçada e exercício anterior"
            data={metrics.monthlySalesTrend}
            height={260}
          />
        ) : (
          <EmptyChartPlaceholder
            title="Evolução Mensal das Vendas (Faturamento vs Metas)"
            subtitle="Comparativo mensal realizado vs meta orçada"
            icon={Calendar}
          />
        )}

        {/* 2. Receita vs Custos vs Margem */}
        {metrics.revenueVsCostsTrend && metrics.revenueVsCostsTrend.length > 0 ? (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Receita Comercial vs Custos das Vendas (CPV)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Acompanhamento da absorção de custos fabris e margem bruta
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {metrics.revenueVsCostsTrend.map((item, idx) => {
                const maxVal = 600000;
                const revW = (item.revenue / maxVal) * 100;
                const costW = (item.costs / maxVal) * 100;
                const marginPct = (item.profit / item.revenue) * 100;

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-sans">{item.month}/24</span>
                      <div className="flex gap-4">
                        <span className="text-blue-600 font-semibold">{BusinessFormulas.formatCompactCurrency(item.revenue)}</span>
                        <span className="text-rose-500">{BusinessFormulas.formatCompactCurrency(item.costs)}</span>
                        <span className="text-emerald-600 font-semibold">{marginPct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                      <div style={{ width: `${costW}%` }} className="bg-rose-400 h-full" title="Custo (CPV)" />
                      <div style={{ width: `${revW - costW}%` }} className="bg-emerald-500 h-full" title="Lucro Bruto" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyChartPlaceholder
            title="Receita Comercial vs Custos das Vendas (CPV)"
            subtitle="Acompanhamento da absorção de custos fabris e margem bruta"
            icon={Layers}
          />
        )}

        {/* 3. Lucro e Faturamento por Empresa do Grupo Drafer */}
        {metrics.profitByCompany && metrics.profitByCompany.length > 0 ? (
          <ComparisonBarChart
            title="Faturamento e Lucro por Empresa do Grupo"
            subtitle="Desempenho comparativo entre Matriz (Joinville) e Filiais (SP, PR, MG)"
            data={metrics.profitByCompany}
          />
        ) : (
          <EmptyChartPlaceholder
            title="Faturamento e Lucro por Empresa do Grupo"
            subtitle="Desempenho comparativo entre Matriz e Filiais"
            icon={BarChart3}
          />
        )}

        {/* 4. Participação de Produtos no Faturamento */}
        {metrics.productCategoryShare && metrics.productCategoryShare.length > 0 ? (
          <DonutShareChart
            title="Participação de Categorias no Faturamento"
            subtitle="Composição da receita bruta por linhas de produto"
            data={metrics.productCategoryShare}
          />
        ) : (
          <EmptyChartPlaceholder
            title="Participação de Categorias no Faturamento"
            subtitle="Composição da receita bruta por linhas de produto"
            icon={PieChart}
          />
        )}

        {/* 5. Ranking de Vendedores com Atingimento */}
        {metrics.topSalesReps && metrics.topSalesReps.length > 0 ? (
          <BarRankingChart
            title="Ranking Comercial de Vendedores"
            subtitle="Faturamento apurado versus cota individual do mês"
            data={metrics.topSalesReps}
          />
        ) : (
          <EmptyChartPlaceholder
            title="Ranking Comercial de Vendedores"
            subtitle="Faturamento apurado versus cota individual do mês"
            icon={Users}
          />
        )}

        {/* 6. Contas a Receber por Vencimento (Aging) */}
        {metrics.receivablesAging && metrics.receivablesAging.length > 0 ? (
          <AgingBarChart
            title="Aging de Contas a Receber (Vencimento)"
            subtitle="Distribuição temporal dos títulos a liquidar e faixas de atraso"
            data={metrics.receivablesAging}
            type="receivables"
          />
        ) : (
          <EmptyChartPlaceholder
            title="Aging de Contas a Receber (Vencimento)"
            subtitle="Distribuição temporal dos títulos a liquidar e faixas de atraso"
            icon={Wallet}
          />
        )}

        {/* 7. Contas a Pagar por Vencimento */}
        {metrics.payablesAging && metrics.payablesAging.length > 0 ? (
          <AgingBarChart
            title="Aging de Contas a Pagar (Obrigações)"
            subtitle="Cronograma de desembolso de fornecedores por período"
            data={metrics.payablesAging}
            type="payables"
          />
        ) : (
          <EmptyChartPlaceholder
            title="Aging de Contas a Pagar (Obrigações)"
            subtitle="Cronograma de desembolso de fornecedores por período"
            icon={Receipt}
          />
        )}

        {/* 8. Evolução do Resultado Gerencial (EBITDA & Líquido) */}
        {metrics.managerialResultTrend && metrics.managerialResultTrend.length > 0 ? (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Evolução do EBITDA e Resultado Líquido
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Geração de caixa operacional (LAJIDA) versus lucro final
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {metrics.managerialResultTrend.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-center"
                >
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">{m.month}/24</div>
                  <div className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                    {BusinessFormulas.formatCompactCurrency(m.ebitda || 0)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">EBITDA</div>
                  <div className="text-xs font-semibold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                    {BusinessFormulas.formatCompactCurrency(m.netResult || 0)}
                  </div>
                  <div className="text-[10px] text-slate-400">Líquido</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyChartPlaceholder
            title="Evolução do EBITDA e Resultado Líquido"
            subtitle="Geração de caixa operacional (LAJIDA) versus lucro final"
            icon={Scale}
          />
        )}
      </div>
    </div>
  );
};
