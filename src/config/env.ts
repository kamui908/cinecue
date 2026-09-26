// Central environment access for CineCue.
//
// MONGODB_URI is intentionally read WITHOUT the EXPO_PUBLIC_ prefix.
// - On a Node runtime (API routes, scripts, EAS backend) it resolves from
//   `.env` / server secrets.
// - In the Expo client bundle it is always `undefined`, because Metro only
//   inlines EXPO_PUBLIC_* variables. The client must NEVER hold the raw
//   database URI — all account/list data syncs through an API layer, with
//   local on-device storage as the offline source of truth.
//
// Client-safe config (currently none) belongs here with an EXPO_PUBLIC_
// prefix instead.

export const MONGODB_URI: string | undefined =
  typeof process !== 'undefined' ? process.env?.MONGODB_URI : undefined;

export const isMongoConfigured = (): boolean =>
  !!MONGODB_URI && MONGODB_URI.length > 0;

// Base URL of the deployed cinecue-server (see backend/). Client-safe: it is
// only a public https origin, so it uses the EXPO_PUBLIC_ prefix and is
// inlined into the app bundle at build time.
export const API_URL: string =
  (typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_URL : undefined) || '';

export const isApiConfigured = (): boolean => API_URL.length > 0;
