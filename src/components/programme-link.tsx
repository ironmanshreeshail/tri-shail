"use client";
import { Arrow } from "./icons";
export function ProgrammeLink({ goal }: { goal: string }) {
  return (
    <a
      href="#contact"
      className="programme-link"
      onClick={() =>
        document.dispatchEvent(
          new CustomEvent("choose-programme", { detail: goal }),
        )
      }
    >
      Explore coaching <Arrow diagonal />
    </a>
  );
}
