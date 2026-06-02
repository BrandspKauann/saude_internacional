import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const siteDir = path.join(rootDir, "site");
const port = Number(process.env.PORT || 4174);

const redirectRoutes = new Map([
  ["/ig", "/links?utm_source=instagram&utm_medium=social&utm_campaign=organico&utm_id=campanha_1&utm_content=bio"],
  ["/tiktok", "/links?utm_source=tiktok&utm_medium=social&utm_campaign=organico&utm_id=campanha_1&utm_content=bio"],
  ["/linkedin", "/links?utm_source=linkedin&utm_medium=social&utm_campaign=organico&utm_id=campanha_1&utm_content=post"],
  ["/facebook", "/links?utm_source=facebook&utm_medium=social&utm_campaign=organico&utm_id=campanha_1&utm_content=post"],
  ["/youtube", "/links?utm_source=youtube&utm_medium=social&utm_campaign=organico&utm_id=campanha_1&utm_content=descricao"]
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "text/xml; charset=utf-8"
};

function resolvePath(requestPath) {
  const pathname = decodeURIComponent(new URL(requestPath, "http://localhost").pathname);
  const normalized = path.normalize(path.join(siteDir, `.${pathname}`));
  const relative = path.relative(siteDir, normalized);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return normalized;
}

async function sendFile(res, filePath) {
  const fileStats = await stat(filePath);

  if (!fileStats.isFile()) {
    return false;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  res.writeHead(200, {
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    "Content-Length": fileStats.size,
    "Content-Type": contentType
  });

  createReadStream(filePath).pipe(res);
  return true;
}

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const normalizedPath = requestUrl.pathname.replace(/\/$/, "") || "/";
  const redirectTarget = redirectRoutes.get(normalizedPath);

  if (redirectTarget) {
    res.writeHead(307, {
      "Cache-Control": "no-cache",
      "Location": redirectTarget
    });
    res.end();
    return;
  }

  const targetPath = resolvePath(req.url || "/");

  if (!targetPath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  const hasExtension = path.extname(targetPath) !== "";
  const candidate =
    existsSync(targetPath) && (await stat(targetPath)).isFile()
      ? targetPath
      : existsSync(path.join(targetPath, "index.html"))
        ? path.join(targetPath, "index.html")
        : null;

  try {
    if (candidate && (hasExtension || candidate !== path.join(siteDir, "index.html"))) {
      await sendFile(res, candidate);
      return;
    }

    await sendFile(res, path.join(siteDir, "index.html"));
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Saude Internacional running at http://localhost:${port}`);
});
