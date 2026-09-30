import {
  buildTransactions,
  deltaPercent,
  filterByMonth,
  filterByYear,
  getAvailableYears,
  getCategoryBreakdown,
  getMonthlyAnalytics,
  getMonthlyComparison,
  getMonthlySeries,
  getTrendSeries,
  getYearlyAnalytics,
  getYearlyComparison,
} from './analytics';

const DATASET = {
  income: [
    { id: 'i1', amount: 500, category: 'bonus', date: '2026-09-10', description: 'Prime' },
    { id: 'i2', amount: '250', category: 'freelance', date: '2026-08-05' },
  ],
  variableExpenses: [
    { id: 'e1', amount: 120, category: 'food', date: '2026-09-02' },
    { id: 'e2', amount: '80', category: 'transport', date: '2026-09-20' },
    { id: 'e3', amount: 200, category: 'food', date: '2026-08-15' },
    { id: 'e4', amount: 60, category: 'leisure', date: '2025-09-11' },
  ],
  monthlySalaries: [
    { id: 's1', year: 2026, month: 8, amount: '3000', label: 'Sept' },
  ],
};

const SEPTEMBER = { year: 2026, month: 8 };

describe('buildTransactions', () => {
  it('unifie revenus, depenses datees et salaires mensuels', () => {
    const transactions = buildTransactions(DATASET);

    expect(transactions).toHaveLength(7);
    expect(transactions.filter((item) => item.type === 'expense')).toHaveLength(4);
    expect(transactions.filter((item) => item.type === 'income')).toHaveLength(3);
  });

  it('trie du plus recent au plus ancien', () => {
    const dates = buildTransactions(DATASET).map((item) => item.date);

    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
  });

  it('date le salaire mensuel au premier jour du mois', () => {
    const salary = buildTransactions(DATASET).find((item) => item.kind === 'salary');

    expect(salary).toMatchObject({ date: '2026-09-01', year: 2026, month: 8, category: 'salary' });
  });

  it('convertit les montants texte en nombres', () => {
    const transaction = buildTransactions(DATASET).find((item) => item.id === 'i2');

    expect(transaction.amount).toBe(250);
  });

  it('ignore les elements sans date exploitable', () => {
    const transactions = buildTransactions({
      variableExpenses: [
        { id: 'ok', amount: 10, date: '2026-09-01' },
        { id: 'sansDate', amount: 10 },
        { id: 'mauvaiseDate', amount: 10, date: '30/09/2026' },
      ],
    });

    expect(transactions.map((item) => item.id)).toEqual(['ok']);
  });

  it('ignore les salaires mensuels mal formes', () => {
    const transactions = buildTransactions({
      monthlySalaries: [
        { id: 'ok', year: 2026, month: 0, amount: '100' },
        { id: 'moisInvalide', year: 2026, month: 12, amount: '100' },
        { id: 'anneeInvalide', year: 'abc', month: 1, amount: '100' },
      ],
    });

    expect(transactions.map((item) => item.id)).toEqual(['ok']);
  });

  it('retourne une liste vide sans argument', () => {
    expect(buildTransactions()).toEqual([]);
  });

  it('remplace un montant non numerique par zero', () => {
    const [transaction] = buildTransactions({
      variableExpenses: [{ id: 'x', amount: 'abc', date: '2026-09-01' }],
    });

    expect(transaction.amount).toBe(0);
  });
});

describe('filtres', () => {
  const transactions = buildTransactions(DATASET);

  it('filtre par annee', () => {
    expect(filterByYear(transactions, 2026)).toHaveLength(6);
    expect(filterByYear(transactions, 2025)).toHaveLength(1);
    expect(filterByYear(transactions, 2020)).toHaveLength(0);
  });

  it('filtre par mois', () => {
    expect(filterByMonth(transactions, 2026, 8)).toHaveLength(4);
    expect(filterByMonth(transactions, 2026, 7)).toHaveLength(2);
  });

  it('liste les annees disponibles du plus recent au plus ancien', () => {
    expect(getAvailableYears(transactions)).toEqual([2026, 2025]);
  });
});

describe('deltaPercent', () => {
  it.each([
    [120, 100, 20],
    [80, 100, -20],
    [100, 100, 0],
    [50, -100, 150],
  ])('calcule %p vs %p', (current, previous, expected) => {
    expect(deltaPercent(current, previous)).toBeCloseTo(expected, 5);
  });

  it.each([
    [100, 0],
    [0, 0],
    [Number.NaN, 100],
    [100, Number.NaN],
    [100, Number.POSITIVE_INFINITY],
  ])('retourne null pour %p vs %p', (current, previous) => {
    expect(deltaPercent(current, previous)).toBeNull();
  });
});

describe('getMonthlyAnalytics', () => {
  const transactions = buildTransactions(DATASET);

  it('agrege le mois demande', () => {
    const result = getMonthlyAnalytics(transactions, SEPTEMBER);

    expect(result.totalExpenses).toBe(200);
    expect(result.totalIncome).toBe(3500);
    expect(result.balance).toBe(3300);
    expect(result.transactionCount).toBe(4);
    expect(result.expenseCount).toBe(2);
    expect(result.largestExpense).toMatchObject({ id: 'e1', amount: 120 });
  });

  it('retourne des totaux nuls pour un mois sans donnees', () => {
    const result = getMonthlyAnalytics(transactions, { year: 2026, month: 0 });

    expect(result).toMatchObject({
      totalExpenses: 0,
      totalIncome: 0,
      balance: 0,
      transactionCount: 0,
      largestExpense: null,
    });
  });
});

describe('getYearlyAnalytics', () => {
  const transactions = buildTransactions(DATASET);

  it('agrege l annee et calcule la moyenne sur les mois actifs', () => {
    const result = getYearlyAnalytics(transactions, { year: 2026 });

    expect(result.totalExpenses).toBe(400);
    expect(result.activeMonths).toBe(2);
    expect(result.monthlyAverage).toBe(200);
    expect(result.months).toHaveLength(12);
  });

  it('identifie le mois le plus depensier', () => {
    const result = getYearlyAnalytics(transactions, { year: 2026 });

    expect(result.busiestMonth).toMatchObject({ month: 7, total: 200 });
  });

  it('evite la division par zero sans donnees', () => {
    const result = getYearlyAnalytics(transactions, { year: 2000 });

    expect(result.monthlyAverage).toBe(0);
    expect(result.activeMonths).toBe(0);
    expect(result.busiestMonth).toBeNull();
  });
});

describe('getMonthlySeries', () => {
  it('produit douze points meme sans donnees', () => {
    const series = getMonthlySeries(buildTransactions(DATASET), { year: 2026 });

    expect(series).toHaveLength(12);
    expect(series[8]).toMatchObject({ month: 8, label: 'Sept', total: 200 });
    expect(series[0].total).toBe(0);
  });

  it('exclut les revenus de la serie de depenses', () => {
    const series = getMonthlySeries(buildTransactions(DATASET), { year: 2026 });

    expect(series.reduce((sum, entry) => sum + entry.total, 0)).toBe(400);
  });
});

describe('getCategoryBreakdown', () => {
  const transactions = buildTransactions(DATASET);

  it('regroupe et classe par montant decroissant', () => {
    const breakdown = getCategoryBreakdown(transactions, SEPTEMBER);

    expect(breakdown).toEqual([
      { category: 'food', total: 120, share: 0.6 },
      { category: 'transport', total: 80, share: 0.4 },
    ]);
  });

  it('agrege sur l annee quand le mois est omis', () => {
    const breakdown = getCategoryBreakdown(transactions, { year: 2026 });

    expect(breakdown[0]).toMatchObject({ category: 'food', total: 320 });
  });

  it('retourne une liste vide sans depense', () => {
    expect(getCategoryBreakdown(transactions, { year: 1999 })).toEqual([]);
  });

  it('classe les depenses sans categorie dans other', () => {
    const breakdown = getCategoryBreakdown(
      buildTransactions({ variableExpenses: [{ id: 'x', amount: 10, date: '2026-09-01' }] }),
      SEPTEMBER
    );

    expect(breakdown).toEqual([{ category: 'other', total: 10, share: 1 }]);
  });
});

describe('comparaisons', () => {
  const transactions = buildTransactions(DATASET);

  it('compare le mois courant au precedent', () => {
    const result = getMonthlyComparison(transactions, SEPTEMBER);

    expect(result.current.totalExpenses).toBe(200);
    expect(result.previous.totalExpenses).toBe(200);
    expect(result.expensesDelta).toBe(0);
  });

  it('franchit la frontiere d annee', () => {
    const result = getMonthlyComparison(transactions, { year: 2026, month: 0 });

    expect(result.previous.period).toEqual({ year: 2025, month: 11 });
  });

  it('compare deux annees', () => {
    const result = getYearlyComparison(transactions, { year: 2026 });

    expect(result.current.totalExpenses).toBe(400);
    expect(result.previous.totalExpenses).toBe(60);
    expect(result.expensesDelta).toBeCloseTo(566.666, 2);
  });

  it('retourne un delta null quand la periode precedente est vide', () => {
    const result = getYearlyComparison(transactions, { year: 2025 });

    expect(result.previous.totalExpenses).toBe(0);
    expect(result.expensesDelta).toBeNull();
  });
});

describe('getTrendSeries', () => {
  it('produit la fenetre glissante demandee en finissant sur la periode courante', () => {
    const trend = getTrendSeries(buildTransactions(DATASET), { ...SEPTEMBER, length: 3 });

    expect(trend).toHaveLength(3);
    expect(trend[2]).toMatchObject({ year: 2026, month: 8, total: 200 });
    expect(trend[1]).toMatchObject({ year: 2026, month: 7, total: 200 });
    expect(trend[0]).toMatchObject({ year: 2026, month: 6, total: 0 });
  });

  it('remonte sur l annee precedente si necessaire', () => {
    const trend = getTrendSeries(buildTransactions(DATASET), { year: 2026, month: 0, length: 2 });

    expect(trend[0]).toMatchObject({ year: 2025, month: 11 });
  });
});
