import docsStyles from "./docs.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Why NMUI";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    <header class="docs-header">
      <h1>Why NMUI</h1>
      <p>Frontend tooling got heavy. The browser didn't.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>The pitch</h2>
        <p>A form, a dialog, a nav rail. Shipping those should not need a compiler, a bundler, and a folder of dependencies — but that is what the standard frontend setup asks for now. The browser already ships custom elements, CSS variables, and real inputs. <strong>NATIVE MUI</strong> is the bet that the platform is enough, and the bet pays off in time: no build config to write, no build errors to debug, no framework upgrade mornings. Edit a file, refresh the page, done.</p>
        <p>The point is you don't need fancy build tools. Native JavaScript, native CSS, and HTML — and the browsers themselves — have come a long way since React (2013) and AngularJS (2010) first came out. Back then you needed a framework to paper over what browsers couldn't do. You don't anymore. You don't need a complex build process to make something that should be simple.</p>
      </section>

      <section class="docs-section">
        <h2>What you save</h2>
        <p><strong>The build step.</strong> There is none — no config, no CI build minutes, no "it works on my machine" from a toolchain.</p>
        <p><strong>The update treadmill.</strong> The UI layer has no dependencies, so there is nothing in it to update, audit, or break on a major version.</p>
        <p><strong>The learning surface.</strong> One element per component family, settings as attributes. There is no framework API to memorize on top of the web platform you already know.</p>
        <p><strong>The debugging layer.</strong> When something looks wrong, it is HTML and CSS in the page you wrote — not a compiled artifact three transforms away from your source.</p>
      </section>

      <section class="docs-section">
        <h2>NMUI vs the rest</h2>
        <p>Every option below is a good tool for somebody. The question is only what it costs you to ship a page. Each matchup has its own page — click a name for the full head-to-head.</p>
        <div class="docs-table-wrap">
        <table class="docs-compare">
          <thead>
            <tr><th>Approach</th><th>Build step</th><th>Runtime shipped</th><th>M3 Expressive</th><th>Best when</th></tr>
          </thead>
          <tbody>
            <tr><td>NMUI</td><td>None — import a file</td><td>None (native custom elements)</td><td>Built in</td><td>You want M3 and you'd rather ship a page than configure a toolchain</td></tr>
            <tr><td><a data-link href="/why-nmui/react">React</a></td><td>Yes (JSX + bundler)</td><td>React + ReactDOM</td><td>Bring your own (MUI, etc.)</td><td>You need the ecosystem, a big team, or server rendering</td></tr>
            <tr><td><a data-link href="/why-nmui/vue">Vue</a></td><td>Yes, for single-file components</td><td>Vue</td><td>Bring your own</td><td>You like Vue's model and its ecosystem</td></tr>
            <tr><td><a data-link href="/why-nmui/svelte">Svelte</a></td><td>Yes (compiler)</td><td>Almost none — compiled away</td><td>Bring your own</td><td>You want a compiler that disappears at runtime</td></tr>
            <tr><td><a data-link href="/why-nmui/angular">Angular</a></td><td>Yes</td><td>Angular</td><td>Bring your own (Angular Material)</td><td>Enterprise, large teams, batteries included</td></tr>
            <tr><td><a data-link href="/why-nmui/tailwind">Tailwind</a></td><td>Yes, in practice</td><td>None (it's CSS)</td><td>Bring your own — utilities, not components</td><td>You want full styling control and don't mind composing every component yourself</td></tr>
            <tr><td><a data-link href="/why-nmui/bootstrap">Bootstrap</a></td><td>No (CDN works)</td><td>Small JS for some components</td><td>No — its own look</td><td>You want a familiar, battle-tested kit and don't care about M3</td></tr>
            <tr><td><a data-link href="/why-nmui/material-web">Material Web</a></td><td>Usually (Lit components, normally bundled)</td><td>Lit</td><td>Built in (Google's own)</td><td>You want Google's official M3 web components and don't mind the Lit runtime</td></tr>
            <tr><td><a data-link href="/why-nmui/vanilla">Hand-rolled vanilla</a></td><td>None</td><td>None</td><td>You build it</td><td>You have very few components and full control matters most</td></tr>
          </tbody>
        </table>
        </div>
      </section>

      <section class="docs-section">
        <h2>But what about…</h2>
        <p>Every framework pitch is a list of things you supposedly can't do without it. Here are the usual ones — and the native answer to each.</p>
        <p><strong>"I need a router."</strong> The site you're reading has one. A tiny SPA router, no framework, with server fallback configs for every stack — <a data-link href="/docs/router">the Router guide</a>. We built a simple one, and it's literally all you need.</p>
        <p><strong>"I need to customize the theme."</strong> We built a tool for that. Thirty color roles, live preview, contrast checks, export the CSS file — <a data-link href="/docs/theming">the Theming tool</a>. It's easy as shit.</p>
        <p><strong>"I need state management."</strong> State lives in your JavaScript. The components emit events; you keep the state in plain objects. No store library, no subscription model, no framework-shaped state.</p>
        <p><strong>"I need server rendering."</strong> Most pages don't. Static hosting, the router, and the page you're on — that's the whole stack, and it works.</p>
      </section>

      <section class="docs-section">
        <h2>The short version</h2>
        <p>If the browser can do it, NMUI lets the browser do it.</p>
      </section>
    </main>

    <footer class="docs-footer">
      <p><strong>NATIVE MUI</strong> — <a href="https://github.com/nativemui">github.com/nativemui</a></p>
    </footer>
  </div>`;
}
