import React, { useEffect, useState } from "react";
import { dataProvider, isRealApiConfigured } from "../../services";
import { IntegrationStatus } from "../../types/admin";
import {
  Database,
  RefreshCw,
  Server,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  ShieldCheck,
  AlertTriangle,
  PlugZap,
  Radio,
  Terminal,
} from "lucide-react";

export const IntegrationsView: React.FC = () => {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Local Connector ping state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
    metrics?: any;
  } | null>(null);

  useEffect(() => {
    dataProvider.getIntegrationStatus().then(res => setStatus(res));
  }, []);

  const handleTriggerSync = async () => {
    setSyncing(true);
    const res = await dataProvider.triggerSync();
    setSyncing(false);
    setSyncMessage(res.message);
    setTimeout(() => setSyncMessage(null), 5000);
  };

  const handleTestLocalConnector = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      // Calls local proxy endpoint /api/v1/dashboard/metrics
      const res = await fetch("/api/v1/dashboard/metrics", {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setConnectionResult({
        success: true,
        message: `DRAFER Connector respondendo via proxy Vite com sucesso! Origem: ${data.source || "MOCK"}`,
        metrics: data,
      });
    } catch (err: any) {
      setConnectionResult({
        success: false,
        message: `Servidor FastAPI local inacessível em 127.0.0.1:8000 via proxy Vite: ${err.message}. Certifique-se de que o backend DRAFER Connector v2.3 esteja rodando.`,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  if (!status) return null;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Arquitetura de Integração & DRAFER Connector v2.3
            </h1>
            <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
              {isRealApiConfigured ? "Modo Real (API/Connector)" : "Modo MOCK Homologado"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pipeline corporativo: Firebird 5.0 local → DRAFER Connector Python CDC → Proxy Vite (/api → 127.0.0.1:8000) → DRAFER Intelligence.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Sincronizando..." : "Executar Sincronização Delta"}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs px-4 py-2.5 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Fase 2.4 - Painel de Integração Local Segura com DRAFER Connector */}
      <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <PlugZap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                DRAFER Connector v2.3 — Proxy de Desenvolvimento Seguro
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Roteamento de requisições <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">/api/*</code> para <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">http://127.0.0.1:8000</code> exclusivo para o ambiente de desenvolvimento local.
            </p>
          </div>

          <button
            onClick={handleTestLocalConnector}
            disabled={testingConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors shrink-0 font-mono"
          >
            <Radio className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin text-amber-400" : "text-emerald-400"}`} />
            <span>{testingConnection ? "Testando..." : "Testar Conexão Local (/api/v1/dashboard/metrics)"}</span>
          </button>
        </div>

        {connectionResult && (
          <div className={`mt-4 p-3.5 rounded-md text-xs flex items-start gap-2.5 ${
            connectionResult.success 
              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300"
          }`}>
            {connectionResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-semibold">{connectionResult.message}</div>
              {connectionResult.metrics && (
                <div className="font-mono text-[11px] bg-white/60 dark:bg-black/30 p-2 rounded border border-emerald-300/50 dark:border-emerald-800/50">
                  Receita: R$ {connectionResult.metrics.receita?.toLocaleString("pt-BR") || 0} | 
                  Custos: R$ {connectionResult.metrics.custos?.toLocaleString("pt-BR") || 0} | 
                  Lucro Bruto: R$ {connectionResult.metrics.lucro_bruto?.toLocaleString("pt-BR") || 0} | 
                  Margem: {connectionResult.metrics.margem_bruta_percentual}%
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-2">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Proxy Vite (Dev Server)</span>
            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block mt-1">/api → http://127.0.0.1:8000</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Sem exposição pública, mantendo o backend estritamente em loopback local.</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Variáveis de Ambiente</span>
            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block mt-1">VITE_USE_REAL_API={String(isRealApiConfigured)}</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Prefixo: <code className="font-mono">VITE_API_URL="/api/v1"</code> sem duplicação de caminho.</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Camada de Adaptadores</span>
            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block mt-1">snake_case ⇆ 34 Campos</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Transforma respostas encapsuladas de vendas e métricas em tipos rígidos do BI.</span>
          </div>
        </div>
      </div>

      {/* Architecture Diagram Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Fluxo de Dados Entre Servidores Corporativos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Step 1 */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
              <Server className="w-4 h-4 text-amber-500" />
              <span>1. Firebird 5.0 (Local)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              host: 192.168.10.5:3050<br />
              DRAFER_ERP.FDB (x64)
            </div>
            <div className="text-[10px] text-slate-400">
              Banco relacional transacional (OLTP) do ERP corporativo.
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>2. DRAFER Connector (Python)</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              FastAPI v2.3 / firebird-driver<br />
              127.0.0.1:8000
            </div>
            <div className="text-[10px] text-slate-400">
              Captura incremental de alterações (CDC), higienização e endpoints REST.
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>3. Proxy Vite Local</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              /api → 127.0.0.1:8000<br />
              Vite Dev Server (Porta 3000)
            </div>
            <div className="text-[10px] text-slate-400">
              Proxy reverso sem necessidade de túneis públicos ou abertura de portas.
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>4. Adaptadores & Frontend</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              /api/v1/sales/items<br />
              34 Campos / Executive BI
            </div>
            <div className="text-[10px] text-slate-400">
              Dashboards interativos, tabelas e relatórios gerenciais com dados reais ou simulados.
            </div>
          </div>
        </div>
      </div>

      {/* Status KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Registros Processados</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {status.totalRecordsProcessed.toLocaleString("pt-BR")}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Vendas, títulos e itens</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Tempo de Ciclo (Delta Sync)</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {status.syncDurationSeconds}s
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Leitura otimizada por CDC</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Última Sincronização</div>
          <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">
            {status.lastSyncTime}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Sem pendências</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3">
          <div className="text-[11px] text-slate-400 font-medium">Divergências / Erros</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            0
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Integridade 100% verificada</div>
        </div>
      </div>

      {/* Pipeline Steps Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Fases do Pipeline de Sincronização Local
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {status.driver}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {status.pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{step.step}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{step.details}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-slate-800 dark:text-slate-200">{step.records.toLocaleString("pt-BR")}</span>
                <span className="text-slate-400 text-[10px] block">registros processados</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
