# Samuel Masco Recruiting Site

Phase 1 of the CMS migration introduces two runtimes:

- **Front-end** powered by Vite so we can consume Sanity content with modern tooling.
- **Sanity Studio** (inside `/sanity`) that models every section of the site and ships with starter data matching the current hard-coded content.

## Prerequisites

- Node 18+
- A Sanity account (create one at [sanity.io](https://www.sanity.io/) if you have not already)

## Project Structure

```
/
├── index.html           # Still serves as the base template for Phase 1
├── styles.css           # Global styles (unchanged)
├── src/main.js          # Vite entry point (formerly script.js)
├── src/lib/sanityClient.js
├── sanity/              # Sanity Studio + schema + seeds
└── sanity/seeds/initial-content.ndjson
```

## Install Dependencies

```bash
# Front-end
npm install

# Sanity Studio
(cd sanity && npm install)
```

## Environment Variables

Copy the provided examples and fill in your actual values.

```bash
cp .env.example .env
cp sanity/.env.example sanity/.env
```

| Variable | Location | Description |
| --- | --- | --- |
| `VITE_SANITY_PROJECT_ID` | `.env` | Sanity project ID used by the front-end |
| `VITE_SANITY_DATASET` | `.env` | Dataset to read (defaults to `production`) |
| `VITE_SANITY_API_VERSION` | `.env` | API version string (e.g., `2024-01-01`) |
| `SANITY_STUDIO_PROJECT_ID` | `sanity/.env` | Same project ID used by the Studio |
| `SANITY_STUDIO_DATASET` | `sanity/.env` | Dataset name for Studio/CLI commands |

> The Studio expects these vars before you can run `npm run dev` or any CLI task. Front-end logging for Sanity data is currently limited to development mode.

## Running the Apps

```bash
# Front-end (Vite)
npm run dev

# Sanity Studio
cd sanity
npm run dev
```

The Vite build now logs a small Sanity preview query in the browser console if credentials are present, proving the client is wired up ahead of the full UI binding planned for Phase 2.

## Seed the Dataset With the Current Content

The file `sanity/seeds/initial-content.ndjson` mirrors every section inside the original static HTML (hero, about, resume, academics, highlights, videos, dual-sport, and contact cards). After creating a project/dataset in Sanity:

```bash
cd sanity
sanity login                      # only needed once
sanity dataset create production  # skip if it already exists
sanity dataset import seeds/initial-content.ndjson production
```

Because the desk structure forces singleton documents to fixed IDs, the seed file uses consistent `_id` values (`heroSection`, `aboutSection`, etc.). Importing more than once will upsert the docs.

## Data Model Summary

- `siteSettings` – global title/SEO copy.
- `heroSection`, `aboutSection`, `resumeSection`, `academicsSection`, `highlightsSection`, `videosSection`, `dualSportSection`, `contactSection` – singleton docs that map 1:1 to visible sections.
- `highlightEvent` – repeatable timeline cards with `manualOrder` + date sorting.
- `videoHighlight` – repeatable video cards (stores the YouTube ID, description, CTA text, optional thumbnail).
- Object types (`metric`, `cta`, `profileFact`, `quickHit`, `statItem`, `dualCard`, `contactCard`, etc.) mirror the nested pieces of each section, so editors only touch structured inputs instead of raw HTML.

## Front-end Status

- `src/main.js` now fetches the full site payload via `fetchSiteContent` and renders **every** section (hero, about, resume, academics, highlights, videos, dual-sport, contact) with CMS data.
- `index.html` only contains placeholders; users no longer see stale copy and get a loading message while content resolves. Error messages surface if the fetch fails.
- Video cards, hero CTAs, metrics, and contact details are all hydrated from Sanity. The YouTube frame logic reattaches after each render so autoplay still works.
- Navigation, scroll animations, and the interactive golf ball remain intact because the rendered markup preserves the existing structure/classes.

## QA & Deployment Notes

- `npm run dev` (root) requires the `VITE_SANITY_*` env vars; without them, the placeholders persist and a warning banner appears.
- `npm run build` generates the static bundle that you can deploy to any static host (Netlify, Vercel, etc.). Ensure those hosts receive the same env vars so the Sanity client can query at runtime.
- Keep the Studio deployed (`npx sanity deploy`) for editors, and rerun `sanity dataset import` only if you want to reset content to the seed state.
