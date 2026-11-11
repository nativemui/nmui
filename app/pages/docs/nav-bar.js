import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Navigation bar — nmui docs";

const DESTS = `<button selected><icon>home</icon>Home</button>
  <button><icon>search</icon>Search</button>
  <button><icon>favorite</icon>Favorites</button>
  <button><icon>settings</icon>Settings</button>`;

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/navigation-bar")}
    <header class="docs-header">
      <h1>Navigation bar</h1>
      <p><code>&lt;nmui-navigation bar&gt;</code> — one element, role as a bare attribute. This is the M3 Expressive <strong>flexible</strong> bar only: the live overview says it replaces the baseline bar, which is no longer recommended, so no baseline bar is implemented. 64dp tall, surface-container, no shadow, 3–5 destinations of equal importance, icon 24dp, pill indicator 64×32. The selected label is secondary (the M3E overview change); the selected icon is on-secondary-container on the secondary-container pill. Compact windows (under 600dp) stack icon over label; medium windows (600dp and up) lay destinations out horizontally, icon beside label, centred as a group — narrow your browser under 600px to see the compact layout, or view it on a phone. Labels show for all destinations by default.</p>
    </header>


    <main>
      <section class="docs-section">
        <h2>Flexible bar — four destinations</h2>
        ${demo(`<nmui-navigation bar>
  ${DESTS}
</nmui-navigation>`)}
        <p class="docs-note">On a wide browser this renders in its medium horizontal layout; under 600px it stacks. Clicking a destination selects it and emits <code>change</code> with { value, destination }.</p>
      </section>

      <section class="docs-section">
        <h2>Label behaviour — [labels-selected]</h2>
        ${demo(`<nmui-navigation bar labels-selected>
  ${DESTS}
</nmui-navigation>`)}
      </section>

      <section class="docs-section">
        <h2>Label behaviour — [labels-none]</h2>
        ${demo(`<nmui-navigation bar labels-none>
  ${DESTS}
</nmui-navigation>`)}
      </section>

      <section class="docs-section">
        <h2>Five destinations</h2>
        ${demo(`<nmui-navigation bar>
  <button selected><icon>home</icon>Home</button>
  <button><icon>search</icon>Search</button>
  <button><icon>library_music</icon>Library</button>
  <button><icon>favorite</icon>Favorites</button>
  <button><icon>settings</icon>Settings</button>
</nmui-navigation>`)}
      </section>

      <section class="docs-section">
        <h2>Change event</h2>
        ${demo(`<nmui-navigation bar id="demo-bar">
  ${DESTS}
</nmui-navigation>`)}
        <output id="demo-bar-out" class="docs-output">pick a destination…</output>
        ${evTable([
          ["change (custom)", "the bar host", "detail: {value, destination}", "a destination is clicked; value is its value attribute, else its href, else its label text; destination is the element"],
          ["click", "a destination (bubbles)", "—", "same press, native — anchors still navigate; the component never preventDefaults"],
        ])}
        <p>Same contract as the rail — one polymorphic element, one event. The native way works too: a destination's <code>.click()</code> selects it and fires <code>change</code> (an anchor also follows its href); setting <code>[selected]</code> on a destination in code moves the pill silently, no event.</p>
      </section>

      <section class="docs-section">
        <h2>What the spec pages did not print</h2>
        <p class="docs-note">The live overview prints no heights: 64dp flexible (against 80dp baseline) is corroborated by implementation summaries, and the 64×32 pill is the baseline indicator size carried over — the overview prints no flexible indicator size. If the live specs page diagrams say otherwise when you read them, the numbers above are the ones to correct.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/navigation-bar/specs">m3.material.io/components/navigation-bar</a></p>
    </footer>
  </div>`;

  const out = mount.querySelector("#demo-bar-out");
  mount.querySelector("#demo-bar")?.addEventListener("change", (e) => {
    if (!e.detail.destination) return;
    out.textContent = `change → ${e.detail.value}`;
  });
}
