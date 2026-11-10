import switchStyles from "./switch.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(switchStyles)) {
  document.adoptedStyleSheets.push(switchStyles);
}

const ON_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6 12-12L20.1 5.6z" fill="currentColor"/></svg>';
const OFF_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 5.7 18.3 4.3 16.9 9.2 12 4.3 7.1l1.4-1.4 4.9 4.9 6.3-6.3z" fill="currentColor"/></svg>';

/**
 * <nmui-switch> — M3 switch. Decorates a native checkbox input.
 *
 *   <nmui-switch><input type="checkbox">Wi-Fi</nmui-switch>
 *   <nmui-switch icons><input type="checkbox" checked></nmui-switch>
 *
 * [icons] shows check / x glyphs in the thumb.
 */
class NMUISwitch extends HTMLElement {
  #ready = false;
  #input = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input[type=checkbox]");
    if (!this.#input) return;

    const track = document.createElement("track");
    const thumb = document.createElement("thumb");
    thumb.innerHTML = `<on>${ON_SVG}</on><off>${OFF_SVG}</off>`;
    track.appendChild(thumb);
    this.prepend(track);

    const sync = () => {
      this.toggleAttribute("checked", this.#input.checked);
      this.toggleAttribute("disabled", this.#input.disabled);
    };
    this.#input.addEventListener("change", sync);
    new MutationObserver(sync).observe(this.#input, { attributes: true });
    sync();

    this.addEventListener("click", (e) => {
      if (e.target === this.#input) return;
      e.preventDefault();
      this.#input.click();
    });
  }
}

if (!customElements.get("nmui-switch")) {
  customElements.define("nmui-switch", NMUISwitch);
}

export { NMUISwitch };
