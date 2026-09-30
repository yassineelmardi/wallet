import { MONTH_COUNT, monthShortLabel, parsePeriod, shiftMonth } from '../utils/period';

const toAmount = (value) => {
  const amount = parseFloat(value);
  return Number.isFinite(amount) ? amount : 0;
};

const pad = (value) => String(value).padStart(2, '0');

/**
 * Les charges fixes ne portent aucune date : elles sont volontairement exclues
 * de l'historique plutot que rattachees arbitrairement a une periode.
 */
export const buildTransactions = ({
  income = [],
  variableExpenses = [],
  monthlySalaries = [],
} = {}) => {
  const transactions = [];

  const pushDated = (item, type, kind) => {
    const period = parsePeriod(item.date);
    if (!period) return;
    transactions.push({
      id: item.id,
      type,
      kind,
      amount: toAmount(item.amount),
      category: item.category || 'other',
      description: item.description || '',
      date: item.date,
      year: period.year,
      month: period.month,
    });
  };

  income.forEach((item) => pushDated(item, 'income', 'income'));
  variableExpenses.forEach((item) => pushDated(item, 'expense', 'variable'));

  monthlySalaries.forEach((item) => {
    const year = Number(item.year);
    const month = Number(item.month);
    if (!Number.isInteger(year) || !Number.isInteger(month)) return;
    if (month < 0 || month > 11) return;
    transactions.push({
      id: item.id,
      type: 'income',
      kind: 'salary',
      amount: toAmount(item.amount),
      category: 'salary',
      description: item.label || '',
      date: `${year}-${pad(month + 1)}-01`,
      year,
      month,
    });
  });

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
};

export const filterByYear = (transactions, year) =>
  transactions.filter((item) => item.year === year);

export const filterByMonth = (transactions, year, month) =>
  transactions.filter((item) => item.year === year && item.month === month);

const scopeOf = (transactions, { year, month }) =>
  month === undefined || month === null
    ? filterByYear(transactions, year)
    : filterByMonth(transactions, year, month);

export const deltaPercent = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
};

const summarize = (transactions) => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  const incomes = transactions.filter((item) => item.type === 'income');
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const largestExpense = expenses.reduce(
    (max, item) => (!max || item.amount > max.amount ? item : max),
    null
  );
  return {
    totalExpenses,
    totalIncome,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    expenseCount: expenses.length,
    largestExpense,
  };
};

export const getMonthlySeries = (transactions, { year }) =>
  Array.from({ length: MONTH_COUNT }, (unused, month) => {
    const scoped = filterByMonth(transactions, year, month);
    const expenses = scoped.filter((item) => item.type === 'expense');
    return {
      month,
      label: monthShortLabel(month),
      total: expenses.reduce((sum, item) => sum + item.amount, 0),
    };
  });

export const getMonthlyAnalytics = (transactions, { year, month }) => ({
  period: { year, month },
  ...summarize(filterByMonth(transactions, year, month)),
});

export const getYearlyAnalytics = (transactions, { year }) => {
  const summary = summarize(filterByYear(transactions, year));
  const months = getMonthlySeries(transactions, { year });
  const activeMonths = months.filter((entry) => entry.total > 0).length;
  const busiest = months.reduce(
    (max, entry) => (!max || entry.total > max.total ? entry : max),
    null
  );
  return {
    period: { year },
    ...summary,
    months,
    activeMonths,
    monthlyAverage: activeMonths > 0 ? summary.totalExpenses / activeMonths : 0,
    busiestMonth: busiest && busiest.total > 0 ? busiest : null,
  };
};

export const getCategoryBreakdown = (transactions, period = {}) => {
  const expenses = scopeOf(transactions, period).filter((item) => item.type === 'expense');
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const byCategory = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      total: amount,
      share: total > 0 ? amount / total : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

const buildComparison = (current, previous) => ({
  current,
  previous,
  expensesDelta: deltaPercent(current.totalExpenses, previous.totalExpenses),
  incomeDelta: deltaPercent(current.totalIncome, previous.totalIncome),
  balanceDelta: deltaPercent(current.balance, previous.balance),
});

export const getMonthlyComparison = (transactions, { year, month }) =>
  buildComparison(
    getMonthlyAnalytics(transactions, { year, month }),
    getMonthlyAnalytics(transactions, shiftMonth({ year, month }, -1))
  );

export const getYearlyComparison = (transactions, { year }) =>
  buildComparison(
    getYearlyAnalytics(transactions, { year }),
    getYearlyAnalytics(transactions, { year: year - 1 })
  );

export const getTrendSeries = (transactions, { year, month, length = 6 }) =>
  Array.from({ length }, (unused, index) => {
    const period = shiftMonth({ year, month }, index - (length - 1));
    const expenses = filterByMonth(transactions, period.year, period.month)
      .filter((item) => item.type === 'expense');
    return {
      ...period,
      label: monthShortLabel(period.month),
      total: expenses.reduce((sum, item) => sum + item.amount, 0),
    };
  });

export const getAvailableYears = (transactions) => {
  const years = [...new Set(transactions.map((item) => item.year))];
  return years.sort((a, b) => b - a);
};
