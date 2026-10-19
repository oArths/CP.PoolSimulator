# CP.PoolSimulator

Single Next.js 16 (App Router) app in `frontend/` — root has no code. Run all commands from `frontend/`.

## Commands

- `npm run dev` — dev server (Turbopack). Also (re)writes `frontend/AGENTS.md`; commit that block instead of deleting it.
- `npm run lint` — bare `eslint` (flat config, `eslint.config.mjs`). Warnings don't fail; only errors do.
- `npx tsc --noEmit` — typecheck; currently clean. No test runner exists.

## Next.js 16 differs from older Next

`frontend/AGENTS.md` (auto-generated) points to the bundled docs in `frontend/node_modules/next/dist/docs/` — read the relevant guide before Next-specific code. Real example: `app/layout.tsx` uses the global `LayoutProps<"/">` type instead of typed props.

## Architecture

- Entry: `app/page.tsx` → `Header` + `PoolSimulator` (multi-step wizard, step 1 = format selection).
- Dataset: `app/json/poolAvalible.json` drives formats/deck/display/gates lists; imported directly (`resolveJsonModule`).
- Format icons: JSON `formats[].component` stores a component name, resolved via `import * as SvgComponents from "../svg"` (barrel: `app/components/svg/index.ts`). To add a format: add `components/svg/<name>.tsx` (default export, `React.SVGProps<SVGSVGElement>` props), export it in `svg/index.ts`, add a JSON entry with `component: "<ExportName>"`. No PoolSimulator change needed.
- Types: `app/json/interface.tsx` declares **ambient globals** (`PoolAvailable`, `PoolFormat`, …) — no imports/exports, visible only because tsconfig includes the file. ESLint flags them as "unused"; that's expected.
- State: `app/store/poolStore/index.ts` is a stub — interfaces only, zustand store not created yet.

## Conventions & gotchas

- Tailwind v4 is CSS-first: theme tokens and typography scale in `app/globals.css` `@theme` (`bg-cp-life-cyan`, `text-heading-md`, …) plus component classes (`.card`, `.button-primary`) in `@layer components`. No `tailwind.config`; CSS loaders wired in `next.config.ts`.
- Components live in one folder with `index.tsx` (`app/components/<Name>/index.tsx`). Path alias `@/*` → `frontend/*`.
- **Typos are load-bearing — don't fix in passing:** `poolAvalible.json`, `ellipesePoolFormat`, `RomavaIcon.svg`/`RomanaPoolFormat`, store field `heigth`. Renaming requires updating every importer/JSON key.
- No `.env`, no backend/API — UI only so far. Repo is Windows/PowerShell.
