import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import * as storage from '../storage/storage';
import { AppProvider, useApp } from './AppContext';

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

const renderApp = async () => {
  const hook = renderHook(() => useApp(), { wrapper });
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook;
};

const COLLECTIONS = [
  {
    name: 'income',
    stateKey: 'income',
    add: 'addIncome',
    update: 'updateIncome',
    remove: 'removeIncome',
    get: storage.getIncome,
    totalKey: 'totalAdditionalIncome',
  },
  {
    name: 'fixed expenses',
    stateKey: 'fixedExpenses',
    add: 'addFixed',
    update: 'updateFixed',
    remove: 'removeFixed',
    get: storage.getFixedExpenses,
    totalKey: 'totalFixed',
  },
  {
    name: 'variable expenses',
    stateKey: 'variableExpenses',
    add: 'addVariable',
    update: 'updateVariable',
    remove: 'removeVariable',
    get: storage.getVariableExpenses,
    totalKey: 'totalVariable',
  },
];

beforeEach(async () => {
  AsyncStorage.reset();
  await i18n.changeLanguage('fr');
});

describe('AppProvider initialization and calculations', () => {
  it('loads default state when storage is empty', async () => {
    const { result } = await renderApp();

    expect(result.current).toEqual(expect.objectContaining({
      loading: false,
      income: [],
      fixedExpenses: [],
      variableExpenses: [],
      settings: { language: 'fr', darkMode: true, currency: '€' },
      globalSalary: null,
      monthlySalaries: [],
      currentMonthSalary: { amount: 0, type: 'none', data: null },
      totalIncome: 0,
      totalAdditionalIncome: 0,
      totalFixed: 0,
      totalVariable: 0,
      balance: 0,
      budgetUsedPercent: 0,
    }));
  });

  it('prefers the current monthly salary and aggregates all financial values', async () => {
    const now = new Date();
    const monthlySalary = {
      id: 'month-current', month: now.getMonth(), year: now.getFullYear(), amount: '2000',
    };
    await storage.saveGlobalSalary({ id: 'global', amount: '5000' });
    await storage.saveMonthlySalaries([monthlySalary]);
    await storage.saveIncome([{ id: 'bonus', amount: '500' }]);
    await storage.saveFixedExpenses([{ id: 'rent', amount: '800' }]);
    await storage.saveVariableExpenses([{ id: 'food', amount: '200' }]);

    const { result } = await renderApp();

    expect(result.current.currentMonthSalary).toEqual({
      amount: 2000,
      type: 'monthly',
      data: monthlySalary,
    });
    expect(result.current.totalAdditionalIncome).toBe(500);
    expect(result.current.totalIncome).toBe(2500);
    expect(result.current.totalFixed).toBe(800);
    expect(result.current.totalVariable).toBe(200);
    expect(result.current.balance).toBe(1500);
    expect(result.current.budgetUsedPercent).toBe(40);
  });

  it('falls back to the global salary when no current monthly salary exists', async () => {
    await storage.saveGlobalSalary({ id: 'global', amount: '1750' });
    await storage.saveMonthlySalaries([
      { id: 'previous', month: 0, year: 2000, amount: '3000' },
    ]);

    const { result } = await renderApp();

    expect(result.current.currentMonthSalary).toEqual({
      amount: 1750,
      type: 'global',
      data: { id: 'global', amount: '1750' },
    });
  });

  it('keeps budget usage at zero without income and caps it at one hundred percent', async () => {
    await storage.saveFixedExpenses([{ id: 'rent', amount: '200' }]);
    const first = await renderApp();
    expect(first.result.current.budgetUsedPercent).toBe(0);

    first.unmount();
    await storage.saveGlobalSalary({ id: 'global', amount: '100' });
    const second = await renderApp();
    expect(second.result.current.budgetUsedPercent).toBe(100);
  });
});

describe.each(COLLECTIONS)('$name mutations', (collection) => {
  it('adds, updates, persists and removes an item', async () => {
    const { result } = await renderApp();
    const item = { id: 'item-1', amount: 10, description: 'initial' };

    await act(async () => result.current[collection.add](item));
    expect(result.current[collection.stateKey]).toEqual([item]);
    await expect(collection.get()).resolves.toEqual([item]);

    await act(async () => result.current[collection.update]('item-1', { amount: 25 }));
    const updated = { ...item, amount: 25 };
    expect(result.current[collection.stateKey]).toEqual([updated]);
    await expect(collection.get()).resolves.toEqual([updated]);

    await act(async () => result.current[collection.remove]('item-1'));
    expect(result.current[collection.stateKey]).toEqual([]);
    await expect(collection.get()).resolves.toEqual([]);
  });

  it('does not mutate in-memory state when persistence fails', async () => {
    const { result } = await renderApp();
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('quota exceeded'));

    await expect(act(async () => result.current[collection.add]({ id: 'failed', amount: 1 })))
      .rejects.toThrow('quota exceeded');
    expect(result.current[collection.stateKey]).toEqual([]);
  });
});

describe('AppProvider settings, salaries, and reset', () => {
  it('merges settings and applies the selected language', async () => {
    const { result } = await renderApp();

    await act(async () => result.current.updateSettings({ currency: '$', language: 'en' }));

    expect(result.current.settings).toEqual({ language: 'en', darkMode: true, currency: '$' });
    await expect(storage.getSettings()).resolves.toEqual(result.current.settings);
    expect(i18n.language).toBe('en');
  });

  it('preserves independent settings changed concurrently', async () => {
    const { result } = await renderApp();

    await act(async () => {
      await Promise.all([
        result.current.updateSettings({ language: 'en' }),
        result.current.updateSettings({ currency: '$' }),
      ]);
    });

    expect(result.current.settings).toEqual({
      language: 'en', darkMode: true, currency: '$',
    });
    await expect(storage.getSettings()).resolves.toEqual(result.current.settings);
  });

  it('keeps the previous settings and recovers its merge base after a write error', async () => {
    const { result } = await renderApp();
    AsyncStorage.setItem.mockRejectedValueOnce(new Error('settings write failed'));

    await expect(result.current.updateSettings({ currency: '$' }))
      .rejects.toThrow('settings write failed');
    expect(result.current.settings).toEqual({ language: 'fr', darkMode: true, currency: '€' });

    await act(async () => result.current.updateSettings({ language: 'en' }));
    expect(result.current.settings).toEqual({ language: 'en', darkMode: true, currency: '€' });
  });

  it('saves a monthly salary, replaces by id, and removes it', async () => {
    const { result } = await renderApp();
    const first = { id: 'month-1', month: 0, year: 2026, amount: '2000' };
    const updated = { ...first, amount: '2300' };

    await act(async () => result.current.setSalaryForMonth(first));
    await act(async () => result.current.setSalaryForMonth(updated));
    expect(result.current.monthlySalaries).toEqual([updated]);
    await expect(storage.getMonthlySalaries()).resolves.toEqual([updated]);

    await act(async () => result.current.removeMonthlySalary(first.id));
    expect(result.current.monthlySalaries).toEqual([]);
  });

  it('updates and removes the global salary', async () => {
    const { result } = await renderApp();
    const salary = { id: 'global', amount: '2100' };

    await act(async () => result.current.updateGlobalSalary(salary));
    expect(result.current.globalSalary).toEqual(salary);
    await act(async () => result.current.removeGlobalSalary());
    expect(result.current.globalSalary).toBeNull();
  });

  it('resets financial records while retaining settings', async () => {
    const { result } = await renderApp();
    await act(async () => {
      await result.current.addIncome({ id: 'bonus', amount: 10 });
      await result.current.addFixed({ id: 'rent', amount: 5 });
      await result.current.addVariable({ id: 'food', amount: 2 });
      await result.current.updateGlobalSalary({ id: 'global', amount: 100 });
      await result.current.setSalaryForMonth({ id: 'month', month: 0, year: 2026, amount: '90' });
      await result.current.updateSettings({ currency: '$' });
    });

    await act(async () => result.current.resetData());

    expect(result.current.income).toEqual([]);
    expect(result.current.fixedExpenses).toEqual([]);
    expect(result.current.variableExpenses).toEqual([]);
    expect(result.current.globalSalary).toBeNull();
    expect(result.current.monthlySalaries).toEqual([]);
    expect(result.current.settings.currency).toBe('$');
    await expect(storage.getSettings()).resolves.toEqual(result.current.settings);
  });
});