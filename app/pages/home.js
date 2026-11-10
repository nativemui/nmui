import homeStyles from "./home.css" with { type: "css" };
import { nav } from "./nav.js";

if (!document.adoptedStyleSheets.includes(homeStyles)) {
  document.adoptedStyleSheets.push(homeStyles);
}

export const title = "nmui — native Material 3";

export function render(mount, nmui) {
  mount.innerHTML = `
  <div class="home">
    ${nav("/")}
    <header class="home-hero">
      <img class="home-mark" src="/assets/mark.svg" alt="">
      <label large class="home-kicker">native material ui</label>
      <display large>nmui</display>
      <nmui-chip class="home-version">v${nmui.version}</nmui-chip>
      <headline small class="home-tagline">
        Material&nbsp;3 Expressive, in vanilla JS/HTML/CSS.
        No framework. No build step. No dependencies.
      </headline>
      <nmui-button tonal large id="home-docs">Read the docs</nmui-button>
      <nmui-button outlined large id="home-theme">Toggle theme</nmui-button>
    </header>
    <section class="home-points">
      <nmui-card outlined>
        <headline small>One tag</headline>
        <p>Bare attributes declare role and variants. <code>&lt;nmui-button tonal large&gt;</code> is the whole API.</p>
      </nmui-card>
      <nmui-card outlined>
        <headline small>One attribute theme</headline>
        <p><code>&lt;html theme="dark"&gt;</code> recolors the library. Try the toggle — this page is the demo.</p>
      </nmui-card>
      <nmui-card outlined>
        <headline small>Zero baggage</headline>
        <p>Import one component, use one component. No runtime, no bundle, no build.</p>
      </nmui-card>
    </section>
  </div>`;

  mount.querySelector("#home-docs")?.addEventListener("click", () => nmui.navigate("/docs"));
  mount
    .querySelector("#home-theme")
    ?.addEventListener("click", () =>
      nmui.theme(nmui.themeName === "dark" ? "light" : "dark")
    );
}
