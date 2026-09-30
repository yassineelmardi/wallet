import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as storage from '../storage/storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import SalaryScreen from './SalaryScreen';
import { formatCurrency } from '../utils/format';

const money = (value) => formatCurrency(value, 'EUR', 'fr');

const mockNavigation = { navigate: jest.fn() };

const renderScreen = () => renderWithProviders(<SalaryScreen navigation={mockNavigation} />);

describe('SalaryScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.navigate.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('validates and saves a global salary with a trimmed label', async () => {
    const { getByPlaceholderText, getAllByText, getByText } = renderScreen();
    await waitFor(() => expect(getByText('+ Définir un salaire global')).toBeTruthy());
    fireEvent.press(getByText('+ Définir un salaire global'));

    fireEvent.changeText(getByPlaceholderText('ex: 3000'), '3100.5');
    fireEvent.changeText(getByPlaceholderText('ex: Salaire CDI'), '  CDI  ');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(async () => expect(storage.getGlobalSalary()).resolves.toEqual({
      id: 'global', amount: '3100.5', label: 'CDI',
    }));
    expect(getAllByText(money(3100.5))).toHaveLength(2);
  });

  it('pre-fills and updates an existing global salary from the edit action', async () => {
    await storage.saveGlobalSalary({ id: 'global', amount: '2000', label: 'Old' });
    const { getByDisplayValue, getAllByText, getByLabelText, getByText } = renderScreen();
    await waitFor(() => expect(getAllByText(money(2000))).toHaveLength(2));

    fireEvent.press(getByLabelText('Modifier le salaire global'));
    expect(getByDisplayValue('2000')).toBeTruthy();
    expect(getByDisplayValue('Old')).toBeTruthy();
    fireEvent.changeText(getByDisplayValue('2000'), '2100');
    fireEvent.changeText(getByDisplayValue('Old'), ' Updated ');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(async () => expect(storage.getGlobalSalary()).resolves.toEqual({
      id: 'global', amount: '2100', label: 'Updated',
    }));
  });

  it.each(['', 'abc', '12abc', '1.2.3', 'Infinity', '0', '-1'])(
    'rejects invalid global salary amount %p',
    async (amount) => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderScreen();
    await waitFor(() => expect(getByText('+ Définir un salaire global')).toBeTruthy());
    fireEvent.press(getByText('+ Définir un salaire global'));

    fireEvent.changeText(getByPlaceholderText('ex: 3000'), amount);
    fireEvent.press(getByText('Enregistrer'));

    expect(alert).toHaveBeenCalledWith('Erreur', 'Veuillez entrer un montant valide.');
    await expect(storage.getGlobalSalary()).resolves.toBeNull();
    }
  );

  it('removes the global salary only after confirmation', async () => {
    await storage.saveGlobalSalary({ id: 'global', amount: '2000' });
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByText, getByText } = renderScreen();
    await waitFor(() => expect(getAllByText(money(2000))).toHaveLength(2));

    fireEvent.press(getByText('✕'));
    expect(alert).toHaveBeenCalledWith(
      'Supprimer',
      'Confirmer ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Supprimer', style: 'destructive', onPress: expect.any(Function) }),
      ])
    );
    await expect(storage.getGlobalSalary()).resolves.toEqual({ id: 'global', amount: '2000' });

    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());
    await waitFor(async () => expect(storage.getGlobalSalary()).resolves.toBeNull());
  });

  it('removes a monthly salary through the monthly list confirmation', async () => {
    await storage.saveMonthlySalaries([
      { id: 'month', month: 0, year: 2026, amount: '1800', label: 'January' },
    ]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderScreen();
    await waitFor(() => expect(getByText('January')).toBeTruthy());

    fireEvent.press(getByText('✕'));
    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());
    await waitFor(async () => expect(storage.getMonthlySalaries()).resolves.toEqual([]));
  });

  it('routes the add button according to the selected tab', async () => {
    const { getByText } = renderScreen();
    await waitFor(() => expect(getByText('Salaires')).toBeTruthy());

    fireEvent.press(getByText('+'));
    fireEvent.press(getByText('Revenus suppl.'));
    fireEvent.press(getByText('+'));

    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'AddMonthlySalary', {});
    expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'AddIncome');
  });

  it('renders monthly salary data for the current month', async () => {
    const now = new Date();
    await storage.saveMonthlySalaries([{
      id: 'current', month: now.getMonth(), year: now.getFullYear(), amount: '2400', label: 'Current',
    }]);
    const { getAllByText, getByText } = renderScreen();

    await waitFor(() => expect(getByText('MENSUEL')).toBeTruthy());
    expect(getAllByText(/ce mois/)).toHaveLength(2);
    expect(getByText('Current')).toBeTruthy();
  });

  it('shows income totals and entries on the additional-income tab', async () => {
    await storage.saveIncome([
      { id: 'bonus', amount: '100', category: 'bonus', description: 'Annual bonus', date: '2026-09-30' },
      { id: 'other', amount: '50', category: 'other', description: 'Refund' },
    ]);
    const { getByText } = renderScreen();

    await waitFor(() => expect(getByText('Salaires')).toBeTruthy());
    fireEvent.press(getByText('Revenus suppl.'));

    expect(getByText(/Total :/)).toBeTruthy();
    expect(getByText('Annual bonus')).toBeTruthy();
    expect(getByText('2026-09-30')).toBeTruthy();
    expect(getByText('Refund')).toBeTruthy();
  });

  it('shows the empty state for an empty additional-income list', async () => {
    const { getByText } = renderScreen();
    await waitFor(() => expect(getByText('Salaires')).toBeTruthy());

    fireEvent.press(getByText('Revenus suppl.'));

    expect(getByText('Aucun revenu supplémentaire')).toBeTruthy();
  });

  it('removes an additional income only after confirmation', async () => {
    await storage.saveIncome([
      { id: 'bonus', amount: '100', category: 'bonus', description: 'Annual bonus' },
    ]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderScreen();
    await waitFor(() => expect(getByText('Salaires')).toBeTruthy());
    fireEvent.press(getByText('Revenus suppl.'));
    fireEvent.press(getByText('✕'));

    expect(alert).toHaveBeenCalledWith(
      'Supprimer',
      'Confirmer ?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Supprimer', style: 'destructive', onPress: expect.any(Function) }),
      ])
    );
    const remove = alert.mock.calls[0][2].find((button) => button.text === 'Supprimer');
    await act(async () => remove.onPress());
    await waitFor(async () => expect(storage.getIncome()).resolves.toEqual([]));
  });

  it('closes the global salary modal without saving when cancelled', async () => {
    const { getByPlaceholderText, getByText, queryByPlaceholderText } = renderScreen();
    await waitFor(() => expect(getByText('+ Définir un salaire global')).toBeTruthy());
    fireEvent.press(getByText('+ Définir un salaire global'));
    fireEvent.changeText(getByPlaceholderText('ex: 3000'), '3000');
    fireEvent.press(getByText('Annuler'));

    expect(queryByPlaceholderText('ex: 3000')).toBeNull();
    await expect(storage.getGlobalSalary()).resolves.toBeNull();
  });

  it('ouvre le formulaire d edition avec le revenu selectionne', async () => {
    const existing = { id: 'bonus', amount: '100', category: 'bonus', description: 'Annual bonus' };
    await storage.saveIncome([existing]);
    const { getByLabelText, getByText } = renderScreen();
    await waitFor(() => expect(getByText('Salaires')).toBeTruthy());

    fireEvent.press(getByText('Revenus suppl.'));
    fireEvent.press(getByLabelText('Modifier ce revenu'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddIncome', { editItem: existing });
  });
});