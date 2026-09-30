import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
  formatNumber,
  formatPercent,
  getMonthNames,
  normalizeCurrency,
} from '../utils/format';

/**
 * Regroupe locale et devise courantes pour eviter de les propager a chaque
 * appel de formatage dans les ecrans.
 */
export const useFormat = () => {
  const { i18n } = useTranslation();
  const { settings } = useApp();
  const locale = i18n.language || 'fr';
  const currency = normalizeCurrency(settings.currency);

  return useMemo(
    () => ({
      locale,
      currency,
      money: (value, options) => formatCurrency(value, currency, locale, options),
      number: (value, options) => formatNumber(value, locale, options),
      percent: (value, fractionDigits) => formatPercent(value, locale, fractionDigits),
      date: (value, options) => formatDate(value, locale, options),
      monthYear: (period) => formatMonthYear(period, locale),
      monthNames: (style) => getMonthNames(locale, style),
    }),
    [locale, currency]
  );
};

export default useFormat;
