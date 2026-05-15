import { CCol, CRow } from "@coreui/react";
import { Activity, AlertTriangle, BarChart3, Gauge, ShieldCheck, TrendingDown } from "lucide-react";
import type { SolarDashboardMetricsDto } from "@/src/backend/dto/SolarDashboardDto";
import MetricCard from "./MetricCard";

type MetricsGridProps = {
  metrics: SolarDashboardMetricsDto;
};

const formatKwh = (value: number) => `${value.toLocaleString()} kWh`;

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <CRow className="g-3">
      <CCol md={6} xl={4}>
        <MetricCard
          title="Total Production"
          value={formatKwh(metrics.totalProduction)}
          subtitle="Approved CSV records"
          icon={BarChart3}
          color="success"
        />
      </CCol>
      <CCol md={6} xl={4}>
        <MetricCard
          title="Average Daily Production"
          value={formatKwh(metrics.averageProduction)}
          subtitle="Across validated rows"
          icon={Gauge}
          color="info"
        />
      </CCol>
      <CCol md={6} xl={4}>
        <MetricCard
          title="Highest Production Day"
          value={
            metrics.highestProductionDay
              ? formatKwh(metrics.highestProductionDay.production)
              : "n/a"
          }
          subtitle={metrics.highestProductionDay?.date ?? "No approved data"}
          icon={Activity}
          color="primary"
        />
      </CCol>
      <CCol md={6} xl={4}>
        <MetricCard
          title="Lowest Production Day"
          value={
            metrics.lowestProductionDay
              ? formatKwh(metrics.lowestProductionDay.production)
              : "n/a"
          }
          subtitle={metrics.lowestProductionDay?.date ?? "No approved data"}
          icon={TrendingDown}
          color="warning"
        />
      </CCol>
      <CCol md={6} xl={4}>
        <MetricCard
          title="Anomaly Count"
          value={metrics.anomalyCount}
          subtitle="Rows marked in CSV"
          icon={AlertTriangle}
          color={metrics.anomalyCount > 0 ? "warning" : "success"}
          badgeText={metrics.anomalyCount > 0 ? "Review" : "Clear"}
          badgeColor={metrics.anomalyCount > 0 ? "warning" : "success"}
        />
      </CCol>
      <CCol md={6} xl={4}>
        <MetricCard
          title="Validation Success Rate"
          value={`${metrics.validationSuccessRate}%`}
          subtitle="Accepted rows vs uploaded rows"
          icon={ShieldCheck}
          color="success"
        />
      </CCol>
    </CRow>
  );
}
