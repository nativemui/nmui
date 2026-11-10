import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Badge — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/badge")}
    <header class="docs-header">
      <h1>Badge</h1>
      <p><code>&lt;nmui-badge&gt;</code> wraps its anchor; the host's own text becomes the label. No size attribute — size follows content, as in M3. Empty is the small badge, a 6dp dot tucked into the anchor's top-trailing corner. Text is the large badge, 16dp tall with a label-small count, straddling that corner. Cap the label at four characters including "+" (<code>999+</code>). Colors are error / on-error.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Small</h2>
        ${demo(`<nmui-badge><nmui-button icon standard>notifications</nmui-button></nmui-badge>
<nmui-badge><nmui-button icon standard>mail</nmui-button></nmui-badge>`)}
      </section>

      <section class="docs-section">
        <h2>Large</h2>
        ${demo(`<nmui-badge>3<nmui-button icon standard>notifications</nmui-button></nmui-badge>
<nmui-badge>27<nmui-button icon standard>mail</nmui-button></nmui-badge>
<nmui-badge>99+<nmui-button icon standard>chat</nmui-button></nmui-badge>
<nmui-badge>999+<nmui-button icon standard>chat</nmui-button></nmui-badge>`)}
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["— none —", "the badge itself", "—", "a badge is decoration on its anchor; it fires nothing and takes no input"],
        ])}
        <p>Nothing to listen for here — deliberately. Changing the count in code: at authoring time the label is the host's text, but after connection it lives in the badge's dot — so use the <code>label</code> property (<code>badge.label = "5"</code>, or <code>""</code> for the dot) and the size follows the content. (Setting the host's <code>textContent</code> would replace the wrapped anchor along with the label — don't.) Clicks and events belong to the anchor — listen to the button or link inside, whose own contract is unchanged by wearing a badge.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/badges/specs">m3.material.io/components/badges</a></p>
    </footer>
  </div>`;
}
