import sliderStyles from "./slider.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(sliderStyles)) {
  document.adoptedStyleSheets.push(sliderStyles);
}

/**
 * <nmui-slider> — M3 Expressive slider. Decorates native
 * <input type="range"> element(s); keyboard, touch, form
 * behavior and the native input/change events come free —
 * they fire on the authored input and bubble through the
 * host. The visuals (track segments, stops, handle, value
 * indicator) are rendered by the component and synced from
 * the input, because the native pseudo-elements can't draw
 * the split track.
 *
 *   <nmui-slider><input type="range" value="40" aria-label="Volume"></nmui-slider>
 *
 * Variants (bare attributes):
 *   (default)   standard — active track from the start
 *   [centered]  active track grows from the middle
 *   [range]     two handles; author TWO inputs (start, end)
 *   [vertical]  vertical orientation (avoid with [range] —
 *               the guidelines call it too much load)
 * Sizes: bare = XS (16dp track); [small] 24, [medium] 40,
 * [large] 56, [xlarge] 96. Length via --nmui-slider-length
 * (vertical height; horizontal is width: 100%).
 *   [stops]  draws a stop indicator at every step (the
 *            input's step already snaps; keep counts sane)
 *   [label]  value indicator above the handle while
 *            interacting (hover / focus / drag); range shows
 *            one at a time. Format with slider.formatLabel.
 *   <icon inset>volume_up</icon> inside: inset icon (M+).
 *
 * Accessors mirror the input(s) like the other form
 * controls: value (single), valueStart / valueEnd (range),
 * min, max, step, disabled.
 */
const GAP = 6; // px between a track segment and the handle center

class NMUISlider extends HTMLElement {
  #ready = false;
  #inputs = [];
  #track = null;
  #segs = null;
  #handles = {};
  #labels = {};
  #stopsEl = null;
  #icon = null;

  /** Optional: (value:number) => string for the indicator. */
  formatLabel = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#inputs = [...this.querySelectorAll(":scope > input[type=range]")];
    if (!this.#inputs.length) return;
    const range = this.hasAttribute("range");
    if (range && this.#inputs.length > 2) this.#inputs.length = 2;
    if (!range) this.#inputs.length = 1;
    this.#inputs.forEach((input, i) => {
      input.dataset.handle = range ? (i === 0 ? "start" : "end") : "start";
    });

    // Generated track layer (inserted before the inputs,
    // which overlay it invisibly and take the interaction).
    const track = document.createElement("track");
    const mk = (tag, cls) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      track.appendChild(el);
      return el;
    };
    const before = mk("seg", "before");
    const active = mk("seg", "active");
    const after = mk("seg", "after");
    this.#segs = { before, active, after };
    this.#stopsEl = mk("stops");
    for (const which of range ? ["start", "end"] : ["start"]) {
      this.#handles[which] = mk("handle", which);
      if (this.hasAttribute("label")) {
        this.#labels[which] = mk("value", which);
      }
    }
    // End stops: every slider carries a stop at the end of
    // its inactive track (a 3:1 contrast anchor per the
    // accessibility spec) — both ends for centered/range.
    if (!this.hasAttribute("stops")) {
      mk("endstop", "at-end");
      if (range || this.hasAttribute("centered")) mk("endstop", "at-start");
    }
    this.#icon = this.querySelector(":scope > icon[inset]");
    if (this.#icon) track.appendChild(this.#icon);
    this.insertBefore(track, this.firstChild);
    this.#track = track;

    for (const input of this.#inputs) {
      input.addEventListener("input", () => this.#sync());
      input.addEventListener("focus", () => {
        // The focus halo is a keyboard indicator only
        // (:focus-visible semantics). Keying it off the raw
        // focus event painted the ring on every mouse press
        // too, where it reads as a stray outline.
        let visible = false;
        try {
          visible = input.matches(":focus-visible");
        } catch {
          visible = true;
        }
        if (visible) this.setAttribute("data-focus", input.dataset.handle);
      });
      input.addEventListener("blur", () => {
        if (this.getAttribute("data-focus") === input.dataset.handle) {
          this.removeAttribute("data-focus");
        }
      });
      input.addEventListener("pointerdown", () => {
        this.setAttribute("data-active", input.dataset.handle);
        this.setAttribute("data-pressing", "");
        const clear = () => {
          this.removeAttribute("data-pressing");
          window.removeEventListener("pointerup", clear);
          window.removeEventListener("pointercancel", clear);
        };
        window.addEventListener("pointerup", clear);
        window.addEventListener("pointercancel", clear);
      });
      new MutationObserver(() => this.#sync()).observe(input, {
        attributes: true,
      });
    }
    const form = this.closest("form");
    form?.addEventListener("reset", () =>
      requestAnimationFrame(() => this.#sync())
    );
    if (range) this.#rangePointer();
    this.#sync();
  }

  // --- range pointer routing -------------------------------
  // Two stacked inputs can't share one overlay (the top one
  // would take every drag), so range drags are routed by
  // the host: pick the nearer handle, then drive its input.
  #rangePointer() {
    const valueFromEvent = (e) => {
      const r = this.#track.getBoundingClientRect();
      const vertical = this.hasAttribute("vertical");
      const frac = vertical
        ? 1 - (e.clientY - r.top) / Math.max(1, r.height)
        : (e.clientX - r.left) / Math.max(1, r.width);
      const [a, b] = this.#inputs;
      const min = parseFloat(a.min || "0");
      const max = parseFloat(a.max || "100");
      const step = parseFloat(a.step || "1");
      let v = min + Math.min(1, Math.max(0, frac)) * (max - min);
      if (step > 0) v = min + Math.round((v - min) / step) * step;
      // Match the inputs' own precision (avoid 0.30000004).
      const dec = (String(step).split(".")[1] || "").length;
      return parseFloat(v.toFixed(Math.max(dec, 6)));
    };
    const pick = (e) => {
      const v = valueFromEvent(e);
      const [a, b] = this.#inputs;
      const dStart = Math.abs(v - parseFloat(a.value));
      const dEnd = Math.abs(v - parseFloat(b.value));
      return dStart <= dEnd ? a : b;
    };
    this.addEventListener("pointermove", (e) => {
      if (this.hasAttribute("data-pressing")) return;
      this.setAttribute("data-near", pick(e).dataset.handle);
    });
    this.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input")) return; // keyboard-focus clicks pass through
      const input = pick(e);
      const which = input.dataset.handle;
      const [a, b] = this.#inputs;
      const apply = (ev) => {
        let v = valueFromEvent(ev);
        if (which === "start") v = Math.min(v, parseFloat(b.value));
        else v = Math.max(v, parseFloat(a.value));
        if (parseFloat(input.value) !== v) {
          input.value = v;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      };
      apply(e);
      this.setAttribute("data-active", which);
      this.setAttribute("data-near", which);
      this.setAttribute("data-pressing", "");
      this.setPointerCapture?.(e.pointerId);
      const move = (ev) => apply(ev);
      const up = () => {
        this.removeEventListener("pointermove", move);
        this.removeEventListener("pointerup", up);
        this.removeEventListener("pointercancel", up);
        this.removeAttribute("data-pressing");
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      this.addEventListener("pointermove", move);
      this.addEventListener("pointerup", up);
      this.addEventListener("pointercancel", up);
    });
  }

  // --- sync -------------------------------------------------
  #frac(input) {
    const min = parseFloat(input.min || "0");
    const max = parseFloat(input.max || "100");
    const v = parseFloat(input.value || "0");
    return max === min ? 0 : Math.min(1, Math.max(0, (v - min) / (max - min)));
  }

  #sync() {
    const range = this.hasAttribute("range");
    const centered = this.hasAttribute("centered") && !range;
    const [a, b] = this.#inputs;
    const fa = this.#frac(a);
    const fb = range ? this.#frac(b) : null;
    const pct = (f) => `${Math.round(f * 1000000) / 10000}%`;
    const seg = (el, pos, len, on, kind) => {
      el.style.setProperty("--pos", pos);
      el.style.setProperty("--len", len);
      el.toggleAttribute("hidden", !on);
      el.dataset.kind = kind;
    };
    let span; // active span [from, to] as fractions
    if (range) {
      span = [fa, fb];
      seg(this.#segs.before, "0%", `calc(${pct(fa)} - ${GAP}px)`, fa > 0, "inactive");
      seg(this.#segs.active, `calc(${pct(fa)} + ${GAP}px)`, `calc(${pct(fb - fa)} - ${GAP * 2}px)`, fb > fa, "active");
      seg(this.#segs.after, `calc(${pct(fb)} + ${GAP}px)`, `calc(${pct(1 - fb)} - ${GAP}px)`, fb < 1, "inactive");
    } else if (centered && fa < 0.5) {
      span = [fa, 0.5];
      seg(this.#segs.before, "0%", `calc(${pct(fa)} - ${GAP}px)`, fa > 0, "inactive");
      seg(this.#segs.active, `calc(${pct(fa)} + ${GAP}px)`, `calc(${pct(0.5 - fa)} - ${GAP}px)`, fa < 0.5, "active");
      seg(this.#segs.after, "50%", "50%", true, "inactive");
    } else if (centered) {
      span = [0.5, fa];
      seg(this.#segs.before, "0%", "50%", true, "inactive");
      seg(this.#segs.active, "50%", `calc(${pct(fa - 0.5)} - ${GAP}px)`, fa > 0.5, "active");
      seg(this.#segs.after, `calc(${pct(fa)} + ${GAP}px)`, `calc(${pct(1 - fa)} - ${GAP}px)`, fa < 1, "inactive");
    } else {
      // standard: the "before" slot carries the active track
      span = [0, fa];
      seg(this.#segs.before, "0%", `calc(${pct(fa)} - ${GAP}px)`, fa > 0, "active");
      seg(this.#segs.active, "0%", "0%", false, "active");
      seg(this.#segs.after, `calc(${pct(fa)} + ${GAP}px)`, `calc(${pct(1 - fa)} - ${GAP}px)`, fa < 1, "inactive");
    }

    for (const [which, input, f] of range
      ? [["start", a, fa], ["end", b, fb]]
      : [["start", a, fa]]) {
      this.#handles[which].style.setProperty("--pos", pct(f));
      const label = this.#labels[which];
      if (label) {
        label.style.setProperty("--pos", pct(f));
        const v = parseFloat(input.value);
        label.textContent = this.formatLabel ? this.formatLabel(v) : input.value;
      }
    }

    if (this.hasAttribute("stops")) this.#syncStops(span);
    if (this.#icon) {
      const w = this.#track.clientWidth || 0;
      const activePx = span[1] * w;
      this.toggleAttribute("data-icon-on", activePx >= 48);
    }
    this.toggleAttribute(
      "disabled",
      this.#inputs.every((i) => i.disabled)
    );
  }

  #syncStops(span) {
    const a = this.#inputs[0];
    const min = parseFloat(a.min || "0");
    const max = parseFloat(a.max || "100");
    const step = parseFloat(a.step || "1");
    const count = step > 0 ? Math.round((max - min) / step) : 0;
    const key = `${min}/${max}/${step}`;
    if (this.#stopsEl.dataset.key !== key) {
      this.#stopsEl.dataset.key = key;
      this.#stopsEl.replaceChildren();
      if (count >= 1 && count <= 100) {
        for (let i = 0; i <= count; i++) {
          const dot = document.createElement("dot");
          const f = i / count;
          dot.style.setProperty("--pos",
            `calc(${f} * (100% - var(--_th)) + var(--_th) / 2)`);
          dot.dataset.frac = f;
          this.#stopsEl.appendChild(dot);
        }
      }
    }
    for (const dot of this.#stopsEl.children) {
      const f = parseFloat(dot.dataset.frac);
      dot.toggleAttribute("on", f >= span[0] - 1e-9 && f <= span[1] + 1e-9);
    }
  }

  // --- accessor reflection (delegates to the input) --------
  get value() {
    return this.#inputs[0] ? parseFloat(this.#inputs[0].value) : 0;
  }
  set value(v) {
    if (!this.#inputs[0]) return;
    this.#inputs[0].value = v;
    this.#sync();
  }
  get valueStart() {
    return this.value;
  }
  set valueStart(v) {
    if (!this.#inputs[0]) return;
    const end = this.#inputs[1];
    this.#inputs[0].value = end ? Math.min(v, parseFloat(end.value)) : v;
    this.#sync();
  }
  get valueEnd() {
    return this.#inputs[1] ? parseFloat(this.#inputs[1].value) : 0;
  }
  set valueEnd(v) {
    if (!this.#inputs[1]) return;
    this.#inputs[1].value = Math.max(v, parseFloat(this.#inputs[0].value));
    this.#sync();
  }
  get min() {
    return this.#inputs[0] ? parseFloat(this.#inputs[0].min || "0") : 0;
  }
  set min(v) {
    for (const i of this.#inputs) i.min = v;
    this.#sync();
  }
  get max() {
    return this.#inputs[0] ? parseFloat(this.#inputs[0].max || "100") : 100;
  }
  set max(v) {
    for (const i of this.#inputs) i.max = v;
    this.#sync();
  }
  get step() {
    return this.#inputs[0] ? parseFloat(this.#inputs[0].step || "1") : 1;
  }
  set step(v) {
    for (const i of this.#inputs) i.step = v;
    this.#sync();
  }
  get disabled() {
    return this.#inputs.length > 0 && this.#inputs.every((i) => i.disabled);
  }
  set disabled(v) {
    for (const i of this.#inputs) i.disabled = !!v;
    this.#sync();
  }
}

if (!customElements.get("nmui-slider")) {
  customElements.define("nmui-slider", NMUISlider);
}

export { NMUISlider };
