import type { MetricsResponseDto } from "./MetricsResponseDto";
import type { SolarProductionRowDto } from "./SolarProductionRowDto";

export type AiInsightRequestDto = {
  rows: SolarProductionRowDto[];
  metrics: MetricsResponseDto;
};
