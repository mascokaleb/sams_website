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

- `src/main.js` now runs through Vite and imports `fetchSitePreview` from `src/lib/sanityClient.js`.
- When `VITE_SANITY_*` variables are set, the client fetches a small slice of CMS data and logs it in dev mode, confirming connectivity before we swap the DOM to fully dynamic rendering in Phase 2.
- All legacy behavior (navigation toggle, motion effects, video embeds, golf ball interaction) is preserved.

## Next Steps (Phase 2 Preview)

1. Replace the hard-coded HTML blocks with templating functions that consume the Sanity response.
2. Add loading/error states while CMS data resolves.
3. Expand the video grid to pull thumbnails + titles from the `videoHighlight` documents and feed the existing YouTube player script via `data-video-id` attributes.
4. Wire tournament highlights, stats, academics, contact cards, etc., to the new schemas.
