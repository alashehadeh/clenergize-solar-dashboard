import { CAlert, CButton, CCard, CCardBody, CCardHeader, CSpinner } from "@coreui/react";
import { Sparkles } from "lucide-react";

type AiInsightCardProps = {
  insight?: string;
  isLoading: boolean;
  onGenerateInsight: () => void;
};

export default function AiInsightCard({
  insight,
  isLoading,
  onGenerateInsight,
}: AiInsightCardProps) {
  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardHeader className="bg-white d-flex align-items-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">AI Insights</h2>
          <p className="text-body-secondary small mb-0">
            Customer-friendly summary of performance and recommended next steps.
          </p>
        </div>
        <CButton
          className="ai-generate-button"
          color="success"
          size="sm"
          type="button"
          onClick={onGenerateInsight}
          disabled={isLoading}
        >
          {isLoading ? <CSpinner size="sm" /> : <Sparkles size={16} aria-hidden="true" />}
          <span>Generate AI</span>
        </CButton>
      </CCardHeader>
      <CCardBody>
        {insight ? (
          <p className="mb-0 dashboard-insight-text">{insight}</p>
        ) : (
          <CAlert color="light" className="mb-0">
            Generate insights from validated rows, weather performance, and anomaly flags.
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  );
}
