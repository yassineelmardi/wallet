import {
  CSV_COLUMNS,
  EXPORT_SCHEMA_VERSION,
  buildCsv,
  buildExport,
  buildJson,
  exportFileName,
} from './export';

const DATASET = {
  income: [{ id: 'i1', amount: 500, category: 'bonus', description: 'Prime', date: '2026-09-10' }],
  variableExpenses: [
    { id: 'e1', amount: '120.5', category: 'food', description: 'Courses', date: '2026-09-02' },
  ],
  fixedExpenses: [{ id: 'f1', amount: 720, category: 'rent', description: 'Loyer' }],
  monthlySalaries: [{ id: 's1', year: 2026, month: 8, amount: '3000', label: 'Salaire' }],
  globalSalary: null,
  settings: { currency: 'EUR', language: 'fr' },
};

describe('buildCsv', () => {
  it('place les colonnes attendues en en-tête', () => {
    expect(buildCsv(DATASET).split('\n')[0]).toBe(CSV_COLUMNS.map((c) => c).join(';'));
  });

  it('exporte toutes les écritures, charges fixes comprises', () => {
    const lines = buildCsv(DATASET).split('\n');

    expect(lines).toHaveLength(5);
    expect(lines.filter((line) => line.includes('fixed'))).toHaveLength(1);
  });

  it('entoure chaque cellule de guillemets et double ceux du contenu', () => {
    const csv = buildCsv({
      ...DATASET,
      variableExpenses: [
        { id: 'e1', amount: 10, category: 'food', description: 'Say "hi"', date: '2026-09-02' },
      ],
    });

    expect(csv).toContain('"Say ""hi"""');
  });

  it('neutralise les débuts de cellule interprétés comme formule', () => {
    const csv = buildCsv({
      ...DATASET,
      variableExpenses: [
        { id: 'e1', amount: 10, category: 'food', description: '=1+1', date: '2026-09-02' },
      ],
    });

    expect(csv).toContain(`"'=1+1"`);
  });

  it('normalise la devise héritée en code ISO', () => {
    expect(buildCsv({ ...DATASET, settings: { currency: '€' } })).toContain('"EUR"');
  });

  it('produit un en-tête seul sans données', () => {
    expect(buildCsv()).toBe(CSV_COLUMNS.join(';'));
  });
});

describe('buildJson', () => {
  it('inclut une version de schéma et un horodatage', () => {
    const payload = JSON.parse(buildJson(DATASET));

    expect(payload.schemaVersion).toBe(EXPORT_SCHEMA_VERSION);
    expect(payload.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('conserve toutes les collections sans perte', () => {
    const payload = JSON.parse(buildJson(DATASET));

    expect(payload.income).toEqual(DATASET.income);
    expect(payload.variableExpenses).toEqual(DATASET.variableExpenses);
    expect(payload.fixedExpenses).toEqual(DATASET.fixedExpenses);
    expect(payload.monthlySalaries).toEqual(DATASET.monthlySalaries);
  });

  it('reste valide sans aucune donnée', () => {
    const payload = JSON.parse(buildJson());

    expect(payload.income).toEqual([]);
    expect(payload.globalSalary).toBeNull();
  });
});

describe('buildExport', () => {
  it.each([
    ['csv', 'text/csv'],
    ['json', 'application/json'],
  ])('expose le type MIME de %p', (format, mimeType) => {
    expect(buildExport(format, DATASET).mimeType).toBe(mimeType);
  });

  it('nomme le fichier avec la date du jour', () => {
    expect(exportFileName('csv', new Date(2026, 8, 30))).toBe('wallet-export-20260930.csv');
  });

  it('retourne un contenu non vide', () => {
    expect(buildExport('json', DATASET).content.length).toBeGreaterThan(0);
  });
});
