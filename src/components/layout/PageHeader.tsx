import { CBadge } from "@coreui/react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badgeText?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  badgeText,
}: PageHeaderProps) {
  return (
    <div className="page-header d-flex align-items-start justify-content-between gap-3">
      <div>
        <p className="text-uppercase text-success fw-semibold small mb-2">{eyebrow}</p>
        <h1 className="h3 mb-2">{title}</h1>
        <p className="text-body-secondary mb-0">{description}</p>
      </div>
      {badgeText && (
        <CBadge color="success" className="px-3 py-2">
          {badgeText}
        </CBadge>
      )}
    </div>
  );
}
