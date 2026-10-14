import { expect, test } from "@playwright/test";

test("a short iPhone viewport keeps the cinematic journey enabled", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const journey = page.locator("#journey");
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute("data-motion-mode", "cinematic");
  await expect(journey).toHaveClass(/journey-enhanced/);

  const bounds = await journey.evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    range: element.getBoundingClientRect().height - window.innerHeight,
  }));
  for (const [index, progress] of [0.06, 0.44, 0.82].entries()) {
    await page.evaluate(
      ({ top, range, progress }) =>
        window.scrollTo({ top: top + range * progress, behavior: "instant" }),
      { ...bounds, progress },
    );
    const chapter = journey.locator(".chapter").nth(index);
    await expect(chapter).toHaveCSS("opacity", "1");
    await expect(journey.locator(".chapter-button").nth(index)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await chapter
      .locator("img")
      .evaluate((image: HTMLImageElement) => image.decode());
    const viewport = await journey.locator(".journey-viewport").boundingBox();
    expect(Math.abs(viewport!.y)).toBeLessThanOrEqual(1);
  }

  // Safari's controls can change the available height across the old 600 px gate.
  await page.setViewportSize({ width: 375, height: 635 });
  await expect(journey).toHaveClass(/journey-enhanced/);
  await page.setViewportSize({ width: 375, height: 559 });
  await expect(journey).toHaveClass(/journey-enhanced/);

  const before = await journey.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    y: window.scrollY,
  }));
  await page.getByRole("button", { name: "Pause motion" }).click();
  const after = await journey.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    y: window.scrollY,
  }));
  expect(after.height).toBe(before.height);
  expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
  await page.getByRole("button", { name: "Enable motion" }).click();
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("reduced motion stays readable and explains the static experience", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const journey = page.locator("#journey");
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute("data-motion-mode", "reduced");
  await expect(journey).not.toHaveClass(/journey-enhanced/);
  await expect(page.getByText("Reduced motion is on")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveCount(
    0,
  );
  for (const chapter of await journey.locator(".chapter").all()) {
    await expect(chapter).toHaveCSS("position", "relative");
    await expect(chapter).toHaveCSS("visibility", "visible");
  }
});

test("short landscape screens retain all three flowing chapters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const journey = page.locator("#journey");
  await journey.scrollIntoViewIfNeeded();
  await expect(journey).toHaveAttribute("data-motion-mode", "compact");
  await expect(journey).not.toHaveClass(/journey-enhanced/);
  await expect(page.getByRole("button", { name: "Pause motion" })).toHaveCount(
    0,
  );
  for (const chapter of await journey.locator(".chapter").all()) {
    await expect(chapter).toHaveCSS("position", "relative");
    await expect(chapter).toHaveCSS("visibility", "visible");
  }
});
