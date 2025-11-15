import { useState, useEffect, useCallback } from "react";

const KEY = "calendar_dark_mode_v1";

export default function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(isDark));
    } catch {}
  }, [isDark]);

  const toggleDarkMode = useCallback(() => setIsDark((v) => !v), []);
  return { isDark, toggleDarkMode };
}
