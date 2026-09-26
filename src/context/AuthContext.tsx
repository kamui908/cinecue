import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { serverApi, ServerError, ServerUser } from '../api/server';
import { SESSION_KEY, listsKey, readJSON, writeJSON } from '../utils/storage';

/** A tracking tap (heart/bookmark) made while logged out, completed right after login. */
export interface PendingTrackAction {
  list: 'watchlist' | 'favorites';
  mediaType: 'movie' | 'tv';
  item: { id: number; title?: string; name?: string; poster_path: string | null };
}

interface Session {
  token: string;
  user: ServerUser;
}

interface AuthContextType {
  user: ServerUser | null;
  token: string | null;
  status: 'loading' | 'authed' | 'guest';
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  pendingAction: PendingTrackAction | null;
  setPendingAction: (action: PendingTrackAction | null) => void;
  consumePendingAction: () => PendingTrackAction | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAccount(name: string, email: string, password: string) {
  if (name.trim().length < 2) throw new Error('Enter your name.');
  if (!EMAIL_RE.test(email.trim())) throw new Error('Enter a valid email.');
  if (password.length < 6) throw new Error('Password needs at least 6 characters.');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ServerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'authed' | 'guest'>('loading');
  const [pendingAction, setPendingActionState] = useState<PendingTrackAction | null>(null);
  const pendingRef = useRef<PendingTrackAction | null>(null);

  const setPendingAction = useCallback((action: PendingTrackAction | null) => {
    pendingRef.current = action;
    setPendingActionState(action);
  }, []);

  // Restore session on launch.
  useEffect(() => {
    (async () => {
      const session = await readJSON<Session>(SESSION_KEY);
      if (!session?.token) {
        setStatus('guest');
        return;
      }
      try {
        const { user: fresh } = await serverApi.me(session.token);
        setUser(fresh);
        setToken(session.token);
        await writeJSON(SESSION_KEY, { token: session.token, user: fresh });
        setStatus('authed');
      } catch (e) {
        if (e instanceof ServerError && e.status === 401) {
          // Token rejected (expired, revoked, account deleted) — drop it.
          await AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
          setStatus('guest');
        } else {
          // Server unreachable / offline — stay logged in on the cached
          // session. Lists fall back to the device cache until it returns.
          setUser(session.user);
          setToken(session.token);
          setStatus('authed');
        }
      }
    })();
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    validateAccount(name, email, password);
    const { token: next, user: nextUser } = await serverApi.signup(
      name.trim(),
      email.trim(),
      password
    );
    setUser(nextUser);
    setToken(next);
    await writeJSON(SESSION_KEY, { token: next, user: nextUser });
    setStatus('authed');
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!EMAIL_RE.test(email.trim())) throw new Error('Enter a valid email.');
    if (!password) throw new Error('Enter your password.');
    const { token: next, user: nextUser } = await serverApi.login(email.trim(), password);
    setUser(nextUser);
    setToken(next);
    await writeJSON(SESSION_KEY, { token: next, user: nextUser });
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setPendingAction(null);
    await AsyncStorage.removeItem(SESSION_KEY).catch(() => {});
    setStatus('guest');
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) throw new Error('Log in first.');
      if (newPassword.length < 6)
        throw new Error('New password needs at least 6 characters.');
      await serverApi.changePassword(token, currentPassword, newPassword);
    },
    [token]
  );

  const deleteAccount = useCallback(
    async (password: string) => {
      if (!token || !user) throw new Error('Log in first.');
      if (!password) throw new Error('Enter your password to confirm.');
      await serverApi.deleteAccount(token, password);
      const userId = user.id;
      setUser(null);
      setToken(null);
      setPendingAction(null);
      await AsyncStorage.multiRemove([SESSION_KEY, listsKey(userId)]).catch(() => {});
      setStatus('guest');
    },
    [token, user]
  );

  const consumePendingAction = useCallback(() => {
    const action = pendingRef.current;
    pendingRef.current = null;
    setPendingActionState(null);
    return action;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        signup,
        login,
        logout,
        changePassword,
        deleteAccount,
        pendingAction,
        setPendingAction,
        consumePendingAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
