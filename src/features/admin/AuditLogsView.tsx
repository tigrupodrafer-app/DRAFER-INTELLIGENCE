import React, { useEffect, useState } from "react";
import { dataProvider } from "../../services";
import { AuditLogItem } from "../../types/admin";
import { ShieldCheck, Download, Search, AlertCircle, Info } from "lucide-react";

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dataProvider.getAuditLogs().then(res => setLogs(res));
  }, []);

  const filtered = logs.filter(l =>
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Trilha de Auditoria & Conformidade (LGPD)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registro imutável de acessos corporativos, exportações de dados confidenciais e ações administrativas.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
        <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1.5 w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Pesquisar evento, usuário ou ação..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full placeholder:text-slate-400 text-xs"
          />
        </div>
        <div className="text-slate-500 font-mono text-xs">
          {filtered.length} eventos registrados
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5">Data / Hora</th>
                <th className="px-3 py-2.5">Usuário / Perfil</th>
                <th className="px-3 py-2.5">Ação Executada</th>
                <th className="px-3 py-2.5">Módulo</th>
                <th className="px-3 py-2.5">Detalhes da Operação</th>
                <th className="px-3 py-2.5 font-mono">Endereço IP</th>
                <th className="px-3 py-2.5 text-center">Severidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{log.userName}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">{log.userRole}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400">
                    {log.module}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                    {log.details}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      log.severity === "security"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
