import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import ExpensesScreen from './ExpensesScreen';

const mockNavigation = { navigate: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('ExpensesScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.navigate.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('switches between variable and fixed expenses and opens the matching form', async () => {
    await storage.saveVariableExpenses([{ id: 'food', amount: '12', category: 'food' }]);
    await storage.saveFixedExpenses([{ id: 'rent', amount: '700', category: 'rent' }]);
    const { getAllByText, getByText } = renderWithProviders(<ExpensesScreen />);

    await waitFor(() => expect(getAllByText('-12.00 €')).toHaveLength(2));
    fireEvent.press(getByText('Charges fixes'));
    expect(getAllByText('-700.00 €')).toHaveLength(2);
    fireEvent.press(getByText('+'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddExpense', { type: 'fixed' });
  });

  it('removes a variable expense only after destructive confirmation', async () => {
    await storage.saveVariableExpenses([{ id: 'food', amount: '12', category: 'food' }]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByText, getByText } = renderWithProviders(<ExpensesScreen />);
    await waitFor(() => expect(getAllByText('-12.00 €')).toHaveLength(2));

    fireEvent.press(getByText('✕'));
    expect(alert).toHaveBeenCalledWith(
      'Confirmer',
      'Supprimer cette dépense ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Supprimer', style: 'destructive', onPress: expect.any(Function) }),
      ])
    );
    await expect(storage.getVariableExpenses()).resolves.toHaveLength(1);

    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());
    await waitFor(async () => expect(storage.getVariableExpenses()).resolves.toEqual([]));
  });

  it('removes a fixed expense from the fixed tab', async () => {
    await storage.saveFixedExpenses([{ id: 'rent', amount: '700', category: 'rent' }]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithProviders(<ExpensesScreen />);
    await waitFor(() => expect(getByText('Charges fixes')).toBeTruthy());

    fireEvent.press(getByText('Charges fixes'));
    fireEvent.press(getByText('✕'));
    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());

    await waitFor(async () => expect(storage.getFixedExpenses()).resolves.toEqual([]));
  });

  it('ouvre le formulaire d edition avec la depense variable selectionnee', async () => {
    const existing = { id: 'food', amount: '12', category: 'food', date: '2026-09-01' };
    await storage.saveVariableExpenses([existing]);
    const { getByLabelText } = renderWithProviders(<ExpensesScreen />);
    await waitFor(() => expect(getByLabelText('Modifier Nourriture')).toBeTruthy());

    fireEvent.press(getByLabelText('Modifier Nourriture'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddExpense', {
      type: 'variable',
      editItem: existing,
    });
  });

  it('ouvre le formulaire d edition avec la charge fixe selectionnee', async () => {
    const existing = { id: 'rent', amount: '700', category: 'rent', description: 'Loyer' };
    await storage.saveFixedExpenses([existing]);
    const { getByLabelText, getByText } = renderWithProviders(<ExpensesScreen />);
    await waitFor(() => expect(getByText('Charges fixes')).toBeTruthy());

    fireEvent.press(getByText('Charges fixes'));
    fireEvent.press(getByLabelText('Modifier Loyer'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddExpense', {
      type: 'fixed',
      editItem: existing,
    });
  });
});