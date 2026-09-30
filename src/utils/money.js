const MONEY_PATTERN = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/;

export const parsePositiveAmount = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') return null;

  const normalized = String(value).trim().replace(',', '.');
  if (!MONEY_PATTERN.test(normalized)) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};