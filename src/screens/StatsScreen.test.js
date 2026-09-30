import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import StatsScreen from './StatsScreen';
import { formatCurrency, formatPercent } from '../utils/format';

const money = (value, options) => formatCurrency(value, 'EUR', 'fr', options);
const share = (value) => formatPercent(value, 'fr');

const mockNavigation = { navigate: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

beforeEach(() => {
  AsyncStorage.reset();
  mockNavigation.navigate.mockClear();
});

it('ouvre les analyses avancees', async () => {
  const { getByLabelText } = renderWithProviders(<StatsScreen />);
  await waitFor(() => expect(getByLabelText('Analyses avancées')).toBeTruthy());

  fireEvent.press(getByLabelText('Analyses avancées'));

  expect(mockNavigation.navigate).toHaveBeenCalledWith('Analytics');
});

it('aggregates expenses by category and calculates budget usage', async () => {
  await storage.saveGlobalSalary({ id: 'global', amount: '1000' });
  await storage.saveFixedExpenses([
    { id: 'rent', category: 'rent', amount: '300' },
  ]);
  await storage.saveVariableExpenses([
    { id: 'rent-extra', category: 'rent', amount: '50' },
    { id: 'food', category: 'food', amount: '150' },
  ]);
  const { getByText } = renderWithProviders(<StatsScreen />);

  await waitFor(() => expect(getByText(`${share(50)} du budget utilisé`)).toBeTruthy());
  expect(getByText(money(350, { compact: true }))).toBeTruthy();
  expect(getByText('150 €')).toBeTruthy();
});

it('uses the other category for records without a category', async () => {
  await storage.saveVariableExpenses([{ id: 'misc', amount: '12' }]);
  const { getByText } = renderWithProviders(<StatsScreen />);

  await waitFor(() => expect(getByText('Autre')).toBeTruthy());
  expect(getByText('12 €')).toBeTruthy();
});

it('caps expense usage at one hundred percent when overspending', async () => {
  await storage.saveGlobalSalary({ id: 'global', amount: '100' });
  await storage.saveVariableExpenses([{ id: 'expense', amount: '250', category: 'food' }]);
  const { getByText } = renderWithProviders(<StatsScreen />);

  await waitFor(() => expect(getByText(`${share(100)} du budget utilisé`)).toBeTruthy());
});

it('shows the empty state only when both income and expenses are zero', async () => {
  const empty = renderWithProviders(<StatsScreen />);
  await waitFor(() => expect(empty.getByText('Aucune donnée ce mois')).toBeTruthy());
  empty.unmount();

  await storage.saveVariableExpenses([{ id: 'expense', amount: '10', category: 'food' }]);
  const nonEmpty = renderWithProviders(<StatsScreen />);
  await waitFor(() => expect(nonEmpty.getByText('10 €')).toBeTruthy());
  expect(nonEmpty.queryByText('Aucune donnée ce mois')).toBeNull();
});