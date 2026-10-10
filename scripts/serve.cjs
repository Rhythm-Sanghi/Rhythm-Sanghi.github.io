// Static preview: serve only public site files, never .env or repository metadata.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8089);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      const name = pathname === "/" ? "/index.html" : pathname;
      const file = path.resolve(root, "." + name);
      const relative = path.relative(root, file);
      const allowed =
        ["index.html", "robots.txt", "sitemap.xml"].includes(relative) ||
        ["assets", "src"].includes(relative.split(path.sep)[0]);
      if (!allowed || relative.startsWith("..") || !mime[path.extname(file)]) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      const data = await fs.readFile(file);
      response.writeHead(200, {
        "Content-Type": mime[path.extname(file)],
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : data);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Portfolio preview: http://127.0.0.1:${port}`),
  );
