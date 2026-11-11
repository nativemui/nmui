import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Typography — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/typography")}
    <header class="docs-header">
      <h1>Typography</h1>
      <p>The M3 typescale, as type elements. Five roles, three sizes each — use them inside the body of your content wherever a page needs a title, a paragraph, or a label. They are children, not components: no <code>nmui-</code> element, no JS, just the element and a bare size attribute. The face is Roboto, falling back to system-ui where Roboto isn't installed — no webfont fetch, per the house rules.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>How it works</h2>
        <p><code>title</code> and <code>body</code> take the <code>nmui-</code> prefix — a bare <code>&lt;title&gt;</code> parses as RCDATA and a second <code>&lt;body&gt;</code> merges into the document body. <code>label</code> stays bare: the selectors require a size (<code>small</code>, <code>medium</code>, <code>large</code>), so native form labels are untouched unless you opt in. <code>display</code> and <code>headline</code> are free. The emphasized weights (medium for display/headline, bold for title/label) exist as tokens for component use; the elements themselves render the regular scale.</p>
      </section>

      <section class="docs-section">
        <h2>Display</h2>
        <p>The largest text on the page — hero moments and landing pages, not body copy.</p>
        ${demo(`<display small>Display small</display>`)}
        <p class="docs-note">36px / 44px · Regular 400 · tracking 0 · Brand</p>
        ${demo(`<display medium>Display medium</display>`)}
        <p class="docs-note">45px / 52px · Regular 400 · tracking 0 · Brand</p>
        ${demo(`<display large>Display large</display>`)}
        <p class="docs-note">57px / 64px · Regular 400 · tracking −0.25px · Brand</p>
      </section>

      <section class="docs-section">
        <h2>Headline</h2>
        <p>Page and section titles — the heading a reader scans for first.</p>
        ${demo(`<headline small>Headline small</headline>`)}
        <p class="docs-note">24px / 32px · Regular 400 · tracking 0 · Brand</p>
        ${demo(`<headline medium>Headline medium</headline>`)}
        <p class="docs-note">28px / 36px · Regular 400 · tracking 0 · Brand</p>
        ${demo(`<headline large>Headline large</headline>`)}
        <p class="docs-note">32px / 40px · Regular 400 · tracking 0 · Brand</p>
      </section>

      <section class="docs-section">
        <h2>Title</h2>
        <p>Card and dialog titles, list headers — the title of a thing, not a page.</p>
        ${demo(`<nmui-title small>Title small</nmui-title>`)}
        <p class="docs-note">14px / 20px · Medium 500 · tracking 0.1px · Plain</p>
        ${demo(`<nmui-title medium>Title medium</nmui-title>`)}
        <p class="docs-note">16px / 24px · Medium 500 · tracking 0.15px · Plain</p>
        ${demo(`<nmui-title large>Title large</nmui-title>`)}
        <p class="docs-note">22px / 28px · Regular 400 · tracking 0 · Plain</p>
      </section>

      <section class="docs-section">
        <h2>Body</h2>
        <p>Paragraphs and long text — the workhorse. Medium is the default reading size.</p>
        ${demo(`<nmui-body small>Body small — captions and fine print live here, not in label.</nmui-body>`)}
        <p class="docs-note">12px / 16px · Regular 400 · tracking 0.4px · Plain</p>
        ${demo(`<nmui-body medium>Body medium — the default reading size. Most of a page's words are this.</nmui-body>`)}
        <p class="docs-note">14px / 20px · Regular 400 · tracking 0.25px · Plain</p>
        ${demo(`<nmui-body large>Body large — long-form reading, where the extra leading earns its keep.</nmui-body>`)}
        <p class="docs-note">16px / 24px · Regular 400 · tracking 0.5px · Plain</p>
      </section>

      <section class="docs-section">
        <h2>Label</h2>
        <p>Buttons, tabs, captions, overlines — short text that labels something else.</p>
        ${demo(`<label small>Label small</label>`)}
        <p class="docs-note">11px / 16px · Medium 500 · tracking 0.5px · Plain</p>
        ${demo(`<label medium>Label medium</label>`)}
        <p class="docs-note">12px / 16px · Medium 500 · tracking 0.5px · Plain</p>
        ${demo(`<label large>Label large</label>`)}
        <p class="docs-note">14px / 20px · Medium 500 · tracking 0.1px · Plain</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/styles/typography">m3.material.io/styles/typography</a></p>
    </footer>
  </div>`;
}
