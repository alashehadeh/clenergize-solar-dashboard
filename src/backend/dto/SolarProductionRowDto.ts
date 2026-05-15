export type RawCsvRowDto = Record<string, string | number | boolean | null | undefined>;

export type SolarProductionRowDto = {
  date: string;
  site_name: string;
  daily_production_kwh: number;
  weather: string;
  anomaly_detected: boolean;
};

export type SuccessfulCsvRowDto = {
  rowNumber: number;
  data: SolarProductionRowDto;
};

export type FailedCsvRowDto = {
  rowNumber: number;
  originalData: RawCsvRowDto;
  errors: string[];
};
