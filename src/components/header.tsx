"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow, Brand } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        toggle.current?.getAttribute("aria-expanded") === "true"
      ) {
        setOpen(false);
        toggle.current.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#journey">The journey</a>
        <a href="#coach">Your coach</a>
        <a href="#programmes">Programmes</a>
      </nav>
      <a className="nav-cta" href="#contact">
        Let’s talk <Arrow diagonal />
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Menu — open navigation"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[
            ["The journey", "#journey"],
            ["Your coach", "#coach"],
            ["Programmes", "#programmes"],
            ["Start a conversation", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
