# Clenergize Solar Dashboard

Next.js App Router assessment project for uploading and validating solar production CSV files.

## Architecture

- `src/app`: Next.js App Router pages, layouts, and thin API route handlers.
- `src/backend/controllers`: request parsing, orchestration, consistent JSON responses, and graceful error handling.
- `src/backend/dto`: TypeScript data contracts for CSV rows, validation results, metrics, and AI insight requests/responses.
- `src/backend/services`: business logic for CSV validation, solar metrics, and AI insight generation.
- `src/backend/utils`: shared backend helpers such as CSV parsing and date validation.
- `src/components`: reusable CoreUI React components grouped by layout, upload, and dashboard concerns.

API routes intentionally stay small. They receive the HTTP request, call the relevant controller, and return the controller response. React components do not contain CSV validation or metrics business logic.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

Next.js 16 requires Node.js `>=20.9.0`.
