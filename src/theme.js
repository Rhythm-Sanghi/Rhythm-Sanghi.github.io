// Apply the saved preference before paint. The default remains usable without storage.
try {
  const saved = localStorage.getItem("rhythm-theme");
  if (saved === "light" || saved === "dark")
    document.documentElement.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.dataset.theme = "dark";
} catch {
  /* Optional preference. */
}
