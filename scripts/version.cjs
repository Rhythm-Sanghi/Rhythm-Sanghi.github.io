const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
function walk(name) {
  const file = path.join(root, name);
  return fs.statSync(file).isDirectory()
    ? fs.readdirSync(file).flatMap((child) => walk(`${name}/${child}`))
    : [name];
}
const names = [
  "index.html",
  "404.html",
  "assets",
  "src",
  "work",
  "notes",
  "profile",
  "robots.txt",
  "sitemap.xml",
]
  .flatMap(walk)
  .sort();
const hash = crypto.createHash("sha256");
for (const name of names) {
  const data = fs.readFileSync(path.join(root, name));
  const normalized = /\.(html|css|js|svg|txt|xml)$/.test(name)
    ? data.toString("utf8").replace(/\r\n/g, "\n")
    : data;
  hash.update(name + "\0").update(normalized);
}
const version =
  JSON.stringify({ digest: hash.digest("hex"), files: names.length }, null, 2) +
  "\n";
const target = path.join(root, "version.json");
if (process.argv.includes("--check")) {
  if (fs.readFileSync(target, "utf8") !== version)
    throw new Error("Version marker is stale. Run npm run prepare-site.");
  console.log("Deployment digest matches public files.");
} else fs.writeFileSync(target, version);
