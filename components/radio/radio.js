import radioStyles from "./radio.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(radioStyles)) {
  document.adoptedStyleSheets.push(radioStyles);
}

/**
 * <nmui-radio> — M3 radio button. Decorates a native input; the `name`
 * attribute groups radios natively.
 *
 *   <nmui-radio><input type="radio" name="size" checked>Small</nmui-radio>
 *   <nmui-radio><input type="radio" name="size">Large</nmui-radio>
 */
class NMUIRadio extends HTMLElement {
  #ready = false;
  #input = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input[type=radio]");
    if (!this.#input) return;

    const mark = document.createElement("mark");
    this.prepend(mark);

    const sync = () => {
      this.toggleAttribute("checked", this.#input.checked);
      this.toggleAttribute("disabled", this.#input.disabled);
      // Radios clear each other natively — re-sync the whole group.
      if (this.#input.name) {
        document
          .querySelectorAll(`nmui-radio > input[type=radio][name="${CSS.escape(this.#input.name)}"]`)
          .forEach((other) => {
            other.closest("nmui-radio")?.toggleAttribute("checked", other.checked);
          });
      }
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

if (!customElements.get("nmui-radio")) {
  customElements.define("nmui-radio", NMUIRadio);
}

export { NMUIRadio };
