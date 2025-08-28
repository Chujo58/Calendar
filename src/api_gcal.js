const { google } = require("googleapis");
const Store = require("electron-store").default;
const fs = require("fs");
const path = require("node:path");

const keyPath = path.join(__dirname, "credentials.json");
const credentials = JSON.parse(fs.readFileSync(keyPath));
const store = new Store();

function getOAuth2Client() {
    const oAuth2Client = new google.auth.OAuth2(
        credentials.installed.client_id,
        credentials.installed.client_secret,
        credentials.installed.redirect_uris[0]
    );
    const tokens = store.get("tokens");
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
}

async function listEvents() {
    const calendar = google.calendar({
        version: "v3",
        auth: getOAuth2Client(),
    });
    const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
    });
    return res.data.items;
}

module.exports = { listEvents };
