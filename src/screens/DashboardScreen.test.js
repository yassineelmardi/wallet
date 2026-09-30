import React from 'react';
import { waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import DashboardScreen from './DashboardScreen';
import { formatCurrency, formatPercent } from '../utils/format';

const money = (value, options) => formatCurrency(value, 'EUR', 'fr', options);
const share = (value) => formatPercent(value, 'fr');

beforeEach(() => AsyncStorage.reset());

it('shows the calculated balance, income, spending, and budget percentage', async () => {
  await storage.saveGlobalSalary({ id: 'global', amount: '1000' });
  await storage.saveIncome([{ id: 'bonus', amount: '200' }]);
  await storage.saveFixedExpenses([{ id: 'rent', amount: '300' }]);
  await storage.saveVariableExpenses([{ id: 'food', amount: '200' }]);
  const { getAllByText, getByText } = renderWithProviders(<DashboardScreen />);

  await waitFor(() => expect(getByText(share(42))).toBeTruthy());
  expect(getAllByText(money(700, { signDisplay: 'always' }))).toHaveLength(2);
  expect(getByText(money(1200, { compact: true }))).toBeTruthy();
  expect(getByText(money(500, { compact: true }))).toBeTruthy();
  expect(getByText('Revenus supplémentaires')).toBeTruthy();
});

it('shows a negative balance and caps the displayed budget percentage', async () => {
  await storage.saveGlobalSalary({ id: 'global', amount: '100' });
  await storage.saveVariableExpenses([{ id: 'expense', amount: '200' }]);
  const { getAllByText, getByText } = renderWithProviders(<DashboardScreen />);

  await waitFor(() => expect(getByText(share(100))).toBeTruthy());
  expect(getAllByText(money(-100, { signDisplay: 'always' }))).toHaveLength(2);
});

it('uses the warning state when budget usage is between sixty and eighty percent', async () => {
  await storage.saveGlobalSalary({ id: 'global', amount: '100' });
  await storage.saveVariableExpenses([{ id: 'expense', amount: '70' }]);
  const { getByText } = renderWithProviders(<DashboardScreen />);

  await waitFor(() => expect(getByText(share(70))).toBeTruthy());
  expect(getByText(share(70)).props.style.color).toBe('#FFB740');
});