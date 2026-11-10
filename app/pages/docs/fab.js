import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "FAB — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>FAB</h1>
      <p><code>&lt;nmui-button fab&gt;</code> — the floating action button, as a role of the button tag. The content becomes the icon. Colors are the container set: primary container by default, or <code>[secondary]</code> / <code>[tertiary]</code>.</p>
    </header>

    ${familyNav("/docs/fab")}

    <main>
      <section class="docs-section">
        <h2>Sizes — small 40 · default 56 · medium 80 · large 96</h2>
        ${demo(`<nmui-button fab small><icon>add</icon></nmui-button>
<nmui-button fab><icon>edit</icon></nmui-button>
<nmui-button fab medium><icon>edit</icon></nmui-button>
<nmui-button fab large><icon>edit</icon></nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Colors</h2>
        ${demo(`<nmui-button fab><icon>edit</icon></nmui-button>
<nmui-button fab secondary><icon>photo</icon></nmui-button>
<nmui-button fab tertiary><icon outline>share</icon></nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(`<nmui-button fab disabled><icon>edit</icon></nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${demo(`<nmui-button fab id="demo-fab-ev" value="compose"><icon>edit</icon></nmui-button>`)}
        <output id="demo-fab-ev-out" class="docs-output">press it…</output>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, event}", "every press, right after click"],
        ])}
        <p>A FAB is a button — same contract as the standard button. <code>btn.click()</code> presses it from code; <code>btn.value</code> / <code>btn.disabled</code> reflect their attributes silently, the native pattern.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/floating-action-button/specs">m3.material.io/components/floating-action-button</a></p>
    </footer>
  </div>`;

  const fabOut = mount.querySelector("#demo-fab-ev-out");
  mount.querySelector("#demo-fab-ev")?.addEventListener("change", (e) => {
    fabOut.textContent = `change → value: ${e.detail.value}`;
  });
}
