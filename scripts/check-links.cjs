const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
function walk(name) {
  const file = path.join(root, name);
  return fs.statSync(file).isDirectory()
    ? fs.readdirSync(file).flatMap((child) => walk(`${name}/${child}`))
    : [name];
}
const urls = new Set();
for (const name of ["index.html", "work", "notes", "profile"].flatMap(walk)) {
  for (const match of fs
    .readFileSync(path.join(root, name), "utf8")
    .matchAll(/href="(https:\/\/github\.com\/[^"#]+)(?:#[^"]*)?"/g))
    urls.add(match[1]);
}
(async () => {
  const failures = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "portfolio-link-check" },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) failures.push(`${response.status}: ${url}`);
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${error.message}: ${url}`);
    }
  }
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`${urls.size} outbound GitHub links passed.`);
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
