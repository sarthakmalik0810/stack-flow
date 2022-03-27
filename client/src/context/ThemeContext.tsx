import React, { ReactChildren, useEffect, useState } from "react";

interface ThemeContextInterface {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextInterface | null>(
  null
);

const getInitialTheme = (): string => {
  if (typeof window !== undefined && window.localStorage) {
    const storedPref = window.localStorage.getItem("color-theme");
    if (typeof storedPref === "string") {
      return storedPref;
    }
    const userMedia = window.matchMedia("prefers-color-scheme: dark");
    if (userMedia.matches) {
      return "dark";
    }
  }
  /** default theme is light */
  return "light";
};

export interface ThemeProviderProps {
  initialTheme: string;
  children: ReactChildren;
}

export const ThemeProvider = ({
  initialTheme,
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const rawSetTheme = (theme: string): void => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";
    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(theme);

    window.localStorage.setItem("color-theme", theme);
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
