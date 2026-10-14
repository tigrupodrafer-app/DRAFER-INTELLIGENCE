import React, { createContext, useContext, useState } from "react";
import { GlobalFilters } from "../types";

interface FilterContextType {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  updateFilter: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  resetFilters: () => void;
  datePreset: string;
  setDatePreset: (preset: string) => void;
}

const DEFAULT_FILTERS: GlobalFilters = {
  startDate: "2024-10-01",
  endDate: "2024-10-31",
  companyId: "all",
  group: "all",
  subGroup: "all",
  clientId: "all",
  repId: "all",
  searchQuery: "",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilters>(DEFAULT_FILTERS);
  const [datePreset, setDatePresetState] = useState<string>("Este Mês (Out/24)");

  const updateFilter = <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const setDatePreset = (preset: string) => {
    setDatePresetState(preset);
    if (preset === "Este Mês (Out/24)") {
      setFilters(prev => ({ ...prev, startDate: "2024-10-01", endDate: "2024-10-31" }));
    } else if (preset === "Mês Anterior (Set/24)") {
      setFilters(prev => ({ ...prev, startDate: "2024-09-01", endDate: "2024-09-30" }));
    } else if (preset === "Últimos 90 Dias") {
      setFilters(prev => ({ ...prev, startDate: "2024-08-01", endDate: "2024-10-31" }));
    } else if (preset === "Ano 2024") {
      setFilters(prev => ({ ...prev, startDate: "2024-01-01", endDate: "2024-12-31" }));
    }
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDatePresetState("Este Mês (Out/24)");
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters, datePreset, setDatePreset }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
};
