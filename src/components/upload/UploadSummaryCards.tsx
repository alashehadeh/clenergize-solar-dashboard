import { CBadge, CCol, CRow } from "@coreui/react";
import { AlertCircle, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";

type UploadSummaryCardsProps = {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
};

const getStatus = (successfulRows: number, failedRows: number) => {
  if (successfulRows > 0 && failedRows === 0) {
    return { label: "All valid", color: "success" as const };
  }

  if (successfulRows > 0 && failedRows > 0) {
    return { label: "Needs review", color: "warning" as const };
  }

  return { label: "All failed", color: "danger" as const };
};

export default function UploadSummaryCards({
  totalRows,
  successfulRows,
  failedRows,
}: UploadSummaryCardsProps) {
  const status = getStatus(successfulRows, failedRows);

  return (
    <CRow className="g-3">
      <CCol md={6} xl={3}>
        <div className="upload-summary-card">
          <div className="upload-summary-icon text-primary bg-primary-subtle">
            <ClipboardList size={20} aria-hidden="true" />
          </div>
          <span>Total rows</span>
          <strong>{totalRows}</strong>
        </div>
      </CCol>
      <CCol md={6} xl={3}>
        <div className="upload-summary-card upload-summary-card-success">
          <div className="upload-summary-icon text-success bg-success-subtle">
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <span>Successfully added rows</span>
          <strong>{successfulRows}</strong>
        </div>
      </CCol>
      <CCol md={6} xl={3}>
        <div className="upload-summary-card upload-summary-card-failed">
          <div className="upload-summary-icon text-danger bg-danger-subtle">
            <AlertCircle size={20} aria-hidden="true" />
          </div>
          <span>Failed rows</span>
          <strong>{failedRows}</strong>
        </div>
      </CCol>
      <CCol md={6} xl={3}>
        <div className="upload-summary-card">
          <div className={`upload-summary-icon text-${status.color} bg-${status.color}-subtle`}>
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <span>Validation status</span>
          <strong>
            <CBadge color={status.color}>{status.label}</CBadge>
          </strong>
        </div>
      </CCol>
    </CRow>
  );
}
