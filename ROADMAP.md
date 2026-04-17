# OpenClaw Roadmap

A prioritized list of completed work and planned enhancements. Use this as your single source of truth for "what's done" vs "what's next".

---

## ✅ Done

### Backend & Data
- [x] Express + Neon PostgreSQL backend with Drizzle ORM
- [x] Auto-migration + auto-seeding on first boot (~25 listings + 4 ads)
- [x] Full CRUD API for listings, submissions, ads
- [x] JWT-based admin auth with rate limiting (login, upvote, submit)
- [x] Frontend `api.ts` calls real backend (no more localStorage mock)
- [x] CORS enabled for cross-origin frontend → backend

### SEO
- [x] Per-page `<title>`, meta description, canonical URLs on every page
- [x] `useSEO` hook syncs OG/Twitter title, description, image, URL
- [x] Default Open Graph image (`/public/og-image.jpg`) — 1200×630
- [x] Dynamic `sitemap.xml` served from backend (includes all DB listings)
- [x] JSON-LD structured data on detail pages (`SoftwareApplication` / `JobPosting`)
- [x] WebSite + SearchAction schema in `index.html`
- [x] `robots.txt` allowing all crawlers

### Deployment
- [x] `DEPLOYMENT.md` step-by-step guide (Vercel + Railway + Neon)

---

## 🚀 Next Up (High Impact)

### 1. Submit & deploy
- [ ] Push to GitHub
- [ ] Deploy backend to Railway/Render with env vars (`NEON_DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`)
- [ ] Deploy frontend to Vercel with `VITE_API_URL` pointing to backend
- [ ] Connect custom domain (e.g., `openclaw.io`)
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster Tools

### 2. Email notifications
- [ ] Integrate Resend or SendGrid
- [ ] Email admin on every new submission
- [ ] Email submitter when listing is approved/rejected

### 3. Analytics
- [ ] Add Plausible or Google Analytics 4
- [ ] Track page views, search queries, upvotes, outbound clicks

### 4. Image uploads
- [ ] Replace logo URL field with image upload (Cloudinary / UploadThing / Cloudflare R2)
- [ ] Auto-resize and optimize uploaded logos

---

## 🎯 Growth Features

### 5. User accounts (optional, big lift)
- [ ] Sign up / login with email or GitHub OAuth
- [ ] Save favorites
- [ ] Track own submissions in a dashboard
- [ ] Per-user upvote (prevents duplicate upvotes from same IP)

### 6. Filters & discovery
- [ ] Multi-select category/tag sidebar on each directory page
- [ ] Sort by: trending (upvotes/week), newest, most viewed
- [ ] "Featured this week" carousel on home page
- [ ] Related listings on detail page

### 7. Submission quality
- [ ] Honeypot field on submit form (spam prevention)
- [ ] hCaptcha or Cloudflare Turnstile on submit
- [ ] Auto-reject duplicate submissions (same name/URL)

### 8. Newsletter
- [ ] Weekly digest of top new listings
- [ ] Integrate Buttondown or ConvertKit

---

## 🔍 SEO Phase 2

- [ ] Generate per-listing OG images dynamically (e.g., `og:image` showing listing name + logo)
- [ ] Add breadcrumb JSON-LD schema on detail pages
- [ ] Add FAQ schema on About page
- [ ] Internal linking: "Similar tools" block on every detail page
- [ ] Blog / changelog at `/blog` for content marketing
- [ ] Compress and convert all images to WebP/AVIF

---

## 🛠️ Tech Debt & Polish

- [ ] Add unit tests (Vitest already configured) for `api.ts` and key hooks
- [ ] Add Playwright E2E tests for submit + admin approve flows
- [ ] Error boundary with friendly fallback UI
- [ ] Skeleton loaders on all listing grids (some already have them)
- [ ] Lighthouse audit → fix any < 90 score
- [ ] Add `<noscript>` fallback message in `index.html`

---

## 💰 Monetization (Later)

- [ ] Paid sponsored listings (Stripe)
- [ ] Featured badge upgrade ($29/mo per listing)
- [ ] Banner ad slots managed via admin
- [ ] Job posting fees ($99 per 30-day post)

---

## 📊 Operations

- [ ] Set up uptime monitoring (UptimeRobot / BetterStack)
- [ ] Database backups (Neon auto-backups should be enabled)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (Logtail / Axiom)

---

## Naming / Branding Ideas (Backup Domain Names)

If `openclaw.io` is unavailable, consider:
- `agentindex.io`
- `mcpdirectory.com`
- `aitooltree.com`
- `claudehub.dev`
- `agentforge.directory`
- `toolclaw.com`

---

## How to Use This File

When you finish something, move it from a section to **Done** with a `[x]`. When you think of new ideas, add them to the relevant section. Keep this file in the repo root — it doubles as a public roadmap if you make the repo public.
