import chipStyles from "./chip.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(chipStyles)) {
  document.adoptedStyleSheets.push(chipStyles);
}

/**
 * <nmui-chip> — M3 chips. One tag, four roles.
 *
 * Roles (pick one): [assist] (default) [filter] [input] [suggestion]
 * Modifiers: [elevated] [selected] [disabled]
 *
 * All roles: 32dp tall, 8dp corners, label-large text, 18dp icons,
 * 48dp minimum target (the visible box is 32dp; the target extends
 * past it via ::after, like the icon button's). Flat chips are
 * outlined (outline-variant since Aug 2024); [elevated] drops the
 * outline for a surface-container-low fill at elevation level 1.
 *
 * Assist chips are momentary actions (primary leading icon). Filter
 * chips toggle [selected] on click — the checkmark the component
 * prepends replaces any authored leading icon while selected — and
 * selected fills secondary-container. Input chips are user-entered
 * data: selected fills secondary-container, the trailing icon is
 * the remove affordance, and Delete/Backspace on a selected input
 * chip asks for removal too. Suggestion chips are plain momentary
 * suggestions.
 *
 * Events (all bubble): every non-remove press fires "change" with
 * { value, selected, chip, event } — value is the [value] attribute,
 * selected the state after the press. Clicking an input chip's
 * trailing icon fires "close" with { chip } INSTEAD, and removing
 * the chip is the app's job (listen and remove the element).
 *
 * Native way: chip.click() is a real press. chip.selected /
 * chip.disabled properties reflect their attributes (visuals and
 * aria included) and, like native programmatic sets, fire no event.
 * An [href] attribute turns assist/suggestion chips into links —
 * the press navigates after change fires, like an <a>.
 *
 *   <nmui-chip assist><icon>calendar</icon>Set date</nmui-chip>
 *   <nmui-chip filter selected>Small</nmui-chip>
 *   <nmui-chip input>Apple<icon>close</icon></nmui-chip>
 *   <nmui-chip input><img avatar src="…">Ada<icon>close</icon></nmui-chip>
 *   <nmui-chip suggestion>Thanks!</nmui-chip>
 */
const CHECK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6 12-12L20.1 5.6z" fill="currentColor"/></svg>';

class NMUIChip extends HTMLElement {
  #ready = false;

  get value() {
    return this.getAttribute("value");
  }

  set value(v) {
    if (v == null) this.removeAttribute("value");
    else this.setAttribute("value", String(v));
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  set selected(v) {
    this.#setSelected(Boolean(v));
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(v) {
    const on = Boolean(v);
    this.toggleAttribute("disabled", on);
    this.#syncState();
  }

  // Selection drives both the attribute and the toggle ARIA.
  // Filter chips are aria-pressed toggles; input chips are
  // aria-selected options. Assist/suggestion carry no toggle ARIA.
  #setSelected(on) {
    this.toggleAttribute("selected", on);
    this.#syncState();
  }

  #syncState() {
    if (this.hasAttribute("filter")) {
      this.setAttribute("aria-pressed", String(this.hasAttribute("selected")));
    }
    if (this.hasAttribute("input")) {
      this.setAttribute("aria-selected", String(this.hasAttribute("selected")));
    }
    if (this.hasAttribute("disabled")) {
      this.setAttribute("aria-disabled", "true");
      this.setAttribute("tabindex", "-1");
    } else {
      this.removeAttribute("aria-disabled");
      this.setAttribute("tabindex", "0");
    }
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;

    // Filter chips: the component owns a checkmark element, shown
    // while selected in place of any authored leading icon.
    if (this.hasAttribute("filter") && !this.querySelector(":scope > check")) {
      const check = document.createElement("check");
      check.innerHTML = CHECK_SVG;
      check.setAttribute("aria-hidden", "true");
      this.prepend(check);
    }

    if (!this.hasAttribute("role")) {
      this.setAttribute(
        "role",
        this.hasAttribute("filter")
          ? "button"
          : this.hasAttribute("input")
            ? "option"
            : "button"
      );
    }
    this.#syncState();

    this.addEventListener("keydown", (e) => {
      if (this.hasAttribute("disabled")) return;
      // Selected input chips: Delete/Backspace asks for removal,
      // the chip-field pattern from the guidelines.
      if (
        this.hasAttribute("input") &&
        this.hasAttribute("selected") &&
        (e.key === "Delete" || e.key === "Backspace")
      ) {
        e.preventDefault();
        this.dispatchEvent(
          new CustomEvent("close", {
            detail: { chip: this },
            bubbles: true,
            composed: true,
          })
        );
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!e.repeat) this.click();
      }
    });

    this.addEventListener("click", (e) => {
      if (this.hasAttribute("disabled")) return;
      const t = e.target instanceof Element ? e.target : null;

      // Input chips: the trailing icon is the remove affordance.
      if (this.hasAttribute("input")) {
        const icon = t?.closest("icon");
        const lastIcon = this.querySelector(":scope > icon:last-of-type");
        if (icon && lastIcon && icon === lastIcon) {
          this.dispatchEvent(
            new CustomEvent("close", {
              detail: { chip: this },
              bubbles: true,
              composed: true,
            })
          );
          return;
        }
        this.#setSelected(!this.hasAttribute("selected"));
      }

      if (this.hasAttribute("filter")) {
        this.#setSelected(!this.hasAttribute("selected"));
      }

      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: this.value,
            selected: this.hasAttribute("selected"),
            chip: this,
            event: e,
          },
          bubbles: true,
          composed: true,
        })
      );

      if (this.hasAttribute("href")) {
        window.location = this.getAttribute("href");
      }
    });
  }
}

if (!customElements.get("nmui-chip")) {
  customElements.define("nmui-chip", NMUIChip);
}

export { NMUIChip };
