import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import IncomeScreen from './IncomeScreen';

const mockNavigation = { navigate: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('IncomeScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.navigate.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('shows the total income and opens the add-income form', async () => {
    await storage.saveGlobalSalary({ id: 'global', amount: '2000' });
    await storage.saveIncome([{ id: 'bonus', amount: '250', category: 'bonus', date: '2026-09-30' }]);
    const { getByText } = renderWithProviders(<IncomeScreen />);

    await waitFor(() => expect(getByText('2250.00 €')).toBeTruthy());
    fireEvent.press(getByText('+'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddIncome');
  });

  it('deletes income only after confirmation', async () => {
    await storage.saveIncome([{ id: 'bonus', amount: '250', category: 'bonus', date: '2026-09-30' }]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<IncomeScreen />);
    await waitFor(() => expect(getByText('+250.00 €')).toBeTruthy());

    fireEvent.press(getByText('✕'));
    expect(alert).toHaveBeenCalledWith(
      'Confirmer',
      'Supprimer ce revenu ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Supprimer', style: 'destructive', onPress: expect.any(Function) }),
      ])
    );
    await expect(storage.getIncome()).resolves.toHaveLength(1);

    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());
    await waitFor(async () => expect(storage.getIncome()).resolves.toEqual([]));
  });
});