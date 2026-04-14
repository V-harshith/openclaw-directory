# OpenClaw

An AI tools marketplace and directory for discovering MCP servers, Skills, Plugins, Templates, and Jobs in the AI ecosystem.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router v6
- **Backend**: Node.js + Express.js, running on port 3001
- **Database**: Neon PostgreSQL (serverless) via Drizzle ORM — connection via `NEON_DATABASE_URL`
- **Security**: Helmet, express-rate-limit, JWT authentication
- **Shared**: Zod schemas via drizzle-zod

## Project Structure

```
/src          - React frontend application
  /components - Reusable UI components (Header, Footer, ListingCard, AdBanner, ScrollToTop)
  /pages      - Top-level views (Index, MCPServers, Skills, Plugins, Templates, Jobs, Detail, About, Submit, Admin, Login, Search)
  /lib        - API client (api.ts) and utilities
  /hooks      - Custom React hooks (useListings with useSearch, useSEO)
  /data       - Mock data and type definitions
/server       - Express backend API
  index.ts    - Entry point, DB migration and seeding, helmet, rate limiting
  routes.ts   - API endpoints (listings, search, ads, admin, upvote)
  db.ts       - Database connection (Drizzle + pg Pool) — uses NEON_DATABASE_URL
  storage.ts  - Data access layer (CRUD + search via ilike)
/shared       - Shared code between frontend and backend
  schema.ts   - Drizzle table definitions and Zod validation schemas
/public       - Static assets (robots.txt)
```

## Running the App

```
npm run start
```

- Frontend (Vite): port 5000
- Backend (Express API): port 3001
- Vite proxies `/api` requests to the backend

## Environment Variables

- `NEON_DATABASE_URL` - Neon PostgreSQL connection string (primary DB, set as env var)
- `DATABASE_URL` - Fallback PostgreSQL connection string (Replit built-in, used if NEON_DATABASE_URL not set)
- `PORT` - Backend API port (default: 3001)
- `ADMIN_PASSWORD` - Password for the admin dashboard (set in shared env vars, default: openclaw2026)
- `JWT_SECRET` - Secret for JWT token signing (optional, logs warning if not set)

## Database

Auto-migrates and seeds on startup (`server/index.ts`). Three main tables:
- `listings` — MCP servers, skills, plugins, templates, jobs
- `submissions` — User-submitted listings awaiting admin review
- `ads` — Sponsored ad placements (header, sidebar, footer, in-content)

Seed data: 8 MCP servers, 3 skills, 3 templates, 1 plugin, 4 jobs + 3 default ads.

## Key Architecture Decisions

- `ListingCard` uses a `TYPE_TO_PATH` map to generate correct hyphenated URLs (`mcp_server` → `/mcp-servers/`)
- `useSEO` hook replaces `react-helmet-async` (which had React version conflicts) — uses direct DOM manipulation
- `ScrollToTop` component resets scroll position on every route change
- Rate limiting uses `trust proxy = 1` for correct IP detection behind Replit's proxy
- All hooks called unconditionally at top of components (React rules of hooks compliance)

## Admin Access

Navigate to `/admin` and log in with the `ADMIN_PASSWORD` env var value.
