import type { AiInsightRequestDto } from "../dto/AiInsightRequestDto";
import { AiInsightService } from "../services/AiInsightService";

const aiInsightService = new AiInsightService();

export class AiInsightController {
  static async handleGenerateInsight(request: Request) {
    try {
      const body = (await request.json()) as AiInsightRequestDto;

      if (!Array.isArray(body.rows) || !body.metrics) {
        return Response.json(
          { error: "Rows and metrics are required to generate an insight." },
          { status: 400 },
        );
      }

      const response = await aiInsightService.generateInsight(body);
      return Response.json(response);
    } catch {
      return Response.json(
        { error: "We could not generate an insight for this upload." },
        { status: 400 },
      );
    }
  }
}
