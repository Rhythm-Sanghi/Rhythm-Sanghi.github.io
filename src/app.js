const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
function syncThemeButton() {
  const dark = root.dataset.theme === "dark";
  document.querySelector("#theme-label").textContent = dark ? "Light" : "Dark";
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content = dark
    ? "#111210"
    : "#f4f4f1";
}
themeButton.hidden = false;
syncThemeButton();
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("rhythm-theme", root.dataset.theme);
  } catch {
    /* Optional preference. */
  }
  syncThemeButton();
});
const navLinks = [...document.querySelectorAll(".section-nav a")];
const sections = navLinks.map((link) => document.querySelector(link.hash));
let scrollQueued = false;
function markSection() {
  const threshold = innerWidth <= 900 ? 145 : 135;
  let active = sections[0];
  for (const section of sections)
    if (section.getBoundingClientRect().top <= threshold) active = section;
  if (
    Math.ceil(scrollY + innerHeight) >=
    document.documentElement.scrollHeight - 5
  )
    active = sections.at(-1);
  for (const link of navLinks) {
    if (link.hash === `#${active.id}`)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scrollQueued = false;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(markSection);
    }
  },
  { passive: true },
);
addEventListener("resize", markSection);
markSection();
const filters = document.querySelector(".project-filters");
filters.hidden = false;
filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  let count = 0;
  for (const project of document.querySelectorAll(".project-row")) {
    project.hidden =
      button.dataset.filter !== "all" &&
      project.dataset.category !== button.dataset.filter;
    if (!project.hidden) count++;
  }
  for (const item of filters.querySelectorAll("button"))
    item.setAttribute("aria-pressed", String(item === button));
  document.querySelector("#filter-status").textContent =
    `${count} projects shown. Filter: ${button.textContent}.`;
  markSection();
});
const copyButton = document.querySelector("#copy-email");
if (navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText("rhythmsanghi06@gmail.com");
      status.textContent = "Email copied.";
    } catch {
      status.textContent =
        "Couldn’t copy. Select the email above, or open it in your mail app.";
    }
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
