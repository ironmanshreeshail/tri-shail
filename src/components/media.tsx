export function Photo({
  name,
  alt,
  className = "",
  eager = false,
  sizes = "100vw",
  fullBleed = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
  fullBleed?: boolean;
}) {
  const img = (
    <img
      className={className}
      src={`/media/${name}-1280.webp`}
      srcSet={`/media/${name}-640.webp 640w, /media/${name}-1280.webp 1280w, /media/${name}-1920.webp 1920w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      width="1920"
      height="1280"
    />
  );
  return fullBleed ? (
    <picture className="full-bleed-photo">
      <source
        media="(max-width: 760px)"
        srcSet={`/media/${name}-mobile-480.webp 480w, /media/${name}-mobile-800.webp 800w, /media/${name}-mobile-1200.webp 1200w`}
        sizes="100vw"
      />
      {img}
    </picture>
  ) : (
    img
  );
}
