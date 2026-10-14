import { IDataProvider } from "./dataProvider";
import { MockDataProvider } from "./mockDataProvider";
import { ApiDataProvider } from "./apiDataProvider";

const useRealApi = (import.meta as any).env?.VITE_USE_REAL_API === "true";

export const isRealApiConfigured = useRealApi;

export const dataProvider: IDataProvider = useRealApi
  ? new ApiDataProvider()
  : new MockDataProvider();

export * from "./dataProvider";
export * from "./mockDataProvider";
export * from "./apiDataProvider";
export * from "./adapters";
export * from "./formulas";
export * from "./exportService";
