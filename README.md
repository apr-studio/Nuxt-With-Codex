# Nuxt UI Dashboard + Showcase

This project is a Nuxt 3 + Nuxt UI demo that includes:
- A route navigator landing page.
- A categorized Nuxt UI component showcase with live props examples.
- A multi-page dashboard with role-based access, mock APIs, and charts.
- Session-based auth with email/password and social OAuth login.

## Routes

- `/` Route navigator landing page.
- `/ui-showcase` Categorized Nuxt UI component gallery.
- `/dashboard/overview` KPI cards + activity feed.
- `/dashboard/reports` ECharts report charts with loading UX.
- `/dashboard/users` CRUD demo with modal + form validation.
- `/dashboard/settings` Settings form with RBAC read-only state.
- `/login` Email/password login + Google/Facebook/Apple OAuth entry.
- `/register` Email/password sign-up.

## Key Features

- Nuxt UI components across pages and dashboard shells.
- Role-based access control via middleware and shared permissions.
- API response schema normalization with typed success/failure.
- Zod runtime validation on server responses.
- Unified `useApiFetch` / `useApiMutation` with retry + toast.
- Global route-loading overlay for dashboard navigation.
- ECharts-powered report modules with fallback data.
- Account settings with avatar upload + password update helpers.

## Project Structure

- `app/pages` UI routes and dashboard pages.
- `app/components/dashboard` Dashboard shell and feature components.
- `app/composables` Shared UI/data composables.
- `app/constants` UI constants for reports/loading.
- `server/api` Mock APIs for dashboard + users.
- `server/schemas` Zod schemas for API runtime validation.
- `shared` Shared types and dashboard config.

## Setup

Install dependencies:

```bash
pnpm install
```

Create environment file:

```bash
cp .env.example .env
```

Generate Prisma client and seed dev data:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Development

```bash
pnpm dev
```

## Scripts

- `pnpm dev` Start the dev server.
- `pnpm build` Build for production.
- `pnpm preview` Preview production build.
- `npm run lint` Lint the codebase.
- `npm run typecheck` Typecheck with Nuxt.
- `npm run db:generate` Prisma client generation.
- `npm run db:push` Apply schema to local DB.
- `npm run db:seed` Seed mock data.

## Notes

- Auth is session-based (`/api/auth/me`) and RBAC is derived from user role.
- Reports use fallback data when API data is missing for a range.
- Charts are rendered client-side via `EChartClient`.

## OAuth Setup (Google / Facebook / Apple)

1. Fill provider credentials in `.env`:

```bash
NUXT_OAUTH_GOOGLE_CLIENT_ID=...
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=...
NUXT_OAUTH_FACEBOOK_CLIENT_ID=...
NUXT_OAUTH_FACEBOOK_CLIENT_SECRET=...
NUXT_OAUTH_APPLE_CLIENT_ID=...
NUXT_OAUTH_APPLE_CLIENT_SECRET=...
```

2. Set callback URLs in each provider console (example for local dev):
- `http://localhost:3000/api/auth/oauth/callback/google`
- `http://localhost:3000/api/auth/oauth/callback/facebook`
- `http://localhost:3000/api/auth/oauth/callback/apple`

3. Start app and test from `/login` social buttons.

If a provider is not configured, that provider login returns an OAuth error message on `/login`.
