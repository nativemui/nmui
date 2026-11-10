import loadingStyles from "./loading.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(loadingStyles)) {
  document.adoptedStyleSheets.push(loadingStyles);
}

/**
 * <nmui-loading> — the M3 Expressive loading indicator. For short,
 * indeterminate waits (200ms–5s); it replaces the indeterminate
 * circular progress indicator and never becomes determinate —
 * longer or measurable waits belong to <nmui-progress>.
 *
 *   <nmui-loading aria-label="Loading articles"></nmui-loading>
 *   <nmui-loading contained aria-label="Refreshing page"></nmui-loading>
 *
 * [contained] puts the indicator on a circular primary-container
 * (for placement over other content, e.g. pull-to-refresh) and
 * switches it to on-primary-container. The component is 48dp with
 * a 38dp shape area; size it with CSS width/height (the specs
 * allow 24–240dp) and the shape scales with it.
 *
 * The indicator morphs through the same seven shapes as the
 * platform implementation (LoadingIndicatorDefaults
 * .IndeterminateIndicatorPolygons): soft burst, 9-sided cookie,
 * pentagon, pill, sunny, 4-sided cookie, oval — one morph every
 * 650ms. The rotation pulses with the morph: it spins fast while
 * the shape is changing and slows as the morph settles (the
 * motion in the guidelines' animation) — each 650ms segment
 * covers 120° on an ease-out curve, and the morph itself
 * completes in the first 75% of its segment. Each shape is
 * generated as an
 * outline, resampled to a shared point count, corner-smoothed,
 * and interpolated point-by-point with requestAnimationFrame —
 * hand-rolled, no dependencies. It carries role="progressbar"
 * (indeterminate: no value); set aria-label to say WHAT is
 * loading. Under prefers-reduced-motion the morph slows down
 * and the rotation stops.
 */

// -- shape generation ---------------------------------------------------------
// Every shape is a dense outline (arrays of [x, y] in unit space,
// clockwise from the top), resampled to K points by arc length so
// any two shapes can be interpolated point-by-point.

const K = 96;

function resample(pts, k = K) {
  const closed = [...pts, pts[0]];
  const lengths = [0];
  for (let i = 1; i < closed.length; i++) {
    const dx = closed[i][0] - closed[i - 1][0];
    const dy = closed[i][1] - closed[i - 1][1];
    lengths.push(lengths[i - 1] + Math.hypot(dx, dy));
  }
  const total = lengths[lengths.length - 1];
  const out = [];
  let j = 0;
  for (let i = 0; i < k; i++) {
    const target = (total * i) / k;
    while (j < lengths.length - 2 && lengths[j + 1] < target) j++;
    const segLen = lengths[j + 1] - lengths[j] || 1;
    const f = (target - lengths[j]) / segLen;
    out.push([
      closed[j][0] + (closed[j + 1][0] - closed[j][0]) * f,
      closed[j][1] + (closed[j + 1][1] - closed[j][1]) * f,
    ]);
  }
  return out;
}

// One Chaikin pass cuts every corner by 1/4 — the rounded corners
// of a RoundedPolygon.
function chaikin(pts) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    out.push(
      [a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25],
      [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]
    );
  }
  return out;
}

function smooth(pts, passes = 2) {
  let out = pts;
  for (let i = 0; i < passes; i++) out = chaikin(out);
  // Chaikin shrinks the outline; rescale so the max radius is 1.
  const max = Math.max(...out.map(([x, y]) => Math.hypot(x, y))) || 1;
  return out.map(([x, y]) => [x / max, y / max]);
}

function radial(fn, n = 360) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = fn(t);
    pts.push([Math.cos(t) * r, Math.sin(t) * r]);
  }
  return pts;
}

function polygon(vertices, smoothPasses = 2) {
  // Densify along the edges, smooth the corners, then come back
  // to the shared K — every shape must land on exactly K points
  // or the point-by-point morph breaks.
  return resample(smooth(resample(vertices, 720), smoothPasses));
}

// Flatten the peaks of a cosine — the plump lobes of a cookie.
const plump = (x) => Math.sign(x) * Math.pow(Math.abs(x), 0.6);

const SHAPES = [
  // SoftBurst — a soft-spiked star (12 points, one smoothing
  // pass keeps the points but rounds them). The valleys sit deep
  // (0.78) so it can't be mistaken for the scalloped cookies.
  polygon(
    Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 1 : 0.78;
      return [Math.cos(t) * r, Math.sin(t) * r];
    }),
    1
  ),
  // Cookie9Sided — 9 plump lobes.
  resample(radial((t) => 0.88 + 0.12 * plump(Math.cos(9 * t)))),
  // Pentagon — true flat edges from the apothem formula, corners
  // rounded by the smoothing pass.
  polygon(
    Array.from({ length: 5 }, (_, i) => {
      const t = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return [Math.cos(t), Math.sin(t)];
    })
  ),
  // Pill — a capsule: two semicircles joined by straight runs,
  // sampled along its outline. Chunky (height 62% of width) so
  // it reads as a capsule, not a flattened oval.
  resample(
    (() => {
      const pts = [];
      const a = 0.38; // half the straight run
      const b = 0.62; // cap radius
      for (let i = 0; i <= 90; i++) {
        const t = -Math.PI / 2 + (i / 90) * Math.PI;
        pts.push([a + Math.cos(t) * b, Math.sin(t) * b]);
      }
      for (let i = 0; i <= 90; i++) {
        const t = Math.PI / 2 + (i / 90) * Math.PI;
        pts.push([-a + Math.cos(t) * b, Math.sin(t) * b]);
      }
      const max = Math.max(...pts.map(([x, y]) => Math.hypot(x, y)));
      return pts.map(([x, y]) => [x / max, y / max]);
    })()
  ),
  // Sunny — 8 long triangular rays over a core circle; the
  // valleys are the deepest of the set (0.62).
  polygon(
    Array.from({ length: 16 }, (_, i) => {
      const t = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 1 : 0.62;
      return [Math.cos(t) * r, Math.sin(t) * r];
    }),
    1
  ),
  // Cookie4Sided — a square with its sides pulled in.
  polygon(
    Array.from({ length: 8 }, (_, i) => {
      const t = (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4;
      const r = i % 2 === 0 ? 1 : 0.76;
      return [Math.cos(t) * r, Math.sin(t) * r];
    })
  ),
  // Oval.
  resample(radial((t) => 1 / Math.hypot(Math.cos(t), Math.sin(t) / 0.72))),
];

function pathFrom(pts) {
  // Unit space -> the 48 viewBox, shape radius 19 (the 38dp area).
  const c = 24;
  const r = 19;
  return (
    pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${(c + x * r).toFixed(2)} ${(c + y * r).toFixed(2)}`)
      .join("") + "Z"
  );
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// -- component ------------------------------------------------------------------

class NMUILoading extends HTMLElement {
  #ready = false;
  #path = null;
  #svg = null;
  #raf = 0;
  #start = 0;

  connectedCallback() {
    if (!this.#ready) {
      this.#ready = true;
      if (!this.hasAttribute("role")) this.setAttribute("role", "progressbar");
      if (!this.hasAttribute("aria-label")) this.setAttribute("aria-label", "Loading");
      if (!this.querySelector(":scope > morph")) {
        const morph = document.createElement("morph");
        morph.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="${pathFrom(SHAPES[0])}"/></svg>`;
        this.appendChild(morph);
      }
      this.#path = this.querySelector(":scope > morph path");
      this.#svg = this.querySelector(":scope > morph > svg");
    }
    // The morph loop (re)starts on EVERY connect: a router that
    // disconnects and reconnects the element must not leave a
    // static shape behind — only the CSS rotation would remain,
    // which reads as "it just spins".
    cancelAnimationFrame(this.#raf);
    this.#start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = reduced ? 2400 : 650;
    const tick = (now) => {
      const elapsed = now - this.#start;
      const segFloat = elapsed / stepMs;
      const seg = Math.floor(segFloat) % SHAPES.length;
      const p = segFloat - Math.floor(segFloat);
      // Morph completes in the first 75% of the segment, then
      // the shape holds; rotation covers 120° per segment on an
      // ease-out, so it spins fast while the shape changes and
      // slows as the morph settles.
      const f = easeInOut(Math.min(p / 0.75, 1));
      const from = SHAPES[seg];
      const to = SHAPES[(seg + 1) % SHAPES.length];
      const pts = from.map(([x, y], i) => [
        x + (to[i][0] - x) * f,
        y + (to[i][1] - y) * f,
      ]);
      this.#path.setAttribute("d", pathFrom(pts));
      if (!reduced) {
        const angle = (Math.floor(segFloat) + (1 - Math.pow(1 - p, 3))) * 120;
        this.#svg.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }
      this.#raf = requestAnimationFrame(tick);
    };
    this.#raf = requestAnimationFrame(tick);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.#raf);
  }
}

if (!customElements.get("nmui-loading")) {
  customElements.define("nmui-loading", NMUILoading);
}

export { NMUILoading };
