// Smoke test: every main route renders without a page error.
// Run from the repo root with the site on localhost:8080:
//   python3 serve.py &
//   node tools/smoke.mjs
import { chromium } from "playwright";

const routes = [
  "/",
  "/docs",
  "/docs/button",
  "/docs/state",
  "/docs/getting-started",
  "/why-nmui",
  "/about",
];

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
// Only real JS exceptions fail the smoke test. Third-party resources
// (the Material Symbols font, shields.io badges) can fail to load in
// a sandboxed run without the site being broken — those are warnings.
page.on("pageerror", (e) => errors.push(String(e.message)));
page.on("console", (m) => {
  if (m.type() === "error") console.log("  (resource warning)", m.text().slice(0, 120));
});

for (const route of routes) {
  await page.goto(`http://localhost:8080${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const heading = await page
    .locator("h1, display, headline")
    .first()
    .textContent()
    .catch(() => "");
  if (!heading?.trim()) throw new Error(`${route}: no heading rendered`);
  console.log(`ok ${route} — ${heading.trim().slice(0, 40)}`);
}

await browser.close();
if (errors.length) {
  console.error("page errors:", errors);
  process.exit(1);
}
console.log("smoke: all routes rendered clean");
