import React, { useEffect, useState } from "react";
import { dataProvider } from "../../services";
import { UserProfile, UserRole } from "../../types/admin";
import { Users, Shield, Check, Lock, Building, Eye, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const UsersPermissionsView: React.FC = () => {
  const { currentUser, switchUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataProvider.getUsers().then(res => {
      setUsers(res);
      setLoading(false);
    });
  }, []);

  const rolesMatrix = [
    { role: "Superadmin", modules: "Todos (Acesso Irrestrito)", canExport: true, maskData: false, scope: "Todas as Empresas" },
    { role: "Administrador BI", modules: "Dashboards, Construtor, DRE, Vendas, Financeiro", canExport: true, maskData: false, scope: "Todas as Empresas" },
    { role: "Diretoria", modules: "Dashboard Executivo, DRE Consolidado, Finanças, Comercial", canExport: true, maskData: false, scope: "Grupo Consolidado" },
    { role: "Financeiro", modules: "DRE, Contas a Pagar/Receber, Fluxo de Caixa, Cenários", canExport: true, maskData: false, scope: "Todas as Empresas" },
    { role: "Comercial", modules: "Vendas por Produto/Cliente/Vendedor, Relatórios Comerciais", canExport: true, maskData: true, scope: "Filiais Comerciais" },
    { role: "Gestor de Filial", modules: "Vendas da Filial, Recebíveis Locais, Dashboard da Filial", canExport: true, maskData: false, scope: "Apenas Filial Alocada" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Usuários & Matriz de Permissões (RBAC)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Controle de acesso baseado em papéis, governança de dados sensíveis e segregação de funções.
          </p>
        </div>
      </div>

      {/* Role Definitions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Perfis de Acesso do DRAFER Intelligence
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-2.5">Perfil de Acesso</th>
                <th className="px-4 py-2.5">Módulos Permitidos</th>
                <th className="px-4 py-2.5 text-center">Exportar CSV</th>
                <th className="px-4 py-2.5 text-center">Proteção de Custos (LGPD)</th>
                <th className="px-4 py-2.5">Escopo de Filiais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rolesMatrix.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {r.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                    {r.modules}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" /> Sim
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.maskData ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                        <Lock className="w-3.5 h-3.5" /> Mascarado
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Visível</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {r.scope}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Colaboradores Cadastrados ({users.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Clique em "Ativar Perfil" para testar a experiência com as permissões do usuário
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-2.5">Nome / Colaborador</th>
                <th className="px-4 py-2.5">Departamento</th>
                <th className="px-4 py-2.5">Perfil RBAC</th>
                <th className="px-4 py-2.5">Último Acesso</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 text-center">Simular Sessão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {u.department}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                      {u.role}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {u.lastLogin}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isCurrent ? (
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                          Sessão Ativa
                        </span>
                      ) : (
                        <button
                          onClick={() => switchUser(u.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 rounded transition-colors"
                        >
                          Ativar Perfil
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
