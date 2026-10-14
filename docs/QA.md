# Local verification — 14 October 2026

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
