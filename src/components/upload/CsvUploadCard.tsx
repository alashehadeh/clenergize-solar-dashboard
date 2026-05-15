import { CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { ArrowRight, Download, RotateCcw } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import FailedRowsTable from "./FailedRowsTable";
import FileDropzone from "./FileDropzone";
import SuccessRowsTable from "./SuccessRowsTable";
import UploadResultAlert from "./UploadResultAlert";
import UploadSummaryCards from "./UploadSummaryCards";
import type { CsvValidationResultDto } from "@/src/backend/dto/CsvValidationResultDto";
import type { FailedCsvRowDto } from "@/src/backend/dto/SolarProductionRowDto";

type CsvUploadCardProps = {
  accept: string;
  errorMessage?: string;
  isProcessing: boolean;
  onContinueToDashboard?: () => void;
  onFileSelected: (file: File) => void;
  onReset: () => void;
  result: CsvValidationResultDto | null;
  selectedFileName?: string;
  selectedFileSizeKb?: string;
};

const requiredColumns =
  "Required columns: date, site_name, daily_production_kwh, weather, anomaly_detected.";

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
};

const downloadFailedRows = (failedRows: FailedCsvRowDto[]) => {
  const headers = [
    "rowNumber",
    "date",
    "site_name",
    "daily_production_kwh",
    "weather",
    "anomaly_detected",
    "errors",
  ];
  const lines = failedRows.map((row) =>
    [
      row.rowNumber,
      row.originalData.date,
      row.originalData.site_name,
      row.originalData.daily_production_kwh,
      row.originalData.weather,
      row.originalData.anomaly_detected,
      row.errors.join("; "),
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = "failed-solar-production-rows.csv";
  link.click();
  URL.revokeObjectURL(url);
};

export default function CsvUploadCard({
  accept,
  errorMessage,
  isProcessing,
  onContinueToDashboard,
  onFileSelected,
  onReset,
  result,
  selectedFileName,
  selectedFileSizeKb,
}: CsvUploadCardProps) {
  const totalRows = result ? result.success.length + result.failed.length : 0;
  const hasSuccessfulRows = Boolean(result?.success.length);
  const hasFailedRows = Boolean(result?.failed.length);

  return (
    <CCard className="csv-upload-card shadow-sm">
      <CCardHeader className="bg-white">
        <div>
          <h2 className="h5 mb-1">Upload CSV file</h2>
          <p className="text-body-secondary small mb-0">
            Drag a file into the upload area or select it from your computer.
          </p>
        </div>
      </CCardHeader>

      <CCardBody>
        <FileDropzone
          accept={accept}
          errorMessage={errorMessage}
          helperText={requiredColumns}
          isProcessing={isProcessing}
          onClearFile={selectedFileName ? onReset : undefined}
          onFileSelected={onFileSelected}
          selectedFileName={selectedFileName}
          selectedFileSizeKb={selectedFileSizeKb}
        />

        {result && (
          <section className="upload-results-section" id="validation-results">
            <UploadSummaryCards
              totalRows={totalRows}
              successfulRows={result.success.length}
              failedRows={result.failed.length}
            />

            <UploadResultAlert
              successfulRows={result.success.length}
              failedRows={result.failed.length}
            />

            {hasSuccessfulRows && <DashboardPreview rows={result.success} />}

            <SuccessRowsTable rows={result.success} />
            <FailedRowsTable failedRows={result.failed} />

            <div className="upload-actions">
              <CButton color="secondary" variant="outline" type="button" onClick={onReset}>
                <RotateCcw size={16} aria-hidden="true" />
                <span className="ms-2">Upload another file</span>
              </CButton>

              {hasFailedRows && (
                <CButton
                  color="danger"
                  variant="outline"
                  type="button"
                  onClick={() => downloadFailedRows(result.failed)}
                >
                  <Download size={16} aria-hidden="true" />
                  <span className="ms-2">Download failed rows</span>
                </CButton>
              )}

              {hasSuccessfulRows && (
                <CButton color="success" type="button" onClick={onContinueToDashboard}>
                  <span>Continue to Dashboard</span>
                  <ArrowRight size={16} className="ms-2" aria-hidden="true" />
                </CButton>
              )}
            </div>
          </section>
        )}
      </CCardBody>
    </CCard>
  );
}
