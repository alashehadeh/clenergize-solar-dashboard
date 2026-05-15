import { CAlert } from "@coreui/react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type UploadResultAlertProps = {
  successfulRows: number;
  failedRows: number;
};

export default function UploadResultAlert({
  successfulRows,
  failedRows,
}: UploadResultAlertProps) {
  if (successfulRows > 0 && failedRows === 0) {
    return (
      <CAlert color="success" className="d-flex align-items-center gap-2 mb-0">
        <CheckCircle2 size={20} aria-hidden="true" />
        Your file is ready. Continue to the dashboard to review production metrics and insights.
      </CAlert>
    );
  }

  if (successfulRows > 0 && failedRows > 0) {
    return (
      <CAlert color="warning" className="d-flex align-items-center gap-2 mb-0">
        <AlertTriangle size={20} aria-hidden="true" />
        Some rows were rejected. You can download failed rows for correction or continue
        using the valid records.
      </CAlert>
    );
  }

  return (
    <CAlert color="danger" className="d-flex align-items-center gap-2 mb-0">
      <XCircle size={20} aria-hidden="true" />
      No records were accepted. Please fix the CSV errors and upload again.
    </CAlert>
  );
}
