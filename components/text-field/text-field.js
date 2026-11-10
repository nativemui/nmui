import textFieldStyles from "./text-field.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(textFieldStyles)) {
  document.adoptedStyleSheets.push(textFieldStyles);
}

/**
 * <nmui-text-field> — M3 text field. Decorates a native input or textarea
 * plus its label; floating label, error state, and icons included.
 *
 * Variants (pick one): [filled] (default) [outlined]
 * State: [error] [disabled]
 *
 *   <nmui-text-field>
 *     <label>Name</label>
 *     <input>
 *     <small>Supporting text</small>
 *   </nmui-text-field>
 *
 *   <nmui-text-field outlined error>
 *     <label>Email</label>
 *     <input type="email">
 *     <small>Enter a valid email</small>
 *   </nmui-text-field>
 *
 * Leading/trailing <icon> children become adornments.
 */
class NMUITextField extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    const field = this.querySelector(":scope > input, :scope > textarea");
    if (!field) return;

    // The floating label is pure CSS via :placeholder-shown — an empty
    // placeholder keeps it working without placeholder text.
    if (!field.hasAttribute("placeholder")) field.setAttribute("placeholder", " ");
    if (field.hasAttribute("disabled")) this.setAttribute("disabled", "");
    if (field.hasAttribute("required")) this.setAttribute("required", "");
  }
}

if (!customElements.get("nmui-text-field")) {
  customElements.define("nmui-text-field", NMUITextField);
}

export { NMUITextField };
