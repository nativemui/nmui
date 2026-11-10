import radioStyles from "./radio.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(radioStyles)) {
  document.adoptedStyleSheets.push(radioStyles);
}

/**
 * <nmui-radio> — M3 radio button. Decorates a native input, so
 * grouping, forms, validation, and keyboard behavior (Tab to the
 * selected radio, arrows move and select, Space selects) come
 * free from the platform.
 *
 *   <nmui-radio><input type="radio" name="size" value="s">Small</nmui-radio>
 *   <nmui-radio><input type="radio" name="size" value="m" checked>Medium</nmui-radio>
 *
 * The `name` attribute groups radios natively: selecting one
 * clears the others. A group may start with none selected, but
 * once one is selected the group can't return to none by
 * clicking — offer a "None" / "Not applicable" option if people
 * need a way out (accessibility guidance).
 *
 * Spec geometry: 20dp icon (2dp ring, 10dp dot), 40dp state
 * layer, 48dp target (the row height — 14dp padding-block
 * around the 20dp icon). Colors: selected ring + dot are
 * primary; the unselected ring is on-surface-variant; the state
 * layer is on-surface unselected and primary selected (hover
 * 8%, focus 12%, pressed 12%). The label stays on-surface
 * whatever the state (38% when disabled, as are the ring and
 * dot).
 *
 * Label text is wrapped in a native <label> at runtime, so it
 * is the input's accessible name and clicking it selects
 * natively.
 *
 * Programmatic sets (input.checked = true) fire no change
 * event, and the radio the platform silently unchecks fires
 * nothing either — so the component reflects sets through
 * accessors that re-sync the WHOLE group after delegating to
 * the native setter. The input itself stays native, so forms
 * and :checked matching still work.
 */
let uid = 0;

class NMUIRadio extends HTMLElement {
  #ready = false;
  #input = null;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    this.#input = this.querySelector(":scope > input[type=radio]");
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
        if (!this.#input.id) this.#input.id = `nmui-radio-${++uid}`;
        label.htmlFor = this.#input.id;
        this.appendChild(label);
      }
    }

    const mark = document.createElement("mark");
    this.prepend(mark);

    // Sync one host from its input, and re-sync the whole group:
    // radios clear each other natively with no events on the
    // ones that lose selection, so their hosts must be re-read.
    const syncOne = (host, input) => {
      host.toggleAttribute("checked", input.checked);
      host.toggleAttribute("disabled", input.disabled);
    };
    const sync = () => {
      syncOne(this, this.#input);
      if (this.#input.name) {
        document
          .querySelectorAll(
            `nmui-radio > input[type=radio][name="${CSS.escape(this.#input.name)}"]`
          )
          .forEach((other) => {
            if (other !== this.#input) {
              syncOne(other.closest("nmui-radio"), other);
            }
          });
      }
    };
    this.#input.addEventListener("change", sync);
    new MutationObserver(sync).observe(this.#input, { attributes: true });

    // A form reset reverts inputs to their defaultChecked with
    // no change event — re-sync the group just after it lands.
    if (this.#input.form) {
      this.#input.form.addEventListener("reset", () => setTimeout(sync, 0));
    }

    // Reflect programmatic property sets (see JSDoc).
    const proto = Object.getPrototypeOf(this.#input);
    for (const prop of ["checked", "disabled"]) {
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

if (!customElements.get("nmui-radio")) {
  customElements.define("nmui-radio", NMUIRadio);
}

export { NMUIRadio };
