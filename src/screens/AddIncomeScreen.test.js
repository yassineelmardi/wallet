import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import * as storage from '../storage/storage';
import AddIncomeScreen from './AddIncomeScreen';

const mockNavigation = { goBack: jest.fn() };
const mockRoute = { params: {} };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => mockRoute,
}));

describe('AddIncomeScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockRoute.params = {};
    mockNavigation.goBack.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('saves a valid additional income with the selected category', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<AddIncomeScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '125.75');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Prime');
    fireEvent.press(getByText('Bonus'));
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getIncome()).resolves.toEqual([expect.objectContaining({
      amount: 125.75,
      description: 'Prime',
      category: 'bonus',
      date: expect.any(String),
    })]);
  });

  it.each(['', 'abc', '12abc', '1.2.3', 'Infinity', '0', '-1'])(
    'rejects invalid amount %p without saving',
    async (amount) => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderWithProviders(<AddIncomeScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), amount);
    fireEvent.press(getByText('Enregistrer'));

    expect(alert).toHaveBeenCalledWith('', 'Montant invalide');
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
    await expect(storage.getIncome()).resolves.toEqual([]);
    }
  );

  it('accepts a French decimal comma', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<AddIncomeScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '125,75');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getIncome()).resolves.toEqual([
      expect.objectContaining({ amount: 125.75 }),
    ]);
  });

  describe('mode edition', () => {
    const existing = {
      id: 'income-1',
      amount: 100,
      description: 'Prime',
      category: 'bonus',
      date: '2026-09-01',
    };

    beforeEach(async () => {
      await storage.saveIncome([existing]);
      mockRoute.params = { editItem: existing };
    });

    it('pre-remplit le formulaire avec le revenu existant', async () => {
      const { getByDisplayValue, getByText } = renderWithProviders(<AddIncomeScreen />);

      await waitFor(() => expect(getByDisplayValue('100')).toBeTruthy());
      expect(getByDisplayValue('Prime')).toBeTruthy();
      expect(getByDisplayValue('2026-09-01')).toBeTruthy();
      expect(getByText('Modifier')).toBeTruthy();
    });

    it('met a jour le revenu sans creer de doublon ni changer son identifiant', async () => {
      const { getByDisplayValue, getByText } = renderWithProviders(<AddIncomeScreen />);
      await waitFor(() => expect(getByDisplayValue('100')).toBeTruthy());

      fireEvent.changeText(getByDisplayValue('100'), '180');
      fireEvent.changeText(getByDisplayValue('Prime'), 'Prime annuelle');
      fireEvent.press(getByText('Enregistrer'));

      await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
      await expect(storage.getIncome()).resolves.toEqual([
        { ...existing, amount: 180, description: 'Prime annuelle' },
      ]);
    });

    it('refuse un montant invalide et laisse le revenu inchange', async () => {
      const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const { getByDisplayValue, getByText } = renderWithProviders(<AddIncomeScreen />);
      await waitFor(() => expect(getByDisplayValue('100')).toBeTruthy());

      fireEvent.changeText(getByDisplayValue('100'), '0');
      fireEvent.press(getByText('Enregistrer'));

      expect(alert).toHaveBeenCalledWith('', 'Montant invalide');
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
      await expect(storage.getIncome()).resolves.toEqual([existing]);
    });
  });
});