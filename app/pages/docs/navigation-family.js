// Sub-nav for the navigation family: one page per role, alphabetical.
// No drawer page: M3 Expressive deprecates the drawer in favour of
// the expanded rail showing secondary destinations, which the rail
// already does, so no drawer pass is built.
const LINKS = [
  ["/docs/navigation-bar", "Bar"],
  ["/docs/navigation-rail", "Rail"],
];

export function familyNav(active) {
  return `<nav class="docs-family">${LINKS.map(
    ([href, label]) =>
      `<a data-link href="${href}"${href === active ? ' aria-current="page"' : ""}>${label}</a>`
  ).join("")}</nav>`;
}
