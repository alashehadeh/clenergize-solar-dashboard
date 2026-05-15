"use client";

import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeatherAverageProductionDto } from "@/src/backend/dto/SolarDashboardDto";

type WeatherComparisonChartProps = {
  data: WeatherAverageProductionDto[];
  title?: string;
  subtitle?: string;
};

export default function WeatherComparisonChart({
  data,
  title = "Average Production by Weather",
  subtitle = "Helps compare production impact across weather conditions.",
}: WeatherComparisonChartProps) {
  return (
    <CCard className="border-0 shadow-sm h-100">
      <CCardHeader className="bg-white">
        <h2 className="h5 mb-1">{title}</h2>
        <p className="text-body-secondary small mb-0">{subtitle}</p>
      </CCardHeader>
      <CCardBody>
        <div className="chart-shell chart-shell-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="weather" tickLine={false} />
              <YAxis tickLine={false} width={58} />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} kWh`, "Avg production"]}
              />
              <Bar dataKey="averageProduction" fill="#0d6efd" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CCardBody>
    </CCard>
  );
}
