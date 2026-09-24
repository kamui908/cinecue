# CineCue

A movie and TV discovery app built with Expo, expo-router, NativeWind v4 and the TMDB API.

## Features

- **Home** — full-bleed featured hero carousel with auto-advance, plus curated rows (Trending, Top Today, Trending TV/Movies, genre picks)
- **Search** — debounced multi-search with All/Movies/TV/People filters; trending movies, people, and popular picks shown when the query is empty
- **Discover** — movies or TV in stacked sections (Trending, Popular, Top Rated, Upcoming) with selectable genre filters
- **Watchlist & Profile** — saved titles and app preferences
- **Detail pages** — movie, TV, and person pages with cast, stats, genres, and related media
- **Responsive navigation** — top menu bar (≥1100px), icon side rail (768–1099px), floating dock (<768px)
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

## Project structure

```
app/                    # expo-router routes
  (tabs)/               # Home, Search, Discover, Watchlist, Profile
  movie/[id].tsx        # detail pages
  tv/[id].tsx
  person/[id].tsx
src/
  api/tmdb.ts           # TMDB client, image URL builders
  hooks/useTMDB.ts      # React Query hooks
  components/           # MovieCard, TVCard, PersonCard, Nav, UI, Icons
  components/ui/        # gluestack primitives
  theme/                # palette.ts (single source of truth), ThemeContext
  utils/, types/
tailwind.config.js      # colors, fontFamily, fontSize scale
global.css              # CSS variables mirrored from palette.ts
```