import { CBadge, CCard, CCardBody, CCardHeader } from "@coreui/react";

type DataQualityCardProps = {
  approvedRowsCount: number;
  failedRowsCount?: number;
  validationSuccessRate: number;
  uploadedFileName?: string;
};

export default function DataQualityCard({
  approvedRowsCount,
  failedRowsCount,
  validationSuccessRate,
  uploadedFileName,
}: DataQualityCardProps) {
  return (
    <CCard className="border-0 shadow-sm">
      <CCardHeader className="bg-white">
        <h2 className="h5 mb-1">Data Quality</h2>
        <p className="text-body-secondary small mb-0">
          Validation context from the most recent upload.
        </p>
      </CCardHeader>
      <CCardBody>
        <div className="data-quality-grid">
          <div>
            <span>Approved rows</span>
            <strong>{approvedRowsCount}</strong>
          </div>
          {failedRowsCount !== undefined && (
            <div>
              <span>Failed rows</span>
              <strong>{failedRowsCount}</strong>
            </div>
          )}
          <div>
            <span>Success rate</span>
            <strong>
              <CBadge color={validationSuccessRate === 100 ? "success" : "warning"}>
                {validationSuccessRate}%
              </CBadge>
            </strong>
          </div>
          {uploadedFileName && (
            <div>
              <span>Uploaded file</span>
              <strong className="data-quality-file">{uploadedFileName}</strong>
            </div>
          )}
        </div>
      </CCardBody>
    </CCard>
  );
}
