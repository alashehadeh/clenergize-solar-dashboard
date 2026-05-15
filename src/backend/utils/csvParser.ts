import Papa from "papaparse";
import type { RawCsvRowDto } from "../dto/SolarProductionRowDto";

export function parseCsvContent(fileContent: string): RawCsvRowDto[] {
  const result = Papa.parse<RawCsvRowDto>(fileContent, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    const firstError = result.errors[0];
    throw new Error(firstError.message || "Unable to parse CSV file.");
  }

  return result.data;
}
