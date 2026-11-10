import NavigationStyles from "./navigation.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(NavigationStyles)) {
  document.adoptedStyleSheets.push(NavigationStyles);
}

/**
 * <nmui-navigation> — Material 3 navigation. One element; the role is a
 * bare attribute. This pass builds the rail and the bar:
 *
 *   <nmui-navigation rail collapsed>…</nmui-navigation>
 *   <nmui-navigation rail expanded>…</nmui-navigation>
 *   <nmui-navigation bar>…</nmui-navigation>
 *
 * (The baseline rail is gone in M3 Expressive — collapsed replaces it.
 * With neither attribute, the rail starts collapsed. The bar is the
 * M3E flexible bar only: the live overview says it replaces the
 * baseline bar, which is no longer recommended, so no baseline bar
 * is implemented.)
 *
 * Configurations:
 *   [standard]   in the layout, beside the content (the default)
 *   [modal]      overlays the content on a scrim; hidden until opened
 *                with [open], show(), close(), or toggle()
 *
 * Children:
 *   <a> / <button>     destinations. Content is an <icon> plus a label:
 *                        <a href="/home" selected><icon>home</icon>Home</a>
 *                      The icons are wrapped in an <indicator>, the
 *                      label text in a <label>, so each can animate
 *                      on its own. Clicking selects (moves [selected],
 *                      emits "change" with { value, destination }); in
 *                      a modal rail it also closes. Author two icons
 *                      and mark one [selected] to swap glyphs with the
 *                      state.
 *   <section title="…">  a group of secondary destinations under
 *                      the destination before it. That destination
 *                      becomes the group's toggle: it gains a caret
 *                      (flipped while the group is open) and an
 *                      aria-expanded state, and clicking it opens
 *                      or closes the group inline instead of
 *                      selecting or firing "change". Groups start
 *                      closed; author [open] on the <section> to
 *                      start one open. The title renders above the
 *                      group; omit it for an untitled group. The
 *                      collapsed rail hides groups whole — the
 *                      parent destination stands for them.
 *   <nmui-button fab>  the rail's action — moved into the header zone
 *   <header>           optional authored header (menu button, brand…),
 *                      always at the top, above the FAB
 *
 *   [center]  destinations align to the center (top is the default)
 *
 * Bar children are the same <a> / <button> destinations (icon +
 * label, 3–5 of them, compact and medium windows). The bar is the
 * flexible bar: 64dp tall, surface-container, no shadow. Labels
 * show for all destinations by default; [labels-selected] shows
 * only the selected destination's label, [labels-none] shows none.
 * At medium window widths (600dp and up) destinations lay out
 * horizontally — icon beside label — centred as a group.
 */
class NMUINavigation extends HTMLElement {
  #ready = false;
  #inited = false;
  #switchTimer = null;
  #labelTimer = null;

  static observedAttributes = ["expanded", "collapsed"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.#inited) return;
    if (!this.hasAttribute("rail")) return;
    // The variant flipped at runtime. [switching] clips the header
    // for the whole width transition; [labels-out] hides the labels
    // only until the rail is wide enough for the text again, then
    // drops so they flash back mid-flight instead of after.
    this.setAttribute("switching", "");
    this.setAttribute("labels-out", "");
    clearTimeout(this.#switchTimer);
    clearTimeout(this.#labelTimer);
    this.#labelTimer = setTimeout(() => this.removeAttribute("labels-out"), 130);
    this.#switchTimer = setTimeout(() => this.removeAttribute("switching"), 270);
  }

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    if (!this.hasAttribute("role")) this.setAttribute("role", "navigation");
    if (this.hasAttribute("rail")) this.#initRail();
    if (this.hasAttribute("bar")) this.#initBar();
    // [drawer] is deprecated in M3 Expressive in favour of the
    // expanded rail showing secondary destinations, so no drawer
    // pass is built; the rail already covers it.
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.#onKey);
  }

  // -- rail -------------------------------------------------------------------

  #initRail() {
    if (!this.hasAttribute("expanded")) this.setAttribute("collapsed", "");
    if (this.hasAttribute("expanded")) this.removeAttribute("collapsed");

    // Header zone: an authored <header> wins; a FAB child moves into it.
    let header = this.querySelector(":scope > header");
    const fab = [...this.children].find(
      (el) => el.tagName === "NMUI-BUTTON" && el.hasAttribute("fab")
    );
    if (fab) {
      if (!header) {
        header = document.createElement("header");
        this.prepend(header);
      }
      header.appendChild(fab);
    }

    // Everything else that navigates becomes a destination. A
    // <section> moves as a whole — its destinations are secondaries.
    const destinations = document.createElement("destinations");
    [...this.children].forEach((el) => {
      if (
        el !== header &&
        (el.tagName === "A" || el.tagName === "BUTTON" || el.tagName === "SECTION")
      ) {
        destinations.appendChild(el);
      }
    });
    this.appendChild(destinations);

    // The active indicator hugs the icon: wrap each destination's icons.
    // The label text gets its own element too, so it can fade on its
    // own when the variant switches. Section destinations included.
    [...destinations.querySelectorAll("a, button")].forEach((dest) => {
      const icons = [...dest.childNodes].filter(
        (n) => n instanceof Element && n.tagName === "ICON"
      );
      if (icons.length) {
        const indicator = document.createElement("indicator");
        dest.insertBefore(indicator, icons[0]);
        icons.forEach((icon) => indicator.appendChild(icon));
      }
      [...dest.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const label = document.createElement("label");
          label.textContent = node.textContent.trim();
          node.replaceWith(label);
        }
      });
    });

    // A destination directly before a <section> is that group's
    // parent: it stops being a plain destination and becomes the
    // group's toggle — a caret at its trailing edge, aria-expanded
    // tracking the section's [open].
    destinations.querySelectorAll("section").forEach((group) => {
      const parent = group.previousElementSibling;
      if (!parent?.matches("a, button")) return;
      const caret = document.createElement("icon");
      caret.setAttribute("caret", "");
      caret.textContent = "arrow_drop_down";
      parent.appendChild(caret);
      parent.setAttribute(
        "aria-expanded",
        group.hasAttribute("open") ? "true" : "false"
      );
    });

    // Clicking a destination selects it. (Anchors still navigate —
    // selection is the component's feedback, the app owns the route.)
    // Selection clears within the destination's own group: a section
    // keeps its siblings, and the primaries keep theirs. A group
    // parent is the exception: clicking it toggles its section
    // instead — no selection, no "change", and a modal rail stays
    // open.
    this.addEventListener("click", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const dest = t?.closest("a, button");
      if (!dest || dest.closest("destinations") !== destinations) return;
      const group = dest.nextElementSibling;
      if (group?.tagName === "SECTION") {
        group.toggleAttribute("open");
        dest.setAttribute(
          "aria-expanded",
          group.hasAttribute("open") ? "true" : "false"
        );
        return;
      }
      this.#select(dest);
      if (this.hasAttribute("modal")) this.close();
    });

    // Modal rails live on a scrim, dismissed by it or by Escape.
    if (this.hasAttribute("modal")) {
      const scrim = document.createElement("scrim");
      this.after(scrim);
      scrim.addEventListener("click", () => this.close());
      if (this.hasAttribute("open")) {
        document.addEventListener("keydown", this.#onKey);
      }
    }

    this.#inited = true;
  }

  // -- bar --------------------------------------------------------------------

  #initBar() {
    // Destinations move into a <destinations> wrapper, like the rail's,
    // so selection clears within the bar's own group.
    const destinations = document.createElement("destinations");
    [...this.children].forEach((el) => {
      if (el.tagName === "A" || el.tagName === "BUTTON") {
        destinations.appendChild(el);
      }
    });
    this.appendChild(destinations);

    // Same wrapping as the rail: icons into an <indicator> pill,
    // label text into a <label>, so each animates on its own.
    [...destinations.querySelectorAll("a, button")].forEach((dest) => {
      const icons = [...dest.childNodes].filter(
        (n) => n instanceof Element && n.tagName === "ICON"
      );
      if (icons.length) {
        const indicator = document.createElement("indicator");
        dest.insertBefore(indicator, icons[0]);
        icons.forEach((icon) => indicator.appendChild(icon));
      }
      [...dest.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const label = document.createElement("label");
          label.textContent = node.textContent.trim();
          node.replaceWith(label);
        }
      });
    });

    // Clicking a destination selects it. Anchors still navigate —
    // selection is the component's feedback, the app owns the route.
    this.addEventListener("click", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const dest = t?.closest("a, button");
      if (!dest || dest.closest("destinations") !== destinations) return;
      this.#select(dest);
    });

    this.#inited = true;
  }

  #select(dest) {
    const dests = dest.parentElement;
    [...dests.children].forEach((d) => {
      if (d !== dest) d.removeAttribute("selected");
    });
    dest.setAttribute("selected", "");
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value:
            dest.getAttribute("value") ||
            dest.getAttribute("href") ||
            dest.textContent.trim(),
          destination: dest,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  // -- modal open / close -------------------------------------------------------

  #onKey = (e) => {
    if (e.key === "Escape") this.close();
  };

  show() {
    if (!this.hasAttribute("modal")) return;
    this.setAttribute("open", "");
    document.addEventListener("keydown", this.#onKey);
  }

  close() {
    if (!this.hasAttribute("modal")) return;
    this.removeAttribute("open");
    document.removeEventListener("keydown", this.#onKey);
  }

  toggle() {
    if (this.hasAttribute("open")) this.close();
    else this.show();
  }
}

if (!customElements.get("nmui-navigation")) {
  customElements.define("nmui-navigation", NMUINavigation);
}

export { NMUINavigation };
