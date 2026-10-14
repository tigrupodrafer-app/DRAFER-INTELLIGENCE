export * from './sales34Fields';
export * from './dre';
export * from './financial';
export * from './reports';
export * from './admin';

export interface GlobalFilters {
  startDate: string;
  endDate: string;
  companyId: string; // 'all' | 'EMP-01' | ...
  group: string;     // 'all' | categoria de produto
  subGroup: string;  // 'all' | subcategoria
  clientId: string;  // 'all' | cliente
  repId: string;     // 'all' | vendedor
  searchQuery: string;
}

export interface KpiMetric {
  title: string;
  value: number;
  formattedValue: string;
  previousValue?: number;
  changePct?: number;
  isPositiveGood?: boolean;
  unit?: string;
  subtitle?: string;
  tooltipFormula?: string;
  iconName?: string;
}
