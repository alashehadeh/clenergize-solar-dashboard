"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CAlert, CButton, CCol, CRow } from "@coreui/react";
import { Download, Upload } from "lucide-react";
import AppShell from "@/src/components/layout/AppShell";
import PageHeader from "@/src/components/layout/PageHeader";
import AiInsightCard from "@/src/components/dashboard/AiInsightCard";
import AnomalyTable from "@/src/components/dashboard/AnomalyTable";
import DataQualityCard from "@/src/components/dashboard/DataQualityCard";
import MetricsGrid from "@/src/components/dashboard/MetricsGrid";
import ProductionTrendChart from "@/src/components/dashboard/ProductionTrendChart";
import WeatherComparisonChart from "@/src/components/dashboard/WeatherComparisonChart";
import { SolarMetricsService } from "@/src/backend/services/SolarMetricsService";
import type { AiInsightResponseDto } from "@/src/backend/dto/AiInsightResponseDto";
import type { SolarDashboardStorageDto } from "@/src/backend/dto/SolarDashboardDto";
import type { SolarProductionRowDto } from "@/src/backend/dto/SolarProductionRowDto";

const dashboardStorageKey = "clenergize.dashboard.validatedRows";
const metricsService = new SolarMetricsService();

const fallbackInsight =
  "Production appears stable across the validated period, with stronger output during favorable weather and lower output during less productive conditions. Review anomaly dates and compare inverter readings to confirm whether the issue is weather-related or operational.";

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
};

const downloadApprovedRows = (rows: SolarProductionRowDto[]) => {
  const headers = [
    "date",
    "site_name",
    "daily_production_kwh",
    "weather",
    "anomaly_detected",
  ];
  const lines = rows.map((row) =>
    [
      row.date,
      row.site_name,
      row.daily_production_kwh,
      row.weather,
      row.anomaly_detected,
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");

  link.href = url;
  link.download = "approved-solar-production-rows.csv";
  link.click();
  URL.revokeObjectURL(url);
};

export default function DashboardPage() {
  const router = useRouter();
  const [storedData, setStoredData] = useState<SolarDashboardStorageDto | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [insight, setInsight] = useState("");
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedValue = sessionStorage.getItem(dashboardStorageKey);

      if (storedValue) {
        try {
          setStoredData(JSON.parse(storedValue) as SolarDashboardStorageDto);
        } catch {
          sessionStorage.removeItem(dashboardStorageKey);
        }
      }

      setIsLoaded(true);
    });
  }, []);

  const approvedRows = useMemo(
    () => storedData?.approvedRows.map((row) => row.data) ?? [],
    [storedData],
  );

  const metrics = useMemo(
    () =>
      metricsService.calculate(approvedRows, {
        failedRowsCount: storedData?.failedRowsCount,
        totalRowsCount: storedData?.totalRowsCount,
      }),
    [approvedRows, storedData],
  );

  const generateInsight = async () => {
    if (approvedRows.length === 0) {
      return;
    }

    setIsInsightLoading(true);

    try {
      const response = await fetch("/api/ai/insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: approvedRows,
          metrics,
        }),
      });

      if (!response.ok) {
        throw new Error("Insight request failed.");
      }

      const data = (await response.json()) as AiInsightResponseDto;
      setInsight(data.insight || fallbackInsight);
    } catch {
      setInsight(fallbackInsight);
    } finally {
      setIsInsightLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="page-content">
          <CAlert color="info" className="mb-0">
            Loading dashboard...
          </CAlert>
        </div>
      </AppShell>
    );
  }

  if (approvedRows.length === 0) {
    return (
      <AppShell>
        <div className="page-content">
          <PageHeader
            eyebrow="Solar analytics"
            title="Solar Production Dashboard"
            description="Validated production records analyzed for performance trends, anomalies, and operational insights."
            badgeText="Dashboard"
          />
          <CAlert color="light" className="empty-dashboard-card mb-0">
            <h2 className="h5 mb-2">No validated records available.</h2>
            <p className="text-body-secondary mb-3">
              Please upload and validate a CSV file first.
            </p>
            <CButton color="success" type="button" onClick={() => router.push("/")}>
              <Upload size={16} aria-hidden="true" />
              <span className="ms-2">Go to Upload Page</span>
            </CButton>
          </CAlert>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-content">
        <PageHeader
          eyebrow="Solar analytics"
          title="Solar Production Dashboard"
          description="Validated production records analyzed for performance trends, anomalies, and operational insights."
          badgeText={`${approvedRows.length} approved rows`}
        />

        <MetricsGrid metrics={metrics} />

        <ProductionTrendChart
          data={metrics.trendData}
          averageProduction={metrics.averageProduction}
        />

        <CRow className="g-3">
          <CCol lg={7}>
            <WeatherComparisonChart data={metrics.weatherAverageProduction} />
          </CCol>
          <CCol lg={5}>
            <AiInsightCard
              insight={insight}
              isLoading={isInsightLoading}
              onGenerateInsight={generateInsight}
            />
          </CCol>
        </CRow>

        <AnomalyTable rows={approvedRows} />

        <DataQualityCard
          approvedRowsCount={approvedRows.length}
          failedRowsCount={storedData?.failedRowsCount}
          validationSuccessRate={metrics.validationSuccessRate}
          uploadedFileName={storedData?.uploadedFileName}
        />

        <div className="dashboard-actions">
          <CButton color="secondary" variant="outline" type="button" onClick={() => router.push("/")}>
            <Upload size={16} aria-hidden="true" />
            <span className="ms-2">Upload another file</span>
          </CButton>
          <CButton
            color="success"
            variant="outline"
            type="button"
            onClick={() => downloadApprovedRows(approvedRows)}
          >
            <Download size={16} aria-hidden="true" />
            <span className="ms-2">Download approved rows</span>
          </CButton>
        </div>
      </div>
    </AppShell>
  );
}
