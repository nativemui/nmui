import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";
import { demo, evTable } from "../demo.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "App bar — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/app-bar")}
    <header class="docs-header">
      <h1>App bar</h1>
      <p><code>&lt;nmui-app-bar&gt;</code> — the top app bar, one element with the variant as a bare attribute. Small (64dp, single row), medium flexible (112dp, 136dp with a subtitle), large flexible (120dp, 152dp with a subtitle). Baseline medium/large are not recommended in M3 Expressive — <code>[medium]</code> and <code>[large]</code> are the flexible variants. Children in order: leading, title, subtitle, trailing. Actions are shown as standard icon buttons. On scroll the container fills with surface-container — no shadow in M3, the fill is the separation — and the app toggles <code>[scrolled]</code> from its own scroll handler.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Small</h2>
        ${demo(`<nmui-app-bar>
  <nmui-button icon standard>menu</nmui-button>
  <headline>Title</headline>
  <nmui-button icon standard>favorite</nmui-button>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Small, centered</h2>
        ${demo(`<nmui-app-bar center>
  <nmui-button icon standard>arrow_back</nmui-button>
  <headline>Title</headline>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Medium flexible</h2>
        ${demo(`<nmui-app-bar medium>
  <nmui-button icon standard>arrow_back</nmui-button>
  <headline>Medium title</headline>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Medium flexible, with subtitle</h2>
        ${demo(`<nmui-app-bar medium>
  <nmui-button icon standard>arrow_back</nmui-button>
  <headline>Medium title</headline>
  <subtitle>Supporting text</subtitle>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Large flexible</h2>
        ${demo(`<nmui-app-bar large>
  <nmui-button icon standard>arrow_back</nmui-button>
  <headline>Large title</headline>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Large flexible, with subtitle</h2>
        ${demo(`<nmui-app-bar large>
  <nmui-button icon standard>arrow_back</nmui-button>
  <headline>Large title</headline>
  <subtitle>Supporting text</subtitle>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>`)}
      </section>

      <section class="docs-section">
        <h2>Scrolled</h2>
        ${demo(`<nmui-app-bar id="demo-bar-scrolled">
  <nmui-button icon standard>menu</nmui-button>
  <headline>Title</headline>
  <nmui-button icon standard>more_vert</nmui-button>
</nmui-app-bar>
<nmui-button tonal id="demo-bar-scroll-toggle">Toggle scrolled</nmui-button>`)}
        <p class="docs-note">The bar doesn't guess your scroll container — toggle <code>[scrolled]</code> from your own scroll handler.</p>
      </section>

      <section class="docs-section">
        <h2>Events</h2>
        ${evTable([
          ["— none —", "the bar itself", "—", "the bar is a container; it fires nothing"],
          ["click / change", "the buttons inside it (they bubble through the bar)", "each button's own detail", "a leading or trailing action is pressed — see the Button pages"],
        ])}
        <p>There is deliberately nothing to listen for on <code>&lt;nmui-app-bar&gt;</code> itself — no scroll event, no title event. State goes in as attributes (<code>[scrolled]</code>, toggled from your own scroll handler as above) and actions come out of the buttons you put in it, which keep their own contracts. Because inner clicks bubble, one listener on the bar can still catch them all — just check <code>e.target</code> to see which button it was.</p>
        <pre><code>bar.addEventListener("click", (e) =&gt; {
  const btn = e.target.closest("nmui-button");
  if (btn) console.log("bar action:", btn.textContent.trim());
});</code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — spec: <a href="https://m3.material.io/components/app-bars/specs">m3.material.io/components/app-bars</a></p>
    </footer>
  </div>`;

  const bar = mount.querySelector("#demo-bar-scrolled");
  mount.querySelector("#demo-bar-scroll-toggle")?.addEventListener("click", () => {
    bar?.toggleAttribute("scrolled");
  });
}
