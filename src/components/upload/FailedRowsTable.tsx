import { useState } from "react";
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { CheckCircle2 } from "lucide-react";
import type { FailedCsvRowDto, RawCsvRowDto } from "@/src/backend/dto/SolarProductionRowDto";

type FailedRowsTableProps = {
  failedRows: FailedCsvRowDto[];
  title?: string;
  maxRowsToShow?: number;
  showPagination?: boolean;
};

const displayCellValue = (row: RawCsvRowDto, column: string) => {
  const value = String(row[column] ?? "").trim();

  if (!value) {
    return <span className="text-body-secondary fst-italic">Missing</span>;
  }

  return value;
};

export default function FailedRowsTable({
  failedRows,
  title = "Failed Rows",
  maxRowsToShow = 10,
  showPagination = true,
}: FailedRowsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleRows =
    showPagination && !showAll ? failedRows.slice(0, maxRowsToShow) : failedRows;
  const canToggle = showPagination && failedRows.length > maxRowsToShow;

  return (
    <CCard className="result-table-card border-0 shadow-sm">
      <CCardHeader className="bg-white d-flex align-items-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">{title}</h2>
          <p className="text-body-secondary small mb-0">
            Rejected records with row-level validation messages.
          </p>
        </div>
        <CBadge color={failedRows.length > 0 ? "danger" : "success"} className="result-count-badge">
          {failedRows.length} failed
        </CBadge>
      </CCardHeader>
      <CCardBody>
        {failedRows.length === 0 ? (
          <CAlert color="success" className="d-flex align-items-center gap-2 mb-0">
            <CheckCircle2 size={18} aria-hidden="true" />
            No failed rows. All records passed validation.
          </CAlert>
        ) : (
          <>
            <CTable
              responsive
              hover
              align="middle"
              className="validation-table failed-validation-table table-sm mb-0"
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Row #</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Site Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Daily Production kWh</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Weather</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Anomaly Detected</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Error Messages</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {visibleRows.map((row) => (
                  <CTableRow key={row.rowNumber}>
                    <CTableDataCell className="fw-semibold">
                      {row.rowNumber}
                    </CTableDataCell>
                    <CTableDataCell>{displayCellValue(row.originalData, "date")}</CTableDataCell>
                    <CTableDataCell>
                      {displayCellValue(row.originalData, "site_name")}
                    </CTableDataCell>
                    <CTableDataCell>
                      {displayCellValue(row.originalData, "daily_production_kwh")}
                    </CTableDataCell>
                    <CTableDataCell>
                      {displayCellValue(row.originalData, "weather")}
                    </CTableDataCell>
                    <CTableDataCell>
                      {displayCellValue(row.originalData, "anomaly_detected")}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1 align-items-start">
                        {row.errors.map((message) => (
                          <CBadge
                            color="danger"
                            key={message}
                            className="error-badge text-wrap text-start"
                          >
                            {message}
                          </CBadge>
                        ))}
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {canToggle && (
              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                >
                  {showAll ? "Show less" : `Show all ${failedRows.length} rows`}
                </CButton>
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  );
}
