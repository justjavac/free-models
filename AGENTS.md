<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: Relay Free-Quota DB (models.jjc.fun)

A static, bilingual (zh/en, dark-mode by default) Next.js site that catalogs LLM relay/gateway providers that offer a **free tier**. Modeled after [models.dev](https://models.dev/); data shapes are isomorphic to its `api.json` / `models.json` / `catalog.json`.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS v4, shadcn-style components.
- Fully static (SSG): no backend, frontend does in-memory search only.
- Globals/design tokens in `src/app/globals.css` (Tailwind v3/v4 HSL vars: `--background`, `--foreground`, `--border`, etc.).

## Commands

```bash
npm install
npm run dev       # dev server → http://localhost:3000
npm run lint      # ESLint
npm run build     # production build (SSG pages + JSON/llms endpoints)
npm run start     # serve the production build
```

## Project layout

- `src/data/relays.ts` — relay/provider definitions (the source of truth for relays).
- `src/data/models.ts` — model specs (the source of truth for models).
- `src/lib/data.ts` — reads the data and computes derived fields at build time (`relay.model_count`, `model.available_on`).
- `src/lib/types.ts` — core types (`Relay`, `Model`, `ModelRef`, `FreeQuota`, ...).
- `src/lib/site.ts` — site-level config: `REPO_URL` and `SITE_URL` (single place to change the base domain).
- `src/app/*/route.ts` — statically generate the JSON endpoints (`/api.json`, `/models.json`, `/catalog.json`) and `/llms.txt`, `/llms-full.txt`.
- `src/lib/llms.ts` — builds the llms.txt/llms-full.txt text from the catalog.
- `src/lib/i18n.ts` — bilingual dictionaries (zh + en) with typed keys (`DictKey`); used via the `useApp()` context (`t()` and `locale`).
- `src/lib/utils.ts`, `src/lib/visual.ts`, `src/lib/sort.ts`, `src/lib/url.ts`, `src/lib/ui.ts`, `src/lib/format.ts` — small shared helpers.
- `src/components/` — UI: `header`, `footer`, `logo`, `relay-list/detail`, `model-list/detail`, `lab-detail`, `about-content`, `home-stats`, `page-header`, `ui/*` (primitives), `providers.tsx` (App theme/locale context).
- `public/` — static assets only (site logos, manifests). The site is otherwise independent of `public` files.

## Data model (schema)

Mirrors models.dev. Top-level objects are keyed by id; models nest under relays.

**Relay** (`src/data/relays.ts`): `id`, `name`, `url`, `api` (base URL), `openai_compatible`, `auth` (`type`/`env`/`signup`), `free_quota` (`available`, `type`, `amount`, `amount_usd`, `models?`, `expires?`, `notes?`), `pricing` (`model` + `notes?`), `features`, `providers[]`, `region[]`, `status`, `logo?`, `doc?`, `models: Record<id, ModelRef>`. `model_count` is computed.

**ModelRef** (within a relay): `id`, `name`, `cost?` (`input`/`output`/`cache_read` USD per million tokens), `notes?`.

**Model** (`src/data/models.ts`): `id` (`provider/model`), `name`, `provider`, `modalities` (`input`/`output` arrays), `context?`, `max_output?`, `price?` (`input`/`output`), `reasoning?`, `tool_call?`, `structured_output?`, `open_weights?`, `release_date?`. `available_on[]` is computed.

**FreeQuotaType**: `credit` | `token` | `daily_checkin` | `free_models` | `unlimited`.

## Adding / maintaining data

- To add a relay: add an entry in `src/data/relays.ts`; to add or edit a model: edit `src/data/models.ts`. `id`s must be unique and stable.
- After changing either file, run `npm run build` and verify the generated JSON endpoints look correct. There is no manual sync — `available_on` and `model_count` are computed by `src/lib/data.ts`.
- Keep free-quota text human-readable; use `type` + a clear `amount` string and set `amount_usd` for sortability when possible.
- Every such change is a separate `data(` conventional commit (e.g., `feat(data): add …` / `chore(data): fix … quota`).

## Convention notes / gotchas

- Provider logos are not vendored; they are loaded from `https://models.dev/logos/{provider}.svg` with a letter-monogram fallback (see `src/components/logo.tsx`). No `devicon`/`simple-icons`/image deps needed.
- New UI copy: keep zh + en strings in `src/lib/i18n.ts` so nothing is hardcoded inline.
- Only list a relay if it actually offers a free tier — see the About page's criteria.
- Respect the `nextjs-agent-rules` block above: this Next.js version has breaking API changes; read `node_modules/next/dist/docs/` before writing Next-specific code.
