# Clenergize Solar Dashboard

Next.js App Router assessment project for uploading, validating, analyzing, and visualizing solar production CSV files.

---

# Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js + React | Modern frontend framework with App Router support and reusable component architecture. |
| Backend | Next.js API Routes | Keeps frontend and backend within a single lightweight application. |
| Language | TypeScript | Improves type safety, maintainability, and developer experience. |
| UI Framework | CoreUI React Admin Template | Provides professional dashboard components and layouts. |
| CSV Processing | PapaParse | Lightweight and reliable CSV parsing library. |
| Charts | Recharts | Simple React charting library for dashboard visualizations. |
| AI Insights | OpenAI API / Fallback Mock Insight | Generates customer-friendly operational insights. |
| Hosting | Vercel | Native support for Next.js deployments and GitHub integration. |

---

# Architecture

The application follows a lightweight layered architecture to keep the code organized, reusable, and easy to maintain.

## Backend Structure

```text
src/backend/
  controllers/
  dto/
  services/
  utils/
```

### Controllers

Located in:

```text
src/backend/controllers
```

Responsibilities:
- request parsing
- orchestration
- consistent JSON responses
- graceful error handling

Controllers do not contain heavy business logic.

---

### DTOs

Located in:

```text
src/backend/dto
```

DTOs define TypeScript data contracts used across the application.

Examples:
- CSV upload request
- validated solar production row
- failed validation row
- dashboard metrics response
- AI insight request/response

---

### Services

Located in:

```text
src/backend/services
```

Services contain business logic such as:
- CSV validation
- row conversion
- metrics calculations
- AI insight generation

---

### Utilities

Located in:

```text
src/backend/utils
```

Shared backend helpers such as:
- CSV parsing
- date validation
- formatting helpers

---

## Frontend Structure

```text
src/components/
  layout/
  upload/
  dashboard/
```

Frontend components are reusable and configurable through props.

Examples:
- upload components
- validation result tables
- KPI cards
- charts
- AI insight cards

Page components mainly manage:
- page state
- navigation
- component composition

React components intentionally avoid backend business logic.

---

## API Design

API routes intentionally stay thin.

Located in:

```text
src/app/api
```

Responsibilities:
- receive HTTP requests
- call the relevant controller
- return controller responses

Example:

```ts
export async function POST(request: Request) {
  return CsvUploadController.handleUpload(request);
}
```

Validation and calculation logic are not implemented directly inside route handlers.

---

# Application Workflow

The application follows this flow:

1. Upload CSV file
2. Validate CSV rows
3. Separate approved and rejected records
4. Display validation results
5. Continue to dashboard using approved rows only
6. Display metrics, charts, anomalies, and AI-generated insights

---

# Features

## CSV Upload

- Drag-and-drop upload
- File picker support
- `.csv` files only
- Invalid file type rejection
- Upload progress and processing states
- Clear/remove selected file

---

## CSV Validation

Required columns:

```text
date
site_name
daily_production_kwh
weather
anomaly_detected
```

Validation rules:
- `date` must be a valid date
- `site_name` is required
- `daily_production_kwh` must be a valid number
- `weather` is required
- `anomaly_detected` must be one of:
  - Yes
  - No
  - true
  - false
  - 1
  - 0

Validation output:

```json
{
  "success": [],
  "failed": []
}
```

Successful rows are converted into clean typed objects.

Failed rows contain:
- row number
- original data
- validation error messages

---

# Dashboard Features

The dashboard analyzes approved rows only.

Dashboard includes:
- Total production
- Average daily production
- Highest production day
- Lowest production day
- Validation success rate
- Production trend chart
- Weather comparison chart
- Anomaly table
- AI operational insights

---

# AI Insight Feature

The AI feature generates customer-friendly operational insights based on approved records.

Insights may include:
- overall production trends
- weather impact analysis
- anomaly observations
- suggested operational next actions

If `OPENAI_API_KEY` is not configured, the application returns fallback mock insights so the demo remains functional.

---

# Assumptions

- CSV files follow the expected column structure.
- The app does not persist data in a database.
- CSV validation is session-based.
- Dashboard analysis uses approved rows only.
- AI insight generation is optional.

---

# Tradeoffs

This assessment intentionally prioritizes:
- clean thinking
- readability
- maintainability
- pragmatic implementation

instead of production-scale complexity.

Current tradeoffs:
- no authentication
- no database persistence
- no multi-user support
- no advanced anomaly detection engine
- lightweight session-based state handling

---

# Future Improvements

Potential future enhancements:
- database persistence
- authentication and authorization
- historical uploads
- advanced anomaly detection
- PDF export
- multi-site comparison
- scheduled reporting
- richer AI recommendations
- cloud storage integration

---

# Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Validation

Run:

```bash
npm run lint
npm run build
```

Next.js 16 requires Node.js:

```text
>=20.9.0
```

---

# Environment Variables

Create:

```text
.env.local
```

Example:

```env
OPENAI_API_KEY=
```

Do not commit `.env.local`.

Use `.env.example` to document required environment variables.

---

# Deployment

Recommended hosting:

```text
Vercel
```

Deployment flow:
1. Push repository to GitHub
2. Import repository into Vercel
3. Configure environment variables if needed
4. Deploy application

---

# Developer Notes

Before submitting or deploying:
- ensure CSV validation works correctly
- ensure dashboard loads approved rows
- ensure fallback AI insight works without API key
- ensure build passes successfully

Recommended validation commands:

```bash
npm run lint
npm run build
```