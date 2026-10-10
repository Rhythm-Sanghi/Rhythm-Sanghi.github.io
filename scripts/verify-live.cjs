const fs = require("node:fs");
const path = require("node:path");
const base = new URL(
  process.env.SITE_URL || "https://rhythm-sanghi.github.io/",
);
const expected = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../version.json"), "utf8"),
);
const attempts = Number(process.env.VERIFY_ATTEMPTS || 24);
async function get(name) {
  const url = new URL(name, base);
  url.searchParams.set("verify", expected.digest.slice(0, 12));
  const response = await fetch(url, {
    headers: { "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`${url.pathname}: HTTP ${response.status}`);
  return response;
}
(async () => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const live = await (await get("version.json")).json();
      if (live.digest !== expected.digest)
        throw new Error("Waiting for the current deployment");
      for (const page of [
        "",
        "work/threadmark/",
        "work/benchlight/",
        "notes/relationships/",
        "notes/tool-origins/",
        "notes/measuring-refresh/",
        "profile/",
      ]) {
        const html = await (await get(page)).text();
        if (!html.includes("Rhythm Sanghi") || !html.includes('id="main"'))
          throw new Error(`${page}: unexpected HTML`);
      }
      for (const file of [
        "src/styles.css",
        "src/pages.css",
        "src/app.js",
        "src/examples.js",
        "assets/rhythm-sanghi-profile.pdf",
        "assets/threadmark-map.webp",
        "assets/benchlight-space.webp",
        "assets/threadmark-demo.mp4",
        "assets/benchlight-demo.mp4",
        "assets/threadmark-demo.vtt",
        "assets/benchlight-demo.vtt",
      ]) {
        const response = await get(file);
        if (!(await response.arrayBuffer()).byteLength)
          throw new Error(`Empty asset: ${file}`);
      }
      console.log(
        `Verified live deployment ${expected.digest.slice(0, 12)}: pages and required assets respond.`,
      );
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      console.log(`Attempt ${attempt}/${attempts}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
