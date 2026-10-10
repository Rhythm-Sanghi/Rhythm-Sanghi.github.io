const graph = {
  readConfig: [],
  loadItems: ["readConfig"],
  renderList: ["loadItems"],
  exportItems: ["loadItems"],
};
for (const figure of document.querySelectorAll(".capture-zoom")) {
  const button = figure.querySelector(".focus-toggle");
  button.hidden = false;
  button.addEventListener("click", () => {
    const focused = figure.classList.toggle("is-focused");
    button.setAttribute("aria-pressed", String(focused));
    button.textContent = focused
      ? "Show full view"
      : "Focus on the right-hand detail";
  });
}
function reaches(from, target, visited = new Set()) {
  if (visited.has(from)) return false;
  visited.add(from);
  return graph[from].some(
    (next) => next === target || reaches(next, target, visited),
  );
}
const directoryEvidence = {
  dependencies: [
    "Rebuildable · review required",
    "A dependency directory next to a package manifest is a candidate for review. Local edits may still be valuable.",
    "Before any real cleanup: inspect the contents, create a plan, revalidate it and explicitly confirm recycling.",
  ],
  source: [
    "Protected",
    "Source files are project material. Their size is not a reason to offer them for cleanup.",
    "Excluded from an ordinary cleanup plan.",
  ],
  unknown: [
    "Review",
    "The name archive does not establish whether its contents can be rebuilt. The classification remains uncertain.",
    "Inspect manually. This sample does not offer a cleanup plan for Review items.",
  ],
  partial: [
    "Incomplete measurement",
    "The scan has not established a complete size or identity for this directory.",
    "Finish the measurement first. Partial evidence cannot authorize cleanup.",
  ],
};
for (const panel of document.querySelectorAll("[data-demo]")) {
  const controls = panel.querySelector(".demo-nodes");
  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !controls.contains(button)) return;
    for (const item of controls.querySelectorAll("button"))
      item.setAttribute("aria-pressed", String(item === button));
    if (panel.dataset.demo === "threadmark") {
      const name = button.dataset.symbol;
      const dependencies = graph[name];
      const impact = Object.keys(graph).filter(
        (other) => other !== name && reaches(other, name),
      );
      panel.querySelector("#symbol-name").textContent = name;
      panel.querySelector("#symbol-dependencies").textContent =
        `Direct dependencies: ${dependencies.length ? dependencies.join(", ") : "none in this sample"}.`;
      panel.querySelector("#symbol-impact").textContent =
        `Reverse reachability: ${impact.length ? impact.join(", ") : "none in this sample"}.`;
    } else {
      const values = directoryEvidence[button.dataset.directory];
      [
        "directory-classification",
        "directory-reason",
        "directory-action",
      ].forEach((id, index) => {
        panel.querySelector(`#${id}`).textContent = values[index];
      });
    }
  });
}
