# AIDir - AI Skills & Plugins Directory

## Overview
A React/TypeScript frontend application that serves as a directory for AI assistant skills and plugins. Built with Vite, Tailwind CSS, and shadcn/ui components. Originally developed on Lovable, migrated to Replit.

## Architecture
- **Type**: Pure frontend SPA (Single Page Application)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State/Data**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation

## Project Structure
```
src/
  App.tsx          - Root component with routing
  main.tsx         - Entry point
  pages/           - Page components (Index, Skills, Plugins, Jobs, Detail, Login, Submit, NotFound)
  components/      - Shared components (Header, Footer, Layout, NavLink, ListingCard, AdBanner, ui/)
  data/            - Static data files
  hooks/           - Custom React hooks
  lib/             - Utility functions
```

## Dev Server
- Runs on port 5000
- Command: `npm run dev`
- Accessible via Replit webview

## Key Dependencies
- React 18, React Router v6, TanStack Query
- Tailwind CSS, shadcn/ui (Radix UI primitives)
- Recharts, Lucide icons, Sonner (toasts)

## Notes
- `lovable-tagger` dev dependency removed from vite.config.ts (not needed on Replit)
- Vite server configured for Replit: `host: "0.0.0.0"`, `allowedHosts: true`, `port: 5000`
