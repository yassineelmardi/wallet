import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import * as storage from '../storage/storage';
import AddExpenseScreen from './AddExpenseScreen';

const mockNavigation = { goBack: jest.fn() };
const mockRoute = { params: { type: 'variable' } };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => mockRoute,
}));

describe('AddExpenseScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockRoute.params = { type: 'variable' };
    mockNavigation.goBack.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('renders the form without crashing', async () => {
    const { getByPlaceholderText } = renderWithProviders(<AddExpenseScreen />);

    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());
  });

  it('saves a variable expense and returns to the previous screen', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<AddExpenseScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '12.50');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Courses');
    fireEvent.press(getByText('Shopping'));
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getVariableExpenses()).resolves.toEqual([expect.objectContaining({
      amount: 12.5,
      description: 'Courses',
      category: 'shopping',
      date: expect.any(String),
    })]);
  });

  it('saves a fixed expense without a date', async () => {
    mockRoute.params = { type: 'fixed' };
    const { getByPlaceholderText, getByText, queryByPlaceholderText } = renderWithProviders(<AddExpenseScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '800');
    fireEvent.changeText(getByPlaceholderText('Description'), 'Loyer');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    const fixedExpenses = await storage.getFixedExpenses();
    expect(fixedExpenses).toEqual([expect.objectContaining({
      amount: 800, description: 'Loyer', category: 'rent',
    })]);
    expect(fixedExpenses[0]).not.toHaveProperty('date');
    expect(queryByPlaceholderText('YYYY-MM-DD')).toBeNull();
  });

  it.each(['', 'abc', '12abc', '1.2.3', 'Infinity', '0', '-1'])(
    'rejects invalid amount %p without saving',
    async (amount) => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderWithProviders(<AddExpenseScreen />);
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), amount);
    fireEvent.press(getByText('Enregistrer'));

    expect(alert).toHaveBeenCalledWith('', 'Montant invalide');
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
    await expect(storage.getVariableExpenses()).resolves.toEqual([]);
    }
  );

  describe('mode edition', () => {
    const variableItem = {
      id: 'variable-1',
      amount: 12.5,
      description: 'Courses',
      category: 'food',
      date: '2026-09-01',
    };
    const fixedItem = {
      id: 'fixed-1',
      amount: 800,
      description: 'Loyer',
      category: 'rent',
    };

    it('pre-remplit le formulaire avec la depense variable existante', async () => {
      await storage.saveVariableExpenses([variableItem]);
      mockRoute.params = { type: 'variable', editItem: variableItem };
      const { getByDisplayValue, getByText } = renderWithProviders(<AddExpenseScreen />);

      await waitFor(() => expect(getByDisplayValue('12.5')).toBeTruthy());
      expect(getByDisplayValue('Courses')).toBeTruthy();
      expect(getByDisplayValue('2026-09-01')).toBeTruthy();
      expect(getByText('Modifier')).toBeTruthy();
    });

    it('met a jour la depense variable sans creer de doublon', async () => {
      await storage.saveVariableExpenses([variableItem]);
      mockRoute.params = { type: 'variable', editItem: variableItem };
      const { getByDisplayValue, getByText } = renderWithProviders(<AddExpenseScreen />);
      await waitFor(() => expect(getByDisplayValue('12.5')).toBeTruthy());

      fireEvent.changeText(getByDisplayValue('12.5'), '20');
      fireEvent.press(getByText('Transport'));
      fireEvent.press(getByText('Enregistrer'));

      await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
      await expect(storage.getVariableExpenses()).resolves.toEqual([
        { ...variableItem, amount: 20, category: 'transport' },
      ]);
    });

    it('met a jour la charge fixe en conservant son identifiant', async () => {
      await storage.saveFixedExpenses([fixedItem]);
      mockRoute.params = { type: 'fixed', editItem: fixedItem };
      const { getByDisplayValue, getByText } = renderWithProviders(<AddExpenseScreen />);
      await waitFor(() => expect(getByDisplayValue('800')).toBeTruthy());

      fireEvent.changeText(getByDisplayValue('800'), '850');
      fireEvent.press(getByText('Enregistrer'));

      await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
      await expect(storage.getFixedExpenses()).resolves.toEqual([
        { ...fixedItem, amount: 850 },
      ]);
    });

    it('refuse un montant invalide et laisse la depense inchangee', async () => {
      await storage.saveVariableExpenses([variableItem]);
      mockRoute.params = { type: 'variable', editItem: variableItem };
      const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
      const { getByDisplayValue, getByText } = renderWithProviders(<AddExpenseScreen />);
      await waitFor(() => expect(getByDisplayValue('12.5')).toBeTruthy());

      fireEvent.changeText(getByDisplayValue('12.5'), '-5');
      fireEvent.press(getByText('Enregistrer'));

      expect(alert).toHaveBeenCalledWith('', 'Montant invalide');
      expect(mockNavigation.goBack).not.toHaveBeenCalled();
      await expect(storage.getVariableExpenses()).resolves.toEqual([variableItem]);
    });
  });
});