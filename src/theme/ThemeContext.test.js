import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, LightTheme } from './colors';
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