import AsyncStorage from '@react-native-async-storage/async-storage';

/** Persisted login session: { token, user } — removed on logout. */
export const SESSION_KEY = '@cinecue_session';

/** Per-account library cache. Scoped by account so users never see each other's lists. */
export const listsKey = (userId: string) => `@cinecue_lists_${userId}`;

export async function readJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is best-effort (private mode, quota). App keeps working in memory.
  }
}
