# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

**Next.js 16 App Router** site for LabVivoUC — a primarily static, informational site in Spanish. All pages are React Server Components; there is no client-side state management.

### Data flow

All external data goes through `lib/labvivo-data.ts`, which is the sole API adapter. It reads `NEXT_PUBLIC_LABVIVO_API_URL` and uses a generic `getFromApi<T>()` helper with ISR revalidation (`next: { revalidate: 120 }`). Every function in that file has embedded fallback/mock data that activates when the API is unreachable — this is intentional for graceful degradation.

Types for all API responses live in `lib/types.ts`.

### Pages and routing

File-based routing under `app/`. Current routes:

- `/` — Home
- `/nosotros` — About/team
- `/repositorio-experiencias` — Project repository
- `/datos-abiertos` — Open data listing
- `/datos-abiertos/[datasetId]` — Dataset detail with chart
- `/oportunidades` — Opportunities/challenges

Page components are `async` and call `labvivo-data.ts` functions directly (often via `Promise.all`). They receive no props — data fetching and layout composition happen in the same file.

### Navigation

`components/navigation.ts` holds the nav link list as a plain array. Active link detection is explicit: pages pass `currentPath` to `SiteShell`, which compares against each nav item. Adding a new route requires updating this file manually.

### Styling

Tailwind CSS 4 via PostCSS. Custom layout utilities (`.page-stack`, `.content-split`, etc.) are defined in `app/globals.css`. Two fonts loaded via `next/font/google`: **Nunito Sans** (`--font-nunito-sans`, body) and **Archivo** (`--font-archivo`, headings).

### Component conventions

Components under `components/` are stateless and presentational. `SiteShell.tsx` is the global layout wrapper — it renders the header, navbar, and footer around `{children}`. All pages are wrapped in it.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_LABVIVO_API_URL` | Base URL for the LabVivoUC backend API |

If unset, pages render with the mock data embedded in `lib/labvivo-data.ts`.
