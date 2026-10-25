# Buckeye Connect

A React app that helps Ohio State students discover people, clubs, and projects through shared interests. Built as an independent hackathon prototype with a scarlet-and-gray design.

## Run locally

Install Node.js 20 or newer, then open this folder in Cursor or another editor.

```sh
npm ci
npm run dev
```

Open the address printed in the terminal, usually `http://127.0.0.1:5173/`.

## Build and test

```sh
npm test
npm run build
npm run preview
```

The production website is generated in `dist/`. A static hosting service can build it with `npm ci && npm run build` and serve `dist/`.

## Features

- Home screen with Projects, Clubs, and Network.
- Editable profiles with professional, casual, and custom interests; optional background and community preferences; .edu email; bio; and weekly availability.
- A 227-listing club catalog, with search, filters, and recommendations that rank distinct shared interests first.
- Connections-in-clubs indicators and links to existing conversations.
- Project and club upload requests held for approval in the prototype.
- Networking on/off switch and received invites with profile preview, acceptance, and decline.
- Local conversations and a meetup picker with flexible dates and times.
- Resettable demo history with an undo option.

## Demo starting point

A new browser opens with Jonathan Vuppu, a second-year Mechanical Engineering student. Ian Shang and Zain Merchant are existing demo connections. A pending invitation from Susheel Vadrevu demonstrates received requests. Club memberships and conversations are simulated.

Profiles, networking preferences, follows, conversations, and meetup suggestions are stored in the visitor's browser using localStorage. Reloading the page preserves this browser's activity. **Reset demo connections** clears interaction history while retaining the profile. The one-time demo invitations and connections do not automatically reappear after a reset.

This prototype has no shared backend, real authentication, email verification, cross-user messaging, live invite delivery, or connected moderation service. Email addresses are not verified. The networking controls demonstrate the intended behavior; a future backend must enforce recipient preferences before delivering real invites.

## Project layout

| Path | Purpose |
| --- | --- |
| `src/main.jsx` | App navigation, student discovery, connections, and conversations |
| `src/community.jsx` | Home, club and project discovery, listing requests, and organizer demo |
| `src/profile.jsx` | Profile editing and local persistence |
| `src/recommendations.js` | Shared-interest ranking |
| `src/network-invites.js` | Invite rules and demo invitation |
| `src/club-connections.js` | Demo memberships and mutual connections |
| `src/demo-profile.js` | Jonathan's default demo profile |
| `src/club-catalog.json` | Combined club directory |
| `src/*.css` | Responsive UI styles |
| `public/images/` | Bundled website images |
| `data/` | Supplied club source data |
| `scripts/import-clubs.py` | Rebuilds the catalog from the supplied data |
| `tests/` | Automated ranking, catalog, connection, reset, and invitation checks |

The catalog importer uses Python's standard library:

```sh
python scripts/import-clubs.py
```

The two 200-club source files contain the same entries. The importer combines them with the original 50-club list, retains stable IDs, and merges documented alternate names into 227 listings. It does not invent current events, member counts, or club-specific website URLs.

## Put this project on GitHub

1. Create a new repository on GitHub, for example `buckeye-connect`.
2. Upload the contents of this folder, including `src`, `public`, `data`, `scripts`, `tests`, `index.html`, both package files, and `.gitignore`.
3. Commit the upload. Collaborators can clone the repository and follow the local setup above.

Upload the extracted project files, rather than only the ZIP archive. This export excludes the original hosting configuration, hosting Git history, dependencies, build output, and local browser data. Uploading to GitHub creates a source repository; website hosting is configured separately.
