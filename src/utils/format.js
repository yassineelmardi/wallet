// Registre ISO 4217 restreint aux marches vises. Les decimales varient : JPY et
// les francs CFA n'en utilisent aucune.
export const CURRENCIES = {
  EUR: { code: 'EUR', symbol: '€', decimals: 2 },
  USD: { code: 'USD', symbol: '$', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'C$', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', decimals: 0 },
  INR: { code: 'INR', symbol: '₹', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ', decimals: 2 },
  SAR: { code: 'SAR', symbol: '﷼', decimals: 2 },
  MAD: { code: 'MAD', symbol: 'DH', decimals: 2 },
  DZD: { code: 'DZD', symbol: 'DA', decimals: 2 },
  TND: { code: 'TND', symbol: 'DT', decimals: 3 },
  XOF: { code: 'XOF', symbol: 'CFA', decimals: 0 },
  XAF: { code: 'XAF', symbol: 'FCFA', decimals: 0 },
};

export const DEFAULT_CURRENCY = 'EUR';

// Les versions precedentes stockaient un symbole d'affichage et non un code ISO.
const LEGACY_SYMBOLS = {
  '€': 'EUR',
  $: 'USD',
  '£': 'GBP',
  MAD: 'MAD',
  DZD: 'DZD',
  TND: 'TND',
};

export const normalizeCurrency = (value) => {
  if (typeof value !== 'string') return DEFAULT_CURRENCY;
  const trimmed = value.trim();
  if (CURRENCIES[trimmed]) return trimmed;
  return LEGACY_SYMBOLS[trimmed] || DEFAULT_CURRENCY;
};

export const currencyDecimals = (currency) => CURRENCIES[normalizeCurrency(currency)].decimals;

export const currencySymbol = (currency) => CURRENCIES[normalizeCurrency(currency)].symbol;

const toNumber = (value) => {
  const amount = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(amount) ? amount : 0;
};

const fallbackCurrency = (amount, code, decimals, signDisplay) => {
  const sign = signDisplay === 'always' && amount >= 0 ? '+' : amount < 0 ? '-' : '';
  return `${sign}${Math.abs(amount).toFixed(decimals)} ${CURRENCIES[code].symbol}`;
};

export const formatCurrency = (value, currency, locale = 'fr', options = {}) => {
  const code = normalizeCurrency(currency);
  const amount = toNumber(value);
  const decimals = options.compact ? 0 : CURRENCIES[code].decimals;
  const signDisplay = options.signDisplay || 'auto';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay,
    }).format(amount);
  } catch {
    return fallbackCurrency(amount, code, decimals, signDisplay);
  }
};

export const formatNumber = (value, locale = 'fr', options = {}) => {
  const amount = toNumber(value);
  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch {
    return String(amount);
  }
};

export const formatPercent = (value, locale = 'fr', fractionDigits = 0) => {
  const amount = toNumber(value);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount / 100);
  } catch {
    return `${amount.toFixed(fractionDigits)} %`;
  }
};

// Date locale, sans passer par toISOString() qui bascule en UTC et decale le
// jour dans tous les fuseaux non alignes sur Greenwich.
export const todayISO = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export const formatDate = (isoDate, locale = 'fr', options) => {
  const match = ISO_DATE.exec(String(isoDate || '').trim());
  if (!match) return String(isoDate || '');

  const [, year, month, day] = match;
  try {
    return new Intl.DateTimeFormat(
      locale,
      options || { year: 'numeric', month: 'short', day: 'numeric' }
    ).format(new Date(Number(year), Number(month) - 1, Number(day)));
  } catch {
    return `${day}/${month}/${year}`;
  }
};

const capitalize = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

// Intl ajoute un point aux abreviations francaises : inutilisable sur un axe de graphique.
const tidy = (value) => capitalize(String(value).replace(/\.$/, ''));

export const getMonthNames = (locale = 'fr', month = 'long') => {
  try {
    const formatter = new Intl.DateTimeFormat(locale, { month, timeZone: 'UTC' });
    return Array.from({ length: 12 }, (unused, index) =>
      tidy(formatter.format(new Date(Date.UTC(2021, index, 1))))
    );
  } catch {
    return [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ];
  }
};

export const formatMonthYear = ({ year, month }, locale = 'fr') =>
  `${getMonthNames(locale)[month] || ''} ${year}`.trim();
