"use client";

import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SolarTrendPointDto } from "@/src/backend/dto/SolarDashboardDto";

type ProductionTrendChartProps = {
  data: SolarTrendPointDto[];
  averageProduction: number;
  title?: string;
  subtitle?: string;
};

const renderDot = ({
  cx,
  cy,
  payload,
}: {
  cx?: number;
  cy?: number;
  payload?: SolarTrendPointDto;
}) => {
  if (!payload?.anomalyDetected || cx === undefined || cy === undefined) {
    return <circle cx={cx} cy={cy} r={3} fill="#198754" />;
  }

  return <circle cx={cx} cy={cy} r={5} fill="#f59f00" stroke="#fff" strokeWidth={2} />;
};

export default function ProductionTrendChart({
  data,
  averageProduction,
  title = "Daily Production Trend",
  subtitle = "Production output over time based on validated CSV records.",
}: ProductionTrendChartProps) {
  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardHeader className="bg-white">
        <h2 className="h5 mb-1">{title}</h2>
        <p className="text-body-secondary small mb-0">{subtitle}</p>
      </CCardHeader>
      <CCardBody>
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} minTickGap={24} />
              <YAxis tickLine={false} width={58} />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Production"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <ReferenceLine
                y={averageProduction}
                stroke="#0d6efd"
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: `Avg ${averageProduction.toLocaleString()} kWh`,
                  position: "insideTopRight",
                  fill: "#0d6efd",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="production"
                stroke="#198754"
                strokeWidth={2}
                fill="#d1e7dd"
                dot={renderDot}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CCardBody>
    </CCard>
  );
}
