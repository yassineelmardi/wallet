import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import * as storage from '../storage/storage';
import AddIncomeScreen from './AddIncomeScreen';

const mockNavigation = { goBack: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('AddIncomeScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
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
});