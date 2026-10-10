const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const projects = JSON.parse(
  fs.readFileSync(path.join(root, "content/projects.json"), "utf8"),
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const names = new Set();
const rows = projects
  .map((project, index) => {
    for (const key of ["name", "url", "category", "description", "stack"])
      if (typeof project[key] !== "string" || !project[key].trim())
        throw new Error(`Missing ${key} in project ${index + 1}`);
    if (!project.url.startsWith("https://github.com/Rhythm-Sanghi/"))
      throw new Error(`Unexpected project URL: ${project.url}`);
    if (names.has(project.name))
      throw new Error(`Duplicate project: ${project.name}`);
    names.add(project.name);
    return `            <a class="project-row" href="${escape(project.url)}">
              <span class="row-index mono">${String(index + 1).padStart(2, "0")}</span>
              <div><h3>${escape(project.name)} <span class="project-status">${escape(project.category)}</span></h3><p>${escape(project.description)}</p></div>
              <span class="row-tech mono">${escape(project.stack)}</span><span class="row-arrow" aria-hidden="true">↗</span>
            </a>`;
  })
  .join("\n");
const file = path.join(root, "index.html");
const html = fs.readFileSync(file, "utf8");
const pattern = /<!-- projects:start -->[\s\S]*?<!-- projects:end -->/;
if (!pattern.test(html)) throw new Error("Missing project list markers");
const next = html.replace(
  pattern,
  `<!-- projects:start -->\n${rows}\n            <!-- projects:end -->`,
);
if (process.argv.includes("--check")) {
  if (next !== html)
    throw new Error("Project list is stale. Run npm run projects.");
  console.log(
    `${projects.length} project entries match content/projects.json.`,
  );
} else {
  fs.writeFileSync(file, next);
  console.log(`Updated ${projects.length} project entries.`);
}
