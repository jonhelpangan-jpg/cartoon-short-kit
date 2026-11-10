const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon"
};

function createStaticServer(root) {
  const base = path.resolve(root);
  return http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    } catch {
      res.writeHead(400).end("Bad request");
      return;
    }

    const relative = pathname.replace(/^[/\\]+/, "") || "index.html";
    const file = path.resolve(base, relative);
    if (file !== base && !file.startsWith(base + path.sep)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.stat(file, (statError, stat) => {
      const target = !statError && stat.isDirectory() ? path.join(file, "index.html") : file;
      fs.readFile(target, (error, data) => {
        if (error) {
          res.writeHead(error.code === "ENOENT" ? 404 : 500).end("File not found");
          return;
        }
        res.writeHead(200, {
          "Content-Type": MIME[path.extname(target).toLowerCase()] || "application/octet-stream",
          "Content-Length": data.length,
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store"
        });
        res.end(data);
      });
    });
  });
}

module.exports = { createStaticServer };
