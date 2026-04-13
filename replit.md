# OpenClaw

An AI tools marketplace and directory for discovering MCP servers, Skills, Plugins, Templates, and Jobs in the AI ecosystem.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router v6
- **Backend**: Node.js + Express.js, running on port 3001
- **Database**: PostgreSQL (Replit built-in) via Drizzle ORM
- **Shared**: Zod schemas via drizzle-zod

## Project Structure

```
/src          - React frontend application
  /components - Reusable UI components (shadcn/ui)
  /pages      - Top-level views (Index, Jobs, Plugins, Skills, Admin, Submit)
  /lib        - API client (api.ts) and utilities
  /hooks      - Custom React hooks
/server       - Express backend API
  index.ts    - Entry point, DB migration and seeding
  routes.ts   - API endpoint definitions
  db.ts       - Database connection (Drizzle + pg Pool)
  storage.ts  - Data access layer
/shared       - Shared code between frontend and backend
  schema.ts   - Drizzle table definitions and Zod validation schemas
/public       - Static assets
```

## Running the App

The app uses `concurrently` to run both the backend API server and Vite dev server together:

```
npm run start
```

- Frontend (Vite): port 5000
- Backend (Express API): port 3001
- Vite proxies `/api` requests to the backend

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `PORT` - Backend API port (default: 3001)
- `ADMIN_PASSWORD` - Password for the admin dashboard (set in .replit userenv)
- `JWT_SECRET` - Secret for JWT token signing (optional, falls back to default)

## Database

The app automatically runs migrations and seeds data on startup (in `server/index.ts`). Three main tables:
- `listings` - MCP servers, skills, plugins, templates, jobs
- `submissions` - User-submitted listings awaiting review
- `ads` - Sponsored ad placements

## Admin Access

Navigate to `/admin` and use the `ADMIN_PASSWORD` environment variable value to log in.
