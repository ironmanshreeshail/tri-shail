import { mkdir } from "node:fs/promises";
import sharp from "sharp";

// Retain the supplied originals outside public; serve only compressed variants.
await mkdir("public/media", { recursive: true });
for (const sport of ["run", "bike", "swim"]) {
  const source = `assets/coach/shreeshail-${sport}.png`;
  const { width } = await sharp(source).metadata();
  for (const size of [320, 480, width]) {
    const output = `public/media/shreeshail-${sport}-${size}.webp`;
    const result = await sharp(source)
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(output);
    console.log(`${output}: ${Math.round(result.size / 1024)} KiB`);
  }
}
