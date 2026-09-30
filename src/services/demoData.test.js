import { generateDemoDataset } from './demoData';
import { buildTransactions, getAvailableYears, getMonthlySeries } from './analytics';
import { parsePeriod, shiftMonth } from '../utils/period';

const REFERENCE = new Date(2026, 8, 30);

describe('generateDemoDataset', () => {
  it('produit le meme jeu pour une meme graine', () => {
    const first = generateDemoDataset({ reference: REFERENCE });
    const second = generateDemoDataset({ reference: REFERENCE });

    expect(first).toEqual(second);
  });

  it('produit un jeu different pour une autre graine', () => {
    const first = generateDemoDataset({ reference: REFERENCE, seed: 1 });
    const second = generateDemoDataset({ reference: REFERENCE, seed: 2 });

    expect(first.variableExpenses).not.toEqual(second.variableExpenses);
  });

  it('couvre le nombre de mois demande en finissant sur le mois de reference', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE, months: 14 });

    expect(dataset.monthlySalaries).toHaveLength(14);
    expect(dataset.monthlySalaries[13]).toMatchObject({ year: 2026, month: 8 });
    expect(dataset.monthlySalaries[0]).toMatchObject(shiftMonth({ year: 2026, month: 8 }, -13));
  });

  it('genere des dates exploitables par le module d analyse', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE });

    dataset.variableExpenses.forEach((item) => {
      expect(parsePeriod(item.date)).not.toBeNull();
    });
    dataset.income.forEach((item) => {
      expect(parsePeriod(item.date)).not.toBeNull();
    });
  });

  it('attribue des identifiants uniques', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE });
    const ids = [
      ...dataset.income,
      ...dataset.variableExpenses,
      ...dataset.fixedExpenses,
      ...dataset.monthlySalaries,
    ].map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('genere uniquement des montants positifs', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE });
    const amounts = [
      ...dataset.income,
      ...dataset.variableExpenses,
      ...dataset.fixedExpenses,
      ...dataset.monthlySalaries,
    ].map((item) => parseFloat(item.amount));

    expect(amounts.every((amount) => amount > 0)).toBe(true);
  });

  it('alimente reellement les analyses sur deux annees', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE, months: 14 });
    const transactions = buildTransactions(dataset);

    expect(getAvailableYears(transactions)).toEqual([2026, 2025]);
    const series = getMonthlySeries(transactions, { year: 2026 });
    expect(series.filter((entry) => entry.total > 0)).toHaveLength(9);
  });

  it('respecte un nombre de mois personnalise', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE, months: 3 });

    expect(dataset.monthlySalaries).toHaveLength(3);
    expect(dataset.variableExpenses.length).toBeGreaterThanOrEqual(18);
  });

  it('fournit des charges fixes sans date, conformement au modele actuel', () => {
    const dataset = generateDemoDataset({ reference: REFERENCE });

    expect(dataset.fixedExpenses).toHaveLength(4);
    dataset.fixedExpenses.forEach((item) => {
      expect(item).not.toHaveProperty('date');
    });
  });
});
