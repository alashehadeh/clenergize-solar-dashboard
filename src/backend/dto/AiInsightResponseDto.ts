export type AiInsightResponseDto = {
  insight: string;
  source: "openai" | "fallback";
};
