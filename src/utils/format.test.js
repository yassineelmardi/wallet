import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  currencyDecimals,
  currencySymbol,
  formatCurrency,
  formatDate,
  formatMonthYear,
  formatNumber,
  formatPercent,
  getMonthNames,
  normalizeCurrency,
  todayISO,
} from './format';

describe('normalizeCurrency', () => {
  it.each([
    ['EUR', 'EUR'],
    ['JPY', 'JPY'],
    [' USD ', 'USD'],
  ])('conserve le code ISO %p', (input, expected) => {
    expect(normalizeCurrency(input)).toBe(expected);
  });

  it.each([
    ['€', 'EUR'],
    ['$', 'USD'],
    ['£', 'GBP'],
    ['MAD', 'MAD'],
  ])('migre le symbole hérité %p', (input, expected) => {
    expect(normalizeCurrency(input)).toBe(expected);
  });

  it.each([null, undefined, '', 'inconnu', 42])('retombe sur la devise par défaut pour %p', (input) => {
    expect(normalizeCurrency(input)).toBe(DEFAULT_CURRENCY);
  });
});

describe('formatCurrency', () => {
  it('place le symbole avant le montant en anglais', () => {
    expect(formatCurrency(1234.5, 'USD', 'en-US')).toBe('$1,234.50');
  });

  it('place le symbole après le montant en français', () => {
    const result = formatCurrency(1234.5, 'EUR', 'fr-FR');

    expect(result).toMatch(/1\s?234,50/);
    expect(result).toContain('€');
  });

  it('supprime les décimales pour le yen', () => {
    expect(formatCurrency(1234.56, 'JPY', 'ja-JP')).toBe('￥1,235');
  });

  it('supprime les décimales pour le franc CFA', () => {
    expect(formatCurrency(1500, 'XOF', 'fr-FR')).not.toMatch(/,00/);
  });

  it('applique trois décimales au dinar tunisien', () => {
    expect(formatCurrency(12.3456, 'TND', 'fr-FR')).toMatch(/12,346/);
  });

  it('affiche le signe positif à la demande', () => {
    expect(formatCurrency(700, 'USD', 'en-US', { signDisplay: 'always' })).toBe('+$700.00');
  });

  it('retire les décimales en mode compact', () => {
    expect(formatCurrency(1234.56, 'USD', 'en-US', { compact: true })).toBe('$1,235');
  });

  it.each([null, undefined, 'abc', Number.NaN])('traite la valeur %p comme zéro', (value) => {
    expect(formatCurrency(value, 'USD', 'en-US')).toBe('$0.00');
  });

  it('accepte un montant sous forme de chaîne', () => {
    expect(formatCurrency('250.5', 'USD', 'en-US')).toBe('$250.50');
  });
});

describe('formatNumber et formatPercent', () => {
  it('groupe les milliers selon la locale', () => {
    expect(formatNumber(1234567, 'en-US')).toBe('1,234,567');
    expect(formatNumber(1234567, 'fr-FR')).toMatch(/1\s?234\s?567/);
  });

  it('formate un pourcentage', () => {
    expect(formatPercent(42, 'en-US')).toBe('42%');
  });

  it('accepte des décimales sur le pourcentage', () => {
    expect(formatPercent(28.75, 'en-US', 1)).toBe('28.8%');
  });
});

describe('todayISO', () => {
  it.each([
    [new Date(2026, 9, 1, 0, 30, 0), '2026-10-01'],
    [new Date(2026, 9, 1, 8, 0, 0), '2026-10-01'],
    [new Date(2026, 9, 1, 23, 30, 0), '2026-10-01'],
  ])('retient le jour local quelle que soit l heure (%p)', (date, expected) => {
    expect(todayISO(date)).toBe(expected);
  });

  it('reste aligné sur les composantes locales de la date', () => {
    const now = new Date();
    const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    expect(todayISO(now)).toBe(expected);
  });

  it('complète les mois et jours sur deux chiffres', () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatDate', () => {
  it('formate selon la locale', () => {
    expect(formatDate('2026-09-30', 'en-US')).toBe('Sep 30, 2026');
  });

  it('respecte un format personnalisé', () => {
    expect(formatDate('2026-09-30', 'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
      .toBe('09/30/2026');
  });

  it.each(['', null, 'pas-une-date', '30/09/2026'])('retourne la valeur brute pour %p', (value) => {
    expect(formatDate(value, 'en-US')).toBe(String(value || ''));
  });
});

describe('getMonthNames', () => {
  it('retourne douze mois capitalisés en français', () => {
    const months = getMonthNames('fr-FR');

    expect(months).toHaveLength(12);
    expect(months[0]).toBe('Janvier');
    expect(months[11]).toBe('Décembre');
  });

  it('traduit les mois selon la locale', () => {
    expect(getMonthNames('en-US')[0]).toBe('January');
    expect(getMonthNames('es-ES')[0]).toBe('Enero');
  });

  it('fournit des libellés courts', () => {
    expect(getMonthNames('en-US', 'short')[8]).toBe('Sep');
  });

  it('compose le libellé mois et année', () => {
    expect(formatMonthYear({ year: 2026, month: 8 }, 'en-US')).toBe('September 2026');
  });
});

describe('metadonnees de devise', () => {
  it('expose les decimales attendues', () => {
    expect(currencyDecimals('JPY')).toBe(0);
    expect(currencyDecimals('EUR')).toBe(2);
    expect(currencyDecimals('TND')).toBe(3);
  });

  it('expose un symbole pour chaque devise', () => {
    Object.keys(CURRENCIES).forEach((code) => {
      expect(currencySymbol(code)).toBeTruthy();
    });
  });

  it('couvre les devises des marches vises', () => {
    ['EUR', 'USD', 'GBP', 'CAD', 'JPY', 'INR', 'SGD', 'AED', 'SAR', 'MAD', 'XOF'].forEach((code) => {
      expect(CURRENCIES[code]).toBeDefined();
    });
  });
});
