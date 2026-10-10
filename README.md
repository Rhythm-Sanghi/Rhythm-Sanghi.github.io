# Rhythm Sanghi — portfolio

My project portfolio and build notes. The interface uses the warm neutrals, fine borders and green/ochre accents of Threadmark and Benchlight, with a simple section index and system fonts.

## Preview

Requires Node.js 20+; the static site itself has no package dependencies or build step.

```sh
npm run dev
```

Open http://127.0.0.1:8089. The preview server exposes only the public page, source and assets, never local `.env` or Git metadata. GitHub Pages can serve these files directly from the repository root.

## Edit

- `index.html`: biography, selected work, projects, notes and contact links. Core content is readable without JavaScript or network services.
- `src/styles.css`: palette, layout, both themes and responsive rules.
- `src/theme.js`: saved/system preference applied before paint.
- `src/app.js`: section index, filters and email copy.
- `assets/`: personal mark, application logos, optimized screenshots and sharing image. Threadmark’s map and Benchlight’s Space capture come from their respective `docs/screenshots` folders. The pictures are actual application captures, not interactive demos.

Project descriptions and notes link to the actual repositories. The earlier Firestore post is not shown: its camera/drone fire-detection narrative does not match the current CSV/Gemini UFDR prototype. The remote blog collection is untouched; previous site source remains in Git history. Education and contact details are carried over from the earlier portfolio. Keep these facts current when editing.

## Check

```sh
npm run check
```

This checks JavaScript syntax. Also preview phone/desktop layouts, both themes, filters and detail disclosures before publishing. Test keyboard navigation, focus visibility and reduced-motion behavior after interface changes.

## Optional Spotify service

The portfolio no longer displays a simulated now-playing track. `spotify-nowplaying.js` remains a separate optional Express service; GitHub Pages does not execute it.

```sh
npm ci
npm start
```

Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` in an untracked local `.env`. The service exposes `GET http://localhost:3000/nowplaying`. It is not connected to the page. Deploy it separately if you choose to add a real playback indicator.

## License

MIT. Dependencies retain their respective licenses.
