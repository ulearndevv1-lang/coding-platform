import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

const STORAGE_KEY = "codespace-dark-mode";

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(darkMode));
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((value) => !value);
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
