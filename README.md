# CineCue

A movie and TV discovery app built with Expo, expo-router, NativeWind v4 and the TMDB API.

## Features

- **Home** — full-bleed featured hero carousel with auto-advance, plus curated rows
- **Search** — debounced multi-search with All/Movies/TV/People 
- **Discover** — movies or TV in stacked sections (Trending, Popular, Top Rated, Upcoming) with selectable genre filters
- **Accounts** — create account / log in 
- **Tracking gate** — heart/bookmark 
- **Watchlist** — per-account watchlist + favorites, cached on device and merged /
  pushed to the server when online (offline edits queue locally)
- **Profile** — account details, library stats, guests get a sign-in CTA
- **Settings** (`/settings`) — Light/Dark/System appearance, trailer-autoplay
  toggle (off by default), and account management (log out, change password,
  delete account)
- **Trailer autoplay** — movie/TV backdrops play the trailer automatically on web
  (muted, per browser rules); elsewhere the backdrop still shows and tapping it
  opens the trailer. Toggle in Settings → Playback.
- **Movie / TV detail pages** 
- **Person pages** — profile, biography, stats, acting / TV / crew credits
- **Responsive navigation** — top menu bar (≥1100px), icon side rail (768–1099px), floating dock (<768px)
- **Web footer** — brand, Explore/Library links, about
- **Light/dark theme** — follows OS preference by default, manually toggleable, 


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

```bash
# .env (see .env.example)
EXPO_PUBLIC_API_URL=https://your-deployment-link
```

## Project structure

```
app/                    # expo-router routes
  (tabs)/               # Home, Search, Discover, Watchlist, Profile
  auth/                 # login, signup
  settings.tsx          # appearance, playback, account
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
  context/SettingsContext.tsx   # trailer-autoplay preference (persisted, default on)
  context/WatchlistContext.tsx  # per-account lists, server sync, pending-action runner
  components/TrailerBackdrop.tsx # backdrop slot: autoplay embed (web) or still
  hooks/useTMDB.ts      # React Query hooks
  hooks/useRequireAccount.ts    # tracking-tap auth gate
  components/           # MovieCard, TVCard, PersonCard, CastList, Nav, WebFooter, UI, Icons
  components/ui/        # gluestack primitives
  theme/                # palette.ts (single source of truth), ThemeContext
  utils/, types/
tailwind.config.js      # colors, fontFamily, fontSize scale
global.css              # CSS variables mirrored from palette.ts
```