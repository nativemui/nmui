import docsStyles from "./docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "About Native MUI";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>About Native MUI</h1>
      <p>Material 3 Expressive, in vanilla JS/HTML/CSS. No framework. No build step. No dependencies.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>What it is</h2>
        <p><strong>NATIVE MUI</strong> is a component library for the web, built to the Material 3 Expressive spec. One element per component family, bare attributes for role and variants, light DOM all the way down: <code>&lt;nmui-button tonal large&gt;</code> is the whole API for a button. Components decorate native elements — a checkbox wraps a real <code>&lt;input type="checkbox"&gt;</code>, a slider wraps a real range input — so forms, keyboard, and screen readers keep working the way the platform already made them work.</p>
        <p>There is nothing to install and nothing to compile. Import a file, write markup, open the page. Theming is a block of CSS variables under a <code>theme</code> attribute on <code>&lt;html&gt;</code>; the typescale is five elements (<code>display</code>, <code>headline</code>, <code>nmui-title</code>, <code>nmui-body</code>, <code>label</code>); motion is a set of spring tokens. The library is the components, the type, the motion, and the theme — nothing else.</p>
      </section>

      <section class="docs-section">
        <h2>What it isn't</h2>
        <p>It is not a framework. There is no router, no state management, no virtual DOM, no server story — the router on this site is the site's own, and it is not part of the library. It does not fetch your data or architect your app. It is the layer that makes the page look and behave like Material 3, and then it gets out of the way.</p>
      </section>

      <section class="docs-section">
        <h2>Why native</h2>
        <p>The platform already does the job. Custom elements give you components. CSS variables give you theming. Native inputs give you forms, focus, and accessibility for free. A library that fights the platform — reimplementing inputs, focus, and scrolling in JavaScript — is paying a tax on every interaction. <strong>NATIVE MUI</strong> is the bet that the thin layer is enough: use what the browser ships, add the Material design on top, and stop there.</p>
      </section>

      <section class="docs-section">
        <h2>Who it's for</h2>
        <p>Anyone who wants Material 3 without adopting a framework or a build pipeline to get it. Small sites, dashboards, internal tools, prototypes that need to look finished — anywhere the page is the product and the toolchain is overhead. If you already ship a framework and hire for it, that framework is probably still the right call; see <a data-link href="/why-nmui">Why NMUI</a> for the honest version of that argument.</p>
      </section>

      <section class="docs-section">
        <h2>Honest limits</h2>
        <p>Safari is intentionally unsupported: the library loads CSS as JS modules, which WebKit does not implement (<a href="https://bugs.webkit.org/show_bug.cgi?id=227967">WebKit bug 227967</a>). Everything else modern works. The library is pre-1.0 and moving fast — attributes and details still change between versions, and the version number on the home page is the truth about what you're looking at.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><strong>NATIVE MUI</strong> — <a href="https://github.com/nativemui">github.com/nativemui</a></p>
    </footer>
  </div>`;
}
