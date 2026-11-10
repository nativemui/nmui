import timePickerStyles from "./time-picker.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(timePickerStyles)) {
  document.adoptedStyleSheets.push(timePickerStyles);
}

const CLOCK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m1 10.6 4.5 2.6-.8 1.3L11 13.5V7h2z" fill="currentColor"/></svg>';

/**
 * <nmui-time-picker> — M3 time picker field. Decorates a native time
 * input with M3 field styling; the native picker does the picking.
 *
 *   <nmui-time-picker>
 *     <label>Wake up</label>
 *     <input type="time" value="07:30">
 *   </nmui-time-picker>
 *
 * [outlined] for the outlined field.
 */
class NMUITimePicker extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    const input = this.querySelector(":scope > input");
    if (!input) return;
    if (!input.hasAttribute("placeholder")) input.setAttribute("placeholder", " ");

    const icon = document.createElement("icon");
    icon.innerHTML = CLOCK_SVG;
    this.appendChild(icon);
  }
}

if (!customElements.get("nmui-time-picker")) {
  customElements.define("nmui-time-picker", NMUITimePicker);
}

export { NMUITimePicker };
