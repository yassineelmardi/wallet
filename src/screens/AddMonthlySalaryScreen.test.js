import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderWithProviders } from '../testSupport/renderWithProviders';
import * as storage from '../storage/storage';
import AddMonthlySalaryScreen from './AddMonthlySalaryScreen';

const mockNavigation = { goBack: jest.fn() };

const renderScreen = (route = { params: {} }) =>
  renderWithProviders(
    <AddMonthlySalaryScreen navigation={mockNavigation} route={route} />
  );

describe('AddMonthlySalaryScreen', () => {
  beforeEach(() => {
    AsyncStorage.reset();
    mockNavigation.goBack.mockClear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('creates a salary for the selected period and trims its label', async () => {
    const { getByPlaceholderText, getByText } = renderScreen();
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());
    const now = new Date();

    fireEvent.changeText(getByPlaceholderText('0.00'), '2400.50');
    fireEvent.changeText(getByPlaceholderText('ex: Prime incluse, congé sans solde…'), '  Salaire net  ');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getMonthlySalaries()).resolves.toEqual([
      expect.objectContaining({
        month: now.getMonth(),
        year: now.getFullYear(),
        amount: '2400.5',
        label: 'Salaire net',
      }),
    ]);
  });

  it.each(['', 'abc', '12abc', '1.2.3', 'Infinity', '0', '-1'])(
    'rejects invalid salary amount %p',
    async (amount) => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderScreen();
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), amount);
    fireEvent.press(getByText('Enregistrer'));

    expect(alert).toHaveBeenCalledWith('Erreur', 'Veuillez entrer un montant valide.');
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
    await expect(storage.getMonthlySalaries()).resolves.toEqual([]);
    }
  );

  it('asks before replacing an existing salary for the same month', async () => {
    const now = new Date();
    const existing = {
      id: 'existing', month: now.getMonth(), year: now.getFullYear(), amount: '1800', label: 'Old',
    };
    await storage.saveMonthlySalaries([existing]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderScreen();
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '2000');
    fireEvent.press(getByText('Enregistrer'));

    expect(alert).toHaveBeenCalledWith(
      'Mois déjà défini',
      expect.stringContaining(`${now.getFullYear()}`),
      expect.arrayContaining([
        expect.objectContaining({ text: 'Annuler', style: 'cancel' }),
        expect.objectContaining({ text: 'Remplacer', onPress: expect.any(Function) }),
      ])
    );
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
    const replace = alert.mock.calls[0][2].find((button) => button.text === 'Remplacer');
    await act(async () => replace.onPress());

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getMonthlySalaries()).resolves.toEqual([
      { ...existing, amount: '2000', label: '' },
    ]);
  });

  it('updates an existing salary without treating itself as a duplicate', async () => {
    const now = new Date();
    const existing = {
      id: 'editing', month: now.getMonth(), year: now.getFullYear(), amount: '1900', label: 'Old',
    };
    await storage.saveMonthlySalaries([existing]);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = renderScreen({ params: { editItem: existing } });
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '1950');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    expect(alert).not.toHaveBeenCalled();
    await expect(storage.getMonthlySalaries()).resolves.toEqual([
      { ...existing, amount: '1950', label: 'Old' },
    ]);
  });

  it('can select January of the following year', async () => {
    const { getByPlaceholderText, getByText } = renderScreen();
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());
    const nextYear = new Date().getFullYear() + 1;

    fireEvent.press(getByText('Jan'));
    fireEvent.press(getByText('+'));
    fireEvent.changeText(getByPlaceholderText('0.00'), '1000');
    fireEvent.press(getByText('Enregistrer'));

    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalledTimes(1));
    await expect(storage.getMonthlySalaries()).resolves.toEqual([
      expect.objectContaining({ month: 0, year: nextYear, amount: '1000' }),
    ]);
  });

  it('does not show a preview for a partially numeric amount', async () => {
    const { getByPlaceholderText, queryByText } = renderScreen();
    await waitFor(() => expect(getByPlaceholderText('0.00')).toBeTruthy());

    fireEvent.changeText(getByPlaceholderText('0.00'), '12abc');

    expect(queryByText('12.00 €')).toBeNull();
  });
});