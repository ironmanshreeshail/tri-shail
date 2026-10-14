# Website verification

## Coach branding revision — 15 October 2026

The previous website is preserved in GitHub commit `761cd53`. The branding revision (`3825969`) was deployed on 15 October 2026 and included on `master`. Cloudflare version: `60413282-1959-4d8d-8af2-51251ce70a69`.

Post-deployment browser checks confirmed the updated page title, prominent coach name, authentic hero portrait, all three animated photo chapters with matching navigation, and no horizontal overflow at 390×844. Privacy and credits return 200; GET `/api/enquiries` returns the expected 405. The same existing D1 binding was retained, with no schema or backend-code changes. The live form was not resubmitted for this visual update; the prior production persistence verification remains documented below. Search indexing remains disabled.

- Production build and TypeScript compilation pass. The eight existing backend tests passed when saving the deployed checkpoint; this revision does not change the backend.
- Shreeshail’s authentic running portrait replaces the stock hero. His swim, bike, and run photos replace the three cinematic scenes. His name is prominent in the opening and biography, and a face portrait replaces the enquiry initials.
- Source photos are retained outside the public directory. The largest served WebP variants are approximately 60 KiB (run), 45 KiB (bike), and 70 KiB (swim). Smaller 320/480 px variants use their actual source widths, with no enlargement.
- Chromium checks at 360×800, 390×844, 375×667, 768×1024, 1024×768, 1366×900, 1920×1080, and 812×375 found no horizontal document overflow or broken images. Hero, biography, contact, and swim/bike/run crops were visually inspected on desktop and phone; a compact-height rule keeps the face above the story text on shorter phones.
- All three animated chapters were reached with matching navigation on desktop and phone. Pausing kept the story height at 2363 px and changed the measured scroll position by 1 px. Reduced-motion emulation restored three visible, flowing chapters.
- A fresh axe scan reported zero WCAG 2 A/AA, WCAG 2.1 A/AA, or WCAG 2.2 AA violations in the tested mobile state.
- The local mobile Lighthouse audit scored 98 performance, 100 accessibility, and 100 best practices: approximately 2.5 s LCP, 0.9 s FCP, 10 ms total blocking time, zero layout shift, and 304 KiB transferred. Reports: `output/lighthouse-coach.report.html` and `.json`. These are laboratory measurements of the local preview; they do not establish live or physical-device performance.

Physical iPhone/iPad, Android, and macOS Safari checks remain open. The historic deployment and initial-design measurements below describe the previous design.

## Initial design — 14 October 2026

The initial checks below used exported production pages and the Cloudflare Worker/D1 development runtime. Cloudflare was subsequently connected on 14 October 2026, and a review version was deployed at https://tri-shail.ironman-shreeshail.workers.dev/.

## Cloudflare deployment verification

- Cloudflare Free account connected via browser OAuth; production D1 created in APAC and schema applied.
- Worker rate-limit secret generated and stored directly in Cloudflare, not in source.
- Hosted page and privacy page load successfully over HTTPS.
- A browser form submission returned the success state and was verified as exactly one record in remote D1; the synthetic test record was then deleted and absence confirmed.
- GET `/api/enquiries` returns 405, exposing no enquiry listing.
- Extra version-preview URLs are disabled; the main review URL remains enabled.
- Source `robots` remains `noindex, nofollow`. The Cloudflare connection and deployment do not resolve the outstanding content, privacy, and physical-device checks below.

A mobile Lighthouse audit against the hosted URL scored 95 performance, 100 accessibility, and 100 best practices. It measured simulated LCP 2.8 seconds, first contentful paint 1.2 seconds, total blocking time 10 ms, zero layout shift, and approximately 452 KiB transferred. Reports are in `output/lighthouse-cloudflare.report.html` and `.json`. LCP remains slightly above the original 2.5-second target; these are laboratory results, not real-user percentile measurements.

## Build and backend

- Production static export and TypeScript compilation pass.
- Eight automated tests pass: normalisation, invalid input, optional fields, persistence/idempotency, concurrent retries, request protections, durable rate limiting, and database-failure recovery.
- A browser form submission was verified in local D1 as one stored enquiry.
- A deliberately failed browser request preserved form inputs; retry saved successfully.
- Synthetic browser test records were removed after verification.
- GET requests do not expose enquiries. Static pages remain independent of database availability.

## Responsive and interaction checks

Chromium viewport checks at 360×800, 390×844, 768×1024, 1024×768, 1366×900, 1920×1080, and 812×375 found no horizontal document overflow or broken loaded images. Desktop, tablet, phone, and story screenshots were visually inspected.

Verified the mobile menu, Escape dismissal with focus restoration, programme links populating the enquiry goal, chapter navigation, and pause/resume. The pause control now keeps story height and scroll position stable and switches to discrete, still-image chapter changes. Reduced-motion emulation restores all three readable flowing chapters and automatic native scrolling.

Screenshots are in the ignored `output/playwright/` directory. The site uses compressed portrait sources on phones and landscape sources on larger screens; a 390 px preview selected `hero-mobile-480.webp` (approximately 34 KiB). Higher-density devices select a larger portrait source.

## Loading and accessibility

Latest mobile Lighthouse audit of the portrait-image build:

| Measure | Result |
| --- | --- |
| Performance | 95 / 100 |
| Accessibility | 100 / 100 |
| Best practices | 100 / 100 |
| First contentful paint | 0.9 seconds |
| Simulated largest contentful paint | 2.9 seconds |
| Total blocking time | 0 ms |
| Cumulative layout shift | 0 |
| Total transferred resources | approximately 446 KiB |

Reports: `output/lighthouse-portrait.report.html` and `.json`. A separate final axe scan for WCAG 2 A/AA, WCAG 2.1 A/AA, and WCAG 2.2 AA reported zero violations in the tested page state. These are automated checks, not an accessibility certification.

The initial JavaScript inventory was approximately 174 KiB gzip, including the legacy-browser polyfill chunk. GSAP is loaded separately near the story. All photos and fonts are self-hosted, and there is no video or 3D download in this version.

A 119-frame desktop scroll sample had median frame spacing approximately 8.3 ms, 95th percentile approximately 9.1 ms, and no observed long tasks. This is a local host/browser sample, not evidence of equivalent behaviour on mid-range phones. Lighthouse's 0 ms blocking-time result likewise does not prove scroll smoothness.

## Remaining verification and release work

- The hosted 2.8-second simulated LCP still exceeds the initial ≤2.5-second target. It improved after replacing oversized phone downloads with portrait crops; further tuning remains open. No field LCP/INP percentiles are available before sufficient real traffic.
- Physical iPhone/iPad Safari, Android Chrome, and macOS Safari have not been tested. Chromium viewport emulation does not establish touch, mobile browser-chrome, or Safari behaviour.
- Confirm final programme inclusions, certification details, privacy contact/retention, and the coach's original photo before public launch.
- Production database/secrets and live form verification are complete. Finalise metadata, domain if chosen, and indexing after the remaining business details are confirmed.

The hosted version is ready for design review and accepts enquiries. The original cross-device release criteria remain open until the above checks are completed.
