import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../locales/i18n';
import * as storage from '../storage/storage';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [income, setIncome] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [variableExpenses, setVariableExpenses] = useState([]);
  const [settings, setSettings] = useState({ language: 'fr', darkMode: true, currency: '€' });
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [inc, fixed, variable, sett] = await Promise.all([
      storage.getIncome(),
      storage.getFixedExpenses(),
      storage.getVariableExpenses(),
      storage.getSettings(),
    ]);
    setIncome(inc);
    setFixedExpenses(fixed);
    setVariableExpenses(variable);
    setSettings(sett);
    i18n.changeLanguage(sett.language);
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
    const merged = { ...settings, ...newSettings };
    await storage.saveSettings(merged);
    setSettings(merged);
    if (newSettings.language) i18n.changeLanguage(newSettings.language);
  };

  const resetData = async () => {
    await storage.resetAllData();
    setIncome([]);
    setFixedExpenses([]);
    setVariableExpenses([]);
  };

  // ─── Calculs ──────────────────────────────────────────────────────────────

  const totalIncome = income.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
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
        totalIncome,
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
        resetData,
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
