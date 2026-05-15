import {
  CAlert,
  CBadge,
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
import type { SolarProductionRowDto } from "@/src/backend/dto/SolarProductionRowDto";

type AnomalyTableProps = {
  rows: SolarProductionRowDto[];
};

export default function AnomalyTable({ rows }: AnomalyTableProps) {
  const anomalyRows = rows.filter((row) => row.anomaly_detected);

  return (
    <CCard className="border-0 shadow-sm">
      <CCardHeader className="bg-white d-flex align-items-center justify-content-between gap-3">
        <div>
          <h2 className="h5 mb-1">Anomaly Review Queue</h2>
          <p className="text-body-secondary small mb-0">
            Approved records where the uploaded CSV flagged an anomaly.
          </p>
        </div>
        <CBadge color={anomalyRows.length > 0 ? "warning" : "success"}>
          {anomalyRows.length} anomaly record(s)
        </CBadge>
      </CCardHeader>
      <CCardBody>
        {anomalyRows.length === 0 ? (
          <CAlert color="success" className="d-flex align-items-center gap-2 mb-0">
            <CheckCircle2 size={18} aria-hidden="true" />
            No anomalies detected in the approved records.
          </CAlert>
        ) : (
          <CTable responsive hover align="middle" className="validation-table table-sm mb-0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Site Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Daily Production kWh</CTableHeaderCell>
                <CTableHeaderCell scope="col">Weather</CTableHeaderCell>
                <CTableHeaderCell scope="col">Suggested Review Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {anomalyRows.map((row) => (
                <CTableRow key={`${row.date}-${row.site_name}-${row.daily_production_kwh}`}>
                  <CTableDataCell>{row.date}</CTableDataCell>
                  <CTableDataCell>{row.site_name}</CTableDataCell>
                  <CTableDataCell>{row.daily_production_kwh.toLocaleString()} kWh</CTableDataCell>
                  <CTableDataCell>{row.weather}</CTableDataCell>
                  <CTableDataCell>
                    Review inverter logs and compare weather conditions for this day.
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
}
