# CineCue

A movie and TV discovery app built with Expo, expo-router, NativeWind v4 and the TMDB API.

## Features

- **Home** — full-bleed featured hero carousel with auto-advance, plus curated rows
  (Trending and Top Today as horizontal backdrops; Trending TV/Movies and genre
  picks — Sci-Fi, Drama, Comedy, Horror, Animation — as vertical posters)
- **Search** — debounced multi-search with All/Movies/TV/People filters; trending movies, people, and popular picks shown when the query is empty
- **Discover** — movies or TV in stacked sections (Trending, Popular, Top Rated, Upcoming) with selectable genre filters
- **Accounts** — create account / log in (JWT + MongoDB via `backend/`), sessions
  restored on launch; only a `401` clears the session, offline launches keep you
  logged in on the cached session with device-cache lists
- **Tracking gate** — heart/bookmark taps while logged out send you to login, and
  the pending save completes automatically right after
- **Watchlist** — per-account watchlist + favorites, cached on device and merged /
  pushed to the server when online (offline edits queue locally)
- **Profile** — account details, library stats, log out, change password, delete
  account; guests get a sign-in CTA
- **Movie / TV detail pages** — responsive poster header (centered on mobile,
  poster-left on desktop), redesigned left-aligned rating card (score, 5-star row,
  verdict badge, progress bar, votes + popularity), Release/Duration/Status info
  cards, full Details section (original title/language, spoken languages,
  production countries, homepage/IMDb links, …), stats grid, Top Billed Cast
  horizontal scroller, production companies, similar + recommended rows.
  Tapping the backdrop opens the trailer.
- **Person pages** — profile, biography, stats, acting / TV / crew credits
- **Responsive navigation** — top menu bar (≥1100px), icon side rail (768–1099px), floating dock (<768px)
- **Web footer** — brand, Explore/Library links, about + TMDB attribution at the bottom of every page (web only)
- **Light/dark theme** — follows OS preference by default, manually toggleable, persisted to localStorage


## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Routing | expo-router (file-based) |
| Styling | NativeWind v4 + Tailwind CSS 3.4 |
| UI primitives | Gluestack UI (local wrappers in `src/components/ui/gluestack.tsx`) |
| Icons | lucide-react-native (registry in `src/components/Icons.tsx`) |

## Getting started

```bash
npm install --legacy-peer-deps
npm run web        # or: npm run android / npm run ios / npm run start
```

`--legacy-peer-deps` is required (peer dependency conflicts in the Expo/Gluestack tree).

## Accounts backend

`backend/` is a standalone Express + MongoDB API (deploys separately — see
`backend/README.md`). It owns `MONGODB_URI` and `JWT_SECRET`; the Expo client
never sees them. Point the app at a deployment with:

```bash
# .env (see .env.example)
EXPO_PUBLIC_API_URL=https://your-deployment-link
```

## Project structure

```
app/                    # expo-router routes
  (tabs)/               # Home, Search, Discover, Watchlist, Profile
  auth/                 # login, signup
  movie/[id].tsx        # detail pages
  tv/[id].tsx
  person/[id].tsx
backend/                # standalone Express + MongoDB API (deploys separately)
  index.js              # auth + list-sync endpoints (database: cinecue)
  models/User.js
src/
  api/tmdb.ts           # TMDB client, image URL builders
  api/server.ts         # backend client (auth + lists)
  config/env.ts         # EXPO_PUBLIC_API_URL (client) / MONGODB_URI (server-only)
  context/AuthContext.tsx       # session, signup/login/logout, password, delete
  context/WatchlistContext.tsx  # per-account lists, server sync, pending-action runner
  hooks/useTMDB.ts      # React Query hooks
  hooks/useRequireAccount.ts    # tracking-tap auth gate
  components/           # MovieCard, TVCard, PersonCard, CastList, Nav, WebFooter, UI, Icons
  components/ui/        # gluestack primitives
  theme/                # palette.ts (single source of truth), ThemeContext
  utils/, types/
tailwind.config.js      # colors, fontFamily, fontSize scale
global.css              # CSS variables mirrored from palette.ts
```