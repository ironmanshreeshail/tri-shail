"use client";
import { useEffect, useRef, useState } from "react";
import { chapters } from "@/content/site";
import { CoachPhoto } from "./coach-photo";
import { SportIcon, Arrow } from "./icons";

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const motionControl = useRef<((value: boolean) => void) | null>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    // Load the animation engine near the story, after the opening has painted.
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const motion = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]).catch(() => null);
        if (!motion || cancelled) return;
        const [{ gsap }, { ScrollTrigger }] = motion;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });
        const media = gsap.matchMedia();
        media.add(
          "(min-height: 600px) and (prefers-reduced-motion: no-preference)",
          () => {
            element.classList.add("journey-enhanced");
            const panels = gsap.utils.toArray<HTMLElement>(".chapter", element);
            const images = gsap.utils.toArray<HTMLElement>(
              ".chapter-image",
              element,
            );
            const buttons =
              element.querySelectorAll<HTMLButtonElement>(".chapter-button");
            const activeChapter = (progress: number) =>
              progress < 1.025 / 3.35 ? 0 : progress < 2.025 / 3.35 ? 1 : 2;
            const updateNavigation = (progress: number) => {
              const active = activeChapter(progress);
              buttons.forEach((button, i) => {
                if (button.dataset.active !== String(i === active)) {
                  button.dataset.active = String(i === active);
                  button.setAttribute("aria-pressed", String(i === active));
                }
              });
            };
            gsap.set(panels.slice(1), { autoAlpha: 0 });
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: element,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.35,
                invalidateOnRefresh: true,
                onUpdate: (self) => updateNavigation(self.progress),
              },
            });
            images.forEach((image, i) =>
              timeline.fromTo(
                image,
                { scale: 1.08, yPercent: 0 },
                { scale: 1, yPercent: -2, duration: 1.35, ease: "none" },
                i,
              ),
            );
            [1, 2].forEach((i) => {
              timeline.to(
                panels[i - 1],
                { autoAlpha: 0, duration: 0.22, ease: "none" },
                i - 0.1,
              );
              timeline.to(
                panels[i],
                { autoAlpha: 1, duration: 0.25, ease: "none" },
                i - 0.1,
              );
              timeline.fromTo(
                panels[i].querySelector(".chapter-title"),
                { y: 35 },
                { y: 0, duration: 0.5, ease: "power2.out" },
                i - 0.05,
              );
            });
            // Pausing swaps to discrete chapter changes, preserving the same
            // layout and scroll position instead of collapsing the pinned story.
            let staticChapter = -1;
            const showStatic = (progress: number) => {
              updateNavigation(progress);
              const active = activeChapter(progress);
              if (active === staticChapter) return;
              staticChapter = active;
              gsap.set(panels, { autoAlpha: 0 });
              gsap.set(panels[active], { autoAlpha: 1 });
            };
            const staticTrigger = ScrollTrigger.create({
              trigger: element,
              start: "top top",
              end: "bottom bottom",
              onUpdate: (self) => {
                if (pausedRef.current) showStatic(self.progress);
              },
            });
            staticTrigger.disable(false);
            motionControl.current = (value) => {
              if (value) {
                timeline.scrollTrigger?.disable(false);
                timeline.scrollTrigger?.getTween()?.pause();
                gsap.set(images, { scale: 1, yPercent: 0 });
                gsap.set(element.querySelectorAll(".chapter-title"), { y: 0 });
                staticChapter = -1;
                staticTrigger.enable(false, true);
                showStatic(staticTrigger.progress);
              } else {
                const progress = staticTrigger.progress;
                staticTrigger.disable(false);
                timeline.scrollTrigger?.enable(false, true);
                timeline.progress(progress);
              }
            };
            if (pausedRef.current) motionControl.current(true);
            return () => {
              motionControl.current = null;
              element.classList.remove("journey-enhanced");
              buttons.forEach((b) => b.removeAttribute("data-active"));
            };
          },
        );
        cleanup = () => media.revert();
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup?.();
    };
  }, []);
  function toggleMotion() {
    const value = !pausedRef.current;
    pausedRef.current = value;
    motionControl.current?.(value);
    setPaused(value);
  }
  function goTo(index: number) {
    const element = root.current;
    if (!element) return;
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      pausedRef.current;
    if (element.classList.contains("journey-enhanced")) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top:
          top +
          (element.offsetHeight - window.innerHeight) * (index / 3 + 0.04),
        behavior: reduced ? "instant" : "smooth",
      });
    } else
      element.querySelectorAll(".chapter")[index]?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
  }
  return (
    <section
      id="journey"
      className="journey"
      ref={root}
      aria-label="The swim, bike, run journey"
    >
      <div className="journey-viewport">
        <div className="story-top">
          <span className="eyebrow">
            SHREESHAIL’S WORLD. YOUR NEXT CHAPTER.
          </span>
          <button
            className="motion-toggle"
            onClick={toggleMotion}
            aria-pressed={paused}
          >
            {paused ? "Enable" : "Pause"} motion{" "}
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          </button>
        </div>
        {chapters.map((chapter) => (
          <article
            className={`chapter chapter-${chapter.id}`}
            id={chapter.id}
            key={chapter.id}
          >
            <CoachPhoto
              sport={chapter.id}
              className="chapter-image"
              alt={chapter.alt}
            />
            <div className="chapter-shade" />
            <div className="chapter-content">
              <div className="chapter-kicker">
                <SportIcon sport={chapter.id} />
                <span>
                  {chapter.number} / {chapter.name.toUpperCase()}
                </span>
              </div>
              <h2 className="chapter-title">
                {chapter.title[0]}
                <br />
                <span>{chapter.title[1]}</span>
              </h2>
              <div className="chapter-copy">
                <h3>{chapter.phrase}</h3>
                <p>{chapter.description}</p>
                <span className="chapter-meta">{chapter.meta}</span>
              </div>
            </div>
          </article>
        ))}
        <div className="story-bottom">
          <div className="chapter-buttons" aria-label="Choose a discipline">
            {chapters.map((chapter, i) => (
              <button
                type="button"
                className="chapter-button"
                key={chapter.id}
                onClick={() => goTo(i)}
                title={`Go to ${chapter.name} chapter`}
              >
                <span>{chapter.number}</span> {chapter.name}
                <span className="chapter-line" />
              </button>
            ))}
          </div>
          <a href="#programmes" className="story-next">
            Find your programme <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
