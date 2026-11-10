import checkboxStyles from "./checkbox.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(checkboxStyles)) {
  document.adoptedStyleSheets.push(checkboxStyles);
}

const CHECK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6 12-12L20.1 5.6z" fill="currentColor"/></svg>';

/**
 * <nmui-checkbox> — M3 checkbox. Decorates a native input, so forms,
 * validation, and keyboard behavior come free.
 *
 *   <nmui-checkbox><input type="checkbox">Remember me</nmui-checkbox>
 *   <nmui-checkbox><input type="checkbox" checked>Remember me</nmui-checkbox>
 *   <nmui-checkbox error><input type="checkbox">Required</nmui-checkbox>
 *
 * Spec geometry: 18dp container, 2dp corners, 18dp icon, 40dp
 * state layer, 48dp target (the row height — 15dp padding-block
 * around the 18dp box). State layer: on-surface unselected,
 * primary selected/indeterminate, error in error — hover 8%,
 * focus 12%, pressed 12%. Label text stays on-surface whatever
 * the state (38% when disabled).
 *
 * Label text is wrapped in a native <label> at runtime, so it is
 * the input's accessible name and clicking it toggles natively.
 * [error] is a host attribute the app sets (e.g., after
 * validation); it exists for unselected, selected, and
 * indeterminate alike.
 *
 * Programmatic sets (input.checked = true, input.indeterminate
 * = true) fire no change event and touch no attribute, so the
 * component reflects them through accessors that sync the host
 * after delegating to the native setter — the input itself stays
 * native, so forms and :checked matching still work.
 */
let uid = 0;

class NMUICheckbox extends HTMLElement {
  #ready = false;
  #input = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input[type=checkbox]");
    if (!this.#input) return;

    // Label: wrap any non-input content in a native <label> tied
    // to the input, unless the author already provided one.
    if (!this.querySelector(":scope > label")) {
      const label = document.createElement("label");
      let node = this.firstChild;
      while (node) {
        const next = node.nextSibling;
        if (node !== this.#input) label.appendChild(node);
        node = next;
      }
      if (label.childNodes.length) {
        if (!this.#input.id) this.#input.id = `nmui-cb-${++uid}`;
        label.htmlFor = this.#input.id;
        this.appendChild(label);
      }
    }

    const mark = document.createElement("mark");
    mark.innerHTML = CHECK_SVG;
    this.prepend(mark);

    const sync = () => {
      this.toggleAttribute("checked", this.#input.checked);
      this.toggleAttribute("indeterminate", this.#input.indeterminate);
      this.toggleAttribute("disabled", this.#input.disabled);
    };
    this.#input.addEventListener("change", sync);
    new MutationObserver(sync).observe(this.#input, { attributes: true });

    // A form reset reverts the input to its defaultChecked with no
    // change event and no attribute mutation — re-sync just after
    // the reset lands so the host never shows a stale state.
    if (this.#input.form) {
      this.#input.form.addEventListener("reset", () => setTimeout(sync, 0));
    }

    // Reflect programmatic property sets (see JSDoc).
    const proto = Object.getPrototypeOf(this.#input);
    for (const prop of ["checked", "indeterminate", "disabled"]) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc || typeof desc.set !== "function") continue;
      Object.defineProperty(this.#input, prop, {
        get() {
          return desc.get.call(this);
        },
        set(v) {
          desc.set.call(this, v);
          sync();
        },
        configurable: true,
      });
    }
    sync();

    this.addEventListener("click", (e) => {
      if (this.#input.disabled) return;
      if (e.target === this.#input) return;
      if (e.target.closest?.("label")) return;
      e.preventDefault();
      this.#input.click();
    });
  }
}

if (!customElements.get("nmui-checkbox")) {
  customElements.define("nmui-checkbox", NMUICheckbox);
}

export { NMUICheckbox };
