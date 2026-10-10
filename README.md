# Rhythm Sanghi

My portfolio at [rhythm-sanghi.github.io](https://rhythm-sanghi.github.io/).

Plain HTML, CSS and JavaScript. No third-party runtime packages or external fonts. GitHub Pages serves the committed files from `master`.

## Preview

Requires Node.js 20 or later. Nothing to install:

```sh
npm run dev
```

Open http://127.0.0.1:8089. Set `PORT` for a different port. The server serves public pages/assets only, and returns the custom 404 page for missing pages.

## Editing

- `index.html`: introduction, featured projects, about and contact.
- `content/projects.json`: the five secondary project entries. Run `npm run projects` to update their static HTML; visitors do not fetch this file.
- `work/threadmark/` and `work/benchlight/`: case studies, measurements, interface walkthroughs and clearly labelled sample interactions.
- `notes/`: three short technical articles.
- `profile/index.html`: printable profile. `assets/rhythm-sanghi-profile.pdf` is the corresponding one-page download; update both together when facts change.
- `src/styles.css` and `src/pages.css`: home layout, shared page styles, responsive rules and print presentation.
- `src/app.js`, `src/theme.js`, `src/examples.js`: theme, navigation, email copy, screenshot focus and sample interactions.
- `content/sources.json`: project-documentation revisions used for the case studies and measurements.

After editing public content:

```sh
npm run prepare-site
npm run check
```

`prepare-site` refreshes the secondary list and `version.json`, a digest of the public files. `check` validates syntax, generated content, metadata, IDs, local links/anchors, images and source-size budgets. It does not replace visual review: check phone/desktop layouts, both themes, keyboard navigation and sample controls.

## Publishing and verification

Push to `master`. The existing GitHub Pages deployment publishes the repository root. The source workflow runs checks, then waits for the matching public digest and verifies the live pages and required assets:

```sh
npm run verify-live
```

The outbound GitHub-link check is available manually and runs monthly, rather than making every edit depend on remote services:

```sh
npm run check-links
```

A custom domain is optional. If one is added, update the canonical/structured-data/sharing URLs, sitemap and verification URL together, and set up DNS/HTTPS before adding `CNAME`.

## Images, measurements and license

Threadmark and Benchlight logos and screenshots come from their respective repositories. Threadmark captures render its UI using responses recorded from its Rust engine; Benchlight captures show a local Windows scan. The case studies link to the original capture notes and measurements at the recorded source revisions. Numbers are documented development measurements with their conditions and limits, not fresh benchmarks or general guarantees.

The browser examples use hand-written sample data. They do not run either application, inspect a visitor's files or perform cleanup. There is no database, tracking, authentication or contact form.

Source is licensed under [GPL-3.0](LICENSE), consistent with [Threadmark](https://github.com/Rhythm-Sanghi/Threadmark/blob/main/LICENSE) and [Benchlight](https://github.com/Rhythm-Sanghi/Benchlight/blob/main/LICENSE). Project branding identifies its respective project; a source license does not grant trademark rights.
