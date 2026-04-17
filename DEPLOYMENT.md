# OpenClaw Deployment Guide

Complete step-by-step guide to deploy OpenClaw (frontend + backend + Neon DB).

---

## Architecture Overview

OpenClaw is a **two-part application**:

1. **Frontend** — React + Vite (static site) → deploy to **Vercel**
2. **Backend** — Express API server → deploy to **Railway** or **Render** (NOT Vercel — see notes)
3. **Database** — Neon PostgreSQL (already provisioned)

> **Why not Vercel for backend?** Vercel uses serverless functions, but our Express server is a long-running process with rate limiting and connection pooling. Railway/Render run it natively with zero refactoring.

---

## Database Schemas — Are They Pushed?

**Yes, automatically.** On every backend startup, `server/index.ts` runs:
- **Auto-migration** — creates the `listings`, `submissions`, and `ads` tables if they don't exist (defined in `shared/schema.ts`)
- **Auto-seeding** — inserts ~25 starter listings + 4 default ads if the DB is empty

You do **not** need to run migrations manually. Just deploy the backend and it handles everything on first boot.

To verify after deploy: hit `https://your-backend-url/api/listings` — you should see JSON.

---

## Step 1 — Deploy Backend to Railway (recommended)

### 1.1 Push your code to GitHub
Connect your Lovable project to GitHub via the GitHub button (top right of the editor).

### 1.2 Create Railway project
1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your OpenClaw repo
3. Railway auto-detects Node.js

### 1.3 Configure build & start commands
In Railway → **Settings** → **Build**:
- **Build command:** `npm install`
- **Start command:** `npx tsx server/index.ts`

### 1.4 Add environment variables
In Railway → **Variables**, add:

| Name | Value |
|------|-------|
| `NEON_DATABASE_URL` | `postgresql://neondb_owner:npg_WlXdxO5aey8R@ep-spring-hill-an3dzfe3-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `ADMIN_PASSWORD` | `openclaw2026` (or pick your own strong password) |
| `JWT_SECRET` | A random 32+ char string (generate with `openssl rand -hex 32`) |
| `PORT` | `3001` |

### 1.5 Generate a public domain
Railway → **Settings** → **Networking** → **Generate Domain**
You'll get something like `openclaw-backend-production.up.railway.app`. **Save this URL.**

### 1.6 Verify backend is live
Open `https://YOUR-RAILWAY-URL/api/listings` — should return JSON with seeded listings.

---

## Step 2 — Deploy Frontend to Vercel

### 2.1 Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → **Import Git Repository**
2. Select your OpenClaw repo
3. Framework preset: **Vite** (auto-detected)

### 2.2 Add environment variable
In Vercel → **Settings** → **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL/api` *(from Step 1.5, with `/api` appended)* |

### 2.3 Deploy
Click **Deploy**. Vercel builds and serves your frontend.

### 2.4 (Optional) Add custom domain
Vercel → **Domains** → add your domain (e.g. `openclaw.io`). Update DNS as instructed.

---

## Step 3 — Enable CORS on Backend

Since frontend (Vercel) and backend (Railway) are on different domains, add CORS to `server/index.ts`:

```ts
import cors from "cors";
app.use(cors({
  origin: ["https://your-frontend.vercel.app", "https://openclaw.io"],
  credentials: true,
}));
```

Then `npm install cors @types/cors` and redeploy backend.

---

## Step 4 — Post-Deploy Checklist

- [ ] Backend `/api/listings` returns JSON
- [ ] Frontend loads listings on home page (not empty)
- [ ] Admin login works at `/admin` with `ADMIN_PASSWORD`
- [ ] Submit form creates a new submission (visible in admin panel)
- [ ] Approve/delete actions in admin panel actually update the DB
- [ ] Upvote button increments count and persists on refresh
- [ ] Submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console)
- [ ] Submit to [Bing Webmaster Tools](https://www.bing.com/webmasters)

---

## Common Issues

| Symptom | Fix |
|---------|-----|
| Frontend shows no listings | `VITE_API_URL` missing or wrong on Vercel |
| CORS error in browser console | Add CORS middleware (Step 3) |
| Admin login fails | `ADMIN_PASSWORD` mismatch or `JWT_SECRET` not set on backend |
| 502 from backend | Railway free tier sleeping — upgrade or ping every 5 min |
| Tables don't exist | Backend never started successfully — check Railway logs |

---

## What's Next (Optional Enhancements)

1. **Dynamic sitemap.xml** — Generate from DB so all listing detail pages get indexed
2. **JSON-LD structured data** — Add `Product` / `JobPosting` schema to detail pages for rich Google results
3. **Open Graph images** — Default social share image for Twitter/LinkedIn previews
4. **Analytics** — Plausible or Google Analytics
5. **Email notifications** — Notify admin when new submission arrives (Resend / SendGrid)
6. **Rate limiting per IP on submit form** — Already in place, verify it works under load
7. **Image uploads for listings** — Use Cloudinary or UploadThing instead of URL-only logos
8. **Categories/tags filter UI** — Multi-select sidebar filters on each directory page
9. **User accounts** — Let users save favorites, track their own submissions
10. **API documentation** — Public REST docs for the listing API (could become a feature)
