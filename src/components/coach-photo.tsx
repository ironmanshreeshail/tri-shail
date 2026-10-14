const dimensions = {
  run: { width: 682, height: 1024 },
  bike: { width: 576, height: 1024 },
  swim: { width: 768, height: 1024 },
};

export function CoachPhoto({
  sport,
  alt,
  className = "",
  eager = false,
  sizes = "(max-width: 760px) 100vw, 50vw",
}: {
  sport: keyof typeof dimensions;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const { width, height } = dimensions[sport];
  const path = `/media/shreeshail-${sport}`;
  return (
    <img
      src={`${path}-${width}.webp`}
      srcSet={`${path}-320.webp 320w, ${path}-480.webp 480w, ${path}-${width}.webp ${width}w`}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
    />
  );
}
