import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Router — nmui docs";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/router")}
    <header class="docs-header">
      <h1>Router</h1>
      <p>Not part of Material 3 — an optional extra. This is the exact routing setup this site runs on: real URLs, no framework, no build step, pages lazy-loaded by a route table. Copy the parts you want.</p>
      <p class="docs-note">A client-side router is only half the job. The other half is your <strong>server</strong>: when someone refreshes or deep-links to <code>/docs/button</code>, the server has to answer with <code>index.html</code> and let the router sort it out. That one rule — <em>serve real files, fall back to index.html for everything else</em> — is the whole trick, and most of this page is that rule translated into the config file of every common stack. Working copies of the main ones ship in this zip under <code>examples/router/</code>, including a standalone <code>router.js</code>.</p>
    </header>

    <main>
      <section class="docs-section" id="how">
        <h2>How this site routes</h2>
        <p>Four pieces, all in <code>app.js</code>:</p>
        <ul class="docs-list">
          <li><strong>A route table</strong> maps each path to a dynamic <code>import()</code>, so a page's code loads only when you visit it — code splitting with no bundler.</li>
          <li><strong>Link interception.</strong> In-app links carry <code>data-link</code>. One delegated click listener catches them, stops the browser's full page load, and calls <code>history.pushState</code> instead.</li>
          <li><strong>Back / forward</strong> arrive as <code>popstate</code> events and re-render from the URL.</li>
          <li><strong>The URL is the source of truth.</strong> On boot and on refresh the router reads <code>location.pathname</code> and renders that page. Unknown paths fall back to <code>/</code>.</li>
        </ul>
        <p>Every page is a module exporting the same two things: a <code>title</code> and a <code>render(mount, nmui)</code> function. The router sets <code>document.title</code>, scrolls to the top, and syncs the navigation rail's selected state after each render.</p>
      </section>

      <section class="docs-section" id="core">
        <h2>The whole router</h2>
        <p>This is the router from <code>app.js</code>, lifted out as a standalone file (also shipped as <code>examples/router/router.js</code>). Drop it next to a route table and a <code>&lt;main&gt;</code> element and you have this site's routing:</p>
        <pre><code>// router.js — no dependencies. Edit routes.js, not this file.
import { routes } from "./routes.js";

const mount = document.querySelector("main");

async function render(path) {
  const page = await routes[path]();      // lazy-loads the page module
  mount.innerHTML = "";
  await page.render(mount);
  document.title = page.title || "My site";
  mount.scrollTo(0, 0);
}

function go(path, push) {
  const target = routes[path] ? path : "/";   // unknown path -&gt; home
  if (push) history.pushState({ path: target }, "", target);
  return render(target);
}

// In-app links: &lt;a data-link href="/docs"&gt;. Everything else —
// external URLs, downloads, anchors — is left for the browser.
document.addEventListener("click", function (e) {
  const a = e.target.closest ? e.target.closest("a[data-link]") : null;
  if (!a) return;
  e.preventDefault();
  go(a.getAttribute("href"), true);
});

// Back / forward buttons.
window.addEventListener("popstate", function (e) {
  go((e.state && e.state.path) || location.pathname, false);
});

// Boot from the URL, so refresh and deep links land on the right page.
(function boot() {
  let path = location.pathname;
  if (path.endsWith("/index.html")) {
    path = path.slice(0, -"/index.html".length) || "/";
  }
  if (!routes[path]) path = "/";
  history.replaceState({ path: path }, "", path);
  render(path);
})();

export { go as navigate };</code></pre>
        <p>And the route table it reads (<code>app/pages/index.js</code> on this site). One line per page:</p>
        <pre><code>// routes.js — path -&gt; lazy page module.
export const routes = {
  "/":             () =&gt; import("./pages/home.js"),
  "/about":        () =&gt; import("./pages/about.js"),
  "/docs":         () =&gt; import("./pages/docs.js"),
  "/docs/button":  () =&gt; import("./pages/docs/button.js"),
  "/docs/router":  () =&gt; import("./pages/docs/router.js"),
};</code></pre>
      </section>

      <section class="docs-section" id="page">
        <h2>The page contract</h2>
        <p>A page is just a module with a title and a render function. It owns its markup, wires its own events after rendering, and does not know the router exists:</p>
        <pre><code>// pages/about.js
export const title = "About — My site";

export function render(mount) {
  mount.innerHTML =
    "&lt;h1&gt;About&lt;/h1&gt;" +
    "&lt;p&gt;Rendered by the router into the mount element.&lt;/p&gt;" +
    "&lt;nmui-button tonal id='cta'&gt;Say hi&lt;/nmui-button&gt;";

  mount.querySelector("#cta").addEventListener("click", function () {
    alert("hi");
  });
}</code></pre>
        <p>Pages can also be <code>async</code> — fetch data first, then set <code>innerHTML</code>. The router awaits <code>render()</code> before setting the title.</p>
      </section>

      <section class="docs-section" id="add">
        <h2>Adding a route, step by step</h2>
        <ul class="docs-list">
          <li><strong>1.</strong> Create the page module, e.g. <code>app/pages/pricing.js</code>, exporting <code>title</code> and <code>render</code>.</li>
          <li><strong>2.</strong> Add one line to the route table: <code>"/pricing": () =&gt; import("./pages/pricing.js"),</code></li>
          <li><strong>3.</strong> Link to it with <code>&lt;a data-link href="/pricing"&gt;Pricing&lt;/a&gt;</code> anywhere — nav, body, footer.</li>
          <li><strong>4.</strong> That's it. No server change: the fallback you set up once (below) covers every route you ever add.</li>
        </ul>
        <p>Programmatic navigation — after a form saves, say — goes through the same function the click handler uses:</p>
        <pre><code>import { navigate } from "./router.js";

saveButton.addEventListener("click", async function () {
  await saveForm();
  navigate("/pricing");      // pushState + render, no reload
});</code></pre>
        <p>On this site the same call is exposed as <code>nmui.navigate(path)</code>.</p>
      </section>

      <section class="docs-section" id="demo">
        <h2>Try the pattern</h2>
        <p>A miniature of the router, simulated in this box so it cannot hijack the page you are reading. The buttons call the same <code>go(path, true)</code> the real router uses; the log shows what would happen to the history stack:</p>
        <div class="docs-demo">
          <div class="docs-row">
            <nmui-button tonal data-mini="/demo">Home</nmui-button>
            <nmui-button tonal data-mini="/demo/docs">Docs</nmui-button>
            <nmui-button tonal data-mini="/demo/docs/button">Button</nmui-button>
            <nmui-button outlined data-mini="/demo/nope">Broken link</nmui-button>
          </div>
          <p style="margin: 16px 0 4px;">URL: <code id="router-demo-url">/demo</code></p>
          <div class="docs-output" id="router-demo-view">Home page — rendered by routes["/demo"]</div>
          <pre style="margin-top: 12px;"><code id="router-demo-log">boot: replaceState /demo, render</code></pre>
        </div>
        <p>The broken link demonstrates the unknown-path rule: it is not in the table, so <code>go()</code> sends it home instead of rendering a blank page.</p>
      </section>

      <section class="docs-section" id="params">
        <h2>Route parameters and query strings</h2>
        <p>The shipped table is exact-match only, which is all this site needs. When a route needs a value in the path — a user id, a product slug — match segment by segment. Segments starting with <code>:</code> capture:</p>
        <pre><code>// param-routes.js — patterns with :captures, checked before
// the exact table (or instead of it).
const paramRoutes = {
  "/users/:id":        () =&gt; import("./pages/user.js"),
  "/blog/:year/:slug": () =&gt; import("./pages/post.js"),
};

function matchParams(path) {
  const got = path.split("/").filter(Boolean);
  for (const pattern of Object.keys(paramRoutes)) {
    const want = pattern.split("/").filter(Boolean);
    if (want.length !== got.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i &lt; want.length; i++) {
      if (want[i].startsWith(":")) {
        params[want[i].slice(1)] = decodeURIComponent(got[i]);
      } else if (want[i] !== got[i]) { ok = false; break; }
    }
    if (ok) return { load: paramRoutes[pattern], params: params };
  }
  return null;
}

// In render(): const hit = matchParams(path);
// if (hit) { const page = await hit.load();
//             page.render(mount, hit.params); }</code></pre>
        <p>The page receives the captures as a plain object — <code>render(mount, { id: "42" })</code> for <code>/users/42</code>.</p>
        <p>Query strings need no router support at all; read them in the page:</p>
        <pre><code>// /search?q=carousel&amp;page=2
const query = new URLSearchParams(location.search);
const q = query.get("q") || "";
const page = Number(query.get("page") || "1");</code></pre>
        <p class="docs-note">Note: <code>go()</code> above keys the table on <code>location.pathname</code> only, so a link to <code>/search?q=x</code> still matches the <code>/search</code> route. If you intercept <code>data-link</code> clicks yourself, pass the anchor's <code>pathname</code> to the matcher and keep the full <code>href</code> for <code>pushState</code>.</p>
      </section>

      <section class="docs-section" id="guards">
        <h2>Redirects and guards</h2>
        <p>Both are one check inside <code>go()</code>, before the table lookup. A redirect map keeps old URLs alive when pages move:</p>
        <pre><code>const redirects = {
  "/home": "/",
  "/old-docs": "/docs",
  "/docs/nav-bar": "/docs/navigation-bar",
};

function go(path, push) {
  if (redirects[path]) path = redirects[path];
  const target = routes[path] ? path : "/";
  // …
}</code></pre>
        <p>A guard protects a section — send signed-out visitors to a login page instead of rendering:</p>
        <pre><code>function go(path, push) {
  const signedIn = Boolean(localStorage.getItem("session"));
  if (path.startsWith("/account") && !signedIn) {
    path = "/login";
  }
  // …table lookup as before
}</code></pre>
        <p>Keep guards synchronous and local. Anything that needs a server round-trip belongs in the page's own <code>render()</code>, which can navigate away once it knows.</p>
      </section>

      <section class="docs-section" id="not-found">
        <h2>A real 404 page</h2>
        <p>Falling back to <code>/</code> is this site's choice, not a law. If you would rather show a not-found page, point the fallback at a dedicated module instead:</p>
        <pre><code>function go(path, push) {
  const known = routes[path];
  const target = known ? path : "/404";
  if (push) history.pushState({ path: target }, "", path); // keep the bad URL visible
  return render(target);
}</code></pre>
        <p>Pushing the <em>requested</em> URL while rendering the 404 page keeps the address bar honest, so the user can see (and fix) the typo.</p>
      </section>

      <section class="docs-section" id="chrome">
        <h2>Title, scroll, and the active link</h2>
        <p>Three small jobs after every render. Title is in the router already. Scroll: the router scrolls the mount to the top (if your page scrolls the window instead, use <code>window.scrollTo(0, 0)</code>). Active nav: mark the link that matches the path — this site's version also lights up a parent destination when one of its secondary destinations is selected:</p>
        <pre><code>function syncNav(path) {
  document.querySelectorAll("a[data-link]").forEach(function (a) {
    if (a.getAttribute("href") === path) {
      a.setAttribute("selected", "");
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("selected");
      a.removeAttribute("aria-current");
    }
  });
}
// call syncNav(target) at the end of render()</code></pre>
      </section>

      <section class="docs-section" id="hash">
        <h2>The hash router — when you cannot configure the server</h2>
        <p>History routing needs the server fallback below. If you have <em>no</em> server control at all — a <code>file://</code> page, a locked-down host, an embedded webview — put the route in the fragment instead: <code>index.html#/docs/button</code>. Fragments are never sent to the server, so every URL is just <code>index.html</code> and nothing can 404. The cost is uglier URLs and no real paths for search engines or shared links to resolve server-side.</p>
        <pre><code>// hash-router.js — same route table, fragment edition.
import { routes } from "./routes.js";

const mount = document.querySelector("main");

async function render() {
  const path = location.hash.slice(1) || "/";   // "#/docs" -&gt; "/docs"
  const load = routes[path] || routes["/"];
  const page = await load();
  mount.innerHTML = "";
  await page.render(mount);
  document.title = page.title || "My site";
}

window.addEventListener("hashchange", render);
// Links are plain anchors: &lt;a href="#/docs"&gt;Docs&lt;/a&gt;
// No click interception, no pushState — the browser does it.
render();</code></pre>
      </section>

      <section class="docs-section" id="server">
        <h2>The server half: one rule, every stack</h2>
        <p>Without a fallback, <code>/docs/button</code> is a file path to your server — and there is no such file, so: 404. The fix is always the same sentence, translated:</p>
        <p class="docs-note"><strong>If the request matches a real file or folder, serve it. Otherwise serve index.html — as a rewrite (HTTP 200, URL unchanged), never as a redirect.</strong> A redirect to <code>/</code> throws the deep link away; a rewrite keeps the URL in the address bar, and the router reads it on boot and renders the right page.</p>
        <h3>Config files at a glance</h3>
        <ul class="docs-list">
          <li><strong>nginx</strong> — <code>nginx.conf</code> (or a file in <code>conf.d/</code>): <code>try_files</code></li>
          <li><strong>Apache</strong> — <code>.htaccess</code> in the web root, or <code>FallbackResource</code> in the virtual host</li>
          <li><strong>Caddy</strong> — <code>Caddyfile</code>: <code>try_files</code></li>
          <li><strong>lighttpd</strong> — <code>lighttpd.conf</code>: <code>url.rewrite-if-not-file</code></li>
          <li><strong>IIS (Windows)</strong> — <code>web.config</code> in the web root: a rewrite rule (XML)</li>
          <li><strong>Netlify</strong> — <code>_redirects</code> (plain text) or <code>netlify.toml</code> (TOML — the INI family)</li>
          <li><strong>Vercel</strong> — <code>vercel.json</code>: <code>rewrites</code></li>
          <li><strong>Cloudflare Pages</strong> — <code>_redirects</code>, or <code>wrangler.toml</code> with <code>not_found_handling</code></li>
          <li><strong>Firebase Hosting</strong> — <code>firebase.json</code>: <code>rewrites</code></li>
          <li><strong>GitHub Pages</strong> — no config exists; ship a <code>404.html</code> copy of <code>index.html</code></li>
          <li><strong>Node</strong> — Express <code>app.get("*", …)</code>, or a plain <code>http</code> server</li>
          <li><strong>Python</strong> — the included <code>serve.py</code>, a <code>router.ini</code>-driven variant, Flask, FastAPI, Django</li>
          <li><strong>PHP</strong> — <code>router.php</code> for the built-in server, <code>.htaccess</code> on Apache, a Laravel fallback route</li>
          <li><strong>Go</strong> — <code>net/http</code> handler that stats the file first</li>
          <li><strong>Rust</strong> — Axum with <code>ServeDir</code> + <code>ServeFile</code> fallback</li>
          <li><strong>Ruby</strong> — Rails: a catch-all route, last in <code>routes.rb</code></li>
          <li><strong>.NET</strong> — ASP.NET Core: <code>MapFallbackToFile("index.html")</code></li>
          <li><strong>Java</strong> — Spring Boot: a forwarding controller</li>
          <li><strong>Dev servers</strong> — Vite and webpack do it out of the box for development only</li>
        </ul>
        <p>Each stack's config is one button away, in <a href="#configs">Config files</a> just below.</p>
      </section>

      <section class="docs-section" id="configs">
        <h2>Config files</h2>
        <p>Every stack gets its own card, all at one level — no grouping, nothing stacked inside anything else. The pop-up is an M3 <strong>dialog</strong> — M3 has no separate &ldquo;modal&rdquo; component; the dialog <em>is</em> its modal surface, scrim and all. Pick your stack:</p>
        <div class="router-cfg-grid">
          <button type="button" class="router-cfg-card" data-cfg="nginx"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/nginx.svg" alt=""></span><span>nginx</span></button>
          <button type="button" class="router-cfg-card" data-cfg="apache"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/apache.svg" alt=""></span><span>Apache</span></button>
          <button type="button" class="router-cfg-card" data-cfg="caddy"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/caddy.svg" alt=""></span><span>Caddy</span></button>
          <button type="button" class="router-cfg-card" data-cfg="lighttpd"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/lighttpd.svg" alt=""></span><span>lighttpd</span></button>
          <button type="button" class="router-cfg-card" data-cfg="iis"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/iis.svg" alt=""></span><span>IIS</span></button>
          <button type="button" class="router-cfg-card" data-cfg="netlify"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/netlify.svg" alt=""></span><span>Netlify</span></button>
          <button type="button" class="router-cfg-card" data-cfg="vercel"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/vercel.svg" alt=""></span><span>Vercel</span></button>
          <button type="button" class="router-cfg-card" data-cfg="cloudflare"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/cloudflare.svg" alt=""></span><span>Cloudflare Pages</span></button>
          <button type="button" class="router-cfg-card" data-cfg="firebase"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/firebase.svg" alt=""></span><span>Firebase</span></button>
          <button type="button" class="router-cfg-card" data-cfg="github-pages"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/github.svg" alt=""></span><span>GitHub Pages</span></button>
          <button type="button" class="router-cfg-card" data-cfg="node"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/nodedotjs.svg" alt=""></span><span>Node.js</span></button>
          <button type="button" class="router-cfg-card" data-cfg="express"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/express.svg" alt=""></span><span>Express</span></button>
          <button type="button" class="router-cfg-card" data-cfg="python-serve"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/python.svg" alt=""></span><span>Python · serve.py</span></button>
          <button type="button" class="router-cfg-card" data-cfg="python-ini"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/python.svg" alt=""></span><span>Python · INI</span></button>
          <button type="button" class="router-cfg-card" data-cfg="flask"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/flask.svg" alt=""></span><span>Flask</span></button>
          <button type="button" class="router-cfg-card" data-cfg="fastapi"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/fastapi.svg" alt=""></span><span>FastAPI</span></button>
          <button type="button" class="router-cfg-card" data-cfg="django"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/django.svg" alt=""></span><span>Django</span></button>
          <button type="button" class="router-cfg-card" data-cfg="php"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/php.svg" alt=""></span><span>PHP</span></button>
          <button type="button" class="router-cfg-card" data-cfg="laravel"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/laravel.svg" alt=""></span><span>Laravel</span></button>
          <button type="button" class="router-cfg-card" data-cfg="go"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/go.svg" alt=""></span><span>Go</span></button>
          <button type="button" class="router-cfg-card" data-cfg="rust"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/rust.svg" alt=""></span><span>Rust</span></button>
          <button type="button" class="router-cfg-card" data-cfg="rails"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/rubyonrails.svg" alt=""></span><span>Rails</span></button>
          <button type="button" class="router-cfg-card" data-cfg="aspnet"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/dotnet.svg" alt=""></span><span>ASP.NET Core</span></button>
          <button type="button" class="router-cfg-card" data-cfg="spring"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/spring.svg" alt=""></span><span>Spring Boot</span></button>
          <button type="button" class="router-cfg-card" data-cfg="docker"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/docker.svg" alt=""></span><span>Docker</span></button>
          <button type="button" class="router-cfg-card" data-cfg="vite"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/vite.svg" alt=""></span><span>Vite</span></button>
          <button type="button" class="router-cfg-card" data-cfg="webpack"><span class="router-cfg-chip"><img class="router-cfg-logo" src="/assets/logos/webpack.svg" alt=""></span><span>webpack</span></button>
        </div>
        <p class="docs-note">Working copies of these files ship in <code>examples/router/</code> in this zip, so you can copy the folder for your stack instead of transcribing from here. Brand logos belong to their owners; they are here so you can spot your stack at a glance. (The lighttpd logo is by Phu, CC BY-SA; the IIS card carries the Microsoft logo, IIS having no standalone mark of its own.)</p>
      </section>

      <nmui-dialog class="router-dialog" id="cfg-nginx">
        <headline>nginx</headline>
        <p>This site's own config (<code>nginx.conf</code>, shipped in the zip). <code>try_files</code> checks the real file, then the folder, then falls back:</p>
        <pre><code>server {
    listen 80;
    root /usr/share/nginx/html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}</code></pre>
        <p>With an API on the same domain, proxy it <em>before</em> the fallback so API paths never return HTML:</p>
        <pre><code>    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-apache">
        <headline>Apache — .htaccess and virtual hosts</headline>
        <p>On shared hosting (DreamHost, cPanel, and friends) you cannot touch the server config — but you do not need to. Drop this <code>.htaccess</code> in the web root next to <code>index.html</code>; it is the whole setup:</p>
        <pre><code># .htaccess — SPA fallback (needs mod_rewrite, on by default
# on most shared hosts)
RewriteEngine On

# Serve real files and folders as-is…
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
# …everything else is a client-side route.
RewriteRule ^ index.html [L]</code></pre>
        <p>Deployed under a subfolder, say <code>example.com/app/</code>? Add one line after <code>RewriteEngine On</code>: <code>RewriteBase /app/</code>.</p>
        <p>If you do control the virtual host, Apache has a one-liner built for exactly this — no rewrite rules at all:</p>
        <pre><code>&lt;VirtualHost *:80&gt;
    ServerName example.com
    DocumentRoot /var/www/myapp

    # Any path that is not a real file gets index.html.
    FallbackResource /index.html
&lt;/VirtualHost&gt;</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-caddy">
        <headline>Caddy</headline>
        <p><code>Caddyfile</code> — Caddy's <code>try_files</code> matcher does the same dance, and HTTPS is automatic:</p>
        <pre><code>example.com {
    root * /var/www/myapp
    encode gzip
    try_files {path} {path}/ /index.html
    file_server
}</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-lighttpd">
        <headline>lighttpd</headline>
        <p><code>lighttpd.conf</code> — the directive's name is the rule, stated plainly:</p>
        <pre><code>server.document-root = "/var/www/myapp"
url.rewrite-if-not-file = ( "^(.*)$" =&gt; "/index.html" )</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-iis">
        <headline>IIS — web.config (Windows)</headline>
        <p>IIS reads a per-folder XML config, <code>web.config</code>. This rule (needs the URL Rewrite module, standard on Azure App Service and most Windows hosts) rewrites anything that is not a file or folder:</p>
        <pre><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;configuration&gt;
  &lt;system.webServer&gt;
    &lt;rewrite&gt;
      &lt;rules&gt;
        &lt;rule name="SPA fallback" stopProcessing="true"&gt;
          &lt;match url=".*" /&gt;
          &lt;conditions logicalGrouping="MatchAll"&gt;
            &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt;
            &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt;
          &lt;/conditions&gt;
          &lt;action type="Rewrite" url="/index.html" /&gt;
        &lt;/rule&gt;
      &lt;/rules&gt;
    &lt;/rewrite&gt;
  &lt;/system.webServer&gt;
&lt;/configuration&gt;</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-netlify">
        <headline>Netlify</headline>
<h3>Netlify — _redirects</h3>
        <p>A one-line plain-text file named <code>_redirects</code> in the publish folder. Status <code>200</code> is what makes it a rewrite, not a redirect:</p>
        <pre><code>/*    /index.html    200</code></pre>
<h3>Netlify — netlify.toml</h3>
        <p>The same rule in Netlify's TOML config (TOML is the INI format, formalized — sections in brackets, key = value):</p>
        <pre><code>[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-vercel">
        <headline>Vercel — vercel.json</headline>
        <p>Vercel checks the filesystem first, so real files win automatically and the rewrite only catches routes:</p>
        <pre><code>{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-cloudflare">
        <headline>Cloudflare Pages — _redirects or wrangler.toml</headline>
        <p>Same <code>_redirects</code> file as Netlify:</p>
        <pre><code>/*    /index.html    200</code></pre>
        <p>Or declare it in <code>wrangler.toml</code> (again TOML / INI-style) when deploying with Wrangler:</p>
        <pre><code>name = "myapp"
compatibility_date = "2024-06-01"

[assets]
directory = "."
not_found_handling = "single-page-application"</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-firebase">
        <headline>Firebase Hosting — firebase.json</headline>
        <pre><code>{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-github-pages">
        <headline>GitHub Pages — the 404.html trick</headline>
        <p>GitHub Pages offers no config file at all. What it does do: for any unknown path it serves your <code>404.html</code> (with a 404 status). So make <code>404.html</code> a copy of <code>index.html</code> — the router boots, reads the URL, and renders the right page anyway. This repo ships exactly that file:</p>
        <pre><code>cp index.html 404.html</code></pre>
        <p class="docs-note">The 404 status is cosmetic here — the page renders correctly — but it does mean GitHub Pages is the one host where deep links report 404 to crawlers and link checkers. Fine for docs and demos; pick a host with a real rewrite for production SEO.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-node">
        <headline>Plain Node — no dependencies</headline>
        <p>The same logic with only the standard library. The small MIME map matters: browsers refuse to run module scripts served without a JavaScript content type.</p>
        <pre><code>import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();
const types = {
  ".html": "text/html", ".js": "text/javascript",
  ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".json": "application/json",
};

createServer(async function (req, res) {
  let file = join(root, req.url.split("?")[0]);
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
  } catch {
    file = join(root, "index.html");    // not a file -&gt; route
  }
  res.setHeader("Content-Type",
    types[extname(file)] || "application/octet-stream");
  createReadStream(file).pipe(res);
}).listen(8080);</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-express">
        <headline>Express (server.js)</headline>
        <pre><code>import express from "express";
import path from "node:path";

const root = process.cwd();
const app = express();

app.use(express.static(root));          // real files first

// Everything else is a route. (Express 5 spells the
// wildcard "/*splat" instead of "*".)
app.get("*", function (req, res) {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(8080);</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-python-serve">
        <headline>Python — the included serve.py</headline>
        <p>This repo's dev server is stdlib-only Python: a <code>SimpleHTTPRequestHandler</code> whose <code>do_GET</code> checks whether the path exists and rewrites it to <code>/index.html</code> when it does not. Run it with <code>python3 serve.py</code>. It is in the zip — read it, it is 35 lines.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-python-ini">
        <headline>Python — driven by an INI file</headline>
        <p>Prefer config over code? Python's standard library reads classic INI — <code>[section]</code> headers, <code>key = value</code> pairs — via <code>configparser</code>, no install. A <code>router.ini</code>:</p>
        <pre><code>; router.ini — semicolons are comments in INI
[server]
host = 127.0.0.1
port = 8080

[site]
root = .
fallback = index.html</code></pre>
        <p>And the server that obeys it — the same fallback trick, with the port, root, and fallback page all coming from the INI file (<code>examples/router/python-ini/serve_ini.py</code> in the zip):</p>
        <pre><code>import configparser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

cfg = configparser.ConfigParser()
cfg.read("router.ini")
root = Path(cfg["site"]["root"]).resolve()
fallback = cfg["site"]["fallback"]

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        if path != "/" and not (root / path.lstrip("/")).exists():
            self.path = "/" + fallback + ("?" + query if query else "")
        return super().do_GET()

port = cfg.getint("server", "port")
ThreadingHTTPServer((cfg["server"]["host"], port), Handler).serve_forever()</code></pre>
        <p class="docs-note">INI shows up all over ops for the same reason it works here: PHP reads <code>php.ini</code>, systemd units and uWSGI (<code>uwsgi.ini</code>) are INI-shaped, and TOML (<code>netlify.toml</code>, <code>wrangler.toml</code>, <code>pyproject.toml</code>) is INI with a spec. If a tool asks you for a <code>.toml</code>, write it like the INI above and you are most of the way there.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-flask">
        <headline>Flask</headline>
        <p>Serve the folder as static at the root, and answer 404s with the app — Flask still returns your page with a 404 status unless you return 200 explicitly, so do:</p>
        <pre><code>import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder=".", static_url_path="")

@app.errorhandler(404)
def spa_fallback(error):
    return send_from_directory(".", "index.html"), 200</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-fastapi">
        <headline>FastAPI</headline>
        <pre><code>import os
from fastapi import FastAPI
from fastapi.responses import FileResponse

app = FastAPI()

# …declare your /api routes first — order matters…

@app.get("/{full_path:path}")
async def spa(full_path: str):
    candidate = os.path.join(".", full_path)
    if os.path.isfile(candidate):
        return FileResponse(candidate)
    return FileResponse("./index.html")</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-django">
        <headline>Django</headline>
        <p>Put the catch-all <em>last</em> in <code>urls.py</code>, after admin and API routes. Build the app into a template (or serve the folder with WhiteNoise and the same fallback view):</p>
        <pre><code># urls.py
from django.urls import path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    # …api routes…
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-php">
        <headline>PHP</headline>
<h3>Built-in server: router.php</h3>
        <p>PHP's dev server takes a router script. Returning <code>false</code> means "serve the file yourself"; anything else is a route, so the script answers with the app:</p>
        <pre><code>&lt;?php
// router.php — run: php -S localhost:8080 router.php
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$file = __DIR__ . $path;

if ($path !== "/" && is_file($file)) {
    return false;                    // real file — server serves it
}

readfile(__DIR__ . "/index.html");   // route — hand over the app</code></pre>
<h3>Apache / shared hosting</h3>
        <p>Nothing PHP-specific: the <code>.htaccess</code> from the Apache section above is the whole setup. To add a PHP API on the same domain, route <code>/api/</code> to it <em>before</em> the SPA rule:</p>
        <pre><code>RewriteEngine On
RewriteRule ^api/ api.php [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-laravel">
        <headline>Laravel</headline>
        <p>Build/copy the app into <code>public/</code> and add a fallback route last in <code>routes/web.php</code>:</p>
        <pre><code>Route::fallback(function () {
    return response()-&gt;file(public_path("index.html"));
});</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-go">
        <headline>Go — net/http, standard library only</headline>
        <pre><code>package main

import (
    "net/http"
    "os"
    "path/filepath"
)

func main() {
    root := "."
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        p := filepath.Join(root, r.URL.Path)
        info, err := os.Stat(p)
        if err != nil || info.IsDir() {
            // Not a file -&gt; client-side route.
            http.ServeFile(w, r, filepath.Join(root, "index.html"))
            return
        }
        http.ServeFile(w, r, p)
    })
    http.ListenAndServe(":8080", nil)
}</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-rust">
        <headline>Rust — Axum with tower-http</headline>
        <p><code>ServeDir</code> serves real files; its <code>fallback</code> is the file to answer with when nothing matches — the whole rule in one builder chain:</p>
        <pre><code>use axum::Router;
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    let app = Router::new().fallback_service(
        ServeDir::new(".")
            .fallback(ServeFile::new("index.html")),
    );
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await.unwrap();
    axum::serve(listener, app).await.unwrap();
}</code></pre>
        <p>Crates: <code>axum</code>, <code>tokio</code> (rt-multi-thread, macros), <code>tower-http</code> (fs feature).</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-rails">
        <headline>Ruby on Rails — config/routes.rb</headline>
        <p>The catch-all goes <em>last</em> and only answers browser page loads, so API and XHR traffic are untouched:</p>
        <pre><code># config/routes.rb — last entry in the file
get "*path", to: "spa#index",
    constraints: -&gt;(req) { !req.xhr? && req.format.html }</code></pre>
        <pre><code># app/controllers/spa_controller.rb
class SpaController &lt; ApplicationController
  def index
    render file: Rails.public_path.join("index.html"),
           layout: false, content_type: "text/html"
  end
end</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-aspnet">
        <headline>ASP.NET Core — Program.cs</headline>
        <p>The framework ships the rule as a named method. Order matters: fallback is registered after your API endpoints:</p>
        <pre><code>var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// app.MapControllers();  // …your API, first…

app.MapFallbackToFile("index.html");
app.Run();</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-spring">
        <headline>Spring Boot — a forwarding controller</headline>
        <p>Forward (do not redirect) every extension-less path to the app. Paths containing a dot are treated as files and left to the static resource handler:</p>
        <pre><code>@Controller
class SpaController {
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}</code></pre>
        <p class="docs-note">That pattern covers one path segment at the end; deep routes like <code>/docs/button</code> match because <code>**</code> covers the middle. Keep your <code>/api</code> controllers on more specific mappings — Spring prefers the most specific match, so they win.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-docker">
        <headline>Docker — this site's setup</headline>
        <p>nginx in a container, with the config from the nginx section baked in and the site copied next to it:</p>
        <pre><code># Dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html</code></pre>
        <pre><code># docker-compose.yml — dev version: bind-mount the folder
# into the container, so edits are live with no rebuilds.
services:
  nmui:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./:/usr/share/nginx/html:ro</code></pre>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-vite">
        <headline>Vite — development only</headline>
<p>Bundler dev servers already fall back, because SPA development would be impossible otherwise. Vite does it by default (<code>appType: "spa"</code> is the default) — there is nothing to configure.</p>
<p class="docs-note">This only covers the dev server. The day you deploy the built files to a real host, you are back to the config for that host, above.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <nmui-dialog class="router-dialog" id="cfg-webpack">
        <headline>webpack — development only</headline>
<p>Bundler dev servers already fall back, because SPA development would be impossible otherwise. webpack needs one flag:</p>
<pre><code>// webpack.config.js
devServer: {
  historyApiFallback: true,
}</code></pre>
<p class="docs-note">This only covers the dev server. The day you deploy the built files to a real host, you are back to the config for that host, above.</p>
        <actions>
          <nmui-button text data-close>Close</nmui-button>
        </actions>
      </nmui-dialog>

      <section class="docs-section" id="subpath">
        <h2>Deploying under a subpath</h2>
        <p>Everything above assumes the app owns the domain root. If it lives at <code>example.com/app/</code> instead:</p>
        <ul class="docs-list">
          <li>Apache: add <code>RewriteBase /app/</code> (shown in the Apache section). nginx: put the <code>try_files</code> in a <code>location /app/</code> block with the fallback as <code>/app/index.html</code>.</li>
          <li>Asset URLs: this site uses absolute paths (<code>/css/app.css</code>) because it owns its root. Under a subpath, prefix them (<code>/app/css/app.css</code>) or add <code>&lt;base href="/app/"&gt;</code> to <code>index.html</code> and use relative URLs.</li>
          <li>The router itself does not care — it reads whatever pathname the URL has — but your route table keys must include the prefix (<code>/app/docs</code>), or strip it once at boot: <code>path.replace(/^\\/app/, "") || "/"</code>.</li>
        </ul>
      </section>

      <section class="docs-section" id="checklist">
        <h2>Checklist — is my fallback right?</h2>
        <ul class="docs-list">
          <li>Open a deep link in a private window (<code>/docs/button</code> typed directly, not clicked). Right page, first try?</li>
          <li>Refresh on that deep link. Still the right page — not a 404, not the home page?</li>
          <li>Check the status in devtools' Network tab: the document request should be <strong>200</strong> (rewrite). A 301/302 means you wrote a redirect, and shared deep links will lose their path.</li>
          <li>Request a real asset (<code>/css/app.css</code>, an image, a JS module) — served as itself, with its real content type, not as HTML.</li>
          <li>Request a file that truly does not exist (e.g. <code>/favicon-typo.ico</code>). It will return <code>index.html</code> — that is the fallback doing its job, and why apps should not rely on 404s for missing assets.</li>
          <li>If you have an API on the same origin, hit one of its routes and confirm you get JSON, not the app shell.</li>
        </ul>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — router is an optional extra, not part of the M3 spec: <a href="https://m3.material.io/">m3.material.io</a></p>
    </footer>
  </div>`;

  // Live mini-router demo: the same go() shape as the real thing,
  // simulated against fake paths so it cannot hijack this page.
  const miniPages = {
    "/demo": "Home page — rendered by routes[\"/demo\"]",
    "/demo/docs": "Docs page — rendered by routes[\"/demo/docs\"]",
    "/demo/docs/button": "Button page — rendered by routes[\"/demo/docs/button\"]",
    "/demo/nope": null,
  };
  const view = mount.querySelector("#router-demo-view");
  const url = mount.querySelector("#router-demo-url");
  const log = mount.querySelector("#router-demo-log");
  const miniGo = (path) => {
    const target = miniPages[path] ? path : "/demo";
    url.textContent = target;
    view.textContent = miniPages[target];
    log.textContent +=
      "\npushState " + path +
      (target === path ? ", render " + target
                       : "  -> unknown, fell back to " + target);
  };
  mount.querySelectorAll("[data-mini]").forEach((btn) => {
    btn.addEventListener("click", () => miniGo(btn.getAttribute("data-mini")));
  });

  // Config-file dialogs: each tile button opens its stack's dialog.
  mount.querySelectorAll("[data-cfg]").forEach((btn) => {
    const dialog = mount.querySelector("#cfg-" + btn.getAttribute("data-cfg"));
    btn.addEventListener("click", () => dialog?.show());
  });
}
