import type { SuccessfulCsvRowDto } from "./SolarProductionRowDto";

export type SolarTrendPointDto = {
  date: string;
  production: number;
  anomalyDetected: boolean;
};

export type WeatherAverageProductionDto = {
  weather: string;
  averageProduction: number;
  recordCount: number;
};

export type SolarDashboardMetricsDto = {
  totalProduction: number;
  averageProduction: number;
  highestProductionDay: SolarTrendPointDto | null;
  lowestProductionDay: SolarTrendPointDto | null;
  anomalyCount: number;
  weatherAverageProduction: WeatherAverageProductionDto[];
  trendData: SolarTrendPointDto[];
  validationSuccessRate: number;
};

export type SolarDashboardStorageDto = {
  approvedRows: SuccessfulCsvRowDto[];
  failedRowsCount: number;
  totalRowsCount: number;
  uploadedFileName?: string;
};
