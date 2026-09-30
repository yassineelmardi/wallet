import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { I18nManager } from 'react-native';
import i18n from '../locales/i18n';
import { generateDemoDataset } from '../services/demoData';
import * as storage from '../storage/storage';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Le sens de lecture ne s'applique pleinement qu'au prochain demarrage.
const applyDirection = (language) => {
  const shouldBeRTL = RTL_LANGUAGES.includes(String(language).split('-')[0]);
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) I18nManager.forceRTL(shouldBeRTL);
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [income, setIncome] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [variableExpenses, setVariableExpenses] = useState([]);
  const [settings, setSettings] = useState({ language: 'fr', darkMode: true, currency: '€' });
  const settingsRef = useRef(settings);
  const [globalSalary, setGlobalSalary] = useState(null);
  const [monthlySalaries, setMonthlySalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [inc, fixed, variable, sett, gSalary, mSalaries] = await Promise.all([
      storage.getIncome(),
      storage.getFixedExpenses(),
      storage.getVariableExpenses(),
      storage.getSettings(),
      storage.getGlobalSalary(),
      storage.getMonthlySalaries(),
    ]);
    setIncome(inc);
    setFixedExpenses(fixed);
    setVariableExpenses(variable);
    setSettings(sett);
    settingsRef.current = sett;
    setGlobalSalary(gSalary);
    setMonthlySalaries(mSalaries);
    i18n.changeLanguage(sett.language);
    applyDirection(sett.language);
    setLoading(false);
  };

  // ─── Revenus ──────────────────────────────────────────────────────────────

  const addIncome = async (item) => {
    await storage.addIncome(item);
    setIncome((prev) => [...prev, item]);
  };

  const updateIncome = async (id, updated) => {
    await storage.updateIncome(id, updated);
    setIncome((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const removeIncome = async (id) => {
    await storage.deleteIncome(id);
    setIncome((prev) => prev.filter((i) => i.id !== id));
  };

  // ─── Charges fixes ────────────────────────────────────────────────────────

  const addFixed = async (item) => {
    await storage.addFixedExpense(item);
    setFixedExpenses((prev) => [...prev, item]);
  };

  const updateFixed = async (id, updated) => {
    await storage.updateFixedExpense(id, updated);
    setFixedExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const removeFixed = async (id) => {
    await storage.deleteFixedExpense(id);
    setFixedExpenses((prev) => prev.filter((i) => i.id !== id));
  };

  // ─── Dépenses variables ───────────────────────────────────────────────────

  const addVariable = async (item) => {
    await storage.addVariableExpense(item);
    setVariableExpenses((prev) => [...prev, item]);
  };

  const updateVariable = async (id, updated) => {
    await storage.updateVariableExpense(id, updated);
    setVariableExpenses((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const removeVariable = async (id) => {
    await storage.deleteVariableExpense(id);
    setVariableExpenses((prev) => prev.filter((i) => i.id !== id));
  };

  // ─── Paramètres ───────────────────────────────────────────────────────────

  const updateSettings = async (newSettings) => {
    const previous = settingsRef.current;
    const merged = { ...previous, ...newSettings };
    settingsRef.current = merged;
    try {
      await storage.saveSettings(merged);
      setSettings(merged);
      if (newSettings.language) {
        i18n.changeLanguage(newSettings.language);
        applyDirection(newSettings.language);
      }
    } catch (error) {
      if (settingsRef.current === merged) settingsRef.current = previous;
      throw error;
    }
  };

  // ─── Salaire global ────────────────────────────────────────────────────────

  const updateGlobalSalary = async (salary) => {
    await storage.saveGlobalSalary(salary);
    setGlobalSalary(salary);
  };

  const removeGlobalSalary = async () => {
    await storage.deleteGlobalSalary();
    setGlobalSalary(null);
  };

  // ─── Salaires mensuels ────────────────────────────────────────────────────

  const setSalaryForMonth = async (item) => {
    await storage.upsertMonthlySalary(item);
    setMonthlySalaries((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [...prev, item];
    });
  };

  const removeMonthlySalary = async (id) => {
    await storage.deleteMonthlySalary(id);
    setMonthlySalaries((prev) => prev.filter((i) => i.id !== id));
  };

  const resetData = async () => {
    await storage.resetAllData();
    setIncome([]);
    setFixedExpenses([]);
    setVariableExpenses([]);
    setGlobalSalary(null);
    setMonthlySalaries([]);
  };

  // Remplace les donnees financieres par un jeu de test couvrant plusieurs mois.
  // Inerte hors developpement : la garde d'interface ne protege pas d'un appel direct.
  const loadDemoData = async (options) => {
    if (!__DEV__) return null;
    const dataset = generateDemoDataset(options);
    await Promise.all([
      storage.saveIncome(dataset.income),
      storage.saveFixedExpenses(dataset.fixedExpenses),
      storage.saveVariableExpenses(dataset.variableExpenses),
      storage.saveMonthlySalaries(dataset.monthlySalaries),
      storage.deleteGlobalSalary(),
    ]);
    setIncome(dataset.income);
    setFixedExpenses(dataset.fixedExpenses);
    setVariableExpenses(dataset.variableExpenses);
    setMonthlySalaries(dataset.monthlySalaries);
    setGlobalSalary(null);
    return dataset;
  };

  // ─── Calculs ──────────────────────────────────────────────────────────────

  const currentMonthSalary = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthly = monthlySalaries.find((s) => s.month === month && s.year === year);
    if (monthly) return { amount: parseFloat(monthly.amount || 0), type: 'monthly', data: monthly };
    if (globalSalary) return { amount: parseFloat(globalSalary.amount || 0), type: 'global', data: globalSalary };
    return { amount: 0, type: 'none', data: null };
  }, [globalSalary, monthlySalaries]);

  const totalAdditionalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalIncome = currentMonthSalary.amount + totalAdditionalIncome;
  const totalFixed = fixedExpenses.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const totalVariable = variableExpenses.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
  const balance = totalIncome - totalFixed - totalVariable;
  const budgetUsedPercent = totalIncome > 0
    ? Math.min(100, Math.round(((totalFixed + totalVariable) / totalIncome) * 100))
    : 0;

  return (
    <AppContext.Provider
      value={{
        loading,
        income,
        fixedExpenses,
        variableExpenses,
        settings,
        globalSalary,
        monthlySalaries,
        currentMonthSalary,
        totalIncome,
        totalAdditionalIncome,
        totalFixed,
        totalVariable,
        balance,
        budgetUsedPercent,
        addIncome,
        updateIncome,
        removeIncome,
        addFixed,
        updateFixed,
        removeFixed,
        addVariable,
        updateVariable,
        removeVariable,
        updateSettings,
        updateGlobalSalary,
        removeGlobalSalary,
        setSalaryForMonth,
        removeMonthlySalary,
        resetData,
        loadDemoData,
        reload: loadAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
