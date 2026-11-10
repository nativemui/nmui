const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Live demo + its code from one source of truth: the markup renders AND
   prints, so docs code can never drift from docs output.
   Usage: ${demo(btn("elevated", "Elevated"))} */
export function demo(html) {
  return `<div class="docs-demo">${html}</div>\n<pre><code>${esc(html)}</code></pre>`;
}

/* Events reference table: one row per event —
   [name, attach it to, detail / what to read, when it fires].
   Every component's Events section uses this, so the format is
   the same everywhere you look. */
export function evTable(rows) {
  const body = rows
    .map(
      (r) =>
        `<tr><td><code>${esc(r[0])}</code></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`
    )
    .join("\n");
  return `<table class="docs-evtable"><thead><tr><th>Event</th><th>Attach to</th><th>detail / read</th><th>When</th></tr></thead><tbody>\n${body}\n</tbody></table>`;
}

/* Shorthand for button demos. */
export function btn(attrs, label) {
  return `<nmui-button${attrs ? " " + attrs : ""}>${label}</nmui-button>`;
}

export { esc };
