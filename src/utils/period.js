export const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const MONTH_COUNT = 12;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Decoupe la chaine sans passer par Date() : evite tout decalage de fuseau.
export const parsePeriod = (isoDate) => {
  if (typeof isoDate !== 'string') return null;
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  return { year, month, day };
};

export const currentPeriod = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};

export const shiftMonth = ({ year, month }, delta) => {
  const absolute = year * MONTH_COUNT + month + delta;
  return {
    year: Math.floor(absolute / MONTH_COUNT),
    month: ((absolute % MONTH_COUNT) + MONTH_COUNT) % MONTH_COUNT,
  };
};

export const monthLabel = (month) => MONTHS[month] || '';

export const monthShortLabel = (month) => (MONTHS[month] || '').slice(0, 3);

export const formatPeriod = ({ year, month }) =>
  month === undefined || month === null ? String(year) : `${monthLabel(month)} ${year}`;

export const toMonthKey = ({ year, month }) =>
  `${year}-${String(month + 1).padStart(2, '0')}`;

export const isSamePeriod = (a, b) =>
  Boolean(a) && Boolean(b) && a.year === b.year && a.month === b.month;
