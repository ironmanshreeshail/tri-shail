# Maintenance and eventual deployment

## Current scope

Cloudflare was connected on 14 October 2026 after the user created an account and authorised Wrangler. The hosted review version is https://tri-shail.ironman-shreeshail.workers.dev/. The production Worker is `tri-shail`; its D1 database is `tri-shail-enquiries`, created in APAC. The account and database IDs are configured in `wrangler.jsonc`.

The coach branding revision from Git commit `3825969` was deployed on 15 October 2026. Cloudflare version: `60413282-1959-4d8d-8af2-51251ce70a69`. `master` includes the deployed revision; the original design remains recoverable at `761cd53`. The live opening, all three coach photo chapters and navigation, privacy/credits pages, and API method protection were checked after deployment.

The compact-mobile cinematic correction (`2c01d83`) was subsequently deployed on 15 October 2026 as Cloudflare version `ba9de95d-6fd1-4f41-8fd4-6a8d69425b4a`, and included on `master`. Cinematic mode supports viewport heights from 480 px; shorter screens use flowing chapters. Reduced motion remains respected and is now labelled in the story. WebKit tests run with `npm run test:browser` against a running preview; `TRISHAIL_TEST_URL` can target the live deployment.

The production schema and rate-limit secret are installed. A browser enquiry was verified in the remote database, then removed. The main `workers.dev` URL is enabled; extra version-preview URLs are disabled. Hosting uses the Free plan's default CPU allowance; do not add a custom `limits.cpu_ms` setting, which Cloudflare rejects on Free.

For ordinary updates, use `npm run deploy`. The initial setup below is already complete; do not repeat database creation for an existing deployment. Git-connected automatic deployment is not configured yet.

## Cloudflare setup, when requested

1. Log in with `npx wrangler login --scopes account:read user:read workers:write workers_scripts:write d1:write` in the intended Cloudflare account.
2. Create the database: `npx wrangler d1 create tri-shail-enquiries`.
3. Replace the local placeholder `database_id` in `wrangler.jsonc` with the returned ID.
4. Apply production migrations: `npx wrangler d1 migrations apply tri-shail-enquiries --remote`.
5. Set a strong secret using `npx wrangler secret put RATE_LIMIT_SALT`. Do not put the production value in Git, command arguments, or documentation.
6. Run `npm run typecheck`, `npm test`, and `npm run build`, then deploy with `npx wrangler deploy`.
7. Submit one clearly labelled test enquiry, verify it in D1 Studio, and delete it after verification.
8. Connect the Git repository to Cloudflare Workers Builds for subsequent deployments. Build command: `npm run build`; deploy command: `npx wrangler deploy`.

Serve static assets directly. Only `/api/*` invokes the Worker first. Keep development/preview bindings separate from production before enabling branch previews. Do not point preview deployments at the production enquiries database.

The hosted review version currently has `robots: noindex` so unfinished business copy is not indexed. Before promoting the site as final, confirm programme availability and inclusions, coach biography/certification details, and privacy contact/retention period. Replace the preview note on the privacy page. Configure production origin metadata, canonical URL, sitemap, and a share image, then enable indexing deliberately. There is no domain purchase requirement for reviewing this provider-hosted version.

## Reviewing leads

Use Cloudflare's D1 Studio with restricted account access to review the `enquiries` table. Records include name, phone, optional email, goal, message, consent time/version, creation time, and status. Status values are `new`, `contacted`, and `closed`. The website exposes no GET/list endpoint for these records.

Use SQL parameters for application changes. D1 exports contain personal information; keep them in an appropriately protected destination and remove obsolete exports. Define the coach's retention policy before public launch, and delete closed enquiries when they are no longer needed. The Free plan provides seven days of D1 point-in-time recovery; document restoration and maintain periodic exports if required.

## Spam and retry behaviour

Same-origin JSON submissions only, bounded 12 KB payload, schema validation, hidden honeypot, and a durable limit of five new valid submissions per source per hour. The database stores only a salted hash of the network source/window, not raw IP addresses. Counters expire and are cleaned on successful submissions. Idempotent retries do not create duplicate records. This is basic abuse control; enable server-verified Turnstile if real spam requires stronger protection. Requests and blocked attempts still consume Cloudflare allowances.

## Coach profile source

RunOrbit supplied the Sangli location, work/training context, coaching modes/languages, and named race results: https://runorbit.in/runorbit_services/shreeshail/. The local profile draft is on `codex/coach-profile` and is not deployed. Pricing, counts, and the specific certification provider remain unconfirmed. The injury-free guarantee was not adopted. All profile copy and results are maintained in `src/content/site.ts`.

## Media

The built image files are committed to make builds independent of third-party availability. The supplied coach photographs are retained in `assets/coach/`, outside the public asset directory. Run `npm run media:coach` to generate their WebP variants; when changing originals, update the dimensions in `src/components/coach-photo.tsx`. Variants never enlarge the original photos, and responsive descriptors use their actual widths. Desktop scenes put the photograph beside the copy; mobile scenes use a portrait crop with copy below the face.

`scripts/prepare-media.mjs` prepares the illustrative programme photographs and fonts. The obsolete temporary attachment dependency has been removed. Generated images and fonts are already committed; neither media script is required for ordinary builds.

Use short, compressed media and keep one visible moving scene. Preserve image dimensions, responsive sources, and the reduced-motion layout. If adding video, include still posters, playback/error fallbacks, offscreen pause, and device-specific sources. Keep the initial mobile load within the plan's budget.

Photography sources:

- Opening, cinematic swim/bike/run scenes, biography, enquiry avatar: user-supplied photographs of Shreeshail Janagond. No photographer attribution was supplied.
- Programme mountain running: Andrea Leopardi, https://unsplash.com/photos/person-running-on-road-at-daytime-QVD3Xht9txA
- Programme swim: billow926, https://unsplash.com/photos/person-swimming-on-blue-sea-during-daytime-aezJk92dIsM
- Programme bike: charlie dt, https://unsplash.com/photos/cyclists-race-on-a-road-with-motion-blur-XmlEVg-1nRk
- Programme running: Laura Ghise, https://unsplash.com/photos/unknown-person-running-on-road-5DykCHKRm5Q
- Barlow Condensed: Google Fonts, SIL Open Font License; local subset files.

## Rollback and costs

Git history and Cloudflare Worker versions support rolling back code. Database migrations require their own recovery plan; a code rollback does not undo stored data or schema changes. Add migrations instead of rewriting applied migrations.

Start on Cloudflare Free. Track Worker CPU time/requests and D1 rows/storage. Static asset requests are separate from backend request limits. Upgrade only when usage or operational needs warrant it; optional domains, licensed assets, and business email have separate costs.
