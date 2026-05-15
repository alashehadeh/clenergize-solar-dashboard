import type { FailedCsvRowDto, SuccessfulCsvRowDto } from "./SolarProductionRowDto";

export type CsvValidationResultDto = {
  success: SuccessfulCsvRowDto[];
  failed: FailedCsvRowDto[];
};
