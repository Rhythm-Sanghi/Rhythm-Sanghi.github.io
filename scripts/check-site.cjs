const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const publicRoots = ["index.html", "404.html", "work", "notes", "profile"];
function walk(name) {
  const file = path.join(root, name);
  return fs.statSync(file).isDirectory()
    ? fs.readdirSync(file).flatMap((child) => walk(path.join(name, child)))
    : [name];
}
const pages = publicRoots
  .flatMap(walk)
  .filter((name) => name.endsWith(".html"));
const ids = new Map();
const errors = [];
function check(ok, message) {
  if (!ok) errors.push(message);
}
for (const name of pages) {
  const html = fs.readFileSync(path.join(root, name), "utf8");
  const values = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  ids.set(path.resolve(root, name), new Set(values));
  check(new Set(values).size === values.length, `${name}: duplicate IDs`);
  check((html.match(/<h1\b/g) || []).length === 1, `${name}: expected one h1`);
  check(/<html\b[^>]*lang="en"/.test(html), `${name}: missing language`);
  check(/<title>[^<]+<\/title>/.test(html), `${name}: missing title`);
  check(
    /name="description"\s+content="[^"]+"/.test(html),
    `${name}: missing description`,
  );
  check(
    html.includes('class="skip-link"') && values.includes("main"),
    `${name}: missing skip link target`,
  );
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    check(/\balt="[^"]*"/.test(image[0]), `${name}: image without alt`);
    check(
      /\bwidth="\d+"/.test(image[0]) && /\bheight="\d+"/.test(image[0]),
      `${name}: image without explicit dimensions`,
    );
  }
  for (const script of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(script[1]);
    } catch {
      errors.push(`${name}: invalid structured data`);
    }
  }
}
const referencedAssets = new Set();
for (const name of pages) {
  const html = fs.readFileSync(path.join(root, name), "utf8");
  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(ref)) continue;
    const url = new URL(
      ref,
      `https://portfolio.invalid/${name.replaceAll(path.sep, "/")}`,
    );
    let target = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (url.pathname.endsWith("/")) target = path.join(target, "index.html");
    check(target.startsWith(root + path.sep), `${name}: path outside site`);
    check(
      fs.existsSync(target) && fs.statSync(target).isFile(),
      `${name}: missing ${ref}`,
    );
    if (target.includes(path.sep + "assets" + path.sep))
      referencedAssets.add(target);
    if (url.hash)
      check(
        ids.get(target)?.has(decodeURIComponent(url.hash.slice(1))),
        `${name}: missing anchor ${ref}`,
      );
  }
}
for (const asset of fs.readdirSync(path.join(root, "assets"))) {
  const inMetadata = pages.some((name) =>
    fs
      .readFileSync(path.join(root, name), "utf8")
      .includes(`content="https://rhythm-sanghi.github.io/assets/${asset}"`),
  );
  check(
    referencedAssets.has(path.join(root, "assets", asset)) || inMetadata,
    `Unreferenced public asset: ${asset}`,
  );
}
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
check(
  !/linkedin|gridsync/i.test(home),
  "Removed links returned to the home page",
);
const rows = [...home.matchAll(/class="row-index mono">(\d+)/g)].map(
  (m) => m[1],
);
check(
  rows.every((value, index) => value === String(index + 1).padStart(2, "0")),
  "Project numbering is not sequential",
);
for (const file of [
  "src/styles.css",
  "src/pages.css",
  "src/app.js",
  "src/theme.js",
  "src/examples.js",
]) {
  check(
    fs.statSync(path.join(root, file)).size < 50000,
    `${file}: review the source size budget`,
  );
}
if (errors.length) throw new Error(errors.join("\n"));
assert.equal(pages.length, 8);
console.log(
  `${pages.length} HTML pages: metadata, IDs, anchors, assets, image attributes and source budgets passed.`,
);
