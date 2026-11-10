import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";
import { familyNav } from "./button-family.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Extended FAB — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/button")}
    <header class="docs-header">
      <h1>Extended FAB</h1>
      <p><code>&lt;nmui-button fab extended&gt;</code> — a FAB with a label. Icon is optional; the label is the point.</p>
    </header>

    ${familyNav("/docs/extended-fab")}

    <main>
      <section class="docs-section">
        <h2>Sizes — small/default 56 · medium 80 · large 96</h2>
        ${demo(`<nmui-button fab extended><icon>edit</icon>Compose</nmui-button>
<nmui-button fab extended medium><icon>add</icon>Create</nmui-button>
<nmui-button fab extended large><icon>send</icon>Send</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Colors</h2>
        ${demo(`<nmui-button fab extended><icon>edit</icon>Compose</nmui-button>
<nmui-button fab extended secondary><icon>photo</icon>Upload</nmui-button>
<nmui-button fab extended tertiary><icon>share</icon>Share</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Label only</h2>
        ${demo(`<nmui-button fab extended>Compose</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Disabled</h2>
        ${demo(`<nmui-button fab extended disabled><icon>edit</icon>Compose</nmui-button>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${demo(`<nmui-button fab extended id="demo-xfab-ev" value="compose"><icon>edit</icon>Compose</nmui-button>`)}
        <output id="demo-xfab-ev-out" class="docs-output">press it…</output>
        ${evTable([
          ["click", "the host", "—", "every press — pointer, Enter, or Space"],
          ["change (custom)", "the host", "detail: {value, button, event}", "every press, right after click"],
        ])}
        <p>Same button contract — the label changes nothing. <code>btn.click()</code> presses it from code; <code>btn.value</code> / <code>btn.disabled</code> reflect their attributes silently, the native pattern.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/extended-fab/specs">m3.material.io/components/extended-fab</a></p>
    </footer>
  </div>`;

  const xfabOut = mount.querySelector("#demo-xfab-ev-out");
  mount.querySelector("#demo-xfab-ev")?.addEventListener("change", (e) => {
    xfabOut.textContent = `change → value: ${e.detail.value}`;
  });
}
