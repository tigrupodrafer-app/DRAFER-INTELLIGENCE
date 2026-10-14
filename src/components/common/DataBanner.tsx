import React from "react";
import { Info, Database, PlugZap, Radio } from "lucide-react";
import { dataProvider, isRealApiConfigured } from "../../services";

export const DataBanner: React.FC = () => {
  const providerName = dataProvider.providerName || (isRealApiConfigured ? "ApiDataProvider" : "MockDataProvider");

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 font-medium text-slate-200">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          DRAFER Intelligence
        </span>
        <span className="text-slate-500">·</span>
        {isRealApiConfigured ? (
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            DRAFER Connector Ativo (/api/v1 → 127.0.0.1:8000)
          </span>
        ) : (
          <span className="text-slate-400">Ambiente de demonstração — dados simulados</span>
        )}
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        <span className="hidden sm:inline">Camada de serviços: {providerName}</span>
        <span className="text-slate-600 hidden sm:inline">·</span>
        {isRealApiConfigured ? (
          <span className="flex items-center gap-1 text-emerald-300 font-medium">
            <PlugZap className="w-3 h-3 text-emerald-400" />
            Proxy Vite Configurado
          </span>
        ) : (
          <span className="flex items-center gap-1 text-slate-300">
            <Info className="w-3 h-3 text-amber-400" />
            Proxy Vite pronto: /api → 127.0.0.1:8000
          </span>
        )}
      </div>
    </div>
  );
};
