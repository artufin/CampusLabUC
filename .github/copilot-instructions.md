# Project Guidelines

## Scope
This workspace contains a single Next.js app in [web/](../web). Keep changes focused there unless a task explicitly targets [data/](../data).

## Build and Test
Run commands from [web/](../web):
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

No test script is configured yet.

## Code Style
- Use TypeScript and React App Router patterns from [web/app/page.tsx](../web/app/page.tsx), [web/app/layout.tsx](../web/app/layout.tsx), and [web/app/globals.css](../web/app/globals.css).
- Prefer Tailwind utility classes for component layout and shared CSS tokens in [web/app/globals.css](../web/app/globals.css).
- Preserve the existing formatting and file organization in the `web` app.

## Conventions
- Avoid duplicating README content; link to docs instead of restating setup instructions.
