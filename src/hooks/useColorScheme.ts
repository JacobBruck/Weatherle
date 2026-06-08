import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

const STORAGE_KEY = 'weatherle:scheme';

function readStoredScheme(): ColorScheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** User's preferred light/dark appearance, persisted across sessions and applied via a root data-attribute. */
export function useColorScheme(): [ColorScheme, (scheme: ColorScheme) => void] {
  const [scheme, setScheme] = useState<ColorScheme>(readStoredScheme);

  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
  }, [scheme]);

  function changeScheme(next: ColorScheme) {
    setScheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — preference just won't persist across reloads.
    }
  }

  return [scheme, changeScheme];
}
