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
});