// Express — serve a folder with SPA fallback.
//   npm install express
//   node express-server.js        # http://localhost:8080
import express from "express";
import path from "node:path";

const root = process.cwd();
const app = express();

app.use(express.static(root)); // real files first

// Everything else is a client-side route.
// (Express 5 spells the wildcard "/*splat" instead of "*".)
app.get("*", function (req, res) {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(8080);
