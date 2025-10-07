// Requires: npm install express axios dotenv

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Set your Spotify credentials in a .env file
// SPOTIFY_CLIENT_ID=your_client_id
// SPOTIFY_CLIENT_SECRET=your_client_secret
// SPOTIFY_REFRESH_TOKEN=your_refresh_token

async function getAccessToken() {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

app.get('/nowplaying', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Spotify API error:", error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Could not fetch now playing.' });
  }
});

app.listen(PORT, () => {
  console.log(`Spotify Now Playing API running on http://localhost:${PORT}/nowplaying`);
});