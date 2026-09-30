import { shiftMonth } from '../utils/period';

const VARIABLE_CATEGORIES = [
  { key: 'food', labels: ['Courses', 'Restaurant', 'Boulangerie'], min: 8, max: 95 },
  { key: 'shopping', labels: ['Vêtements', 'Électronique', 'Cadeau'], min: 15, max: 180 },
  { key: 'transport', labels: ['Essence', 'Train', 'Taxi'], min: 5, max: 90 },
  { key: 'leisure', labels: ['Cinéma', 'Concert', 'Abonnement'], min: 10, max: 70 },
  { key: 'health', labels: ['Pharmacie', 'Médecin', 'Optique'], min: 12, max: 120 },
  { key: 'other', labels: ['Divers', 'Imprévu'], min: 5, max: 60 },
];

const INCOME_CATEGORIES = [
  { key: 'bonus', labels: ['Prime', 'Bonus annuel'], min: 150, max: 800 },
  { key: 'freelance', labels: ['Mission freelance', 'Prestation'], min: 200, max: 1200 },
  { key: 'other', labels: ['Remboursement', 'Vente'], min: 30, max: 300 },
];

const FIXED_EXPENSES = [
  { id: 'demo-fixed-rent', amount: 720, category: 'rent', description: 'Loyer' },
  { id: 'demo-fixed-internet', amount: 39.99, category: 'internet', description: 'Fibre' },
  { id: 'demo-fixed-insurance', amount: 42.5, category: 'insurance', description: 'Assurance habitation' },
  { id: 'demo-fixed-credit', amount: 180, category: 'credit', description: 'Crédit auto' },
];

// Generateur congruentiel : le jeu de demonstration doit rester reproductible.
const createRandom = (seed) => {
  let state = Math.abs(Math.trunc(seed)) % 2147483647;
  if (state === 0) state = 1;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};

const pad = (value) => String(value).padStart(2, '0');

export const generateDemoDataset = ({
  months = 14,
  reference = new Date(),
  seed = 20260930,
} = {}) => {
  const random = createRandom(seed);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const money = (min, max) => Math.round((min + random() * (max - min)) * 100) / 100;

  const base = { year: reference.getFullYear(), month: reference.getMonth() };
  const income = [];
  const variableExpenses = [];
  const monthlySalaries = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const period = shiftMonth(base, -offset);
    const monthKey = `${period.year}-${pad(period.month + 1)}`;

    const expenseCount = 6 + Math.floor(random() * 7);
    for (let index = 0; index < expenseCount; index += 1) {
      const category = pick(VARIABLE_CATEGORIES);
      variableExpenses.push({
        id: `demo-expense-${monthKey}-${index}`,
        amount: money(category.min, category.max),
        category: category.key,
        description: pick(category.labels),
        date: `${monthKey}-${pad(1 + Math.floor(random() * 28))}`,
      });
    }

    monthlySalaries.push({
      id: `demo-salary-${monthKey}`,
      year: period.year,
      month: period.month,
      amount: String(money(2400, 3100)),
      label: 'Salaire mensuel',
    });

    if (random() > 0.45) {
      const category = pick(INCOME_CATEGORIES);
      income.push({
        id: `demo-income-${monthKey}`,
        amount: money(category.min, category.max),
        category: category.key,
        description: pick(category.labels),
        date: `${monthKey}-${pad(5 + Math.floor(random() * 20))}`,
      });
    }
  }

  return {
    income,
    variableExpenses,
    fixedExpenses: FIXED_EXPENSES.map((item) => ({ ...item })),
    monthlySalaries,
  };
};
