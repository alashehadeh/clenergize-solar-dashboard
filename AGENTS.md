<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project architecture rules

- Keep Next.js API `route.ts` files thin. Route handlers should receive the request, call a controller, and return the controller response.
- Put request orchestration and error handling in `src/backend/controllers`.
- Put data contracts, request shapes, response shapes, and validation result shapes in `src/backend/dto`.
- Put business logic in `src/backend/services`; do not place validation, metrics, or AI prompt logic directly in route handlers or React components.
- Put shared backend helpers in `src/backend/utils`.
- Keep frontend components reusable and configurable through props.
- Use CoreUI React components for application layout, cards, buttons, alerts, and tables where practical.
- Keep pages focused on page-level state and composition.
