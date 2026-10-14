"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
export function EnquiryForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [goal, setGoal] = useState("");
  const key = useRef("");
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const listener = (event: Event) =>
      setGoal((event as CustomEvent<string>).detail);
    document.addEventListener("choose-programme", listener);
    return () => document.removeEventListener("choose-programme", listener);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const data = new FormData(event.currentTarget);
    if (!key.current) key.current = crypto.randomUUID();
    setState("sending");
    setMessage("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          consent: data.get("consent") === "on",
          submissionId: key.current,
        }),
        signal: controller.signal,
      });
      const type = response.headers.get("Content-Type");
      if (!type?.includes("application/json"))
        throw new Error(
          "The enquiry service is unavailable. Please try again shortly.",
        );
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 400 || response.status === 409)
          key.current = "";
        throw new Error(
          result.error || "We could not save your enquiry. Please try again.",
        );
      }
      setState("success");
      setMessage(
        "Your enquiry is in. Shreeshail will be able to review your goal and contact details.",
      );
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof TypeError
          ? "We couldn’t connect. Your details are still here; please try again."
          : error instanceof Error && error.name !== "AbortError"
            ? error.message
            : "The connection took too long. Your details are still here; please try again.",
      );
    } finally {
      clearTimeout(timer);
    }
  }
  if (state === "success")
    return (
      <div className="form-success" role="status">
        <span className="success-icon">✓</span>
        <span className="eyebrow">FIRST STEP, TAKEN.</span>
        <h3>
          Let’s make
          <br />
          it happen.
        </h3>
        <p>{message}</p>
        <button
          className="text-link"
          onClick={() => {
            setState("idle");
            key.current = "";
            setGoal("");
          }}
        >
          Send another enquiry <Arrow />
        </button>
      </div>
    );
  return (
    <form className="enquiry-form" ref={form} onSubmit={submit}>
      <div className="form-row">
        <label>
          Your name <span>*</span>
          <input
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="What should we call you?"
          />
        </label>
        <label>
          Phone / WhatsApp <span>*</span>
          <input
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            maxLength={30}
            minLength={7}
            placeholder="+91 98765 43210"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email <span className="optional">optional</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Your next goal
          <select
            name="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="">Choose your finish line</option>
            {[
              "First triathlon",
              "Ironman 70.3",
              "Full Ironman",
              "Half marathon / marathon",
              "Exploring my options",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Tell us a little about yourself{" "}
        <span className="optional">optional</span>
        <textarea
          name="message"
          rows={3}
          maxLength={2000}
          placeholder="Your experience, target race, or the goal you can’t stop thinking about…"
        />
      </label>
      <div className="honey" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to be contacted about my coaching enquiry.{" "}
          <a href="/privacy/">Privacy policy</a>
        </span>
      </label>
      <button
        type="submit"
        className="button button-orange submit-button"
        disabled={state === "sending"}
      >
        {state === "sending" ? "Sending your enquiry…" : "Take the first step"}
        <Arrow diagonal />
      </button>
      <p
        className={`form-message ${state === "error" ? "error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {message || "A conversation about your goal. A clear next step."}
      </p>
    </form>
  );
}
