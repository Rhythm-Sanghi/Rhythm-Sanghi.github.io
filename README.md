# Rhythm Sanghi

My portfolio at [rhythm-sanghi.github.io](https://rhythm-sanghi.github.io/).

Plain HTML, CSS and JavaScript. No build step, third-party packages or external fonts.

## Local preview

With Node.js 20 or later:

```sh
npm run dev
```

Open http://127.0.0.1:8089. There is nothing to install. Set `PORT` to use another port.

## Files

- `index.html` — projects, notes, biography and contact details.
- `src/styles.css` — layout, responsive rules and light/dark themes.
- `src/theme.js` — applies the saved theme before the page renders.
- `src/app.js` — navigation highlight, project filters and email copying.
- `assets/` — portfolio mark, project logos, screenshots and sharing image.
- `scripts/serve.cjs` — local preview server.
- `robots.txt`, `sitemap.xml`, `.nojekyll` — GitHub Pages metadata.

The Threadmark and Benchlight screenshots come from their repositories' `docs/screenshots` folders. Project notes link directly to the corresponding documentation.

## Checks

```sh
npm run check
```

This checks JavaScript syntax. For interface changes, preview narrow and wide screens, toggle both themes, and try the filters, project details and keyboard navigation.

## Publishing

GitHub Pages serves the repository root directly. Commit the source files and assets; no generated output is needed.
