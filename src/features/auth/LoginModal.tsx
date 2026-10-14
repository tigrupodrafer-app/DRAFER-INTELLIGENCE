import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Database, X } from "lucide-react";
import { MOCK_USERS } from "../../services/mockDataProvider";

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, loginAs } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");

  if (!loginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(email || MOCK_USERS[0].email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-md mb-3">
            D
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            DRAFER <span className="text-blue-600">Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Business Intelligence & Financial Analytics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              E-mail Corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@grupodrafer.com.br"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Acessar Plataforma</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Access Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Perfis de Demonstração (Clique para entrar)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {MOCK_USERS.slice(0, 4).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => loginAs(u.email)}
                className="p-2 text-left bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 rounded-md text-[11px] transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{u.name.split(" ")[0]}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400">{u.role}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Ambiente de demonstração · OpenID Connect / SSO Ready</span>
        </div>
      </div>
    </div>
  );
};
