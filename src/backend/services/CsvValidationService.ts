import type { CsvValidationResultDto } from "../dto/CsvValidationResultDto";
import type {
  FailedCsvRowDto,
  RawCsvRowDto,
  SuccessfulCsvRowDto,
} from "../dto/SolarProductionRowDto";
import { isIsoDate } from "../utils/dateUtils";

const REQUIRED_COLUMNS = [
  "date",
  "site_name",
  "daily_production_kwh",
  "weather",
  "anomaly_detected",
] as const;

const BOOLEAN_VALUES: Record<string, boolean> = {
  yes: true,
  no: false,
  true: true,
  false: false,
  "1": true,
  "0": false,
};

type RequiredColumn = (typeof REQUIRED_COLUMNS)[number];

const isBlank = (value: unknown) => String(value ?? "").trim() === "";

const getValue = (row: RawCsvRowDto, column: RequiredColumn) =>
  String(row[column] ?? "").trim();

const parseBooleanLike = (value: string) => BOOLEAN_VALUES[value.toLowerCase()];

export class CsvValidationService {
  validate(rows: RawCsvRowDto[]): CsvValidationResultDto {
    const headers = rows[0] ? Object.keys(rows[0]).map((header) => header.trim()) : [];
    const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));

    const success: SuccessfulCsvRowDto[] = [];
    const failed: FailedCsvRowDto[] = [];

    if (missingColumns.length > 0) {
      return {
        success,
        failed: [
          {
            rowNumber: 1,
            originalData: {},
            errors: missingColumns.map((column) => `${column} column is required`),
          },
        ],
      };
    }

    rows.forEach((row, index) => {
      const rowNumber = index + 2;
      const errors = this.validateRow(row);

      if (errors.length > 0) {
        failed.push({ rowNumber, originalData: row, errors });
        return;
      }

      success.push({
        rowNumber,
        data: {
          date: getValue(row, "date"),
          site_name: getValue(row, "site_name"),
          daily_production_kwh: Number(getValue(row, "daily_production_kwh")),
          weather: getValue(row, "weather"),
          anomaly_detected: parseBooleanLike(getValue(row, "anomaly_detected")),
        },
      });
    });

    return { success, failed };
  }

  private validateRow(row: RawCsvRowDto) {
    const errors: string[] = [];

    REQUIRED_COLUMNS.forEach((column) => {
      if (isBlank(row[column])) {
        errors.push(`${column} is required`);
      }
    });

    const date = getValue(row, "date");
    const dailyProduction = getValue(row, "daily_production_kwh");
    const anomalyDetected = getValue(row, "anomaly_detected");

    if (date && !isIsoDate(date)) {
      errors.push("date must be a valid date");
    }

    if (dailyProduction && !Number.isFinite(Number(dailyProduction))) {
      errors.push("daily_production_kwh must be a valid number");
    }

    if (anomalyDetected && parseBooleanLike(anomalyDetected) === undefined) {
      errors.push("anomaly_detected must be Yes, No, true, false, 1, or 0");
    }

    return errors;
  }
}
