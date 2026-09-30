import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from '../context/AppContext';
import * as storage from '../storage/storage';
import useSalary from './useSalary';

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

const renderSalaryHook = async () => {
  const hook = renderHook(() => useSalary(), { wrapper });
  await waitFor(() => expect(hook.result.current).toBeDefined());
  return hook;
};

beforeEach(() => AsyncStorage.reset());

it('returns no salary when neither monthly nor global salary exists', async () => {
  const { result } = await renderSalaryHook();
  const now = new Date();

  expect(result.current.getCurrentMonthSalary()).toEqual({ amount: 0, type: 'none', data: null });
  expect(result.current.getSalaryForMonth(now.getMonth(), now.getFullYear()))
    .toEqual({ amount: 0, type: 'none', data: null });
});

it('uses the matching monthly salary and preserves its source record', async () => {
  const now = new Date();
  const monthlySalary = {
    id: 'current', month: now.getMonth(), year: now.getFullYear(), amount: '2100.75',
  };
  await storage.saveMonthlySalaries([monthlySalary]);
  await storage.saveGlobalSalary({ id: 'global', amount: '3000' });
  const { result } = await renderSalaryHook();

  expect(result.current.getCurrentMonthSalary()).toEqual({
    amount: 2100.75,
    type: 'monthly',
    data: monthlySalary,
  });
  expect(result.current.getSalaryForMonth(now.getMonth(), now.getFullYear()))
    .toEqual({ amount: 2100.75, type: 'monthly', data: monthlySalary });
});

it('falls back to the global salary for months without a specific salary', async () => {
  const globalSalary = { id: 'global', amount: '1850' };
  await storage.saveGlobalSalary(globalSalary);
  await storage.saveMonthlySalaries([
    { id: 'other', month: 0, year: 2000, amount: '900' },
  ]);
  const { result } = await renderSalaryHook();

  expect(result.current.getSalaryForMonth(5, 2040)).toEqual({
    amount: 1850,
    type: 'global',
    data: globalSalary,
  });
});

it('uses the global salary as the current salary when no current month entry exists', async () => {
  const globalSalary = { id: 'global', amount: '1850' };
  await storage.saveGlobalSalary(globalSalary);
  await storage.saveMonthlySalaries([
    { id: 'previous', month: 0, year: 2000, amount: '900' },
  ]);
  const { result } = await renderSalaryHook();

  expect(result.current.getCurrentMonthSalary()).toEqual({
    amount: 1850,
    type: 'global',
    data: globalSalary,
  });
});

it('treats a missing monthly amount as zero', async () => {
  const now = new Date();
  await storage.saveMonthlySalaries([{
    id: 'empty', month: now.getMonth(), year: now.getFullYear(), amount: '',
  }]);
  const { result } = await renderSalaryHook();

  expect(result.current.getCurrentMonthSalary()).toEqual({
    amount: 0,
    type: 'monthly',
    data: { id: 'empty', month: now.getMonth(), year: now.getFullYear(), amount: '' },
  });
});