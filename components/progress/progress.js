import progressStyles from "./progress.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(progressStyles)) {
  document.adoptedStyleSheets.push(progressStyles);
}

/**
 * <nmui-progress> — M3 progress indicator, linear (default) and
 * circular, for processes over ~5s or with measurable progress.
 * (Short indeterminate waits under 5s belong to <nmui-loading>.)
 *
 *   <nmui-progress value="0.6" aria-label="Uploading file"></nmui-progress>
 *   <nmui-progress aria-label="Loading article"></nmui-progress>
 *   <nmui-progress circular value="0.6"></nmui-progress>
 *   <nmui-progress wavy value="0.6"></nmui-progress>
 *   <nmui-progress circular wavy></nmui-progress>
 *
 * [value] is 0–1; omit it for indeterminate (a determinate
 * indicator must accurately represent the process — the value is
 * not decorative). [wavy] is the M3 Expressive shape for the
 * active indicator: linear's active part becomes a sine wave
 * over a straight track (wavelength 40dp,
 * amplitude 1.5dp at the 4dp baseline thickness, scaling with
 * thicker tracks — the container grows to fit the wave);
 * circular's arc gets a small radial wave. Track
 * thickness defaults to 4dp and is configurable in Expressive —
 * set it with the --nmui-progress-thickness CSS property
 * (circular size is plain CSS width/height, 24–240dp per specs).
 *
 * Linear determinate indicators carry the 4dp stop indicator dot
 * at the end of the track (an accessibility requirement when the
 * track's contrast is under 3:1 — it ships always rather than
 * asking authors to measure). A 4dp gap separates the active
 * indicator from the track's remainder and the stop.
 *
 * role="progressbar" with aria-valuenow in determinate mode; set
 * aria-label to say WHAT is progressing. The native way works:
 * progress.value reads/writes the progress as a number (setting
 * it also updates aria-valuenow and the drawing).
 */

// Wave geometry (dp, in SVG user units): wavelength 40,
// amplitude 1.5 — scaled on the circular path (circumference
// ~113 units at r=18) to 10 waves of ~11.3 units.
const WAVE = { length: 40, amp: 1.5 };
const CIRC = { r: 18, waves: 10, amp: 0.8 };

// A sine sampled every 2 units and drawn with line segments —
// dense enough that the segments read as a smooth curve.
// Returns the path and its arc length (the dash math needs the
// real length so the 4dp gap stays 4dp at any width).
function waveLine(x0, x1, cy, wavelength, amp) {
  let d = "";
  let len = 0;
  let prev = null;
  for (let x = x0; x <= x1 + 0.001; x += 2) {
    const y = cy + amp * Math.sin(((x - x0) / wavelength) * Math.PI * 2);
    d += `${x === x0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    if (prev) len += Math.hypot(x - prev[0], y - prev[1]);
    prev = [x, y];
  }
  return { d, len };
}

// A circle whose radius wobbles sinusoidally — the wavy arc.
// Closed form (starts and ends at the same angle).
function wavyCirclePath(cx, cy, r, waves, amp) {
  let d = "";
  const steps = waves * 12;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rr = r + amp * Math.sin(t * waves);
    d += `${i === 0 ? "M" : "L"}${(cx + Math.cos(t) * rr).toFixed(2)} ${(cy + Math.sin(t) * rr).toFixed(2)}`;
  }
  return d + "Z";
}

const CIRC_C = 2 * Math.PI * CIRC.r; // ~113.1

let waveClipSeq = 0;

class NMUIProgress extends HTMLElement {
  #ready = false;
  #els = null;
  #ro = null;
  #waveKey = "";
  #wave = null;

  static get observedAttributes() {
    return ["value"];
  }

  get value() {
    const v = parseFloat(this.getAttribute("value"));
    return Number.isNaN(v) ? null : Math.min(1, Math.max(0, v));
  }

  set value(v) {
    if (v == null) this.removeAttribute("value");
    else this.setAttribute("value", String(v));
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    if (!this.hasAttribute("role")) this.setAttribute("role", "progressbar");
    const circular = this.hasAttribute("circular");
    const wavy = this.hasAttribute("wavy");
    const track = document.createElement("track");
    if (circular) {
      // The track stays a smooth circle — only the active arc
      // waves (per the spec art).
      const smooth = `M24 6a18 18 0 1 1 0 36 18 18 0 1 1 0-36`;
      const act = wavy
        ? wavyCirclePath(24, 24, CIRC.r, CIRC.waves, CIRC.amp)
        : smooth;
      track.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path class="trk" d="${smooth}"/>
        <path class="act" pathLength="100" d="${act}"/>
      </svg>`;
    } else if (wavy) {
      // The wave is drawn in PIXEL space (1 unit = 1px) at the
      // element's real width, so the wavelength stays 40dp no
      // matter how wide the container is. #drawWave regenerates
      // the paths; a ResizeObserver keeps them honest.
      // NOTE: no pathLength on the wavy paths — their dash
      // math is in real pixels (see #syncWave). A pathLength
      // here would rescale every dash value into 100-space and
      // the active wave would paint the full width.
      // The clip window is the indeterminate mechanism: a rect
      // over the full wave path, animated with transforms
      // (translate + scale, like Google's two-bar animation) —
      // dash-window animation stepped instead of tweening.
      const clip = `nmui-pw-${++waveClipSeq}`;
      track.innerHTML = `<svg aria-hidden="true" focusable="false">
        <defs><clipPath id="${clip}"><rect class="win" x="0" y="0"/></clipPath></defs>
        <path class="trk"/>
        <path class="act" clip-path="url(#${clip})"/>
      </svg><stop></stop>`;
    } else {
      // The two <seg> children only render in indeterminate
      // mode — they run the two-bar chase animation (the exact
      // keyframes from Google's own implementation, see
      // progress.css). Determinate paints the bar itself.
      track.innerHTML = `<bar><seg><i></i></seg><seg second><i></i></seg></bar><stop></stop>`;
    }
    this.appendChild(track);
    this.#els = {
      act: track.querySelector(".act") ?? track.querySelector("bar"),
      trk: track.querySelector(".trk"),
      svg: track.querySelector("svg"),
      win: track.querySelector(".win"),
    };
    if (wavy && !circular) {
      this.#drawWave();
      this.#ro = new ResizeObserver(() => this.#drawWave());
      this.#ro.observe(this.#els.svg);
    }
    this.#sync();
  }

  disconnectedCallback() {
    this.#ro?.disconnect();
  }

  // Regenerate the wavy linear paths for the element's current
  // pixel width. The container grows with the wave: thickness +
  // the amplitude on both sides (+ padding), so a thicker wave
  // never clips. Amplitude scales with thickness past the 4dp
  // baseline (1.5dp there).
  #drawWave() {
    const svg = this.#els?.svg;
    if (!svg) return;
    const w = Math.round(svg.clientWidth);
    if (w < 10) return;
    const t =
      parseFloat(
        getComputedStyle(this).getPropertyValue("--nmui-progress-thickness")
      ) || 4;
    const amp = Math.max(WAVE.amp, t * 0.375);
    const h = t + amp * 2 + 2;
    const key = `${w}x${h}`;
    if (key === this.#waveKey) return;
    this.#waveKey = key;
    this.style.setProperty("--_h", `${h}px`);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const { d, len } = waveLine(0, w, h / 2, WAVE.length, amp);
    this.#wave = { w, cy: h / 2, len };
    this.#els.win.setAttribute("height", String(h));
    this.#els.act.setAttribute("d", d);
    this.#sync();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  #sync() {
    if (!this.#ready) return;
    const p = this.value;
    this.toggleAttribute("determinate", p != null);
    if (p != null) this.setAttribute("aria-valuenow", String(Math.round(p * 100)));
    else this.removeAttribute("aria-valuenow");

    if (this.hasAttribute("circular")) {
      // pathLength=100 space; 4 units of gap at the arc's head.
      this.#els.act.style.strokeDasharray =
        p != null ? `${Math.max(0, p * 100 - 4)} 100` : "";
    } else if (this.hasAttribute("wavy")) {
      this.#syncWave(p);
    } else if (p != null) {
      this.style.setProperty("--p", String(p));
    }
  }

  // Wavy linear: the active indicator waves, the TRACK STAYS A
  // STRAIGHT LINE (per the spec anatomy — only the active part
  // waves). The track remainder starts after the 4dp gap; at
  // 100% it disappears. All dash math is in real pixels so the
  // gap stays 4dp at any width. Indeterminate: full straight
  // track, the clip window narrows to a segment and the CSS
  // animation tweens it along (translate + scale).
  #syncWave(p) {
    const wv = this.#wave;
    const { act, trk, win } = this.#els;
    if (!wv) return;
    const { w, cy, len } = wv;
    if (p != null) {
      win.setAttribute("width", String(w));
      act.style.strokeDasharray = `${Math.max(0, p * len - 4)} ${len}`;
      trk.setAttribute(
        "d",
        p >= 0.999 ? "" : `M${(p * w).toFixed(1)} ${cy}L${w} ${cy}`
      );
    } else {
      win.setAttribute("width", String(Math.round(w * 0.35)));
      act.style.strokeDasharray = "";
      trk.setAttribute("d", `M0 ${cy}L${w} ${cy}`);
    }
  }
}

if (!customElements.get("nmui-progress")) {
  customElements.define("nmui-progress", NMUIProgress);
}

export { NMUIProgress };
