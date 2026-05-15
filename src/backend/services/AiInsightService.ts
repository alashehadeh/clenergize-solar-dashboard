import type { AiInsightRequestDto } from "../dto/AiInsightRequestDto";
import type { AiInsightResponseDto } from "../dto/AiInsightResponseDto";

export class AiInsightService {
  async generateInsight(request: AiInsightRequestDto): Promise<AiInsightResponseDto> {
    if (!process.env.OPENAI_API_KEY) {
      return {
        source: "fallback",
        insight: this.buildFallbackInsight(request),
      };
    }

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          instructions:
            "You write concise, customer-friendly solar operations insights. Avoid jargon and keep the response under 90 words.",
          input: this.buildPrompt(request),
        }),
      });

      if (!response.ok) {
        return {
          source: "fallback",
          insight: this.buildFallbackInsight(request),
        };
      }

      const data = (await response.json()) as { output_text?: string };

      return {
        source: "openai",
        insight: data.output_text?.trim() || this.buildFallbackInsight(request),
      };
    } catch {
      return {
        source: "fallback",
        insight: this.buildFallbackInsight(request),
      };
    }
  }

  private buildPrompt({ metrics }: AiInsightRequestDto) {
    return [
      `Total production: ${metrics.totalProduction} kWh`,
      `Average production: ${metrics.averageProduction} kWh`,
      `Highest day: ${metrics.highestProductionDay?.date ?? "n/a"} (${metrics.highestProductionDay?.production ?? 0} kWh)`,
      `Lowest day: ${metrics.lowestProductionDay?.date ?? "n/a"} (${metrics.lowestProductionDay?.production ?? 0} kWh)`,
      `Anomaly count: ${metrics.anomalyCount}`,
      `Weather averages: ${metrics.weatherAverageProduction.map((item) => `${item.weather}: ${item.averageProduction} kWh`).join(", ")}`,
      "Give one practical takeaway for the customer.",
    ].join("\n");
  }

  private buildFallbackInsight({ metrics }: AiInsightRequestDto) {
    if (metrics.trendData.length === 0) {
      return "Upload valid solar production rows to generate a simple operational insight.";
    }

    const bestDay = metrics.highestProductionDay
      ? `${metrics.highestProductionDay.date} at ${metrics.highestProductionDay.production} kWh`
      : "not available";
    const lowestDay = metrics.lowestProductionDay
      ? `${metrics.lowestProductionDay.date} at ${metrics.lowestProductionDay.production} kWh`
      : "not available";

    const bestWeather = metrics.weatherAverageProduction[0]?.weather ?? "the strongest weather category";

    return `Production appears stable across the validated period, totaling ${metrics.totalProduction} kWh with an average of ${metrics.averageProduction} kWh per day. Stronger output appears during ${bestWeather} conditions. Best output was ${bestDay}, while the lowest day was ${lowestDay}. Review ${metrics.anomalyCount} anomaly row(s) and compare inverter readings with weather conditions.`;
  }
}
