import type {
  SolarDashboardMetricsDto,
  SolarTrendPointDto,
  WeatherAverageProductionDto,
} from "../dto/SolarDashboardDto";
import type { SolarProductionRowDto } from "../dto/SolarProductionRowDto";

const round = (value: number) => Math.round(value * 100) / 100;

type MetricsOptions = {
  failedRowsCount?: number;
  totalRowsCount?: number;
};

export class SolarMetricsService {
  calculate(
    rows: SolarProductionRowDto[],
    options: MetricsOptions = {},
  ): SolarDashboardMetricsDto {
    const totalRowsCount = options.totalRowsCount ?? rows.length + (options.failedRowsCount ?? 0);

    if (rows.length === 0) {
      return {
        totalProduction: 0,
        averageProduction: 0,
        highestProductionDay: null,
        lowestProductionDay: null,
        anomalyCount: 0,
        weatherAverageProduction: [],
        trendData: [],
        validationSuccessRate: 0,
      };
    }

    const trendData = rows.map((row) => ({
      date: row.date,
      production: row.daily_production_kwh,
      anomalyDetected: row.anomaly_detected,
    }));

    const totalProduction = rows.reduce(
      (total, row) => total + row.daily_production_kwh,
      0,
    );
    const highestProductionDay = this.findProductionExtreme(trendData, "highest");
    const lowestProductionDay = this.findProductionExtreme(trendData, "lowest");
    const anomalyCount = rows.filter((row) => row.anomaly_detected).length;

    return {
      totalProduction: round(totalProduction),
      averageProduction: round(totalProduction / rows.length),
      highestProductionDay,
      lowestProductionDay,
      anomalyCount,
      weatherAverageProduction: this.calculateWeatherAverages(rows),
      trendData,
      validationSuccessRate: totalRowsCount > 0 ? round((rows.length / totalRowsCount) * 100) : 0,
    };
  }

  private findProductionExtreme(
    trendData: SolarTrendPointDto[],
    mode: "highest" | "lowest",
  ) {
    return trendData.reduce((selected, current) => {
      if (mode === "highest") {
        return current.production > selected.production ? current : selected;
      }

      return current.production < selected.production ? current : selected;
    });
  }

  private calculateWeatherAverages(
    rows: SolarProductionRowDto[],
  ): WeatherAverageProductionDto[] {
    const groups = rows.reduce<Record<string, { total: number; count: number }>>(
      (weatherGroups, row) => {
        const weather = row.weather.trim() || "Unknown";
        const current = weatherGroups[weather] ?? { total: 0, count: 0 };

        return {
          ...weatherGroups,
          [weather]: {
            total: current.total + row.daily_production_kwh,
            count: current.count + 1,
          },
        };
      },
      {},
    );

    return Object.entries(groups)
      .map(([weather, group]) => ({
        weather,
        averageProduction: round(group.total / group.count),
        recordCount: group.count,
      }))
      .sort((a, b) => b.averageProduction - a.averageProduction);
  }
}
