# GitHub Pages — the 404.html trick

GitHub Pages has **no config file** — no rewrites, no fallback setting.
What it does do: for any unknown path it serves your `404.html` (with a
404 status). So make `404.html` a copy of `index.html`:

```sh
cp index.html 404.html
```

The router boots from `404.html`, reads the URL, and renders the right
page. The nmui repo root already ships exactly this file.

Caveat: deep links report a 404 status to crawlers and link checkers
even though the page renders fine. Fine for docs and demos; use a host
with a real rewrite (any other folder here) for production SEO.
