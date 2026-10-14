import React from "react";
import { BusinessFormulas } from "../../services/formulas";
import { Calculator, BookOpen, ShieldCheck } from "lucide-react";

export const KpiCatalogView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Catálogo Oficial de Indicadores & Regras de Negócio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Dicionário contábil e de inteligência comercial com fórmulas auditáveis para garantir consistência.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
        <strong>Diretrizes de Integridade Numérica:</strong> No DRAFER Intelligence, não presumimos equivalência entre <em>Valor Total</em> (faturamento bruto com impostos por dentro e por fora) e <em>Total Vendido</em> (receita comercial líquida de descontos incondicionais). Unidades de medida distintas (KG, PC, MT, CJ, UN) nunca são somadas de forma cega nas totalizações de volume físico.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BusinessFormulas.catalog.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-2"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{item.name}</h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                  {item.module}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-700 dark:text-blue-300 mb-2">
                {item.formula}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
