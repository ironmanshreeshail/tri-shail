# Tri-Shail Performance Coaching

A responsive triathlon coaching website with a cinematic swim → bike → run scroll sequence. Next.js generates static pages; GSAP enhances native scrolling; a Cloudflare Worker stores enquiries in D1. Cloudflare Free hosts the current review version.

Hosted review version: [tri-shail.ironman-shreeshail.workers.dev](https://tri-shail.ironman-shreeshail.workers.dev/). Cloudflare Free hosting and the production D1 database are connected. Search indexing is disabled pending final content and privacy-policy details.

The coach branding revision (`3825969`) was deployed on 15 October 2026 and is included on `master`. The previous design is preserved in commit `761cd53`. GitHub remote: `git@github.com:ironmanshreeshail/tri-shail.git`.

## Local preview with a working backend

Use Node.js 22.13+ (Node 24 LTS recommended) and npm.

```sh
npm ci
cp .dev.vars.example .dev.vars
# Replace the local RATE_LIMIT_SALT example with a random value.
npm run build
npm run db:local
npm run preview
```

Open `http://localhost:8787`. Local enquiries are stored in `.wrangler/state/`; no Cloudflare login is required. `.dev.vars` and local database state are ignored by Git. After frontend edits, rebuild to update this production-style preview. The Worker reloads its own source changes automatically.

`npm run dev` provides faster frontend iteration at `http://127.0.0.1:3000`, but the form API is available only in the Wrangler preview. Use the complete preview when checking submissions.

```sh
npm run typecheck
npm test
```

## Editing

- Copy, credentials, FAQs, programme descriptions: `src/content/site.ts`.
- Page composition: `src/app/page.tsx`.
- Colours, spacing, typography, breakpoints: `src/app/globals.css`.
- Scroll choreography and reduced-motion behaviour: `src/components/journey.tsx`.
- Enquiry fields and request states: `src/components/enquiry-form.tsx`.
- Server validation: `worker/validation.ts`.
- Submission handling and rate limiting: `worker/index.ts`.

The opening portrait and cinematic swim, bike, run sequence use Shreeshail’s supplied photographs. Originals are retained in `assets/coach/`; run `npm run media:coach` to regenerate their compressed WebP variants. `src/components/coach-photo.tsx` records the actual source dimensions and responsive widths. The programme cards still use illustrative sport photography, with credits on `/credits/`. All images and fonts are self-hosted. The story uses photography with scroll-driven movement and crossfades; video and 3D are not dependencies.

## Inspect local enquiries

```sh
npx wrangler d1 execute tri-shail-enquiries --local --command "SELECT id, name, goal, created_at, status FROM enquiries ORDER BY created_at DESC LIMIT 20;"
```

Do not commit database exports or contact details. For Cloudflare deployment, lead review, media replacement, and remaining launch inputs, see `docs/HANDOVER.md`. See `docs/QA.md` for verification results and limitations.

## Deploy changes

Wrangler is authenticated on this computer, and `wrangler.jsonc` contains the existing account and database IDs. Use `npm run deploy` to build and publish changes. Keep local secrets in `.dev.vars`; production secrets are stored directly in Cloudflare. Do not recreate the production database for ordinary code or copy changes.

If authentication expires, sign in again using the Cloudflare account already configured for this project:

```sh
npx wrangler login --scopes account:read user:read workers:write workers_scripts:write d1:write
```

Additional version-preview URLs are disabled. Connect a Git repository and a separate test database before enabling branch previews.
