# Buckeye Connect

A React campus involvement prototype for the Honda Bridge Builder challenge. Built for local editing in Cursor. The home screen opens three connected sections: Projects, Clubs, and Network.

## Run

```sh
npm install
npm run dev
```

Open the local address printed by Vite. To make a production build, run `npm run build`.

## Try the flow

1. Select **Network** on the home screen to meet students.
2. Explore student profiles and their highlighted common interests. Filters can limit discovery to newer students.
3. Pass or select **Let's connect**. Pratish, Sofia, and Eli simulate mutual interest; Jeremy demonstrates a pending connection request.
4. Open the conversation, use the suggested icebreaker or write a message, and suggest or reschedule a campus café meetup.
5. Return to **Connections** to reopen a conversation.

All profiles are fictional. Mutual interest is simulated. Network connections, messages, requests, and meeting suggestions are saved in this browser. No messages are sent to real people. Authentication, school verification, real matching, calendars, and a database are future integrations. Sample relative meeting times are illustrative.

Source: `src/main.jsx`; styling: `src/styles.css`.

## Projects and clubs

- **Projects:** Discover projects by category. Select **I'm interested** to save a project and open a conversation with its creator. Reopen conversations from **My projects**. Use **Post a project** to request approval for a new demo listing with interests, needs, commitment, and learning goals.
- **Clubs:** Discover and follow clubs. Following adds every club event to **My clubs → Your club calendar** and includes the club's announcements. Unfollowing removes its events and announcements from the combined view.
- **Club organizer:** This is a simulated organizer workspace, not an authenticated admin account. Approved clubs can publish events and announcements from the organizer workspace. Pending club requests cannot publish updates or enter discovery.
- Project and club listings, interests, and project messages are saved in browser local storage. Network conversations are also saved locally. No messages or notifications go to real people. Club dates are illustrative sample events. The club calendar is in-app; it does not sync with Google, Apple, or Outlook calendars.

Home, project, and club components: `src/community.jsx`; additional styles: `src/community.css`.

## Ohio State theme

The app uses Ohio State scarlet (#ba0c2f), gray (#a7b1b7), and supporting gray tones from the [Buckeye UX palette](https://bux.osu.edu/color/primary-colors/). Theme overrides live in `src/ohio-state.css` and `src/scarlet.css`. The main canvas is scarlet with gray and white cards. Buckeye Connect remains an independent student prototype, with original graphics and demo communities.

## Advertising your project or club

Use **Post a project** or **Advertise a club** on Home or in either section, then **Request upload**. The listing is stored with pending status and appears only in **Your listings** as **Awaiting approval**. It is excluded from discovery, followed listings, calendars, announcements, and organizer controls until explicitly approved. Editing a listing resubmits it for review and preserves club events and announcements. Legacy user-created demo listings without approval status are treated as pending too; sample listings are pre-approved.

There is no student self-approval control. This browser-local prototype does not yet connect to a moderator account or shared database, so new requests remain pending. Production moderation must validate permissions and enforce approval on the server. The demo limits new requests to three pending per section and prevents duplicate owned titles. Users can still edit their requests.

## Your profile

Select **Create profile** in the header or on Home. Enter a name, college major, and college email ending in `.edu`, choose at least one interest from the professional and casual interest groups, and optionally add a bio (up to 500 characters). The email is private and format-validated; ownership verification is not connected. The live preview updates as you type. After saving, **My profile → Edit profile** lets you update it or cancel changes.

Profiles save to browser local storage and survive refreshes. They update your displayed name and initials, student recommendations and shared-interest counts, and project/club ordering and highlighted tags. New project forms also start with your name as creator. Before profile creation, visitors can choose quick starter interests; with no signals, discovery offers an explicitly labeled mix to explore. The profile is local to this browser, with no account verification or sharing between users yet.

Profile components and shared state: `src/profile.jsx`; layout: `src/profile.css`.

## Availability and meetup suggestions

Profiles can optionally save recurring weekly availability with multiple windows per day. End times must follow start times, and overlapping windows are rejected. Turning off a day removes its windows. Old profiles load safely with an empty email and no availability, and require a `.edu` email on their next save. Profile data remains local to this browser.

The **Suggest a meetup** button in Network chat opens a separate scheduling popup with a calendar-style seven-day selector plus unrestricted date and minute-level time inputs, duration, and a public meeting location. It shows the selected person's availability and checks whether the whole meeting fits their windows and your own. Out-of-availability suggestions require an explicit confirmation. Past times and meetings crossing midnight are rejected. Suggestions can be rescheduled and remain awaiting the other person's confirmation.

All availability and meetup times use **America/New_York (Eastern Time)**. The Network demo students have clearly labeled sample availability; real users' chosen availability will need a shared database to appear across accounts. Google Calendar sync, automatic booking, and email verification are not connected. Meetup suggestions save to local storage with the Network conversations.

Scheduling logic: `src/scheduling.js`; weekly editor: `src/availability.jsx`; meeting planner: `src/meeting-picker.jsx`; styles: `src/scheduling.css`.


## Home imagery and Network easter egg

Home uses the three supplied photos from `public/images/`: project collaboration, a student group for Clubs, and Ohio Stadium for Network. Original files are preserved. Pratish Agarwal and Jeremy Perrin remain fictional Network demo profiles, but no longer have pinned positions: all students are ranked by relevance to the current profile.


## Search, conversations, and profile improvements

- **Club catalogue:** `src/club-catalog.json` contains the 50 clubs, 211 distinct interest labels, and category tags from the supplied `ohio_state_50_diverse_clubs.xlsx`, worksheet `50 Clubs`. No meeting dates, member counts, announcements, or individual club website URLs were supplied, so these are not invented. The official directory link is from the workbook's source notes. Current club registration has not been independently verified.
- **Migration:** The catalogue is merged into existing local club data. Existing user requests and messages are retained. Old fictional starter clubs are kept for previously saved conversations/follows but excluded from discovery. New requests still require approval.
- **Search:** Clubs can be searched by name, activity, or category. Missing clubs can be requested with their name prefilled. The profile's **Clubs you're curious about** dropdown accepts both catalogue suggestions and custom names; catalogue selections add their supplied interest labels. Profile searches cover expanded professional and casual interest options, and **Add interest** accepts custom text in either group.
- **Shared traits:** Matching interest tags, counts, and fit explanations use green. Match explanations come from saved interests, not invented compatibility scores.
- **Messages:** Projects and Clubs have visible **Messages** buttons, and Network has **Messages & connections**. All three reopen locally stored conversations. Club organizer announcements remain available under club updates. No messages are sent to real people.
- **Scheduling:** Chat stays compact. **Suggest a meetup** opens a separate popup, with **Back to conversation** and Escape/close returning to chat.
- **Links:** Club requests accept an optional website; project requests accept an optional owner LinkedIn URL. Only HTTP(S) links are allowed; LinkedIn links must use a LinkedIn hostname. They survive resubmission and appear with the listing and in relevant detail/chat views.
- **Sign out:** My Profile and Edit Profile include **Sign out**. It hides the local app and persists across refreshes/tabs while retaining the saved profile and conversations. **Resume saved profile** reopens this local demo. This is not authenticated account security.

Search controls: `src/discovery-controls.jsx`; link checks: `src/discovery-utils.js`; persistence: `src/storage.js`; updated styles: `src/round-improvements.css`.


## Cold-start recommendations

All three discovery sections use the same content-based ranking engine in `src/recommendations.js`. No past clicks or other users are required. Scores are internal ranking values, not compatibility probabilities.

The engine sorts first by distinct shared interests (professional, casual and custom, with aliases such as Coding/Programming). Major/field relationships and weak positive feedback only break equal-count ties. Exact matches, major matches, related topics, and activity-based reasons are distinguished in the interface. For students, overlapping availability is only a small tie-breaker. Names, email addresses, and photos are not ranking signals, and no demographic inference is used.

Club-name selections no longer receive a separate boost. Pending/rejected requests and legacy starter listings are excluded before ranking. Already followed/joined items and connected students remain accessible in their saved/message views rather than repeating in discovery. Existing category/search filters still narrow the ranked results.

A genuinely new visitor sees a spread of fields marked as exploratory, with quick interest buttons on Home and every discovery section. Choosing interests immediately reranks all sections and carries the selections into profile creation. With an unrecognized custom interest and no other relevant signal, the UI says it is suggesting exploration instead of inventing a match. Preferences and positive feedback stay in browser local storage.

The demo now has 12 fictional students and 10 fictional student projects covering software, finance, creative work, engineering, community, gaming, education, and the outdoors. The 50 supplied clubs are unchanged. Fictional projects and sample availability are labeled. The new sample catalogue merges into existing local data without deleting user requests, chats, or saved items.

### Demo walkthrough

Create or edit a profile and change the major/interests to see the ranking respond. These examples require no interaction history:

| Profile | First person | First project | First club |
| --- | --- | --- | --- |
| Computer Science + Coding + Artificial Intelligence | Avery Patel | Study tools, built together | Artificial Intelligence Club |
| Finance + Investing + Financial Modeling | Sam Taylor | Buckeye budget buddy | Buckeye Capital Investors |
| Undecided + Music + Art + Creative Writing | Riley Evans | Campus sound sessions | The Columbus Kaleidoscope |

Selected interests, previous connections/follows, filters, or local activity can change the displayed result. Update interests when demonstrating a different profile. You do not need to reset the real saved conversations or pending requests.

Run `npm run test:recommendations` for 10 tests covering profile switching, major-only startup, unknown/empty profiles, aliases, no name pinning, club preference, moderation, duplicate tags, positive feedback bounds, and availability tie-breaking. Run `npm run build` to check the React app.


### Buckeye Connect profile and ranking update

The Interests field accepts catalog suggestions and custom text without automatically adding a club’s entire tag list. Existing saved profiles and conversations retain their storage keys. Legacy club-name selections are preserved as editable custom interests.

Ranking now sorts by the number of distinct matching selected interests first (including catalog categories and exact aliases). Major, related topics, history and availability only break ties. Each result reports its actual shared-interest count. Previous club-name boosts and unequal professional/casual weights have been removed.

Ethnicity is optional, self-described and private in this local prototype. It does not itself affect ranking. Separate, explicitly selected cultural community interests apply to Clubs only. No ethnicity is inferred from names or photos.


### Expanded club directory and Jonathan demo

The catalog now includes all 200 names from `data/clubs-at-osu.csv`, merged with the original 50 entries into 227 listings. Exact duplicates and eight documented alternate names are combined in `scripts/import-clubs.py`; original catalog IDs remain stable so saved clubs and conversations keep working. Source names remain searchable. Interest labels retain their professional/casual classification. The original source snapshot is in `data/original-clubs.json`. Rebuild the catalog with Python using `scripts/import-clubs.py`. No meeting dates, member counts, or club-specific websites were supplied or invented.

New browsers start with Jonathan Vuppu’s demo profile. Existing profiles are preserved until the user selects **Load Jonathan demo** on Home or My Profile. Loading the demo backs up a previous non-demo profile to `cg-profile-before-demo-v1` and leaves saved clubs, submissions and conversations intact. The email `demo@example.edu` is an explicitly labeled placeholder.

Jonathan is a second-year Mechanical Engineering student with STEM/design interests. Availability repeats in Eastern Time: Monday 3–6pm, Wednesday 2–5pm, Friday 1–4pm, Saturday 10am–2pm. Formula Buckeyes and Baja lead his club recommendations through actual shared traits.

The visual refresh in `src/polish.css` preserves the scarlet-and-gray interface, home destinations, posting approval flow and matching behavior, while refining spacing, typography, cards, imagery, filters and mobile layouts.


### Fresh demo runs

**Reset demo connections** on Home clears student connections, pending interests, chats, meetup suggestions, club/project follows and conversations, and recommendation activity. It keeps the profile (including Jonathan’s bio and availability), catalog and submitted listings. **Undo reset** restores the most recent saved history. Connected tabs synchronize the stored changes.

`data/osu-clubs-200-interest-groups.csv` is included as a second import source. It contains the same 200 clubs and 849 interest rows as the previous supplied file, so the deduplicated catalog remains at 227 listings. Run `npm test` for ranking, import and reset checks.


### Connections in clubs

Club cards, saved listings and detail popups show connected students with explicit matching `clubIds`. The indicator includes initials, names, a count and a **Say hello** action that opens the existing conversation. It never counts strangers as mutual connections. Requested demo members are Ian Shang in Formula Buckeyes (`osu-catalog-19`) and Zain Merchant in Baja Buckeyes (`osu-catalog-18`), Jonathan’s first two recommendations. Their memberships are labeled as demo data.

A versioned, one-time seed adds these two connections without replacing existing connections or Jonathan’s profile. Reset demo connections continues to clear them and their indicators; the seed does not run again after reset. They remain discoverable demo students afterward. Memberships stay tied to club IDs when ordering or filters change.


### Networking preferences and received invites

**Open to networking** is an immediate, persistent switch in Network, Connections, and My Profile/Edit Profile. Off blocks incoming requests through the invite intake helper, disables sending new connections, and excludes paused students from student discovery. Existing invitations can still be accepted or declined, and established chats remain available. The preference synchronizes across tabs and remains unchanged by Reset demo connections.

**Invites** in the header and **Received invites** on Connections show pending inbound requests separately from outgoing requests and accepted connections. A one-time demo invitation from Susheel Vadrevu includes a preview, shared interests, and Accept/Decline actions. Accept moves the sender into connections once and opens the mutual-connection dialog. Decline removes the invite. Reset clears received invites without reseeding them on reload.

This is still a browser-local prototype. There is no shared account database or live delivery of invites between visitors. The same recipient preference checks must be enforced by a future server before implementing real invite delivery or discovery.
