import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Time picker — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/time-picker")}
    <header class="docs-header">
      <h1>Time picker</h1>
      <p>An M3-styled field over a native time input — the platform picker does the picking.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Field</h2>
        ${demo(`<nmui-time-picker>
  <label>Wake up</label>
  <input type="time" value="07:30">
</nmui-time-picker>
<nmui-time-picker outlined>
  <label>Reminder</label>
  <input type="time">
</nmui-time-picker>`)}
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;
}
