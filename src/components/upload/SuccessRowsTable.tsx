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
import type { SuccessfulCsvRowDto } from "@/src/backend/dto/SolarProductionRowDto";

type SuccessRowsTableProps = {
  rows: SuccessfulCsvRowDto[];
  title?: string;
  maxRowsToShow?: number;
  showPagination?: boolean;
};

export default function SuccessRowsTable({
  rows,
  title = "Successfully Added Rows",
  maxRowsToShow = 10,
  showPagination = true,
}: SuccessRowsTableProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleRows =
    showPagination && !showAll ? rows.slice(0, maxRowsToShow) : rows;
  const canToggle = showPagination && rows.length > maxRowsToShow;

  return (
    <CCard className="result-table-card border-0 shadow-sm">
      <CCardHeader className="bg-white d-flex align-items-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">{title}</h2>
          <p className="text-body-secondary small mb-0">
            Clean records converted and ready for dashboard analysis.
          </p>
        </div>
        <CBadge color="success" className="result-count-badge">
          {rows.length} added
        </CBadge>
      </CCardHeader>
      <CCardBody>
        {rows.length === 0 ? (
          <CAlert color="light" className="d-flex align-items-center gap-2 mb-0">
            <CheckCircle2 size={18} aria-hidden="true" />
            No rows were added from this upload.
          </CAlert>
        ) : (
          <>
            <CTable
              responsive
              hover
              align="middle"
              className="validation-table success-validation-table table-sm mb-0"
            >
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Row #</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Site Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Daily Production kWh</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Weather</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Anomaly Detected</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {visibleRows.map((row) => (
                  <CTableRow key={row.rowNumber}>
                    <CTableDataCell className="fw-semibold">
                      {row.rowNumber}
                    </CTableDataCell>
                    <CTableDataCell>{row.data.date}</CTableDataCell>
                    <CTableDataCell>{row.data.site_name}</CTableDataCell>
                    <CTableDataCell>
                      {row.data.daily_production_kwh.toLocaleString()}
                    </CTableDataCell>
                    <CTableDataCell>{row.data.weather}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={row.data.anomaly_detected ? "warning" : "success"}>
                        {row.data.anomaly_detected ? "Yes" : "No"}
                      </CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {canToggle && (
              <div className="d-flex justify-content-end mt-3">
                <CButton
                  color="success"
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAll((current) => !current)}
                >
                  {showAll ? "Show less" : `Show all ${rows.length} rows`}
                </CButton>
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  );
}
