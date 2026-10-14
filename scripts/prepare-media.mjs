import { mkdir, writeFile, access } from "node:fs/promises";
import sharp from "sharp";

await mkdir("public/media", { recursive: true });
const photos = {
  hero: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=2200&q=88",
  swim: "https://images.unsplash.com/photo-1619101198597-466afca339ef?auto=format&fit=crop&w=2000&q=88",
  bike: "https://images.unsplash.com/photo-1775638946697-fb4b8bb1dc88?auto=format&fit=crop&w=2000&q=88",
  run: "https://images.unsplash.com/photo-1565622124890-6cab81e9109d?auto=format&fit=crop&w=2000&q=88",
};
for (const [name, url] of Object.entries(photos)) {
  if (
    !process.argv.includes(`--refresh=${name}`) &&
    (await access(`public/media/${name}-1920.webp`).then(
      () => true,
      () => false,
    )) &&
    (await access(`public/media/${name}-mobile-1200.webp`).then(
      () => true,
      () => false,
    ))
  )
    continue;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  for (const width of [640, 1280, 1920]) {
    const output = await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: name === "hero" ? 70 : 75 })
      .toBuffer();
    await writeFile(`public/media/${name}-${width}.webp`, output);
    console.log(
      `${name}-${width}.webp: ${Math.round(output.length / 1024)} KiB`,
    );
  }
  for (const width of [480, 800, 1200]) {
    const output = await sharp(source)
      .rotate()
      .resize({
        width,
        height: Math.round((width * 16) / 9),
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 72 })
      .toBuffer();
    await writeFile(`public/media/${name}-mobile-${width}.webp`, output);
    console.log(
      `${name}-mobile-${width}.webp: ${Math.round(output.length / 1024)} KiB`,
    );
  }
}
await sharp(
  "/var/folders/86/dw4vt9210q3fy759kwrqtj100000gn/T/codex-clipboard-6ace604e-eb04-4b2a-a7eb-1c436d73d2cf.png",
)
  .resize({ width: 825 })
  .webp({ quality: 85 })
  .toFile("public/media/coach.webp");
// Self-host the font; no third-party font requests at runtime.
const glyphs =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?:;/-&";
const css = await (
  await fetch(
    `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap&text=${encodeURIComponent(glyphs)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    },
  )
).text();
const urls = [
  ...new Set(
    [...css.matchAll(/url\((https:[^)]+)\)/g)].map((match) => match[1]),
  ),
];
for (let i = 0; i < urls.length; i++) {
  const response = await fetch(urls[i]);
  if (!response.ok) throw new Error("Font download failed");
  await writeFile(
    `public/media/barlow-${i}.woff2`,
    Buffer.from(await response.arrayBuffer()),
  );
}
await writeFile(
  "public/media/fonts.css",
  css.replace(
    /url\((https:[^)]+)\)/g,
    (_, url) => `url('/media/barlow-${urls.indexOf(url)}.woff2')`,
  ),
);
console.log(`Font files: ${urls.length}`);
