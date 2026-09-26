import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

const SETTINGS_KEY = '@cinecue_settings';

interface SettingsContextType {
  /** Play trailers automatically in the detail backdrop slot. Off by default. */
  autoplayTrailers: boolean;
  setAutoplayTrailers: (value: boolean) => void;
  /** True once the stored preference has loaded (avoids flashing the wrong backdrop). */
  settingsReady: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoplayTrailers, setAutoplayState] = useState(false);
  const [settingsReady, setSettingsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await readJSON<{ autoplayTrailers?: boolean }>(SETTINGS_KEY);
      if (typeof stored?.autoplayTrailers === 'boolean') {
        setAutoplayState(stored.autoplayTrailers);
      }
      setSettingsReady(true);
    })();
  }, []);

  const setAutoplayTrailers = useCallback((value: boolean) => {
    setAutoplayState(value);
    writeJSON(SETTINGS_KEY, { autoplayTrailers: value });
  }, []);

  return (
    <SettingsContext.Provider value={{ autoplayTrailers, setAutoplayTrailers, settingsReady }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
