// Sub-nav for the button family: one page per button type.
const LINKS = [
  ["/docs/button", "Button"],
  ["/docs/toggle-button", "Toggle"],
  ["/docs/icon-button", "Icon"],
  ["/docs/toggle-icon-button", "Toggle icon"],
  ["/docs/split-button", "Split"],
  ["/docs/button-group", "Group"],
  ["/docs/connected-button-group", "Connected group"],
  ["/docs/fab", "FAB"],
  ["/docs/extended-fab", "Extended FAB"],
  ["/docs/fab-menu", "FAB menu"],
];

export function familyNav(active) {
  return `<nav class="docs-family">${LINKS.map(
    ([href, label]) =>
      `<a data-link href="${href}"${href === active ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("")}</nav>`;
}
