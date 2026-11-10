#!/usr/bin/env python3
"""INI-driven SPA dev server — Python standard library only.

Reads router.ini (same folder) for host/port/root/fallback, serves
real files, and rewrites every other path to the fallback page so
the client-side router survives refreshes and deep links:

    python3 serve_ini.py
"""

import configparser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent

cfg = configparser.ConfigParser()
cfg.read(HERE / "router.ini")
root = (HERE / cfg["site"]["root"]).resolve()
fallback = cfg["site"]["fallback"]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        if path != "/" and not (root / path.lstrip("/")).exists():
            self.path = "/" + fallback + ("?" + query if query else "")
        return super().do_GET()

    def log_message(self, *args):
        pass  # quiet


if __name__ == "__main__":
    host = cfg["server"]["host"]
    port = cfg.getint("server", "port")
    with ThreadingHTTPServer((host, port), Handler) as httpd:
        print(f"serving {root} at http://{host}:{port}  (Ctrl+C to stop)")
        httpd.serve_forever()
