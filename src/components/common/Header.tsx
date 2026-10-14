import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Sun,
  Moon,
  Calculator,
  User,
  Shield,
  ChevronDown,
  LogOut,
  Building,
  Menu,
} from "lucide-react";
import { UserRole } from "../../types";

interface HeaderProps {
  currentViewTitle: string;
  currentModule: string;
  onOpenCommandPalette: () => void;
  onOpenFormulaModal: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ROLES: UserRole[] = [
  "Superadmin",
  "Administrador BI",
  "Diretoria",
  "Financeiro",
  "Comercial",
  "Gestor de Filial",
];

export const Header: React.FC<HeaderProps> = ({
  currentViewTitle,
  currentModule,
  onOpenCommandPalette,
  onOpenFormulaModal,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, switchRole, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1 & 2: Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          title="Alternar menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs truncate">
          <span className="text-slate-400 font-medium hidden sm:inline">{currentModule}</span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {currentViewTitle}
          </span>
        </div>
      </div>

      {/* Zone 3: Search + Tools + Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="font-sans">Buscar módulo ou produto...</span>
          <kbd className="text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1 py-0.5 rounded text-slate-500">
            Ctrl K
          </kbd>
        </button>

        {/* Formula Catalog Button */}
        <button
          onClick={onOpenFormulaModal}
          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title="Catálogo de Fórmulas Oficiais de Cálculo"
        >
          <Calculator className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Role Switcher Dropdown (Demonstrative feature for testing RBAC) */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden lg:block leading-tight">
              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser.name.split(" ")[0]}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {currentUser.department}
                </div>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulador de Perfis (RBAC)
              </div>

              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    currentUser.role === role ? "font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20" : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    {role}
                  </span>
                  {currentUser.role === role && <span className="text-[10px] text-blue-600 font-bold">Ativo</span>}
                </button>
              ))}

              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair do Sistema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
