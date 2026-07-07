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

**Next.js 16 App Router** site for LabVivoUC — a primarily static, informational site in Spanish. All page components are React Server Components; there is essentially no client-side state — the one exception is `LatestExperiencesCarousel.tsx` (see [Component conventions](#component-conventions)).

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

The site does **not** use Tailwind utility classes in markup (Tailwind 4 / PostCSS is installed but `app/globals.css` is a hand-written, BEM-ish stylesheet — not `@apply`-based). Every visual convention lives in that one file; there are no CSS modules and no styled-components.

Two fonts loaded via `next/font/google` in `app/layout.tsx`:

- **Amiri** → CSS var `--font-serif`, used for all headings (`h1`, `h2`, `h3`, `.sh`, `.section-title`, card/kicker titles).
- **Source Sans 3** → CSS var `--font-sans`, the body font (set on `html`).

`globals.css` aliases these as `--serif` / `--sans` in `:root` — always use `var(--serif)` / `var(--sans)`, not the font vars directly.

Design tokens (all in `:root`, `app/globals.css:8-25`):

| Token | Value | Use |
|---|---|---|
| `--b` | `#1b4e85` | top bar background |
| `--y` | `#e9a227` | accent (rarely used) |
| `--tD` | `#134f5c` | dark teal — headings, footer bg, active pagination |
| `--t` | `#026e6e` | primary teal — brand color, links, buttons, chart lines |
| `--tL` | `#c5e1e5` | light teal — tag backgrounds, section bg, hover states |
| `--or` | `#e97425` | orange — CTA buttons, kickers/overlines, active nav underline |
| `--orL` | `#f6cca1` | light orange — tag backgrounds |
| `--cr` | `#faf6ed` | cream — default body background |
| `--pa` | `#f0ebe0` | pale — alternate section background |
| `--gy` | `#ebebeb` | borders, dividers |
| `--tx` | `#0d1a1e` | body text |
| `--tm` | `#2d4a52` | muted text (descriptions, labels) |
| `--wh` | `#ffffff` | white |
| `--mw` | `72.5rem` | max content width (`.wrap`) |

`html` sets `font-size: 75%` so the entire site scales via `rem` — treat this as a deliberate zoom-out, not a bug, when reasoning about sizes.

Key structural/utility classes:

- `.wrap` — centered max-width container (`var(--mw)`), used inside every `.s` section and the nav/footer.
- `.s` + a modifier (`.s--white`, `.s--cream`, `.s--tL`, `.s--tD`, `.s--pa`, `.s--t`) — page section with background color; `.s--slim` reduces vertical padding, `.s--pb100` adds extra bottom padding.
- `.g2` / `.g3` / `.g4` — CSS grid helpers (2/3/4 columns), collapse at the `1060px` and `740px` breakpoints defined at the bottom of the file.
- `.btn` + modifier (`.btn--h` orange pill, `.btn--gh` ghost/outline on dark bg, `.btn--teal`, `.btn--outline`, `.btn--sm`) — buttons/CTAs.
- `.tag` (+ `.tag--gray`, `.tag--or`) — pill-shaped labels.
- `.overline` — small uppercase eyebrow text above section headings.
- Per-feature card classes: `.ac-card` (person cards), `.exp-card` (experience cards, used in the carousel), `.obj-card` (numbered objective/methodology cards), `.opp-card` (opportunities), `.ds-card` / `.dataset-*` (open data listing + detail/chart), `.repo-entry` (experience repository rows), `.m-pill` (associated-member chips).

Hero backgrounds (`.hero`, `.phero`) use a hardcoded green/blue gradient that is **not** one of the `:root` tokens — it's a one-off decorative treatment, not a reusable design token.

Responsive breakpoints are at the bottom of `globals.css`: `max-width: 1060px` (tablet — grids collapse) and `max-width: 740px` (mobile — type scale shrinks, nav shrinks).

### Component conventions

Components under `components/` are stateless and presentational. Almost all are plain server components; `LatestExperiencesCarousel.tsx` is the one exception (`"use client"`, uses `useRef` for its scroll buttons). `OpportunityList` itself has no client state — filtering on `/oportunidades` is done server-side via URL `searchParams`, read directly in `app/oportunidades/page.tsx`. `SiteShell.tsx` is the global layout wrapper — it renders the top bar, navbar (from `components/navigation.ts`), `{children}`, and the footer. Every page is wrapped in it and must pass `currentPath` for active-link highlighting.

`PersonCard.tsx` renders up to four social icons (GitHub, Instagram, LinkedIn, email) from `person.social`, but **GitHub and Instagram only ever render for `group: "executive"`** — academic-group people never show those two icons regardless of whether the fields are populated. Icons only appear if the corresponding field is a non-empty string; the whole social row is hidden if none are set. Icon assets live in `public/assets/icons/`.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_LABVIVO_API_URL` | Base URL for the LabVivoUC backend API |
| `FUSIONSOLAR_EMAIL` | Login email for the Huawei FusionSolar monitoring platform (solar scraper only) |
| `FUSIONSOLAR_PASSWORD` | Login password for the Huawei FusionSolar monitoring platform (solar scraper only) |

If unset, pages render with the mock data embedded in `lib/labvivo-data.ts`.

## Solar plant data (`scripts/solar-scraper/`)

A standalone Playwright script (invoked via `npm run scrape:solar`, not a Next.js route) logs into
Huawei FusionSolar and scrapes both generation AND consumption data for the site's 3 campus solar
plants (CAi, Hall Central, Punto Limpio), producing 6 datasets total (one generation + one consumption
per plant; consumption dataset ids are `{plant-id}-consumo`). It writes `data/solar-plants.json` (a
committed, versioned file — `{ generatedAt, datasets: OpenDataDataset[] }`), which both
`app/api/open-data/solar/route.ts` and `getOpenDataDatasets()` in `lib/labvivo-data.ts` read directly via
`fs` (no internal HTTP round-trip). This is a fallback tier between the external API and the hardcoded
mock datasets — see that function for the exact priority order. A GitHub Actions workflow
(`.github/workflows/scrape-solar-data.yml`) runs the script on a cron and commits the updated JSON,
whose push triggers the site's normal deploy.

Details on the scraping strategy (which FusionSolar endpoints are used, session reuse via
`storageState`, why direct API replay doesn't work) are documented as a comment block at the top of
`scripts/solar-scraper/fusionsolar-client.ts`.
