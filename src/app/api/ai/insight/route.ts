import { AiInsightController } from "@/src/backend/controllers/AiInsightController";

export async function POST(request: Request) {
  return AiInsightController.handleGenerateInsight(request);
}
