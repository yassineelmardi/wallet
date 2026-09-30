import {
  currentPeriod,
  formatPeriod,
  getMonths,
  isSamePeriod,
  monthLabel,
  monthShortLabel,
  parsePeriod,
  shiftMonth,
  toMonthKey,
} from './period';

describe('parsePeriod', () => {
  it.each([
    ['2026-09-30', { year: 2026, month: 8, day: 30 }],
    ['2026-01-01', { year: 2026, month: 0, day: 1 }],
    [' 2024-02-29 ', { year: 2024, month: 1, day: 29 }],
  ])('analyse la date valide %p', (input, expected) => {
    expect(parsePeriod(input)).toEqual(expected);
  });

  it.each([
    '',
    '2026-9-3',
    '2026/09/30',
    '2026-13-01',
    '2026-00-10',
    '2026-09-00',
    '2026-09-32',
    'abc',
    null,
    undefined,
    20260930,
    {},
  ])('rejette la valeur invalide %p', (input) => {
    expect(parsePeriod(input)).toBeNull();
  });
});

describe('shiftMonth', () => {
  it.each([
    [{ year: 2026, month: 8 }, 1, { year: 2026, month: 9 }],
    [{ year: 2026, month: 11 }, 1, { year: 2027, month: 0 }],
    [{ year: 2026, month: 0 }, -1, { year: 2025, month: 11 }],
    [{ year: 2026, month: 0 }, -12, { year: 2025, month: 0 }],
    [{ year: 2026, month: 5 }, 0, { year: 2026, month: 5 }],
    [{ year: 2026, month: 5 }, 25, { year: 2028, month: 6 }],
  ])('decale %p de %p mois', (period, delta, expected) => {
    expect(shiftMonth(period, delta)).toEqual(expected);
  });
});

describe('formatage', () => {
  it('formate un mois et une annee', () => {
    expect(formatPeriod({ year: 2026, month: 8 })).toBe('Septembre 2026');
  });

  it('formate une annee seule', () => {
    expect(formatPeriod({ year: 2026 })).toBe('2026');
    expect(formatPeriod({ year: 2026, month: null })).toBe('2026');
  });

  it('produit une cle de mois triable', () => {
    expect(toMonthKey({ year: 2026, month: 0 })).toBe('2026-01');
    expect(toMonthKey({ year: 2026, month: 11 })).toBe('2026-12');
  });

  it('expose douze libelles de mois', () => {
    expect(getMonths()).toHaveLength(12);
    expect(monthLabel(0)).toBe('Janvier');
    expect(monthShortLabel(8)).toBe('Sept');
    expect(monthLabel(99)).toBe('');
  });

  it('suit la locale demandée', () => {
    expect(monthLabel(0, 'en-US')).toBe('January');
    expect(formatPeriod({ year: 2026, month: 8 }, 'en-US')).toBe('September 2026');
  });
});

describe('currentPeriod', () => {
  it('retourne le mois et l annee en cours', () => {
    const now = new Date();
    expect(currentPeriod()).toEqual({ year: now.getFullYear(), month: now.getMonth() });
  });
});

describe('isSamePeriod', () => {
  it.each([
    [{ year: 2026, month: 8 }, { year: 2026, month: 8 }, true],
    [{ year: 2026, month: 8 }, { year: 2026, month: 9 }, false],
    [{ year: 2026, month: 8 }, null, false],
    [null, null, false],
  ])('compare %p et %p', (a, b, expected) => {
    expect(isSamePeriod(a, b)).toBe(expected);
  });
});
