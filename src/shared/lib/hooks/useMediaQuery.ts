import { useEffect, useState } from 'react';

type MQL = MediaQueryList & {
  addListener?: (l: (e: MediaQueryListEvent) => void) => void;
  removeListener?: (l: (e: MediaQueryListEvent) => void) => void;
};


/** SSR-safe hook for CSS media queries */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const getMatch = (): boolean => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mql = window.matchMedia(query) as MQL;
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Инициализация
    setMatches(mql.matches);

    // Подписка (новые/старые браузеры)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
    } 

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onChange);
      } 
    };
  }, [query, defaultValue]);

  return matches;
}
