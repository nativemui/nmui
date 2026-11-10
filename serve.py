#!/usr/bin/env python3
"""nmui dev server — static files plus an SPA fallback (stdlib only).

Serves this folder. Unknown paths fall back to index.html so the
client-side router survives refreshes and deep links:

    python3 serve.py [port]      # http://localhost:8080 by default
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        raw = self.path
        path, _, query = raw.partition("?")
        target = ROOT / path.lstrip("/")
        # Real files and directories serve normally; everything else is a
        # client-side route — boot index.html and let the router take it.
        if path != "/" and not target.exists():
            self.path = "/index.html" + ("?" + query if query else "")
        return super().do_GET()

    def log_message(self, *args):
        pass  # quiet


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    with ThreadingHTTPServer(("127.0.0.1", port), Handler) as httpd:
        print(f"nmui at http://localhost:{port}  (Ctrl+C to stop)")
        httpd.serve_forever()
