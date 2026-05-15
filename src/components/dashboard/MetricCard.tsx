import { CBadge, CCard, CCardBody } from "@coreui/react";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: "success" | "info" | "warning" | "danger" | "primary";
  badgeText?: string;
  badgeColor?: "success" | "info" | "warning" | "danger" | "primary" | "secondary";
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "success",
  badgeText,
  badgeColor = "success",
}: MetricCardProps) {
  return (
    <CCard className="h-100 border-0 shadow-sm">
      <CCardBody className="d-flex align-items-start justify-content-between gap-3">
        <div className="min-w-0">
          <p className="text-body-secondary small mb-1">{title}</p>
          <div className="h4 mb-1">{value}</div>
          {subtitle && <p className="text-body-secondary small mb-0">{subtitle}</p>}
          {badgeText && (
            <CBadge color={badgeColor} className="mt-2">
              {badgeText}
            </CBadge>
          )}
        </div>
        {Icon && (
          <div className={`metric-icon text-${color} bg-${color}-subtle`}>
            <Icon size={22} aria-hidden="true" />
          </div>
        )}
      </CCardBody>
    </CCard>
  );
}
