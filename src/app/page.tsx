import { Header } from "@/components/header";
import { Arrow, Brand, SportIcon } from "@/components/icons";
import { Photo } from "@/components/media";
import { CoachPhoto } from "@/components/coach-photo";
import { Journey } from "@/components/journey";
import { EnquiryForm } from "@/components/enquiry-form";
import { ProgrammeLink } from "@/components/programme-link";
import {
  coachProfile,
  credentials,
  programmes,
  faqs,
  site,
} from "@/content/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero" aria-labelledby="hero-heading">
          <CoachPhoto
            sport="run"
            className="hero-image"
            alt="Coach Shreeshail Janagond on the run during an Ironman race"
            eager
          />
          <div className="hero-shade" />
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="live-dot" /> BUILT FOR THE JOURNEY
            </span>
            <span className="hero-disciplines">
              SWIM <span>/</span> BIKE <span>/</span> RUN
            </span>
          </div>
          <div className="hero-content">
            <div>
              <p className="hero-pretitle">TRAIN WITH</p>
              <p className="hero-coach-name">SHREESHAIL JANAGOND</p>
              <h1 id="hero-heading">
                YOUR NEXT
                <br />
                <span>FINISH LINE.</span>
              </h1>
            </div>
            <div className="hero-aside">
              <p>
                Your ambition. His experience.
                <br />A plan to go the distance, together.
              </p>
              <a href="#contact" className="button button-orange">
                Train with Shreeshail <Arrow diagonal />
              </a>
              <span className="hero-coach">
                CERTIFIED TRIATHLON COACH <span>·</span> 2× IRONMAN FINISHER
              </span>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#journey">
              SCROLL TO FIND YOUR STRIDE <span>↓</span>
            </a>
            <span>
              TRI-SHAIL PERFORMANCE COACHING
              <br />
              FOUNDED BY SHREESHAIL JANAGOND.
            </span>
          </div>
        </section>
        <section
          className="credential-strip"
          aria-label="Coach race credentials"
        >
          {credentials.map((c) => (
            <div className="credential" key={c.label}>
              <span>{c.value}</span>
              <p>{c.label}</p>
            </div>
          ))}
          <div className="credential credential-certified">
            <svg
              width="31"
              height="36"
              viewBox="0 0 32 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m16 2 13 5v11c0 8-13 16-13 16S3 26 3 18V7l13-5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m9 16 5 5 9-10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <p>
              Certified
              <br />
              Triathlon Coach
            </p>
          </div>
        </section>
        <section className="intro section-padding">
          <span className="eyebrow section-label">
            <span className="label-line" /> THE TRI-SHAIL APPROACH
          </span>
          <div className="intro-grid">
            <h2>
              THREE SPORTS.
              <br />
              ONE STRONGER <span>YOU.</span>
            </h2>
            <div>
              <p>
                That finish line you’ve been thinking about?
                <br />
                Let’s give it a starting point.
              </p>
              <p className="muted">
                Whether you’re taking your first steps into triathlon or looking
                towards an Ironman, Tri-Shail is about building towards your
                goal with purpose, patience, and Shreeshail’s experience by your
                side.
              </p>
              <a className="text-link" href="#journey">
                Discover the journey <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
        <Journey />
        <section id="coach" className="coach-section section-padding">
          <div className="coach-photo">
            <CoachPhoto
              sport="run"
              alt="Shreeshail Janagond racing in his Tri-Shail kit"
              sizes="(max-width: 760px) calc(100vw - 48px), 42vw"
            />
            <span className="photo-caption">YOUR COACH. IN HIS ELEMENT.</span>
          </div>
          <div className="coach-content">
            <span className="eyebrow section-label">
              <span className="label-line" /> MEET YOUR COACH
            </span>
            <h2>
              SHREESHAIL
              <br />
              <span>JANAGOND.</span>
            </h2>
            <p className="coach-role">
              Founder & Coach, Tri-Shail Performance Coaching
            </p>
            <p className="coach-belief">Big goals. Real-life schedules.</p>
            <p className="muted">{coachProfile.biography}</p>
            <div className="coach-details">
              <div>
                <span>COACHING</span>
                <strong>{coachProfile.formats}</strong>
                <p>{coachProfile.location}</p>
              </div>
              <div>
                <span>LET’S TALK</span>
                <strong>{coachProfile.languages}</strong>
              </div>
            </div>
            <h3 className="coach-results-label">RACE HIGHLIGHTS</h3>
            <dl className="coach-results">
              {coachProfile.raceResults.map((race) => (
                <div key={race.event}>
                  <dt>{race.event}</dt>
                  <dd>{race.time}</dd>
                </div>
              ))}
            </dl>
            <p className="coach-source">
              Results listed on his{" "}
              <a
                href={coachProfile.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                RunOrbit profile <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <p className="coach-extra-credentials">
              Official sub-2-hour half-marathon pacer · Multiple half-marathon &
              25 km finishes
            </p>
            <a href="#contact" className="text-link">
              Talk to Shreeshail <Arrow diagonal />
            </a>
          </div>
        </section>
        <section id="programmes" className="programmes-section section-padding">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-label">
                <span className="label-line" /> FIND YOUR STARTING LINE
              </span>
              <h2>
                A GOAL THAT’S YOURS.
                <br />
                <span>A PATH TO MATCH.</span>
              </h2>
            </div>
            <p>
              Choose the distance you’re thinking about.
              <br />
              Let’s discuss how to get you there.
            </p>
          </div>
          <p className="programme-support">{coachProfile.focus}</p>
          <div className="programme-grid">
            {programmes.map((p) => (
              <article className="programme-card" key={p.number}>
                <div className="programme-photo">
                  <Photo
                    name={p.image}
                    alt=""
                    sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
                  />
                  <span className="programme-number">{p.number}</span>
                  <span className="programme-photo-label">{p.tag}</span>
                </div>
                <div className="programme-content">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="programme-detail">{p.detail}</span>
                  <ProgrammeLink goal={p.goal} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="process-section section-padding">
          <div>
            <span className="eyebrow section-label">
              <span className="label-line" /> FROM AMBITION TO ACTION
            </span>
            <h2>
              BIG JOURNEYS.
              <br />
              <span>SMALL, DAILY STEPS.</span>
            </h2>
          </div>
          <div className="process-grid">
            {[
              {
                title: "Start with a conversation",
                text: "Your goal, your experience, and the time you have. A good starting point begins with understanding you.",
              },
              {
                title: "Find your direction",
                text: "Discuss a training approach that brings your next event and your everyday life into the same picture.",
              },
              {
                title: "Build towards race day",
                text: "Make consistent training part of the journey. Keep your next finish line in sight, one week at a time.",
              },
            ].map((step, i) => (
              <article key={step.title}>
                <span className="process-number">0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="quote-section">
          <div className="quote-rule" />
          <p>
            YOU DON’T HAVE TO SEE
            <br />
            THE WHOLE JOURNEY.
            <br />
            <span>JUST TAKE THE FIRST STEP.</span>
          </p>
          <div className="quote-sports">
            <SportIcon sport="swim" />
            <span>—</span>
            <SportIcon sport="bike" />
            <span>—</span>
            <SportIcon sport="run" />
          </div>
        </section>
        <section className="faq-section section-padding">
          <div>
            <span className="eyebrow section-label">
              <span className="label-line" /> BEFORE YOU BEGIN
            </span>
            <h2>
              A LITTLE
              <br />
              <span>CLARITY.</span>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <details key={faq.question}>
                <summary>
                  <span className="faq-number">0{i + 1}</span>
                  {faq.question}
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section section-padding">
          <div className="contact-copy">
            <span className="eyebrow section-label">
              <span className="label-line" /> YOUR JOURNEY STARTS HERE
            </span>
            <h2>
              WHAT’S YOUR
              <br />
              <span>FINISH LINE?</span>
            </h2>
            <p>
              Tell Shreeshail what you’re working towards.
              <br />
              Let’s start a conversation about getting there.
            </p>
            <div className="contact-coach">
              <span className="contact-avatar">
                <CoachPhoto sport="run" alt="" sizes="216px" />
              </span>
              <div>
                <strong>Coach Shreeshail Janagond</strong>
                <span>
                  {coachProfile.formats} · {coachProfile.location}
                </span>
              </div>
            </div>
          </div>
          <EnquiryForm />
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Brand footer />
          <p>
            SWIM. BIKE. RUN.
            <br />
            <span>BECOME.</span>
          </p>
          <a href="#main" className="back-top">
            Back to top ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.fullName}
          </span>
          <a href="/privacy/">Privacy</a>
          <a href="/credits/">Photography credits</a>
          <span>BUILT FOR THE LONG RUN.</span>
        </div>
      </footer>
    </>
  );
}
