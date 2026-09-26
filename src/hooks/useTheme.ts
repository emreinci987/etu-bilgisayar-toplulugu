import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'etu-theme';

/** Gerçek kaynak: html elementindeki .dark class'ı */
function readDomTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Her tema değişiminde meta theme-color etiketini günceller */
function syncMetaTheme(theme: Theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#12100e' : '#ffffff');
}

/**
 * Dark/light tema durumu — html'deki .dark class'ı tek gerçek kaynaktır.
 * - İlk yükleme: index.html'deki inline script localStorage tercihini uygular (FOUC olmadan);
 *   tercih yoksa varsayılan aydınlık temadır
 * - Toggle: html class'ını değiştirir, localStorage'a yazar, meta theme-color'ı günceller
 * - MutationObserver: aynı sayfadaki TÜM useTheme örnekleri (Nav, HeroCanvas…) class
 *   değişiminden haberdar olur ve senkron kalır
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readDomTheme);

  useEffect(() => {
    syncMetaTheme(theme);
  }, [theme]);

  // Diğer bileşenlerden (veya inline script'ten) gelen class değişimlerini yakala
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(readDomTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = readDomTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage kapalıysa sessizce geç (oturum içinde tema yine de çalışır)
    }
    syncMetaTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
}
