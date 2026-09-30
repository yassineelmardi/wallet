import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PALETTE_ID, Themes, getPalette } from './colors';

const THEME_KEY = '@wallet_theme';
const PALETTE_KEY = '@wallet_palette';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // 'dark' | 'light' | 'auto'
  const [themeMode, setThemeMode] = useState('dark');
  const [paletteId, setPaletteId] = useState(DEFAULT_PALETTE_ID);
  const [systemScheme, setSystemScheme] = useState(
    Appearance.getColorScheme() || 'dark'
  );

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved) setThemeMode(saved);
    });
    AsyncStorage.getItem(PALETTE_KEY).then((saved) => {
      if (saved && Themes[saved]) setPaletteId(saved);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme || 'dark');
    });
    return () => sub.remove();
  }, []);

  const setTheme = async (mode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  };

  const setPalette = async (id) => {
    if (!Themes[id]) return;
    setPaletteId(id);
    await AsyncStorage.setItem(PALETTE_KEY, id);
  };

  const isDark =
    themeMode === 'dark' || (themeMode === 'auto' && systemScheme === 'dark');

  const colors = getPalette(paletteId, isDark);

  return (
    <ThemeContext.Provider
      value={{ themeMode, setTheme, paletteId, setPalette, palettes: Themes, isDark, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
