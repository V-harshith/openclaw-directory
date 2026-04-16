

# Fix: Connect Frontend to Neon DB Backend + Remove Sign In

## Summary
The frontend currently uses `localStorage` (mock data) instead of calling the Express backend that's connected to Neon PostgreSQL. All admin panel operations are fake. The fix is to rewrite `src/lib/api.ts` to call the backend API endpoints, and remove the public Sign In button.

## Changes

### 1. Rewrite `src/lib/api.ts` — call real backend API
Replace all localStorage-based functions with `fetch()` calls to the backend at `/api/*`. The backend already has all routes implemented in `server/routes.ts` with full CRUD for listings, submissions, and ads.

Key changes:
- `getListings()` → `GET /api/listings?type=...&category=...`
- `getListing(id)` → `GET /api/listings/:id`
- `search()` → `GET /api/listings/search?q=...&type=...`
- `createListing()` → `POST /api/listings` (with auth header)
- `updateListing()` → `PATCH /api/listings/:id` (with auth header)
- `deleteListing()` → `DELETE /api/listings/:id` (with auth header)
- `adminLogin()` → `POST /api/admin/login`
- `adminMe()` → `GET /api/admin/me` (with auth header)
- `getSubmissions()` → `GET /api/submissions` (with auth header)
- `createSubmission()` → `POST /api/submissions`
- `updateSubmissionStatus()` → `PATCH /api/submissions/:id/status` (with auth header)
- `deleteSubmission()` → `DELETE /api/submissions/:id` (with auth header)
- `getAds()` → `GET /api/ads`
- `getAllAds()` → `GET /api/ads/all` (with auth header)
- `createAd()` → `POST /api/ads` (with auth header)
- `updateAd()` → `PATCH /api/ads/:id` (with auth header)
- `deleteAd()` → `DELETE /api/ads/:id` (with auth header)

The API base URL will use a configurable value (e.g., `VITE_API_URL` env var or default to relative `/api` path for same-origin deployment, or `http://localhost:3001/api` for dev).

### 2. Remove Sign In button from Header
- Remove the "Sign in" `<Link to="/login">` button from both desktop and mobile nav in `src/components/Header.tsx`
- Keep the Submit button and Admin button (admin-only, already gated)

### 3. Vercel deployment notes
- The backend (Express + Neon DB) runs separately — you'll deploy it as a standalone Node.js service (e.g., on Vercel Serverless Functions, Railway, or Render)
- Set these env vars on the backend deployment: `NEON_DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`
- Set `VITE_API_URL` on the frontend Vercel project pointing to the deployed backend URL

