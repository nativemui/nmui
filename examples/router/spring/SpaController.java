/* Spring Boot — a forwarding controller (FRAGMENT).
 * Forward (do not redirect) every extension-less path to the app.
 * Paths containing a dot are treated as files and left to the
 * static resource handler. Put the built app in src/main/resources/static/.
 * Keep /api controllers on more specific mappings — Spring prefers
 * the most specific match, so they win over this catch-all. */
@Controller
class SpaController {
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
