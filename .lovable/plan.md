
# AI Tools & Plugins Directory — with Ad Monetization

## Overview
Build a directory platform similar to OpenClawDir for AI tools, skills, and plugins — with integrated ad spaces throughout for revenue generation. Public browsing is free; accounts are needed to submit listings.

## Pages & Features

### 1. Homepage
- Hero section with search bar and stats counters (skills, plugins, contributors)
- **Ad banner** at the top (leaderboard ad slot)
- Popular Skills section (card grid with logo, name, description, category tag, upvotes, views)
- Featured Plugins section (same card layout with "Featured" badges)
- **Sponsored listing cards** mixed into the grid with a "Sponsored" badge
- **Ad banner** at the bottom before footer

### 2. Skills Listing Page
- Search bar with sort options (Popular, Newest, Most Viewed)
- Category filter chips (Automation, Productivity, Browser, DevOps, etc.)
- 3-column card grid of skills
- **Sidebar ad column** on desktop (right side)
- **Sponsored listings** at the top of results with badge
- Pagination / infinite scroll

### 3. Plugins Listing Page
- Same layout as Skills but with plugin-specific categories (Tools, Channels, Integration, Voice, etc.)
- Search, sort, and category filters
- **Sidebar ads + sponsored listings**

### 4. Detail Page (Skill/Plugin)
- Full description, README-style content
- Stats (stars, views, contributors)
- Category tags, links to source/website
- **Sidebar ad** on desktop
- **Banner ad** below the content

### 5. Jobs Board Page
- Job listings with company, role, location, type filters
- **Sponsored job listings** at the top
- **Banner ads** between job groups

### 6. Submit Listing Page (requires auth)
- Form to submit a new skill, plugin, or job listing
- Fields: name, description, category, website URL, logo upload, tags
- Admin approval queue

### 7. User Auth
- Sign up / Sign in (email + password)
- Profile page showing submitted listings and stats
- Uses Supabase Auth via Lovable Cloud

### 8. Admin Panel
- Approve/reject submitted listings
- Manage ad placements (configure banner image URLs, links, and sponsored listing flags)
- View basic analytics (submissions count, page views)

## Ad System
- **Banner ads**: Configurable ad slots (header, footer, in-content) stored in database with image URL, target link, and impression tracking
- **Sponsored listings**: A "sponsored" flag on listings that pins them to the top of results with a badge
- **Sidebar ads**: Right-column ad blocks on listing and detail pages (hidden on mobile)
- Admin can manage all ad placements from the admin panel

## Design
- Dark theme matching the OpenClawDir aesthetic (dark background, orange/amber accents, card-based layout)
- Responsive — cards stack on mobile, sidebar ads hide on small screens
- Clean navigation: logo + Skills / Plugins / Jobs links + Sign In button

## Database (Lovable Cloud / Supabase)
- `listings` table (name, type, description, category, logo_url, website_url, views, upvotes, status, is_sponsored)
- `categories` table
- `ads` table (placement, image_url, target_url, impressions, clicks, active)
- `profiles` table linked to auth.users
- `user_roles` table for admin access
- RLS policies for secure access

## Tech Stack
- React + Tailwind CSS (dark theme)
- Supabase via Lovable Cloud (auth, database, storage for logos/ad images)
- No subscriptions or payment processing — revenue is from ads only
