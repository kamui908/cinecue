import { API_URL } from '../config/env';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
}

export interface TrackItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  added_at: number;
}

export class ServerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function base(): string {
  if (!API_URL) throw new ServerError('Account server is not configured yet.', 0);
  return API_URL.replace(/\/+$/, '');
}

async function request<T>(path: string, token: string | null, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    res = await fetch(`${base()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
    });
    clearTimeout(timer);
  } catch {
    throw new ServerError('Could not reach the account server. Check your connection.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ServerError(
      typeof (data as any)?.message === 'string' ? (data as any).message : 'Something went wrong.',
      res.status
    );
  }
  return data as T;
}

export const serverApi = {
  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: ServerUser }>('/api/auth/signup', null, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: ServerUser }>('/api/auth/login', null, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: (token: string) => request<{ user: ServerUser }>('/api/auth/me', token),
  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>('/api/auth/password', token, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  deleteAccount: (token: string, password: string) =>
    request<{ ok: boolean }>('/api/auth/account', token, {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    }),
  getLists: (token: string) =>
    request<{ watchlist: TrackItem[]; favorites: TrackItem[] }>('/api/lists', token),
  putLists: (token: string, watchlist: TrackItem[], favorites: TrackItem[]) =>
    request<{ ok: boolean }>('/api/lists', token, {
      method: 'PUT',
      body: JSON.stringify({ watchlist, favorites }),
    }),
};
