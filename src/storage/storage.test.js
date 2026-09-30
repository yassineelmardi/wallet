import asyncStorage from '@react-native-async-storage/async-storage';
import * as storage from './storage';

const AsyncStorage = { default: asyncStorage };

const CRUD_CASES = [
  {
    name: 'income',
    key: '@wallet_income',
    get: storage.getIncome,
    save: storage.saveIncome,
    add: storage.addIncome,
    update: storage.updateIncome,
    remove: storage.deleteIncome,
  },
  {
    name: 'fixed expenses',
    key: '@wallet_fixed_expenses',
    get: storage.getFixedExpenses,
    save: storage.saveFixedExpenses,
    add: storage.addFixedExpense,
    update: storage.updateFixedExpense,
    remove: storage.deleteFixedExpense,
  },
  {
    name: 'variable expenses',
    key: '@wallet_variable_expenses',
    get: storage.getVariableExpenses,
    save: storage.saveVariableExpenses,
    add: storage.addVariableExpense,
    update: storage.updateVariableExpense,
    remove: storage.deleteVariableExpense,
  },
];

beforeEach(() => AsyncStorage.default.reset());

describe.each(CRUD_CASES)('$name storage', ({ key, get, save, add, update, remove }) => {
  it('returns an empty list when no value is stored', async () => {
    await expect(get()).resolves.toEqual([]);
  });

  it('round-trips lists and appends new records', async () => {
    const first = { id: 'first', amount: 10 };
    const second = { id: 'second', amount: 20 };
    await save([first]);
    await add(second);

    await expect(get()).resolves.toEqual([first, second]);
    expect(AsyncStorage.default.setItem).toHaveBeenLastCalledWith(
      key,
      JSON.stringify([first, second])
    );
  });

  it('merges an update and leaves unmatched records unchanged', async () => {
    const original = { id: 'one', amount: 10, description: 'old' };
    await save([original]);

    await update('one', { amount: 15 });
    await update('missing', { amount: 99 });

    await expect(get()).resolves.toEqual([{ ...original, amount: 15 }]);
  });

  it('deletes matching records and leaves unmatched records unchanged', async () => {
    await save([{ id: 'one' }, { id: 'two' }]);

    await remove('one');
    await remove('missing');

    await expect(get()).resolves.toEqual([{ id: 'two' }]);
  });

  it('returns an empty list for malformed JSON or storage read errors', async () => {
    await AsyncStorage.default.setItem(key, '{invalid');
    await expect(get()).resolves.toEqual([]);

    AsyncStorage.default.getItem.mockRejectedValueOnce(new Error('storage unavailable'));
    await expect(get()).resolves.toEqual([]);
  });

  it('propagates storage write errors', async () => {
    AsyncStorage.default.setItem.mockRejectedValueOnce(new Error('quota exceeded'));

    await expect(save([{ id: 'one' }])).rejects.toThrow('quota exceeded');
  });
});

describe('settings storage', () => {
  it('returns default settings when no value is stored or JSON is malformed', async () => {
    const defaults = { language: 'fr', darkMode: true, currency: '€' };
    await expect(storage.getSettings()).resolves.toEqual(defaults);

    await AsyncStorage.default.setItem('@wallet_settings', '{invalid');
    await expect(storage.getSettings()).resolves.toEqual(defaults);
  });

  it('round-trips saved settings and propagates write errors', async () => {
    const settings = { language: 'en', currency: '$' };
    await storage.saveSettings(settings);
    await expect(storage.getSettings()).resolves.toEqual(settings);

    AsyncStorage.default.setItem.mockRejectedValueOnce(new Error('write failed'));
    await expect(storage.saveSettings(settings)).rejects.toThrow('write failed');
  });
});

describe('salary storage', () => {
  it('returns null for missing or malformed global salary data', async () => {
    await expect(storage.getGlobalSalary()).resolves.toBeNull();
    await AsyncStorage.default.setItem('@wallet_global_salary', '{invalid');
    await expect(storage.getGlobalSalary()).resolves.toBeNull();
  });

  it('saves and deletes the global salary', async () => {
    const salary = { id: 'global', amount: '2500' };
    await storage.saveGlobalSalary(salary);
    await expect(storage.getGlobalSalary()).resolves.toEqual(salary);
    await storage.deleteGlobalSalary();
    await expect(storage.getGlobalSalary()).resolves.toBeNull();
  });

  it('returns an empty monthly salary list for missing or malformed data', async () => {
    await expect(storage.getMonthlySalaries()).resolves.toEqual([]);
    await AsyncStorage.default.setItem('@wallet_monthly_salaries', '{invalid');
    await expect(storage.getMonthlySalaries()).resolves.toEqual([]);
  });

  it('upserts by id and removes only the requested monthly salary', async () => {
    const first = { id: 'one', month: 0, year: 2026, amount: '2000' };
    const updated = { ...first, amount: '2200' };
    const second = { id: 'two', month: 1, year: 2026, amount: '2100' };

    await storage.upsertMonthlySalary(first);
    await storage.upsertMonthlySalary(updated);
    await storage.upsertMonthlySalary(second);
    await expect(storage.getMonthlySalaries()).resolves.toEqual([updated, second]);

    await storage.deleteMonthlySalary('one');
    await storage.deleteMonthlySalary('missing');
    await expect(storage.getMonthlySalaries()).resolves.toEqual([second]);
  });
});

it('clears financial data without deleting settings', async () => {
  await AsyncStorage.default.setItem('@wallet_income', '[]');
  await AsyncStorage.default.setItem('@wallet_fixed_expenses', '[]');
  await AsyncStorage.default.setItem('@wallet_variable_expenses', '[]');
  await AsyncStorage.default.setItem('@wallet_global_salary', '{}');
  await AsyncStorage.default.setItem('@wallet_monthly_salaries', '[]');
  await AsyncStorage.default.setItem('@wallet_settings', '{"language":"fr"}');

  await storage.resetAllData();

  expect(AsyncStorage.default.multiRemove).toHaveBeenCalledWith([
    '@wallet_income',
    '@wallet_fixed_expenses',
    '@wallet_variable_expenses',
    '@wallet_global_salary',
    '@wallet_monthly_salaries',
  ]);
  await expect(storage.getSettings()).resolves.toEqual({ language: 'fr' });
});