import docsStyles from "../docs.css" with { type: "css" };
import { nav } from "../nav.js";

if (!document.adoptedStyleSheets.includes(docsStyles)) {
  document.adoptedStyleSheets.push(docsStyles);
}

export const title = "Theming — nmui docs";

/* Theming tool — a working theme editor, not a demo. nmui themes are
   nothing but CSS variables under a [theme="…"] selector, so the tool
   edits the variables directly: controls on the left, a live preview
   of real components in the middle, and the safety checks (WCAG
   contrast + an alarm-color guard) always visible at the top.
   Export writes exactly the file nmui already knows how to load;
   import reads one back. Color math is hand-rolled below — hex/rgb/
   hsl, luminance, contrast, hue — no color library, per the house
   rules. */

// -- color plumbing (hand-rolled) -------------------------------------------

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const c = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

const isHex = (v) => !!hexToRgb(v);

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

// WCAG 2.x relative luminance + contrast ratio.
function luminance({ r, g, b }) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(hexA, hexB) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  if (!a || !b) return 0;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const mixHex = (hexA, hexB, t) => {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
};

const bestOn = (bg) =>
  contrast("#000000", bg) >= contrast("#ffffff", bg) ? "#000000" : "#ffffff";

// -- the tokens the tool edits ----------------------------------------------
// The full color-role set of the shipped themes (themes/light.css and
// dark.css), grouped the way the roles group. background / on-background
// ride along with surface / on-surface — the two pairs carry the same
// values in both shipped themes and components read them as one surface
// story; the export still writes all four roles.

const GROUPS = [
  ["Primary", [
    ["primary", "Primary"], ["on-primary", "On primary"],
    ["primary-container", "Primary container"],
    ["on-primary-container", "On primary container"],
  ]],
  ["Secondary", [
    ["secondary", "Secondary"], ["on-secondary", "On secondary"],
    ["secondary-container", "Secondary container"],
    ["on-secondary-container", "On secondary container"],
  ]],
  ["Tertiary", [
    ["tertiary", "Tertiary"], ["on-tertiary", "On tertiary"],
    ["tertiary-container", "Tertiary container"],
    ["on-tertiary-container", "On tertiary container"],
  ]],
  ["Error — the alarm color", [
    ["error", "Error"], ["on-error", "On error"],
    ["error-container", "Error container"],
    ["on-error-container", "On error container"],
  ]],
  ["Surfaces", [
    ["surface", "Surface"], ["on-surface", "On surface"],
    ["on-surface-variant", "On surface variant"],
    ["surface-variant", "Surface variant"],
    ["surface-container-lowest", "Container lowest"],
    ["surface-container-low", "Container low"],
    ["surface-container", "Container"],
    ["surface-container-high", "Container high"],
    ["surface-container-highest", "Container highest"],
  ]],
  ["Inverse & lines", [
    ["inverse-surface", "Inverse surface"],
    ["inverse-on-surface", "Inverse on surface"],
    ["inverse-primary", "Inverse primary"],
    ["outline", "Outline"], ["outline-variant", "Outline variant"],
  ]],
];

const SHAPES = [
  ["extra-small", "Extra small"], ["small", "Small"], ["medium", "Medium"],
  ["large", "Large"], ["extra-large", "Extra large"],
];
const NS_SHAPES = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 };
const shapeBase = (work, key) =>
  key === "none" || key === "full" ? work.shape[key] : parseFloat(work.shape[key]);

const scheme = (o) => ({
  "primary": o[0], "on-primary": o[1], "primary-container": o[2], "on-primary-container": o[3],
  "secondary": o[4], "on-secondary": o[5], "secondary-container": o[6], "on-secondary-container": o[7],
  "tertiary": o[8], "on-tertiary": o[9], "tertiary-container": o[10], "on-tertiary-container": o[11],
  "error": o[12], "on-error": o[13], "error-container": o[14], "on-error-container": o[15],
  "surface": o[16], "on-surface": o[17], "surface-variant": o[18], "on-surface-variant": o[19],
  "surface-container-lowest": o[20], "surface-container-low": o[21], "surface-container": o[22],
  "surface-container-high": o[23], "surface-container-highest": o[24],
  "inverse-surface": o[25], "inverse-on-surface": o[26], "inverse-primary": o[27],
  "outline": o[28], "outline-variant": o[29],
});

const M3_SHAPE = {
  "none": "0", "extra-small": "4px", "small": "8px", "medium": "12px",
  "large": "16px", "extra-large": "28px", "full": "999px",
};

const PRESETS = {
  light: {
    label: "NMUI Light", themeName: "NMUI Light",
    colors: scheme(["#6750a4", "#ffffff", "#eaddff", "#4f378b",
      "#625b71", "#ffffff", "#e8def8", "#4a4458",
      "#7d5260", "#ffffff", "#ffd8e4", "#633b48",
      "#b3261e", "#ffffff", "#f9dedc", "#8c1d18",
      "#fffbfe", "#1c1b1f", "#e7e0ec", "#49454f",
      "#ffffff", "#f7f2fa", "#f3edf7", "#ece6f0", "#e6e0e9",
      "#322f35", "#f5eff7", "#d0bcff", "#79747e", "#cac4d0"]),
    shape: { ...M3_SHAPE },
  },
  dark: {
    label: "NMUI Dark", themeName: "NMUI Dark",
    colors: scheme(["#d0bcff", "#381e72", "#4f378b", "#eaddff",
      "#ccc2dc", "#332d41", "#4a4458", "#e8def8",
      "#efb8c8", "#492532", "#633b48", "#ffd8e4",
      "#f2b8b5", "#601410", "#8c1d18", "#f9dedc",
      "#1c1b1f", "#e6e0e9", "#49454f", "#cac4d0",
      "#0f0d13", "#1d1b20", "#211f26", "#2b2930", "#36343b",
      "#e6e0e9", "#322f35", "#6750a4", "#938f99", "#49454f"]),
    shape: { ...M3_SHAPE },
  },
  industrial: {
    label: "Industrial Dark", themeName: "Industrial Dark",
    colors: scheme(["#7dd3fc", "#082f49", "#0c4a6e", "#e0f2fe",
      "#94a3b8", "#0f172a", "#1e293b", "#e2e8f0",
      "#fbbf24", "#451a03", "#713f12", "#fef3c7",
      "#f87171", "#450a0a", "#7f1d1d", "#fecaca",
      "#111827", "#f3f4f6", "#1f2937", "#d1d5db",
      "#030712", "#0b1220", "#111827", "#1f2937", "#374151",
      "#e5e7eb", "#111827", "#38bdf8", "#6b7280", "#374151"]),
    shape: { "none": "0", "extra-small": "2px", "small": "4px", "medium": "6px",
      "large": "8px", "extra-large": "12px", "full": "999px" },
  },
  contrast: {
    label: "High Contrast", themeName: "High Contrast",
    colors: scheme(["#0000cc", "#ffffff", "#0000cc", "#ffffff",
      "#333333", "#ffffff", "#e0e0e0", "#000000",
      "#006600", "#ffffff", "#ccffcc", "#003300",
      "#b30000", "#ffffff", "#ffcccc", "#660000",
      "#ffffff", "#000000", "#e0e0e0", "#000000",
      "#ffffff", "#ffffff", "#f0f0f0", "#e0e0e0", "#cccccc",
      "#000000", "#ffffff", "#ffff00", "#000000", "#666666"]),
    shape: { ...M3_SHAPE },
  },
};

// The alarm guard: error must read as RED. Red lives at hue 345–360 /
// 0–20; anything past that (orange starts ~21) is out of family. A
// nearly-grey error can't read as an alarm color either.
const RED_MAX = 20, RED_MIN = 345, ALARM_MIN_SAT = 25;
function alarmCheck(hex) {
  const { h, s } = rgbToHsl(hexToRgb(hex));
  const hueOk = h <= RED_MAX || h >= RED_MIN;
  return { h: Math.round(h), s: Math.round(s), hueOk, ok: hueOk && s >= ALARM_MIN_SAT };
}

// Contrast pairs the panel checks live — the pairs a person actually
// has to read. min is the WCAG AA bar for that pair's job.
const PAIRS = [
  ["on-surface", "surface", "Body text", 4.5],
  ["on-surface-variant", "surface", "Secondary text", 4.5],
  ["on-surface", "surface-container", "Text on containers", 4.5],
  ["on-primary", "primary", "Button labels", 4.5],
  ["on-primary-container", "primary-container", "On primary container", 4.5],
  ["on-secondary-container", "secondary-container", "Chips, selection", 4.5],
  ["on-error", "error", "On error", 4.5],
  ["error", "surface", "Alarm text", 4.5],
  ["primary", "surface", "Links, accents", 3.0],
  ["outline", "surface", "Control borders (UI)", 3.0],
];

const slugify = (name) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "custom";

const clone = (o) => JSON.parse(JSON.stringify(o));

// -- the page -----------------------------------------------------------------

export function render(mount, nmui) {
  let work = clone(PRESETS.light);
  work.name = "NMUI Light";
  let applyApp = true;

  mount.innerHTML = `
  <div class="docs">
    ${nav("/docs/theming")}
    <header class="docs-header">
      <h1>Theming tool</h1>
      <p>Build an nmui theme and export it as one CSS file. A theme is just a block of <code>--md-sys-*</code> variables under a <code>[theme="…"]</code> selector — this tool edits the variables, previews real components live, checks the result for contrast and alarm-color safety, and writes the file nmui already knows how to load.</p>
    </header>

    <main>
      <section class="docs-section">
        <h2>Safety checks</h2>
        <p>Checked live, on purpose, before anything else on the page. Contrast is WCAG: normal text needs <strong>4.5:1</strong>, large text and UI boundaries <strong>3:1</strong>. And the error color is semantic — in a control room, red means <em>alarm</em>. Drift it out of the red family and this panel says so, and the warning travels into the exported file.</p>
        <div class="theme-alarm" id="th-alarm" hidden></div>
        <div class="theme-contrast" id="th-contrast"></div>
      </section>

      <section class="docs-section">
        <h2>Presets</h2>
        <div class="docs-row" id="th-presets">
          <nmui-button tonal data-preset="light">NMUI Light</nmui-button>
          <nmui-button tonal data-preset="dark">NMUI Dark</nmui-button>
          <nmui-button tonal data-preset="industrial">Industrial Dark</nmui-button>
          <nmui-button tonal data-preset="contrast">High Contrast</nmui-button>
        </div>
        <p class="docs-note">Industrial Dark is the OT console theme: charcoal surfaces, a restrained steel-blue primary, amber tertiary, squarer corners — and the error stays red, because on a console red is not a brand color.</p>
      </section>

      <section class="docs-section">
        <h2>Colors</h2>
        <p>Every role from the shipped themes. The swatch and the hex field stay in sync; the derivations fill in the partners you haven't touched — an on-color picks black or white by contrast, a container mixes its color over the surface.</p>
        <div class="docs-row">
          <nmui-button outlined id="th-derive">Derive on-colors &amp; containers</nmui-button>
          <nmui-switch id="th-applyapp"><input type="checkbox" checked>Apply to this app, not just the preview</nmui-switch>
        </div>
        <div id="th-groups"></div>
      </section>

      <section class="docs-section">
        <h2>Shape</h2>
        <p>The corner scale. <code>none</code> and <code>full</code> are fixed (0 and the pill); the five steps between them are yours. Industrial themes pull the scale down; expressive ones push it up.</p>
        <div id="th-shapes"></div>
      </section>

      <section class="docs-section">
        <h2>Preview</h2>
        <div class="theme-preview" id="th-preview">
          <nmui-app-bar>
            <nmui-button icon standard>menu</nmui-button>
            <headline>Console</headline>
            <nmui-button icon standard>search</nmui-button>
            <nmui-badge>3<nmui-button icon standard>notifications</nmui-button></nmui-badge>
          </nmui-app-bar>
          <div class="theme-preview-body">
            <div class="docs-row">
              <nmui-button>Filled</nmui-button>
              <nmui-button tonal>Tonal</nmui-button>
              <nmui-button outlined>Outlined</nmui-button>
              <nmui-button text>Text</nmui-button>
              <nmui-button elevated>Elevated</nmui-button>
              <nmui-button fab><icon>add</icon></nmui-button>
            </div>
            <div class="docs-row">
              <nmui-chip filter selected>Alarms</nmui-chip>
              <nmui-chip filter>Warnings</nmui-chip>
              <nmui-chip assist><icon>bolt</icon>Live feed</nmui-chip>
              <nmui-chip input>Zone 3<icon>close</icon></nmui-chip>
            </div>
            <nmui-card>
              <headline small>Unit 7 — compressor</headline>
              <p>Running inside its envelope. Last alarm cleared 06:12.</p>
              <div class="docs-row">
                <nmui-checkbox><input type="checkbox" checked>Monitor</nmui-checkbox>
                <nmui-switch icons><input type="checkbox" checked>Feed</nmui-switch>
              </div>
            </nmui-card>
            <nmui-card outlined>
              <headline small>Alarm queue</headline>
              <p>Pressure drift on line 2 — inside tolerance, watching.</p>
            </nmui-card>
            <nmui-navigation bar>
              <a href="#" selected><icon>dashboard</icon>Overview</a>
              <a href="#"><icon>warning</icon>Alarms</a>
              <a href="#"><icon>settings</icon>Settings</a>
            </nmui-navigation>
          </div>
        </div>
      </section>

      <section class="docs-section">
        <h2>Export &amp; import</h2>
        <p>The export is the whole theme — every role, not just the ones you changed — so the file stands on its own. Drop it in <code>css/themes/</code>, import it from <code>themes.css</code>, and set <code>&lt;html theme="…"&gt;</code> to the name below. If the alarm check is flagging, the warning is written into the file's header — it exports anyway; it's your theme.</p>
        <div class="theme-export-row">
          <label class="theme-name">Theme name <input type="text" id="th-name" value="NMUI Light"></label>
          <nmui-button id="th-download">Download .css</nmui-button>
          <nmui-button outlined id="th-copy">Copy CSS</nmui-button>
          <label class="theme-file">Load a theme file <input type="file" id="th-file" accept=".css,text/css"></label>
        </div>
        <p class="theme-status" id="th-status" role="status"></p>
        <pre><code id="th-css"></code></pre>
      </section>
    </main>

    <footer class="docs-footer">
      <p>nmui — theming: one attribute, one CSS file. <a href="https://m3.material.io/styles/color/system/overview">M3 color roles</a></p>
    </footer>
  </div>`;

  // Scoped styles live in docs.css like the other page-specific demos;
  // the few one-offs that must win over the app theme (the preview's
  // own background) are set from JS with the working variables.

  const $ = (sel) => mount.querySelector(sel);
  const preview = $("#th-preview");
  const rootEl = document.documentElement;
  const touched = new Set();

  // -- control rows -----------------------------------------------------

  const groupsEl = $("#th-groups");
  GROUPS.forEach(([gname, roles]) => {
    const h = document.createElement("h3");
    h.textContent = gname;
    groupsEl.appendChild(h);
    const wrap = document.createElement("div");
    wrap.className = "theme-roles";
    roles.forEach(([key, label]) => {
      const row = document.createElement("div");
      row.className = "theme-role";
      row.dataset.role = key;
      row.innerHTML = `
        <span class="theme-role-name">${label}</span>
        <input type="color" class="theme-swatch" data-key="${key}" aria-label="${label} color">
        <input type="text" class="theme-hex" data-key="${key}" aria-label="${label} hex" spellcheck="false">
        <span class="theme-touched" title="Edited from the loaded preset">●</span>`;
      wrap.appendChild(row);
    });
    groupsEl.appendChild(wrap);
  });

  const shapesEl = $("#th-shapes");
  const shapeWrap = document.createElement("div");
  shapeWrap.className = "theme-roles";
  SHAPES.forEach(([key, label]) => {
    const row = document.createElement("div");
    row.className = "theme-role";
    row.innerHTML = `
      <span class="theme-role-name">${label}</span>
      <input type="range" class="theme-range" data-shape="${key}" min="0" max="40" step="1" aria-label="${label} corner">
      <input type="text" class="theme-hex theme-px" data-shape="${key}" aria-label="${label} corner in pixels" spellcheck="false">`;
    shapeWrap.appendChild(row);
  });
  shapesEl.appendChild(shapeWrap);

  // -- painting -----------------------------------------------------------

  function applyVars(el, prefix) {
    if (!el) return;
    for (const [key, v] of Object.entries(work.colors)) {
      el.style.setProperty(`--md-sys-color-${key}`, v);
    }
    el.style.setProperty("--md-sys-color-background", work.colors.surface);
    el.style.setProperty("--md-sys-color-on-background", work.colors["on-surface"]);
    el.style.setProperty("--md-sys-color-shadow", "#000000");
    el.style.setProperty("--md-sys-color-scrim", "#000000");
    for (const [key, v] of Object.entries(work.shape)) {
      el.style.setProperty(`--md-sys-shape-corner-${key}`, v);
    }
    if (prefix === "app") el.dataset.nmuiThemeTool = "";
  }

  function clearVars(el) {
    if (!el) return;
    [...el.style].forEach((prop) => {
      if (prop.startsWith("--md-sys-")) el.style.removeProperty(prop);
    });
  }

  // -- readouts -----------------------------------------------------------

  function buildCss() {
    const name = $("#th-name").value || "Custom theme";
    const slug = slugify(name);
    const alarm = alarmCheck(work.colors.error);
    const lines = [];
    lines.push(`/* ${name} — an nmui theme.`);
    lines.push(`   Generated with the nmui theming tool.`);
    lines.push(`   Use it: drop this file in css/themes/, @import it from`);
    lines.push(`   css/themes.css, then set <html theme="${slug}">.`);
    if (!alarm.ok) {
      lines.push(``);
      lines.push(`   ⚠ ALARM COLOR WARNING: --md-sys-color-error is ${work.colors.error}`);
      lines.push(`   (hue ${alarm.h}°, saturation ${alarm.s}%), which does NOT read as red.`);
      lines.push(`   In control-room and industrial UIs, red means ALARM — operators`);
      lines.push(`   are trained to spot it instantly. If this theme drives anything`);
      lines.push(`   safety-adjacent, keep error inside the red family`);
      lines.push(`   (hue 345–360° or 0–20°, saturation ≥ ${ALARM_MIN_SAT}%).`);
    }
    const fails = PAIRS
      .map(([fg, bg, label, min]) => ({ label, min, r: contrast(work.colors[fg], work.colors[bg]) }))
      .filter((p) => p.r < p.min);
    if (fails.length) {
      lines.push(``);
      lines.push(`   ⚠ CONTRAST: ${fails.length} checked pair(s) below WCAG AA at export:`);
      fails.forEach((p) => lines.push(`     - ${p.label}: ${p.r.toFixed(2)}:1 (needs ${p.min}:1)`));
    }
    lines.push(`*/`);
    lines.push(``);
    lines.push(`:root[theme="${slug}"] {`);
    for (const [key, v] of Object.entries(work.colors)) {
      lines.push(`  --md-sys-color-${key}: ${v};`);
    }
    lines.push(`  --md-sys-color-background: ${work.colors.surface};`);
    lines.push(`  --md-sys-color-on-background: ${work.colors["on-surface"]};`);
    lines.push(`  --md-sys-color-shadow: #000000;`);
    lines.push(`  --md-sys-color-scrim: #000000;`);
    for (const [key, v] of Object.entries(work.shape)) {
      lines.push(`  --md-sys-shape-corner-${key}: ${v};`);
    }
    lines.push(`}`);
    return { css: lines.join("\n"), slug, alarm };
  }

  function updateContrast() {
    const box = $("#th-contrast");
    box.innerHTML = PAIRS.map(([fg, bg, label, min]) => {
      const r = contrast(work.colors[fg], work.colors[bg]);
      const state = r >= min ? "pass" : r >= 3 ? "warn" : "fail";
      const word = r >= min ? "PASS" : r >= 3 ? "LARGE TEXT ONLY" : "FAIL";
      const fgHex = work.colors[fg], bgHex = work.colors[bg];
      return `<div class="theme-pair" data-state="${state}">
        <span class="theme-pair-chip" style="background:${bgHex};color:${fgHex}">Ag</span>
        <span class="theme-pair-name">${label}<small>${fgHex} on ${bgHex}</small></span>
        <span class="theme-pair-ratio">${r.toFixed(2)}:1</span>
        <span class="theme-pair-badge">${word}</span>
      </div>`;
    }).join("");

    const alarm = alarmCheck(work.colors.error);
    const alarmEl = $("#th-alarm");
    if (alarm.ok) {
      alarmEl.hidden = true;
      alarmEl.innerHTML = "";
    } else {
      alarmEl.hidden = false;
      alarmEl.innerHTML = `
        <strong>⚠ Alarm color warning.</strong>
        The error color is <strong>${work.colors.error}</strong> — hue ${alarm.h}°, saturation ${alarm.s}%.
        ${!alarm.hueOk
          ? `That hue is outside the red family (345–360° / 0–${RED_MAX}°), so it no longer reads as red.`
          : `The hue is red, but at ${alarm.s}% saturation it reads as grey — an alarm nobody notices.`}
        In control-room and industrial interfaces, red means <em>alarm</em>: it's the color operators
        are trained to catch out of the corner of an eye. Moving it is allowed — this is your theme —
        but it is never silent: this warning is written into the exported file's header.`;
    }
  }

  function updateOutputs() {
    $("#th-css").textContent = buildCss().css;
  }

  function paint() {
    applyVars(preview, "preview");
    if (applyApp) applyVars(rootEl, "app");
    else if (rootEl.dataset.nmuiThemeTool !== undefined) {
      clearVars(rootEl);
      delete rootEl.dataset.nmuiThemeTool;
    }
    updateContrast();
    updateOutputs();
  }

  // -- control sync ---------------------------------------------------------

  function syncControls() {
    mount.querySelectorAll(".theme-swatch").forEach((el) => {
      el.value = work.colors[el.dataset.key];
    });
    mount.querySelectorAll(".theme-hex[data-key]").forEach((el) => {
      el.value = work.colors[el.dataset.key];
    });
    mount.querySelectorAll(".theme-range").forEach((el) => {
      el.value = shapeBase(work, el.dataset.shape);
    });
    mount.querySelectorAll(".theme-px").forEach((el) => {
      el.value = work.shape[el.dataset.shape];
    });
    mount.querySelectorAll(".theme-role").forEach((row) => {
      row.classList.toggle("is-touched", touched.has(row.dataset.role));
    });
  }

  function setColor(key, hex, fromControl) {
    if (!isHex(hex)) return;
    work.colors[key] = hex.toLowerCase();
    touched.add(key);
    if (fromControl !== "swatch") {
      const sw = mount.querySelector(`.theme-swatch[data-key="${key}"]`);
      if (sw) sw.value = work.colors[key];
    }
    if (fromControl !== "hex") {
      const hx = mount.querySelector(`.theme-hex[data-key="${key}"]`);
      if (hx) hx.value = work.colors[key];
    }
    const row = mount.querySelector(`.theme-role[data-role="${key}"]`);
    row?.classList.add("is-touched");
    paint();
  }

  mount.querySelectorAll(".theme-swatch").forEach((el) => {
    el.addEventListener("input", () => setColor(el.dataset.key, el.value, "swatch"));
  });
  mount.querySelectorAll(".theme-hex[data-key]").forEach((el) => {
    el.addEventListener("input", () => {
      if (isHex(el.value)) setColor(el.dataset.key, el.value, "hex");
    });
    el.addEventListener("change", () => {
      if (!isHex(el.value)) el.value = work.colors[el.dataset.key];
    });
  });

  function setShape(key, px, fromControl) {
    const v = clamp(Math.round(px) || 0, 0, 999);
    work.shape[key] = `${v}px`;
    if (fromControl !== "range") {
      const rg = mount.querySelector(`.theme-range[data-shape="${key}"]`);
      if (rg) rg.value = Math.min(40, v);
    }
    if (fromControl !== "px") {
      const tx = mount.querySelector(`.theme-px[data-shape="${key}"]`);
      if (tx) tx.value = work.shape[key];
    }
    paint();
  }

  mount.querySelectorAll(".theme-range").forEach((el) => {
    el.addEventListener("input", () => setShape(el.dataset.shape, Number(el.value), "range"));
  });
  mount.querySelectorAll(".theme-px").forEach((el) => {
    el.addEventListener("input", () => {
      const n = parseFloat(el.value);
      if (!Number.isNaN(n)) setShape(el.dataset.shape, n, "px");
    });
    el.addEventListener("change", () => {
      el.value = work.shape[el.dataset.shape];
    });
  });

  // -- presets ---------------------------------------------------------------

  function loadPreset(p, name) {
    work = clone(p);
    work.name = name ?? p.themeName;
    touched.clear();
    $("#th-name").value = work.name;
    syncControls();
    paint();
    status(`Loaded ${p.label}.`);
  }

  mount.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => loadPreset(PRESETS[btn.dataset.preset]));
  });

  // -- derivations -------------------------------------------------------------

  $("#th-derive").addEventListener("click", () => {
    const c = work.colors;
    const derived = (key, v) => {
      if (!touched.has(key)) work.colors[key] = v;
    };
    derived("on-primary", bestOn(c.primary));
    derived("primary-container", mixHex(c.primary, c.surface, 0.82));
    derived("on-primary-container", bestOn(mixHex(c.primary, c.surface, 0.82)));
    derived("on-secondary", bestOn(c.secondary));
    derived("secondary-container", mixHex(c.secondary, c.surface, 0.82));
    derived("on-secondary-container", bestOn(mixHex(c.secondary, c.surface, 0.82)));
    derived("on-tertiary", bestOn(c.tertiary));
    derived("tertiary-container", mixHex(c.tertiary, c.surface, 0.82));
    derived("on-tertiary-container", bestOn(mixHex(c.tertiary, c.surface, 0.82)));
    derived("on-error", bestOn(c.error));
    derived("error-container", mixHex(c.error, c.surface, 0.85));
    derived("on-error-container", bestOn(mixHex(c.error, c.surface, 0.85)));
    derived("inverse-surface", c["on-surface"]);
    derived("inverse-on-surface", c.surface);
    derived("inverse-primary", mixHex(c.primary, c.surface, 0.45));
    syncControls();
    paint();
    status("Derived the untouched partners. Anything you edited yourself was left alone.");
  });

  // -- app-wide toggle ------------------------------------------------------------

  $("#th-applyapp").addEventListener("change", () => {
    const input = $("#th-applyapp").querySelector("input");
    applyApp = input.checked;
    paint();
  });

  // The router owns <main>; leaving the page must hand the app back.
  new MutationObserver(() => {
    if (!mount.isConnected && rootEl.dataset.nmuiThemeTool !== undefined) {
      clearVars(rootEl);
      delete rootEl.dataset.nmuiThemeTool;
    }
  }).observe(document.body, { childList: true, subtree: true });

  // -- export / import ----------------------------------------------------------------

  const status = (msg) => {
    $("#th-status").textContent = msg;
  };

  $("#th-name").addEventListener("input", updateOutputs);

  $("#th-download").addEventListener("click", () => {
    const { css, slug, alarm } = buildCss();
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${slug}.css`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status(
      `Downloaded theme-${slug}.css.` +
      (!alarm.ok ? " Heads up: it carries the alarm-color warning in its header." : "")
    );
  });

  $("#th-copy").addEventListener("click", async () => {
    const { css } = buildCss();
    try {
      await navigator.clipboard.writeText(css);
      status("Theme CSS copied to the clipboard.");
    } catch (e) {
      status("Clipboard blocked by the browser — the CSS is in the box below, ready to select and copy.");
    }
  });

  $("#th-file").addEventListener("change", async () => {
    const file = $("#th-file").files?.[0];
    if (!file) return;
    const text = await file.text();
    let found = 0;
    const next = clone(work);
    const re = /--md-sys-(color|shape-corner)-([a-z-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(text))) {
      const [, kind, key, raw] = m;
      const v = raw.trim();
      if (kind === "color") {
        if (key === "background") { next.colors.surface = isHex(v) ? v.toLowerCase() : next.colors.surface; if (isHex(v)) found++; continue; }
        if (key === "on-background") continue;
        if (key === "shadow" || key === "scrim") continue;
        if (key in next.colors && isHex(v)) { next.colors[key] = v.toLowerCase(); found++; }
      } else if (key in next.shape) {
        next.shape[key] = v;
        found++;
      }
    }
    const nameMatch = /:root\[theme="([^"]+)"\]/.exec(text);
    if (nameMatch) {
      const pretty = nameMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      next.name = pretty;
      $("#th-name").value = pretty;
    }
    if (!found) {
      status(`No --md-sys-* variables found in ${file.name} — nothing loaded.`);
      return;
    }
    work = next;
    touched.clear();
    syncControls();
    paint();
    status(`Loaded ${found} variables from ${file.name}.`);
  });

  // -- boot -----------------------------------------------------------------------------

  syncControls();
  paint();
}
