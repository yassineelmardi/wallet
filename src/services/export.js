import { buildTransactions } from './analytics';
import { normalizeCurrency } from '../utils/format';

export const CSV_COLUMNS = ['date', 'type', 'kind', 'category', 'description', 'amount', 'currency'];

const SEPARATOR = ';';

// Les tableurs interpretent =, +, - et @ en tete de cellule comme une formule.
const escapeCell = (value) => {
  const raw = value === undefined || value === null ? '' : String(value);
  const guarded = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replace(/"/g, '""')}"`;
};

export const buildCsv = (data = {}) => {
  const currency = normalizeCurrency(data.settings?.currency);
  const transactions = buildTransactions(data);
  const header = CSV_COLUMNS.join(SEPARATOR);

  const rows = transactions.map((item) =>
    [
      item.date,
      item.type,
      item.kind,
      item.category,
      item.description,
      item.amount.toFixed(2),
      currency,
    ]
      .map(escapeCell)
      .join(SEPARATOR)
  );

  const fixedRows = (data.fixedExpenses || []).map((item) =>
    [
      '',
      'expense',
      'fixed',
      item.category || 'other',
      item.description || '',
      (parseFloat(item.amount) || 0).toFixed(2),
      currency,
    ]
      .map(escapeCell)
      .join(SEPARATOR)
  );

  return [header, ...rows, ...fixedRows].join('\n');
};

export const EXPORT_SCHEMA_VERSION = 1;

export const buildJson = (data = {}) =>
  JSON.stringify(
    {
      schemaVersion: EXPORT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      currency: normalizeCurrency(data.settings?.currency),
      income: data.income || [],
      fixedExpenses: data.fixedExpenses || [],
      variableExpenses: data.variableExpenses || [],
      monthlySalaries: data.monthlySalaries || [],
      globalSalary: data.globalSalary || null,
      settings: data.settings || {},
    },
    null,
    2
  );

export const exportFileName = (format, date = new Date()) => {
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `wallet-export-${stamp}.${format}`;
};

export const buildExport = (format, data) => ({
  fileName: exportFileName(format),
  mimeType: format === 'csv' ? 'text/csv' : 'application/json',
  content: format === 'csv' ? buildCsv(data) : buildJson(data),
});
