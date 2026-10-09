# Rhythm Sanghi — portfolio and blog

My portfolio, project list and blog. The page includes a browser terminal,
animated backgrounds and Firebase-backed content.

## Preview the site

```sh
git clone https://github.com/Rhythm-Sanghi/Rhythm-Sanghi.github.io.git
cd Rhythm-Sanghi.github.io
python -m http.server 8080
```

Open http://localhost:8080. The page loads hosted styles, fonts and Firebase
modules, so those features need an internet connection. The Firebase browser
configuration is in `index.html`; use your own project when adapting the site.
Browser configuration is public, so access rules must be configured in Firebase.

## Optional Spotify service

`spotify-nowplaying.js` is a separate Express service. GitHub Pages serves static
files and does not run this Node server.

```sh
npm ci
npm start
```

Create a local `.env` with your own Spotify application's `SPOTIFY_CLIENT_ID`,
`SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. Do not commit credentials.
The service exposes `GET http://localhost:3000/nowplaying`. Connecting it to a
hosted page requires a separately deployed service and the appropriate frontend
request/origin configuration; starting it does not wire it into the page.

## Editing

- Update page content, links, animation names and terminal behavior in `index.html`.
- Configure Firebase content and access rules for your own deployment.
- Keep dependency versions in `package.json` and `package-lock.json`; install
  locally rather than committing `node_modules`.

## License

MIT. Dependency licenses remain with their respective packages.
