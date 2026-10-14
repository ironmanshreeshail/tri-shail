# Tri-Shail Performance Coaching — implementation plan

Prepared 14 October 2026. Status: a hosted review version is deployed at https://tri-shail.ironman-shreeshail.workers.dev/ using Next.js, GSAP, Cloudflare Workers Free, and D1. The user subsequently authorised connecting the new Cloudflare account. A live enquiry was verified and the synthetic record removed. Verification details are in `docs/QA.md`.

## 1. Outcome and priorities

Create a distinctive coaching website for Shreeshail Janagond that turns interest in triathlon into qualified coaching enquiries. The signature experience is a cinematic swim → bike → run journey. It must remain smooth, readable, and usable on phones, tablets, and Mac browsers.

Priority order: usable and responsive experience; compelling art direction and motion; clear coaching offer and reliable enquiries; easy maintenance. Cinematic treatment is a release requirement, including on mobile. Mobile receives an intentionally composed version of the experience.

Launch scope: one landing page, a privacy page, a functioning enquiry endpoint, persistent lead storage, and deployment documentation. Content is primarily static. Payments, athlete accounts, training dashboards, a blog, a CMS, and a custom lead-management interface are deferred.

## 2. Review of earlier recommendations

| Earlier recommendation | Decision after review |
| --- | --- |
| Switch from Astro to Next.js for cinematic quality | Both can deliver the same visual quality. Keep Next.js for React maintainability and static page generation. Export the website as static files for Cloudflare; its extra client cost must be measured. |
| Include React Three Fiber / Three.js | Exclude from the initial dependency set. Photography, short video, and GSAP can produce the proposed experience. Reconsider only for a defined effect with measured device performance. |
| Let scrolling drive the athlete | Scroll controls scene composition, text, and transitions. Visible video clips play normally; avoid continuously seeking through compressed video on scroll, which can stutter. |
| Pin the sports scenes | Use one bounded story section on sufficiently wide and tall screens. Short screens and phones use brief sticky compositions or flowing scenes based on prototype results. |
| Preload the next scene | Load the opening image first, then progressively prepare nearby media with a bounded queue. Never eagerly download every sport video. |
| Target good Core Web Vitals | Retain the targets, but distinguish laboratory checks from real-user measurements and add scroll profiling. Web Vitals alone do not prove animation is smooth. |
| Vercel makes hosting easy | Replace with Cloudflare Workers Static Assets on the Free plan and D1. Serve the website directly as static assets and invoke a Worker only for enquiries. A domain is optional during development. |

## 3. Stack and architecture

- Next.js App Router with TypeScript and `output: 'export'`, using stable compatible versions selected at implementation time and pinned by a lockfile.
- Generate marketing content and Server Components at build time. Isolated Client Components for navigation, motion orchestration, and the form. Avoid marking the full page as a Client Component. No runtime SSR or Server Actions are required.
- Tailwind CSS plus CSS custom properties for colours, spacing, typography, and shared motion values.
- GSAP + ScrollTrigger, with breakpoint and reduced-motion handling through `gsap.matchMedia()`. Use one animation owner per element and clean up timelines/listeners when layouts change.
- Native browser scrolling. Anchor navigation remains usable throughout the story.
- A small Cloudflare Worker handles `/api/enquiries`, with server-side schema validation and D1 for durable records. Do not implement this POST endpoint as a Next.js route handler in the static export.
- Cloudflare Workers Static Assets serves the exported `out/` directory. Configure Worker-first routing only for the API path so ordinary visits do not consume backend requests.
- Git-connected Cloudflare deployment, with separate preview and production databases/configuration. Optimise responsive image variants during the build; do not depend on the default Next.js runtime image optimiser.
- Typed content files for credentials, programmes, FAQs, and calls to action. No CMS is needed for the current editing frequency.

Suggested organisation:

```text
src/app/page.tsx                  page composition and metadata
src/app/privacy/page.tsx          privacy information
worker/index.ts                 server-only submission handler and routing
src/components/story/            media scenes and motion controller
src/components/enquiry-form/     accessible form and request states
src/content/site.ts              editable copy and credentials
src/content/programmes.ts        draft/confirmed programme data
worker/lib/                     persistence and abuse controls
src/styles/                     design tokens and global styles
public/media/                   optimised images, posters, and clips
migrations/                     D1 database schema and indexes
wrangler.jsonc                  static assets, API routing, D1 bindings
docs/                           editing, media, deployment, QA notes
```

Marketing pages do not query the database during a visit. A database failure must not prevent the rest of the site from loading.

## 4. Art direction and storyboard

Visual direction: charcoal and warm white with restrained orange accents, oversized editorial typography, generous space, and authentic endurance photography. Use light and dark sections to establish rhythm. Keep text legible against every media frame using fixed text areas or stable overlays.

| Sequence | Visual and motion | Visitor takeaway |
| --- | --- | --- |
| Opening | Immediately visible finish-line photograph; restrained entrance; clear coaching CTA | Meet the coach and understand the offer |
| Swim | Water-level footage or layered photography, subtle movement; one short text reveal | Build confidence and technique |
| Bike | Transition using a shared horizon and motion direction; controlled lateral movement | Develop endurance and sustainable pacing |
| Run | Forward movement, warmer tones, clear final reveal | Prepare to reach the finish line |
| Coach | Authentic portrait, story, readable credential strip | Understand Shreeshail's experience |
| Programmes | Clear, relatively calm programme cards | Find the appropriate starting point |
| Process and FAQs | Assessment → plan → feedback → preparation | Understand the coaching relationship |
| Contact | Simple form with reassuring copy | Request a coaching conversation |

Start the prototype with roughly three to four viewport heights for the entire desktop sports sequence, then adjust through usability testing. Keep each scene to a short headline and concise supporting copy. Visitors can reach programmes and contact directly through navigation.

Phone compositions use portrait crops, fewer simultaneous animated layers, and shorter transitions while retaining visible athletic motion where playback is supported. Tablet design responds to both width and height; landscape tablets should not inherit a desktop scene that clips their content.

## 5. Media and content preparation

The supplied poster provides branding and context. Prefer its original finish-line photograph for production; the embedded text in the poster is unsuitable as responsive website text.

Asset list: original finish-line image; coach portrait; swimming, cycling, and running imagery or 4–8-second clips; logo/vector if available. Produce portrait and landscape crops, compressed image variants, video posters, and an asset manifest recording source and permitted use. Stock footage may illustrate a discipline, but must not imply it depicts Shreeshail. The prototype can use clearly documented temporary assets while originals are collected.

Record the user's supplied credentials faithfully:

- Founder & Coach, Tri-Shail Performance Coaching.
- Shreeshail Janagond; Certified Triathlon Coach.
- 2× Ironman finisher, with a sub-12-hour personal best.
- 1× Ironman 70.3 finisher.
- Sub-4-hour Tata Mumbai Marathon finisher.
- Official sub-2-hour half-marathon pacer.
- Multiple half-marathon and 25 km finishes; confirm event names and the supplied “25KM Ultra Marathons” wording before publication.

Confirm the certification body, preferred spelling, coach biography, service geography, and contact details before public launch. Do not infer an Ironman-specific coaching certification from race finishes. The poster's “only certified coach” and “fastest” claims are not in the user's credential list and need independent support before use. Do not invent testimonials or athlete success counts.

Proposed programmes, pending coach confirmation:

1. First Triathlon: foundations and a structured introduction to all three disciplines.
2. Ironman 70.3 Preparation: integrated training and race preparation.
3. Full Ironman Preparation: long-course consistency, pacing, and race preparation.
4. Half Marathon / Marathon: running progression and event preparation.

Confirm communication frequency, online/in-person availability, plan adjustments, and pricing before promising inclusions. The starting CTA is “Discuss your goal”; do not promise a free consultation or a response deadline without confirmation.

## 6. Motion and loading implementation

- Deliver visible semantic HTML and the hero image before motion initialisation. No blocking cinematic preloader.
- Reserve image, video, and scene dimensions to prevent layout shifts. Use font fallbacks with compatible metrics and a small self-hosted font subset.
- Animate transforms and opacity primarily. Limit full-screen composited layers; avoid broad use of `will-change`, blur, and large animated shadows.
- Do not drive animation frames through React state. Batch geometry reads and setup work; avoid DOM measurement on every scroll tick.
- Prepare the next relevant scene near entry. If its media is late, retain the poster and transition cleanly instead of showing an empty frame.
- Use muted, inline video. Only the visible clip plays; pause offscreen clips and pause media when the page is hidden. Handle autoplay rejection and missing/failed media with the designed poster state.
- Use device-appropriate media sources without downloading both desktop and mobile variants. Prefer MP4/H.264 as a broadly supported video baseline; additional formats must justify their complexity with measured savings.
- Use stable scene heights and handle mobile browser chrome, orientation changes, and font/media completion without rebuilding timelines on every small viewport change.
- Provide a pause-motion control for ongoing decorative motion and honour reduced-motion preferences. Reduced-motion layouts preserve all content and use still imagery with minimal transitions.
- Keep the site usable if animation JavaScript fails. A visible, readable baseline must never rely on an entrance animation completing.

## 7. Performance targets and measurement

These are initial engineering budgets, not results. Measure on a production build; document and resolve exceptions.

| Measure | Initial target |
| --- | --- |
| LCP | ≤2.5 seconds at the 75th percentile of field visits |
| INP | ≤200 ms at the 75th percentile of field visits |
| CLS | ≤0.1 at the 75th percentile of field visits |
| Initial mobile viewport transfer | ≤1 MB compressed, including HTML, CSS, JS, fonts, and hero image; defer video |
| Initial client JS | Aim for ≤250 KiB compressed, including framework and animation code needed initially |
| Mobile hero image | Aim for ≤200 KiB at an appropriate display resolution |
| Optional story clips | Aim for ≤1.5 MB each on mobile and ≤3 MB on desktop; defer and load only the selected variant |
| Mobile full-page media | Target ≤6 MB for a complete ordinary scroll; verify actual network requests |
| Scrolling | Aim for stable 60 Hz presentation on representative hardware, with no recurring animation-induced main-thread tasks over 50 ms |

Use repeated Lighthouse/mobile-throttling runs to diagnose loading, bundle analysis for code cost, and browser performance traces for frame pacing and memory. Test cold and warm loads. After launch, measure real-user Web Vitals by device class when traffic permits; a Lighthouse score is not a field-performance claim.

If a scene misses budgets, reduce media dimensions/bitrate, concurrent layers, or animation complexity and retest. Preserve its visual composition and narrative. If the Next.js baseline prevents the agreed budgets despite appropriate boundaries, revisit the framework decision before the full build expands.

## 8. Enquiries and backend

Fields: name and phone with country code required; email, goal/event, current experience, target date, and message optional. Add an explicit acknowledgement explaining contact use and link to the privacy page. Avoid asking for health records at this stage.

Flow: form → bounded request and server validation → abuse checks → database insert → confirmation only after successful persistence.

Use a D1 (SQLite) `enquiries` table with UUID, creation time, contact fields, goal fields, consent timestamp/version, status, and a unique submission identifier. An idempotency key and a database uniqueness constraint prevent duplicate rows when a successful submission is retried after a lost response.

- Validate on both client and server; normalise phone input conservatively.
- Keep the D1 binding in the Worker; the browser has no direct database access. Use parameterised SQL. Expose a controlled write endpoint and no public lead-read endpoint. D1 does not use Supabase/Postgres RLS policies.
- Use a honeypot and durable rate limiting rather than process-local counters. Select controls available on the Free plan and include their queries in the CPU/database budget. If Turnstile is enabled, verify its token on the server and load the widget near the form.
- Return field errors, a recoverable network/server error, and an accessible success state. Preserve entered values after failure and prevent accidental double submission.
- Avoid logging contact details or complete request bodies. Keep secrets out of the repository and provide configuration examples containing names only; use Cloudflare secrets and ignored local development files.
- Review leads through the Cloudflare dashboard initially, with documented access, export, deletion, and retention procedures. Document D1 recovery and periodic exports; the Free plan currently includes seven days of point-in-time recovery.
- Separate preview/test enquiries from production records. Optional email notifications come after persistence and must not cause a successful enquiry to be lost if notification delivery fails.

## 9. Delivery milestones and exit criteria

Execution update: milestones 1–4 are implemented, and milestone 6 now has a Cloudflare review deployment and a verified live enquiry. Browser viewport checks, backend tests, and a production build pass. The hosted mobile loading audit scores 95, with simulated LCP 2.8 seconds (above the initial target). Physical-device/Safari checks and final content/privacy/indexing remain open. See `README.md`, `docs/HANDOVER.md`, and `docs/QA.md`.

| Milestone | Deliverable | Exit criterion |
| --- | --- | --- |
| 1. Creative specification | Design tokens, desktop/phone storyboards, draft copy, asset inventory | All scenes have a defined purpose and a workable media source; unknown business details are recorded |
| 2. Cinematic prototype | Opening and complete swim → bike → run sequence in the production stack | Visually compelling at phone, tablet, and desktop sizes; representative scroll and loading traces meet budgets or have resolved adjustments |
| 3. Complete frontend | Coach, programmes, process, FAQs, contact UI, privacy page | Responsive, keyboard accessible, readable without motion; content and media provenance checked |
| 4. Enquiry integration | Migration, server handler, validation, abuse protection, lead-review workflow | Valid submission persists once; invalid/spam requests rejected; failure/retry paths work; anonymous reads blocked |
| 5. Quality pass | Browser/device evidence, production build, performance report | No blocking layout, motion, accessibility, form, or security defects; remaining verification gaps explicitly recorded |
| 6. Deployment and handover | Cloudflare Free hosting configuration, live URL, editing/deployment guide | Production smoke test succeeds; a test lead is verified and removed; rollback and database access are documented |

Do not wait for a domain to implement or review the site. Start locally, then use a hosting preview URL. Public release depends on the final business details, suitable assets, configured backend, and hosting account. Add the chosen domain later, with DNS/TLS setup, redirects, canonical URL, sitemap, and share-image metadata updated together.

## 10. Verification matrix

Check small phones from 360 px wide, larger phones, tablets in both orientations, and laptop/desktop layouts through at least 1920 px. Include zoomed text, short-height windows, anchor jumps, back navigation, and the on-screen keyboard.

Target browsers: iPhone Safari, Android Chrome on a mid-range device, iPad Safari, and Safari/Chrome on macOS. Automated Chromium/WebKit checks cover layout and flows; real devices are required to substantiate claims about touch scrolling, video decoding, and mobile browser chrome. Record unavailable devices as unverified rather than treating emulation as equivalent.

Test rapid and slow scrolling, reverse scrolling, orientation changes, background/resume, slow network, media errors, blocked autoplay, reduced motion, and keyboard/screen-reader form use. Check focus visibility, text contrast, labels, error announcements, and comfortable tap targets.

Automated checks should focus on meaningful behaviours: schema validation, duplicate submission handling, successful storage, failure recovery, and denied unauthorised reads. Keep screenshot/layout checks for key breakpoints and run type checking and a production build. Do not create tests that merely mirror static copy.

## 11. Maintenance, hosting, and remaining inputs

Keep copy changes in content files and media swaps in the asset manifest. Document how to run locally, replace/crop/compress assets, preview changes, deploy, roll back, and review enquiries. Git changes produce reviewable previews before production updates.

Initial infrastructure budget: ₹0/month for Cloudflare Free hosting, the enquiry Worker, and D1 within their allowances. Use a free provider URL first. A custom domain can be purchased later; budget approximately ₹1,000–₹1,500/year for a normal non-premium `.com`, subject to registrar, renewal price, and tax. Licensed assets and business email are separate. Upgrade only if measured usage or operational needs justify it. No purchases or account provisioning are part of this planning task.

Free-tier limits verified during planning on 14 October 2026:

- Static asset requests are free and unlimited when served directly, with 20,000 files per Worker version and a 25 MiB individual-file limit.
- Worker code receives 100,000 requests/day across the account and 10 ms CPU time per request; network/database waiting is excluded from CPU time. Measure the complete enquiry endpoint against this budget.
- D1 includes five million rows read/day and 100,000 rows written/day, with 500 MB per database and 5 GB total account storage. Index writes and abuse-control queries also consume allowances.
- Exhausting backend/database quotas can temporarily prevent submissions. Keep the static website independent of those requests, expose a recoverable form error, and monitor usage. Free-tier usage does not automatically become paid overages.

Remaining inputs that can be collected during the prototype: original coach images and logo, confirmed service inclusions, coaching geography, contact destination, certification details, preferred business copy, and Cloudflare account configuration. These do not block preparing the design or motion prototype; they do affect final content and public launch.

## 12. Research and implementation references

- [Podium creator case study](https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/): athletic storytelling and motion reference; its creators describe Next.js, GSAP, and selective WebGL use.
- [Breakthrough Performance Coaching](https://breakthroughperformancecoaching.com/): programme clarity and coaching-service inspiration.
- [Frederick Webb Triathlon](https://www.frederickwebb-triathlon.com/): personal coaching positioning.
- [JLX Coaching](https://jlxcoaching.net/): discovery-call and coaching-process content reference.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components): client-boundary design and reducing browser JavaScript.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): responsive and reduced-motion animation setup.
- [Web Vitals](https://web.dev/articles/vitals): field thresholds and percentile-based evaluation.
- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports): static page generation and unavailable runtime server features.
- [Cloudflare Static Assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/): free direct asset requests and routing implications.
- [Cloudflare Worker limits](https://developers.cloudflare.com/workers/platform/limits/): API CPU/request and static-file limits.
- [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/): database usage allowances and quota behaviour.
- [Cloudflare D1 limits](https://developers.cloudflare.com/d1/platform/limits/): per-database size and recovery limits.
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/): server verification requirements if enabled.

The website references were researched for their content and published implementation descriptions. No hands-on cross-device performance audit of those sites was performed during planning.
