import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import AnalyticsScreen from './AnalyticsScreen';
import { currentPeriod, formatPeriod, shiftMonth } from '../utils/period';

const mockNavigation = { navigate: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

const today = currentPeriod();
const iso = ({ year, month }, day = '10') =>
  `${year}-${String(month + 1).padStart(2, '0')}-${day}`;

describe('AnalyticsScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.navigate.mockClear();
  });

  it('affiche les indicateurs du mois courant', async () => {
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '120', category: 'food', date: iso(today, '02') },
      { id: 'e2', amount: '80', category: 'transport', date: iso(today, '20') },
    ]);
    await storage.saveIncome([
      { id: 'i1', amount: '500', category: 'bonus', date: iso(today, '05') },
    ]);
    const { getByLabelText } = renderWithProviders(<AnalyticsScreen />);

    await waitFor(() => expect(getByLabelText('Dépenses : 200.00 €')).toBeTruthy());
    expect(getByLabelText('Transactions : 3')).toBeTruthy();
    expect(getByLabelText('Plus grosse dépense : 120.00 €')).toBeTruthy();
    expect(getByLabelText('Revenus : 500.00 €')).toBeTruthy();
  });

  it('navigue vers le mois precedent', async () => {
    const previous = shiftMonth(today, -1);
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '90', category: 'food', date: iso(previous, '12') },
    ]);
    const { getAllByText, getByLabelText } = renderWithProviders(<AnalyticsScreen />);
    await waitFor(() => expect(getAllByText(formatPeriod(today)).length).toBeGreaterThan(0));

    fireEvent.press(getByLabelText(formatPeriod(previous)));

    await waitFor(() => expect(getByLabelText('Dépenses : 90.00 €')).toBeTruthy());
  });

  it('bascule en vue annuelle et calcule la moyenne mensuelle', async () => {
    const previous = shiftMonth(today, -1);
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '100', category: 'food', date: iso(today, '02') },
      { id: 'e2', amount: '300', category: 'food', date: iso(previous, '02') },
    ]);
    const { getAllByText, getByLabelText, getByText } = renderWithProviders(<AnalyticsScreen />);
    await waitFor(() => expect(getByLabelText('Par année')).toBeTruthy());

    fireEvent.press(getByLabelText('Par année'));

    await waitFor(() => expect(getByText('Moyenne mensuelle')).toBeTruthy());
    expect(getAllByText(String(today.year)).length).toBeGreaterThan(0);
    expect(getByLabelText('Moyenne mensuelle : 200.00 €')).toBeTruthy();
  });

  it('affiche la repartition par categorie', async () => {
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '150', category: 'food', date: iso(today, '02') },
      { id: 'e2', amount: '50', category: 'transport', date: iso(today, '03') },
    ]);
    const { getByLabelText } = renderWithProviders(<AnalyticsScreen />);

    await waitFor(() =>
      expect(getByLabelText('Nourriture : 150.00 €, 75 %')).toBeTruthy()
    );
    expect(getByLabelText('Transport : 50.00 €, 25 %')).toBeTruthy();
  });

  it('affiche un etat vide sans transaction', async () => {
    const { getAllByText } = renderWithProviders(<AnalyticsScreen />);

    await waitFor(() =>
      expect(getAllByText('Aucune donnée sur cette période').length).toBeGreaterThan(0)
    );
  });

  it('signale que les charges fixes sont exclues de l historique', async () => {
    await storage.saveFixedExpenses([{ id: 'f1', amount: '700', category: 'rent' }]);
    const { getByText } = renderWithProviders(<AnalyticsScreen />);

    await waitFor(() =>
      expect(
        getByText("Les charges fixes ne sont pas datées : elles ne figurent pas dans l'historique.")
      ).toBeTruthy()
    );
  });

  it('ouvre l historique', async () => {
    const { getByLabelText } = renderWithProviders(<AnalyticsScreen />);
    await waitFor(() => expect(getByLabelText('Historique')).toBeTruthy());

    fireEvent.press(getByLabelText('Historique'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('History');
  });

  it('empeche la navigation au dela du mois courant', async () => {
    const next = shiftMonth(today, 1);
    const { getAllByText, getByLabelText } = renderWithProviders(<AnalyticsScreen />);
    await waitFor(() => expect(getAllByText(formatPeriod(today)).length).toBeGreaterThan(0));

    fireEvent.press(getByLabelText(formatPeriod(next)));

    expect(getAllByText(formatPeriod(today)).length).toBeGreaterThan(0);
  });
});
