import { CCol, CRow } from "@coreui/react";
import { Activity, AlertTriangle, BarChart3, Gauge } from "lucide-react";
import MetricCard from "../dashboard/MetricCard";
import type { SuccessfulCsvRowDto } from "@/src/backend/dto/SolarProductionRowDto";

type DashboardPreviewProps = {
  rows: SuccessfulCsvRowDto[];
};

const round = (value: number) => Math.round(value * 100) / 100;

export default function DashboardPreview({ rows }: DashboardPreviewProps) {
  if (rows.length === 0) {
    return null;
  }

  const cleanRows = rows.map((row) => row.data);
  const totalProduction = cleanRows.reduce(
    (total, row) => total + row.daily_production_kwh,
    0,
  );
  const averageProduction = totalProduction / cleanRows.length;
  const bestDay = cleanRows.reduce((selected, current) =>
    current.daily_production_kwh > selected.daily_production_kwh ? current : selected,
  );
  const anomalyCount = cleanRows.filter((row) => row.anomaly_detected).length;

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h2 className="h5 mb-1">Dashboard preview</h2>
          <p className="text-body-secondary small mb-0">
            A quick snapshot from accepted records.
          </p>
        </div>
      </div>
      <CRow className="g-3">
        <CCol md={6} xl={3}>
          <MetricCard
            title="Total production"
            value={`${round(totalProduction).toLocaleString()} kWh`}
            subtitle={`${cleanRows.length} accepted record(s)`}
            icon={BarChart3}
            color="success"
          />
        </CCol>
        <CCol md={6} xl={3}>
          <MetricCard
            title="Average daily production"
            value={`${round(averageProduction).toLocaleString()} kWh`}
            subtitle="Across accepted rows"
            icon={Gauge}
            color="info"
          />
        </CCol>
        <CCol md={6} xl={3}>
          <MetricCard
            title="Best production day"
            value={`${bestDay.daily_production_kwh.toLocaleString()} kWh`}
            subtitle={bestDay.date}
            icon={Activity}
            color="primary"
          />
        </CCol>
        <CCol md={6} xl={3}>
          <MetricCard
            title="Anomaly records"
            value={anomalyCount}
            subtitle="Marked for review"
            icon={AlertTriangle}
            color={anomalyCount > 0 ? "warning" : "success"}
          />
        </CCol>
      </CRow>
    </section>
  );
}
