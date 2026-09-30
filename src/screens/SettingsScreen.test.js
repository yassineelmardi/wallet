import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import SettingsScreen from './SettingsScreen';

beforeEach(async () => {
  AsyncStorage.reset();
  await i18n.changeLanguage('fr');
});

afterEach(() => jest.restoreAllMocks());

it('persists selected language, currency, and theme', async () => {
  const { getByText } = renderWithProviders(<SettingsScreen />);
  await waitFor(() => expect(getByText('Paramètres')).toBeTruthy());

  fireEvent.press(getByText('English'));
  fireEvent.press(getByText('$'));
  fireEvent.press(getByText('Clair'));

  await waitFor(() => expect(i18n.language).toBe('en'));
  await waitFor(async () => {
    await expect(storage.getSettings()).resolves.toEqual({
      language: 'en', darkMode: true, currency: '$',
    });
    await expect(AsyncStorage.getItem('@wallet_theme')).resolves.toBe('light');
  });
});

it('does not reset data until the destructive action is confirmed', async () => {
  await storage.saveIncome([{ id: 'bonus', amount: '20' }]);
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const { getByText } = renderWithProviders(<SettingsScreen />);
  await waitFor(() => expect(getByText(/Réinitialiser les données/)).toBeTruthy());

  fireEvent.press(getByText(/Réinitialiser les données/));

  expect(alert).toHaveBeenCalledWith(
    'Confirmer',
    'Toutes vos données seront supprimées. Confirmer ?',
    expect.arrayContaining([
      expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
      expect.objectContaining({ text: 'Confirmer', style: 'destructive', onPress: expect.any(Function) }),
    ])
  );
  await expect(storage.getIncome()).resolves.toEqual([{ id: 'bonus', amount: '20' }]);

  const confirm = alert.mock.calls[0][2].find((button) => button.text === 'Confirmer');
  await act(async () => confirm.onPress());
  await waitFor(async () => expect(storage.getIncome()).resolves.toEqual([]));
});

it('uses the default currency when settings have no currency', async () => {
  await storage.saveSettings({ language: 'fr' });
  const { getByText } = renderWithProviders(<SettingsScreen />);

  await waitFor(() => expect(getByText('+2 500 €')).toBeTruthy());
});

it('liste les palettes disponibles et persiste celle choisie', async () => {
  const { getByLabelText, getByText } = renderWithProviders(<SettingsScreen />);
  await waitFor(() => expect(getByText('Palette')).toBeTruthy());

  expect(getByLabelText('Palette Classique')).toBeTruthy();
  expect(getByLabelText('Palette AMOLED Pure Black')).toBeTruthy();

  fireEvent.press(getByLabelText('Palette Emerald Finance'));

  await waitFor(async () =>
    expect(AsyncStorage.getItem('@wallet_palette')).resolves.toBe('emerald')
  );
});