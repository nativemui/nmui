import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Carousel — nmui docs";

/* Short flat SVGs, 21:9 — wider than the 16:9 item frames, so the
   parallax drift (object-position) has room to show. */
const sunset =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='630' height='270'><rect width='630' height='270' fill='%23ff6b35'/><circle cx='315' cy='140' r='65' fill='%23ffe66d'/><rect y='210' width='630' height='60' fill='%232d3142'/></svg>";
const ocean =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='630' height='270'><rect width='630' height='270' fill='%230077be'/><rect y='180' width='630' height='90' fill='%2300c8ff'/><circle cx='120' cy='70' r='30' fill='%23fff9c4'/></svg>";
const forest =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='630' height='270'><rect width='630' height='270' fill='%23a5d6a7'/><polygon points='150,210 210,60 270,210' fill='%231b5e20'/><polygon points='280,210 340,90 400,210' fill='%232e7d32'/><polygon points='410,210 470,60 530,210' fill='%231b5e20'/><rect y='210' width='630' height='60' fill='%235d4037'/></svg>";
const night =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='630' height='270'><rect width='630' height='270' fill='%231a237e'/><circle cx='480' cy='70' r='40' fill='%23fffde7'/><circle cx='100' cy='60' r='4' fill='white'/><circle cx='200' cy='40' r='3' fill='white'/><circle cx='300' cy='90' r='4' fill='white'/><rect y='210' width='630' height='60' fill='%23121212'/></svg>";

const swatch = (bg, h = 160) =>
  `<div style="height: ${h}px; background: ${bg}; border-radius: 28px;"></div>`;

const grads = [
  "linear-gradient(135deg, #ff6b35, #ff3d77)",
  "linear-gradient(135deg, #0077be, #00c8ff)",
  "linear-gradient(135deg, #2e7d32, #a5d6a7)",
  "linear-gradient(135deg, #1a237e, #7e57c2)",
  "linear-gradient(135deg, #ff8f00, #ffd54f)",
];
const tiles = (n, h = 160) =>
  Array.from({ length: n }, (_, i) => swatch(grads[i % grads.length], h)).join(
    "\n  "
  );
const scenes = [
  [sunset, "Sunset"],
  [ocean, "Ocean"],
  [forest, "Forest"],
  [night, "Night"],
];
const photos = (n) =>
  Array.from({ length: n }, (_, i) => {
    const [src, alt] = scenes[i % scenes.length];
    return `<img src="${src}" alt="${alt} ${
      Math.floor(i / scenes.length) + 1
    }">`;
  }).join("\n  ");

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/carousel")}
    <header class="docs-header">
      <h1>Carousel</h1>
      <p>Six layouts, one element. Children are the items; on multi-browse and hero they change size as they scroll — the leading item is large, the next is medium on multi-browse, the rest are small.</p>
      <p class="docs-note">Spec geometry: 16dp leading/trailing padding, 8dp top/bottom, 8dp between items, 28dp item radius on every layout except full-screen (no padding, 16dp between items, one edge-to-edge item, vertical scroll). Uncontained layouts have leading padding only — items bleed past the trailing edge — and scroll freely; multi-browse, hero, and full-screen snap. Large is min(480px, 45%) — set <code>--nmui-carousel-large-max</code> to change it; medium is min(300px, 25%); small is 48px, inside the spec's 40–56 range.</p>
      <p class="docs-note">No arrow buttons, by design: the accessibility guidance forbids buttons inside or beside the carousel container. Navigation is scroll, swipe, snap, and keyboard — Tab reaches the items, arrows move between them. Move it by dragging the strip, scrolling over it (a wheel or touchpad scroll moves the strip until it hits an edge, then the page scrolls), or clicking an item to bring it forward (centered, on center layouts). Under reduced motion there are no size changes and no parallax; every item stays one size. On a vertically-scrolling page, the accessible way to see every item without horizontal scrolling is app-level: a Show all button below the carousel opening a full page of items.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Multi-browse</h2>
        <p>At least one large, one medium, and one small item at a time — at the end of the strip the medium sits just before the large item. Drag the strip to scroll, like the M3 demo, or click any item to make it large. The strip is capped at 720px here so it always has something to scroll to, whatever the window width.</p>
        ${demo(`<nmui-carousel style="max-width: 720px;">
  ${tiles(10)}
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Uncontained</h2>
        <p>One size, no size changes, free scrolling, items bleed past the trailing edge. This is the text-heavy layout — cards fit here.</p>
        ${demo(`<nmui-carousel uncontained>
  <nmui-card filled style="width: 240px;"><headline small>One</headline><p>First item, with room for text.</p></nmui-card>
  <nmui-card filled style="width: 240px;"><headline small>Two</headline><p>Second item, with room for text.</p></nmui-card>
  <nmui-card filled style="width: 240px;"><headline small>Three</headline><p>Third item, with room for text.</p></nmui-card>
  <nmui-card filled style="width: 240px;"><headline small>Four</headline><p>Fourth item, with room for text.</p></nmui-card>
  <nmui-card filled style="width: 240px;"><headline small>Five</headline><p>Fifth item, with room for text.</p></nmui-card>
  <nmui-card filled style="width: 240px;"><headline small>Six</headline><p>Sixth item, with room for text.</p></nmui-card>
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Uncontained multi-aspect ratio</h2>
        <p>Same layout as uncontained, but the items have various widths — 9:16 up to 16:9. Widths come from the items themselves (here: a shared 180px height with different aspect ratios).</p>
        ${demo(`<nmui-carousel multi-aspect>
  <div style="height: 180px; aspect-ratio: 16 / 9; background: linear-gradient(135deg, #ff6b35, #ff3d77); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 9 / 16; background: linear-gradient(135deg, #0077be, #00c8ff); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 1 / 1; background: linear-gradient(135deg, #2e7d32, #a5d6a7); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 3 / 4; background: linear-gradient(135deg, #1a237e, #7e57c2); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 16 / 9; background: linear-gradient(135deg, #ff8f00, #ffd54f); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 9 / 16; background: linear-gradient(135deg, #ff3d77, #7e57c2); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 1 / 1; background: linear-gradient(135deg, #00c8ff, #a5d6a7); border-radius: 28px;"></div>
  <div style="height: 180px; aspect-ratio: 3 / 4; background: linear-gradient(135deg, #ff6b35, #0077be); border-radius: 28px;"></div>
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Hero</h2>
        <p>One large item at a time, with a small preview of what's next. Swipes one item at a time.</p>
        ${demo(`<nmui-carousel hero>
  ${tiles(12, 200)}
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Center-aligned hero</h2>
        <p>Hero plus <code>center</code>: the large item sits centered with a small preview on each side.</p>
        ${demo(`<nmui-carousel hero center>
  ${tiles(10, 200)}
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Full-screen</h2>
        <p>One edge-to-edge item at a time, scrolling vertically with snap. Portrait content only, per the guidelines — the carousel takes its height from wherever you put it (480px here).</p>
        ${demo(`<nmui-carousel full-screen style="height: 480px;">
  <div style="background: linear-gradient(180deg, #ff6b35, #ff3d77);"></div>
  <div style="background: linear-gradient(180deg, #0077be, #00c8ff);"></div>
  <div style="background: linear-gradient(180deg, #2e7d32, #a5d6a7);"></div>
</nmui-carousel>`)}
      </section>

      <section class="docs-section">
        <h2>Parallax</h2>
        <p>Item images drift against their frames as they move — the image content moves slower than the item. Scroll this one and watch the suns and moons slide inside their frames. The sources are 21:9, wider than the 16:9 frames, so the drift has room to show.</p>
        ${demo(`<nmui-carousel>
  ${photos(10)}
</nmui-carousel>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
