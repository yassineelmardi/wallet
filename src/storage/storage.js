import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  INCOME: '@wallet_income',
  FIXED_EXPENSES: '@wallet_fixed_expenses',
  VARIABLE_EXPENSES: '@wallet_variable_expenses',
  SETTINGS: '@wallet_settings',
  GLOBAL_SALARY: '@wallet_global_salary',
  MONTHLY_SALARIES: '@wallet_monthly_salaries',
};

// ─── Revenus ────────────────────────────────────────────────────────────────

export const getIncome = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.INCOME);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveIncome = async (incomeList) => {
  await AsyncStorage.setItem(KEYS.INCOME, JSON.stringify(incomeList));
};

export const addIncome = async (item) => {
  const list = await getIncome();
  list.push(item);
  await saveIncome(list);
};

export const updateIncome = async (id, updated) => {
  const list = await getIncome();
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) list[idx] = { ...list[idx], ...updated };
  await saveIncome(list);
};

export const deleteIncome = async (id) => {
  const list = await getIncome();
  await saveIncome(list.filter((i) => i.id !== id));
};

// ─── Charges fixes ──────────────────────────────────────────────────────────

export const getFixedExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.FIXED_EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveFixedExpenses = async (list) => {
  await AsyncStorage.setItem(KEYS.FIXED_EXPENSES, JSON.stringify(list));
};

export const addFixedExpense = async (item) => {
  const list = await getFixedExpenses();
  list.push(item);
  await saveFixedExpenses(list);
};

export const updateFixedExpense = async (id, updated) => {
  const list = await getFixedExpenses();
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) list[idx] = { ...list[idx], ...updated };
  await saveFixedExpenses(list);
};

export const deleteFixedExpense = async (id) => {
  const list = await getFixedExpenses();
  await saveFixedExpenses(list.filter((i) => i.id !== id));
};

// ─── Dépenses variables ─────────────────────────────────────────────────────

export const getVariableExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.VARIABLE_EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveVariableExpenses = async (list) => {
  await AsyncStorage.setItem(KEYS.VARIABLE_EXPENSES, JSON.stringify(list));
};

export const addVariableExpense = async (item) => {
  const list = await getVariableExpenses();
  list.push(item);
  await saveVariableExpenses(list);
};

export const updateVariableExpense = async (id, updated) => {
  const list = await getVariableExpenses();
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) list[idx] = { ...list[idx], ...updated };
  await saveVariableExpenses(list);
};

export const deleteVariableExpense = async (id) => {
  const list = await getVariableExpenses();
  await saveVariableExpenses(list.filter((i) => i.id !== id));
};

// ─── Paramètres ─────────────────────────────────────────────────────────────

export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : { language: 'fr', darkMode: true, currency: '€' };
  } catch {
    return { language: 'fr', darkMode: true, currency: '€' };
  }
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ─── Reset ──────────────────────────────────────────────────────────────────

export const resetAllData = async () => {
  await AsyncStorage.multiRemove([
    KEYS.INCOME,
    KEYS.FIXED_EXPENSES,
    KEYS.VARIABLE_EXPENSES,
    KEYS.GLOBAL_SALARY,
    KEYS.MONTHLY_SALARIES,
  ]);
};

// ─── Salaire global ─────────────────────────────────────────────────────────

export const getGlobalSalary = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.GLOBAL_SALARY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveGlobalSalary = async (salary) => {
  await AsyncStorage.setItem(KEYS.GLOBAL_SALARY, JSON.stringify(salary));
};

export const deleteGlobalSalary = async () => {
  await AsyncStorage.removeItem(KEYS.GLOBAL_SALARY);
};

// ─── Salaires mensuels ───────────────────────────────────────────────────────

export const getMonthlySalaries = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MONTHLY_SALARIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveMonthlySalaries = async (list) => {
  await AsyncStorage.setItem(KEYS.MONTHLY_SALARIES, JSON.stringify(list));
};

export const upsertMonthlySalary = async (item) => {
  const list = await getMonthlySalaries();
  const idx = list.findIndex((i) => i.id === item.id);
  if (idx !== -1) list[idx] = item;
  else list.push(item);
  await saveMonthlySalaries(list);
};

export const deleteMonthlySalary = async (id) => {
  const list = await getMonthlySalaries();
  await saveMonthlySalaries(list.filter((i) => i.id !== id));
};
