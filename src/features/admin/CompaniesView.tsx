import React, { useEffect, useState } from "react";
import { dataProvider } from "../../services";
import { EnterpriseBranch } from "../../types/admin";
import { Building2, MapPin, CheckCircle2 } from "lucide-react";

export const CompaniesView: React.FC = () => {
  const [companies, setCompanies] = useState<EnterpriseBranch[]>([]);

  useEffect(() => {
    dataProvider.getCompanies().then(res => setCompanies(res));
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Empresas do Grupo Drafer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Estrutura societária de filiais, matriz industrial e unidades distribuidoras contempladas no BI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-sm font-mono">
                  {c.code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.name}</h3>
                  <div className="text-xs text-slate-500">{c.legalName}</div>
                </div>
              </div>
              {c.isHeadquarter && (
                <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  Matriz Fabril
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">CNPJ:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{c.cnpj}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Localidade:</span>
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {c.city} - {c.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Grupo Consolidado:</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">{c.group}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Status ERP:</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Conexão Ativa
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
