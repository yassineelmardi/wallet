import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import HistoryScreen from './HistoryScreen';
import { currentPeriod, formatPeriod, shiftMonth } from '../utils/period';

const today = currentPeriod();
const iso = ({ year, month }, day = '10') =>
  `${year}-${String(month + 1).padStart(2, '0')}-${day}`;

const mockNavigation = { goBack: jest.fn() };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('HistoryScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.goBack.mockClear();
  });

  it('revient a l ecran precedent', async () => {
    const { getByLabelText } = renderWithProviders(<HistoryScreen />);
    await waitFor(() => expect(getByLabelText('Retour')).toBeTruthy());

    fireEvent.press(getByLabelText('Retour'));

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('liste les transactions du mois courant avec les totaux', async () => {
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '120', category: 'food', date: iso(today, '02'), description: 'Courses' },
    ]);
    await storage.saveIncome([
      { id: 'i1', amount: '500', category: 'bonus', date: iso(today, '05'), description: 'Prime' },
    ]);
    const { getAllByText, getByText } = renderWithProviders(<HistoryScreen />);

    await waitFor(() => expect(getByText('Courses')).toBeTruthy());
    expect(getByText('Prime')).toBeTruthy();
    expect(getAllByText('-120.00 €').length).toBeGreaterThan(0);
    expect(getAllByText('+500.00 €').length).toBeGreaterThan(0);
  });

  it('navigue vers le mois precedent', async () => {
    const previous = shiftMonth(today, -1);
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '75', category: 'food', date: iso(previous, '12'), description: 'Ancien' },
    ]);
    const { getAllByText, getByLabelText, getByText, queryByText } = renderWithProviders(<HistoryScreen />);
    await waitFor(() => expect(getAllByText(formatPeriod(today)).length).toBeGreaterThan(0));

    expect(queryByText('Ancien')).toBeNull();
    fireEvent.press(getByLabelText(formatPeriod(previous)));

    await waitFor(() => expect(getByText('Ancien')).toBeTruthy());
  });

  it('bascule en vue annuelle et regroupe par mois', async () => {
    const previous = shiftMonth(today, -1);
    await storage.saveVariableExpenses([
      { id: 'e1', amount: '10', category: 'food', date: iso(today, '02'), description: 'Recent' },
      { id: 'e2', amount: '20', category: 'food', date: iso(previous, '02'), description: 'Ancien' },
    ]);
    const { getAllByText, getByLabelText, getByText } = renderWithProviders(<HistoryScreen />);
    await waitFor(() => expect(getByLabelText('Par année')).toBeTruthy());

    fireEvent.press(getByLabelText('Par année'));

    await waitFor(() => expect(getAllByText(String(today.year)).length).toBeGreaterThan(0));
    expect(getByText('Recent')).toBeTruthy();
    if (previous.year === today.year) expect(getByText('Ancien')).toBeTruthy();
  });

  it('affiche un etat vide explicite', async () => {
    const { getByText } = renderWithProviders(<HistoryScreen />);

    await waitFor(() =>
      expect(getByText(`Aucune transaction en ${formatPeriod(today)}`)).toBeTruthy()
    );
  });

  it('inclut les salaires mensuels dans l historique', async () => {
    await storage.saveMonthlySalaries([
      { id: 's1', year: today.year, month: today.month, amount: '2500', label: 'Salaire' },
    ]);
    const { getAllByText, getByText } = renderWithProviders(<HistoryScreen />);

    await waitFor(() => expect(getByText('Salaire')).toBeTruthy());
    expect(getAllByText('+2500.00 €').length).toBeGreaterThan(0);
  });

  it('traduit les categories de revenus depuis leur propre espace de cles', async () => {
    await storage.saveIncome([
      { id: 'i1', amount: '300', category: 'bonus', date: iso(today, '08') },
    ]);
    const { getByText } = renderWithProviders(<HistoryScreen />);

    await waitFor(() => expect(getByText('Bonus')).toBeTruthy());
    expect(getByText(`Bonus · ${iso(today, '08')}`)).toBeTruthy();
  });
});
