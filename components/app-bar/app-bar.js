import appBarStyles from "./app-bar.css" with { type: "css" };

if (!document.adoptedStyleSheets.includes(appBarStyles)) {
  document.adoptedStyleSheets.push(appBarStyles);
}

/**
 * <nmui-app-bar> — M3 Expressive top app bar. The row above
 * everything, placed at the top of the screen.
 *
 * Variants (pick one; small is the default):
 *   <nmui-app-bar>           small, single row, 64dp
 *   <nmui-app-bar medium>    medium flexible, 112dp (136dp with
 *                            a subtitle)
 *   <nmui-app-bar large>     large flexible, 120dp (152dp with
 *                            a subtitle)
 * Baseline medium/large are not recommended in M3 Expressive and
 * are not implemented — [medium] and [large] ARE the flexible
 * variants, which hug their text and support multi-line titles.
 *
 * Configurations:
 *   [center]    centered title text (center-aligned is merged
 *               into small in M3E — this is that configuration)
 *   [scrolled]  the on-scroll fill (surface-container). The app
 *               toggles it from its own scroll handler; the bar
 *               can't know which element scrolls.
 *
 * Children, in order — leading, title, subtitle, trailing:
 *   <nmui-app-bar>
 *     <nmui-button icon standard>menu</nmui-button>
 *     <headline>Title</headline>
 *     <subtitle>Supporting text</subtitle>
 *     <nmui-button icon standard>more_vert</nmui-button>
 *   </nmui-app-bar>
 *
 * The title is <headline>, <nmui-title>, or any element with a
 * [title] attribute; inside a bar the variant sets its type, so
 * don't size the headline yourself. Leading children sit before
 * the title, trailing children after it — trailing pins to the
 * end automatically. Actions are shown as standard icon buttons.
 * The search app bar is a separate pass: its container is easy,
 * but opening the search view is not this component.
 */
class NMUIAppBar extends HTMLElement {
  #ready = false;

  connectedCallback() {
    if (this.#ready) return;
    this.#ready = true;
    if (!this.hasAttribute("role")) this.setAttribute("role", "banner");
  }
}

if (!customElements.get("nmui-app-bar")) {
  customElements.define("nmui-app-bar", NMUIAppBar);
}

export { NMUIAppBar };
