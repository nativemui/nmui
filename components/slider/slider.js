import sliderStyles from "./slider.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(sliderStyles)) {
  document.adoptedStyleSheets.push(sliderStyles);
}

/**
 * <nmui-slider> — M3 slider. Decorates a native range input; keyboard,
 * touch, and form behavior come free.
 *
 *   <nmui-slider><input type="range" value="40"></nmui-slider>
 *   <nmui-slider discrete><input type="range" min="0" max="5" step="1"></nmui-slider>
 *
 * [discrete] renders tick marks from min/max/step.
 */
class NMUISlider extends HTMLElement {
  #ready = false;
  #input = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input[type=range]");
    if (!this.#input) return;

    const sync = () => {
      const min = parseFloat(this.#input.min || "0");
      const max = parseFloat(this.#input.max || "100");
      const step = parseFloat(this.#input.step || "1");
      const v = parseFloat(this.#input.value || "0");
      const p = max === min ? 0 : ((v - min) / (max - min)) * 100;
      this.style.setProperty("--p", p + "%");
      this.style.setProperty("--ticks", Math.max(1, Math.round((max - min) / step)));
      this.toggleAttribute("disabled", this.#input.disabled);
    };
    this.#input.addEventListener("input", sync);
    new MutationObserver(sync).observe(this.#input, { attributes: true });
    sync();
  }
}

if (!customElements.get("nmui-slider")) {
  customElements.define("nmui-slider", NMUISlider);
}

export { NMUISlider };
