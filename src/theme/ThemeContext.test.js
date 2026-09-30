import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, FintechDarkTheme, FintechLightTheme, LightTheme } from './colors';
import { ThemeProvider, useTheme } from './ThemeContext';

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

beforeEach(() => AsyncStorage.reset());

it('starts in dark mode with dark palette', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });

  expect(result.current.themeMode).toBe('dark');
  expect(result.current.isDark).toBe(true);
  expect(result.current.colors).toBe(DarkTheme);
});

it('loads a persisted light mode', async () => {
  await AsyncStorage.setItem('@wallet_theme', 'light');
  const { result } = renderHook(() => useTheme(), { wrapper });

  await waitFor(() => expect(result.current.themeMode).toBe('light'));
  expect(result.current.isDark).toBe(false);
  expect(result.current.colors).toBe(LightTheme);
});

it('persists a theme change and follows the system when automatic mode is selected', async () => {
  const { result } = renderHook(() => useTheme(), { wrapper });

  await act(async () => result.current.setTheme('light'));
  expect(result.current.isDark).toBe(false);
  await expect(AsyncStorage.getItem('@wallet_theme')).resolves.toBe('light');

  await act(async () => result.current.setTheme('auto'));
  expect(result.current.themeMode).toBe('auto');
  expect(result.current.colors).toBe(result.current.isDark ? DarkTheme : LightTheme);
  await expect(AsyncStorage.getItem('@wallet_theme')).resolves.toBe('auto');
});

it('exposes a theme change even when persistence fails, and rejects the write error', async () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  AsyncStorage.setItem.mockRejectedValueOnce(new Error('storage unavailable'));

  await expect(act(async () => result.current.setTheme('light')))
    .rejects.toThrow('storage unavailable');
  expect(result.current.themeMode).toBe('light');
  expect(result.current.isDark).toBe(false);
});

describe('palettes', () => {
  it('utilise la palette classique par defaut', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.paletteId).toBe('classic');
    expect(result.current.colors).toBe(DarkTheme);
    expect(Object.keys(result.current.palettes)).toHaveLength(10);
  });

  it('applique et persiste la palette choisie', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => result.current.setPalette('fintech'));

    expect(result.current.paletteId).toBe('fintech');
    expect(result.current.colors).toBe(FintechDarkTheme);
    await expect(AsyncStorage.getItem('@wallet_palette')).resolves.toBe('fintech');
  });

  it('bascule sur la variante claire de la palette selon le mode', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => result.current.setPalette('fintech'));
    await act(async () => result.current.setTheme('light'));

    expect(result.current.isDark).toBe(false);
    expect(result.current.colors).toBe(FintechLightTheme);
  });

  it('recharge la palette persistee', async () => {
    await AsyncStorage.setItem('@wallet_palette', 'emerald');
    const { result } = renderHook(() => useTheme(), { wrapper });

    await waitFor(() => expect(result.current.paletteId).toBe('emerald'));
  });

  it('ignore une palette inconnue et conserve la palette courante', async () => {
    await AsyncStorage.setItem('@wallet_palette', 'inexistante');
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => result.current.setPalette('inexistante'));

    expect(result.current.paletteId).toBe('classic');
    expect(result.current.colors).toBe(DarkTheme);
  });

  it('expose une variante claire et sombre complete pour chaque palette', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    const requiredKeys = Object.keys(DarkTheme);

    Object.values(result.current.palettes).forEach((palette) => {
      ['dark', 'light'].forEach((scheme) => {
        expect(Object.keys(palette[scheme]).sort()).toEqual(requiredKeys.sort());
      });
    });
  });
});