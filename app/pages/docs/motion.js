import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Motion — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/motion")}
    <header class="docs-header">
      <h1>Motion</h1>
      <p>The M3 Expressive springs, as tokens. Expressive is Material's opinionated motion scheme — the default for hero moments and key interactions. Every spring below is a <code>linear()</code> approximation of a real spring, used as a transition or animation easing: <code>transition: transform var(--md-sys-motion-spring-fast-effects);</code>. Press Run on any of them and watch the dot travel — the difference between the curves is the whole point of the page.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Effects — no overshoot</h2>
        <p>For fades, color, and size changes — anything that is not moving from one place to another. Effects springs are monotonic: they approach the target and stop, never passing it.</p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-fast-effects);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">150ms · <code>--md-sys-motion-spring-fast-effects</code></p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-default-effects);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">200ms · <code>--md-sys-motion-spring-default-effects</code></p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-medium-effects);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">250ms · <code>--md-sys-motion-spring-medium-effects</code> — not an M3 token. Interpolated stop-by-stop between the default (200ms) and slow (300ms) effects springs, monotonic with no overshoot. It is the spring the library's own slides and variant switches run on.</p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-slow-effects);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">300ms · <code>--md-sys-motion-spring-slow-effects</code></p>
      </section>

      <section class="docs-section">
        <h2>Spatial — overshoots by design</h2>
        <p>For movement between places — a sheet sliding in, a page turning, a panel docking. Spatial springs overshoot their target (default-spatial peaks around 4–5% past it) and settle back: that overshoot is what makes the movement feel physical. Never use a spatial spring for geometry that has to land exactly — widths, docks, slides, indicators, notches. Use a monotonic effects spring for those.</p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-fast-spatial);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">350ms · <code>--md-sys-motion-spring-fast-spatial</code></p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-default-spatial);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">500ms · <code>--md-sys-motion-spring-default-spatial</code></p>
        ${demo(`<div class="motion-demo"><div class="motion-track"><span class="motion-dot" style="transition: transform var(--md-sys-motion-spring-slow-spatial);"></span></div><nmui-button outlined class="motion-run">Run</nmui-button></div>`)}
        <p class="docs-note">650ms · <code>--md-sys-motion-spring-slow-spatial</code></p>
      </section>

      <section class="docs-section">
        <h2>Standard — try not to use these</h2>
        <p>The standard scheme exists too (<code>--md-sys-motion-spring-*-standard</code>: fast/default/slow, spatial and effects) — functional, minimal bounce, for utilitarian products. Expressive is the default; the standard curves are there for when a product genuinely wants to feel plain.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/styles/motion">m3.material.io/styles/motion</a></p>
    </footer>
  </div>`;

  mount.querySelectorAll(".motion-run").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn
        .closest(".motion-demo")
        ?.querySelector(".motion-dot")
        ?.classList.toggle("moved");
    });
  });
}
