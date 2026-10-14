export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16M13 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function SportIcon({ sport }: { sport: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {sport === "swim" ? (
        <>
          <circle cx="23" cy="10" r="2.5" />
          <path d="m7 16 7-5 6 5 7 2M14 11l-4-4 6-3M3 23q3-3 6 0t6 0t6 0t6 0M3 28q3-3 6 0t6 0t6 0t6 0" />
        </>
      ) : sport === "bike" ? (
        <>
          <circle cx="7" cy="24" r="5" />
          <circle cx="25" cy="24" r="5" />
          <circle cx="21" cy="6" r="2.5" />
          <path d="m19 11-6 6 7 2-4 7M19 11l5 5h4M7 24l6-7" />
        </>
      ) : (
        <>
          <circle cx="21" cy="5" r="2.5" />
          <path d="m19 10-4 8 7 5-2 7M15 18l-5 8H3M19 10l5 6h5M17 11l-6-1-4 5" />
        </>
      )}
    </svg>
  );
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="/"
      title="Tri-Shail home"
    >
      <svg
        width="30"
        height="31"
        viewBox="0 0 30 31"
        fill="none"
        aria-hidden="true"
      >
        <path d="M15 2 29 27H1L15 2Z" stroke="currentColor" strokeWidth="2" />
        <path d="m9 20 6-10 6 10H9Z" fill="currentColor" />
        <path d="M2 29h26" stroke="currentColor" />
      </svg>
      <span>
        TRI<span className="brand-dot">·</span>SHAIL{" "}
        <small>PERFORMANCE COACHING</small>
      </span>
    </a>
  );
}
