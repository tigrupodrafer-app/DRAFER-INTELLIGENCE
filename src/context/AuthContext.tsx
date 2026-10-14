import React, { createContext, useContext, useState } from "react";
import { UserProfile, UserRole } from "../types";
import { MOCK_USERS } from "../services/mockDataProvider";

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  loginAs: (email: string) => void;
  logout: () => void;
  canAccessModule: (module: string) => boolean;
  canExportData: () => boolean;
  isSensitiveDataMasked: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // default Superadmin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const switchRole = (role: UserRole) => {
    const found = MOCK_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const loginAs = (email: string) => {
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
    }
    setIsAuthenticated(true);
    setLoginModalOpen(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLoginModalOpen(true);
  };

  const canAccessModule = (module: string): boolean => {
    if (!isAuthenticated) return false;
    const role = currentUser.role;
    if (role === "Superadmin" || role === "Administrador BI" || role === "Diretoria") return true;

    if (role === "Financeiro") {
      // Financeiro cannot edit admin users/integrations, but sees DRE and financial modules
      return ["dashboard", "dre", "financial_receivables", "financial_payables", "financial_cashflow", "report_builder", "saved_reports"].includes(module);
    }

    if (role === "Comercial") {
      // Comercial sees sales, clients, sellers, reports, but NOT DRE or cash flow
      return ["dashboard", "sales_product", "sales_client", "sales_rep", "sales_company", "sales_margins", "report_builder", "saved_reports"].includes(module);
    }

    if (role === "Gestor de Filial") {
      // Gestor de Filial sees branch sales, branch receivables
      return ["dashboard", "sales_product", "sales_client", "sales_rep", "sales_company", "financial_receivables", "report_builder", "saved_reports"].includes(module);
    }

    return true;
  };

  const canExportData = (): boolean => {
    if (currentUser.role === "Comercial" || currentUser.role === "Gestor de Filial") {
      // Permitted with audit logging
      return true;
    }
    return true;
  };

  const isSensitiveDataMasked = (): boolean => {
    // Only masks if Comercial or Gestor de Filial without specific elevation
    return currentUser.role === "Comercial";
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        switchRole,
        isAuthenticated,
        loginModalOpen,
        setLoginModalOpen,
        loginAs,
        logout,
        canAccessModule,
        canExportData,
        isSensitiveDataMasked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
