import React, { useState, useEffect } from "react";
import { dataProvider, BusinessFormulas } from "../../services";
import { ScenarioParameters } from "../../types";
import { Sliders, RotateCcw, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

export const ScenarioSimulatorView: React.FC = () => {
  const [scenarioName, setScenarioName] = useState<"Conservador" | "Base" | "Otimista" | "Personalizado">("Base");
  const [salesGrowth, setSalesGrowth] = useState<number>(5);
  const [defaultRate, setDefaultRate] = useState<number>(2.0);
  const [avgDelay, setAvgDelay] = useState<number>(5);
  const [expenseGrowth, setExpenseGrowth] = useState<number>(3);
  const [pmpDays, setPmpDays] = useState<number>(45);
  const [pmrDays, setPmrDays] = useState<number>(35);

  const [projections, setProjections] = useState<{
    months: string[];
    baseCash: number[];
    projectedCash: number[];
    inflows: number[];
    outflows: number[];
  } | null>(null);

  // Apply scenario presets
  const applyPreset = (preset: "Conservador" | "Base" | "Otimista") => {
    setScenarioName(preset);
    if (preset === "Conservador") {
      setSalesGrowth(-5);
      setDefaultRate(4.5);
      setAvgDelay(14);
      setExpenseGrowth(6);
      setPmpDays(35);
      setPmrDays(45);
    } else if (preset === "Base") {
      setSalesGrowth(5);
      setDefaultRate(2.0);
      setAvgDelay(5);
      setExpenseGrowth(3);
      setPmpDays(45);
      setPmrDays(35);
    } else if (preset === "Otimista") {
      setSalesGrowth(15);
      setDefaultRate(1.0);
      setAvgDelay(2);
      setExpenseGrowth(1.5);
      setPmpDays(50);
      setPmrDays(28);
    }
  };

  useEffect(() => {
    const params: ScenarioParameters = {
      name: scenarioName,
      salesGrowthPct: salesGrowth,
      defaultRatePct: defaultRate,
      averageDelayDays: avgDelay,
      expensesGrowthPct: expenseGrowth,
      paymentTermsDays: pmpDays,
      receivableTermsDays: pmrDays,
    };

    dataProvider.getScenarioProjections(params).then(res => {
      setProjections(res);
    });
  }, [scenarioName, salesGrowth, defaultRate, avgDelay, expenseGrowth, pmpDays, pmrDays]);

  const maxVal = projections ? Math.max(...projections.projectedCash, ...projections.baseCash) * 1.15 : 2000000;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Simulador de Cenários & Projeções Financeiras
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Modelagem preditiva de sensibilidade de caixa, inadimplência e crescimento comercial para os próximos 6 meses.
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(["Conservador", "Base", "Otimista"] as const).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                scenarioName === preset
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Cenário {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Sliders Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Parâmetros Hipotéticos de Sensibilidade
            </h2>
          </div>
          <button
            onClick={() => applyPreset("Base")}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Cenário Base</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Sales Growth */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Crescimento de Vendas (%)</span>
              <span className="font-mono font-bold text-blue-600">{salesGrowth > 0 ? `+${salesGrowth}%` : `${salesGrowth}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="1"
              value={salesGrowth}
              onChange={e => {
                setSalesGrowth(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Recessão (-20%)</span>
              <span>Expansão (+40%)</span>
            </div>
          </div>

          {/* Default Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Inadimplência Estimada (%)</span>
              <span className="font-mono font-bold text-rose-600">{defaultRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={defaultRate}
              onChange={e => {
                setDefaultRate(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Mínima (0.5%)</span>
              <span>Severa (10.0%)</span>
            </div>
          </div>

          {/* Expenses Growth */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Variação de Despesas / Inflação (%)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">+{expenseGrowth}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={expenseGrowth}
              onChange={e => {
                setExpenseGrowth(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-slate-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Controlada (0%)</span>
              <span>Alta Inflação (+20%)</span>
            </div>
          </div>

          {/* Average Delay Days */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Atraso Médio de Recebimento</span>
              <span className="font-mono font-bold text-amber-600">{avgDelay} dias</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={avgDelay}
              onChange={e => {
                setAvgDelay(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Pontual (0d)</span>
              <span>Atraso Alto (30d)</span>
            </div>
          </div>

          {/* PMR */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Prazo Médio Recebimento (PMR)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pmrDays} dias</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={pmrDays}
              onChange={e => {
                setPmrDays(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>15 dias</span>
              <span>60 dias</span>
            </div>
          </div>

          {/* PMP */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Prazo Médio Pagamento (PMP)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{pmpDays} dias</span>
            </div>
            <input
              type="range"
              min="20"
              max="75"
              step="5"
              value={pmpDays}
              onChange={e => {
                setPmpDays(Number(e.target.value));
                setScenarioName("Personalizado");
              }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20 dias</span>
              <span>75 dias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection Results Chart and Table */}
      {projections && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Comparison Cards */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Projeção Comparativa de Saldo de Caixa Acumulado (Próximos 6 Meses)
              </h3>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-400 inline-block" />
                  Cenário Base Orçado
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                  Cenário Simulado ({scenarioName})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {projections.months.map((m, idx) => {
                const base = projections.baseCash[idx];
                const proj = projections.projectedCash[idx];
                const delta = proj - base;
                const isPositive = delta >= 0;

                return (
                  <div
                    key={m}
                    className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/70 dark:border-slate-800/80 text-center space-y-1"
                  >
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{m}</div>
                    <div className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                      {BusinessFormulas.formatCompactCurrency(proj)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Base: {BusinessFormulas.formatCompactCurrency(base)}
                    </div>
                    <div
                      className={`text-[10px] font-mono font-semibold pt-1 border-t border-slate-200 dark:border-slate-800 ${
                        isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {BusinessFormulas.formatCompactCurrency(delta)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
