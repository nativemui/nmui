// Plain Node — SPA fallback with zero dependencies.
//   node plain-server.js          # http://localhost:8080
// The MIME map matters: browsers refuse to run module scripts
// served without a JavaScript content type.
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";

const root = process.cwd();
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

createServer(async function (req, res) {
  let file = join(root, req.url.split("?")[0]);
  try {
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
  } catch {
    file = join(root, "index.html"); // not a file -> client-side route
  }
  res.setHeader(
    "Content-Type",
    types[extname(file)] || "application/octet-stream"
  );
  createReadStream(file).pipe(res);
}).listen(8080);
