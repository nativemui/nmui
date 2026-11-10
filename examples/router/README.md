# Router examples — SPA fallback for every stack

The rule behind every file here: **serve real files, and answer every
other path with `index.html` as a rewrite (HTTP 200, URL unchanged)** —
never a redirect. The client-side router then reads the URL on boot and
renders the right page. Set this up once; it covers every route you
ever add.

Full guide with explanations: the **Router** page in the demo app
(`/docs/router`).

| Folder | Stack | File(s) |
| --- | --- | --- |
| `router.js` + `routes.example.js` | Browser | The standalone router used by this site |
| `nginx/` | nginx | `nginx.conf` — `try_files` |
| `apache/` | Apache / shared hosting | `.htaccess`, `vhost.conf` (`FallbackResource`) |
| `caddy/` | Caddy | `Caddyfile` |
| `lighttpd/` | lighttpd | `lighttpd.conf` |
| `iis/` | IIS / Azure App Service (Windows) | `web.config` |
| `netlify/` | Netlify | `_redirects`, `netlify.toml` |
| `vercel/` | Vercel | `vercel.json` |
| `cloudflare-pages/` | Cloudflare Pages | `_redirects`, `wrangler.toml` |
| `firebase/` | Firebase Hosting | `firebase.json` |
| `github-pages/` | GitHub Pages | the `404.html` trick (see its README) |
| `node/` | Node | Express server, plain-`http` server |
| `python-ini/` | Python, config-driven | `router.ini` + `serve_ini.py` (stdlib `configparser`) |
| `flask/` | Flask | `app.py` |
| `fastapi/` | FastAPI | `main.py` |
| `django/` | Django | `urls.py` fragment (catch-all last) |
| `php/` | PHP | `router.php` (built-in server), API `.htaccess` |
| `laravel/` | Laravel | `web.php` fragment (`Route::fallback`) |
| `go/` | Go | `main.go` (stdlib only) |
| `rust-axum/` | Rust / Axum | `main.rs`, `Cargo.toml` |
| `rails/` | Ruby on Rails | `routes.rb` + controller fragments |
| `aspnet-core/` | ASP.NET Core | `Program.cs` fragment (`MapFallbackToFile`) |
| `spring/` | Spring Boot | `SpaController.java` |
| `docker/` | Docker | `Dockerfile` + `docker-compose.yml` (nginx) |
| `dev-servers/` | Vite / webpack | dev-only fallback notes |

Snippets marked "fragment" are the relevant lines to merge into the
file that already exists in that framework's project — they are not
whole projects.
