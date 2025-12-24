import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('theme:isDarkMode');
        if (stored != null) {
          setIsDarkMode(stored === 'true');
        }
      } catch {
        // ignore storage errors for now
      }
    };

    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    setIsDarkMode(prev => {
      const next = !prev;
      AsyncStorage.setItem('theme:isDarkMode', next ? 'true' : 'false').catch(() => {
        // ignore storage errors
      });
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export default ThemeProvider;