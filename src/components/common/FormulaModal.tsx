import React from "react";
import { X, BookOpen, Calculator, ShieldCheck } from "lucide-react";
import { BusinessFormulas } from "../../services/formulas";

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Catálogo Oficial de Fórmulas e Regras de Negócio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3 text-xs text-blue-900 dark:text-blue-200">
            <strong>Critério de Rigor Técnico:</strong> Não há presunção de equivalência entre Valor Total bruto e Total Vendido líquido. Unidades de medida distintas (KG, PC, MT, CJ, UN) nunca são somadas indiscriminadamente nas agregações de volume.
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {BusinessFormulas.catalog.map((item, idx) => (
              <div key={idx} className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">{item.module}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/70 p-2 rounded border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-700 dark:text-blue-300 mb-1.5">
                  {item.formula}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center text-xs text-slate-500">
          <span>Grupo Drafer · Governança Contábil & BI</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md font-medium hover:bg-slate-800 dark:hover:bg-white text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
