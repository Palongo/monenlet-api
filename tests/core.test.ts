import { convertMalagasy, convertFrench, convertEnglish, convert } from '../src/core/index';

// ─────────────────────────────────────────────────────────────────────────────
// Tests logique Malgache
// ─────────────────────────────────────────────────────────────────────────────

describe('MONENLET_MG — Malgache', () => {
  const mg = (n: number, d = 2) => convertMalagasy(n, { decimals: d });

  test('Exemples de référence originaux', () => {
    expect(mg(1352689.60)).toBe(
      'Sivy amby valopolo sy eninjato sy roa arivo sy dimy alina sy telo hetsy sy iray tapitrisa Ariary faingo enimpolo'
    );
    expect(mg(2245710096.15)).toBe(
      'Enina amby sivifolo sy iray alina sy fito hetsy sy dimy amby efapolo sy roanjato tapitrisa sy roa lavitrisa Ariary faingo dimy amby folo'
    );
  });

  test('Règle arivo / alina (bug v1.0 corrigé)', () => {
    expect(mg(11471786)).toBe(
      'Enina amby valopolo sy fitonjato sy arivo sy fito alina sy efatra hetsy sy iraika amby folo tapitrisa Ariary'
    );
    expect(mg(1000, 0)).toBe('Arivo Ariary');          // arivo seul, sans iray
    expect(mg(10000, 0)).toBe('Iray alina Ariary');    // iray obligatoire
    expect(mg(11000, 0)).toBe('Arivo sy iray alina Ariary');
  });

  test('Unités et dizaines', () => {
    expect(mg(0)).toBe('Aotra Ariary');
    expect(mg(1, 0)).toBe('Iray Ariary');
    expect(mg(11, 0)).toBe('Iraika amby folo Ariary');  // iraika avant amby
    expect(mg(21, 0)).toBe('Iraika amby roapolo Ariary');
    expect(mg(89, 0)).toBe('Sivy amby valopolo Ariary');
  });

  test('Centaines', () => {
    expect(mg(100, 0)).toBe('Zato Ariary');
    expect(mg(600, 0)).toBe('Eninjato Ariary');
    expect(mg(689, 0)).toBe('Sivy amby valopolo sy eninjato Ariary');
  });

  test('Grandes unités', () => {
    expect(mg(2000, 0)).toBe('Roa arivo Ariary');
    expect(mg(20000, 0)).toBe('Roa alina Ariary');
    expect(mg(100000, 0)).toBe('Iray hetsy Ariary');
    expect(mg(1000000, 0)).toBe('Iray tapitrisa Ariary');
    expect(mg(1000000000, 0)).toBe('Iray lavitrisa Ariary');
  });

  test('Décimales / faingo', () => {
    expect(mg(500.75)).toBe('Dimanjato Ariary faingo dimy amby fitopolo');
    expect(mg(1000.01)).toBe('Arivo Ariary faingo iray');
  });

  test('Négatifs convertis en Abs', () => {
    expect(mg(-500, 0)).toBe(mg(500, 0));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests logique Française
// ─────────────────────────────────────────────────────────────────────────────

describe('MONENLET_FR — Français', () => {
  const fr = (n: number, d = 2) => convertFrench(n, { decimals: d });

  test('Dizaines spéciales françaises', () => {
    expect(fr(21, 0)).toBe('VINGT ET UN ARIARYS');
    expect(fr(71, 0)).toBe('SOIXANTE ET ONZE ARIARYS');
    expect(fr(70, 0)).toBe('SOIXANTE-DIX ARIARYS');
    expect(fr(80, 0)).toBe('QUATRE-VINGTS ARIARYS');       // S pour 80 exact
    expect(fr(81, 0)).toBe('QUATRE-VINGT-UN ARIARYS');     // sans S sans ET
    expect(fr(99, 0)).toBe('QUATRE-VINGT-DIX-NEUF ARIARYS');
  });

  test('Accord de CENT', () => {
    expect(fr(100, 0)).toBe('CENT ARIARYS');
    expect(fr(200, 0)).toBe('DEUX CENTS ARIARYS');          // S sur multiple exact
    expect(fr(201, 0)).toBe('DEUX CENT UN ARIARYS');        // pas de S si suivi
  });

  test('MILLE sans UN', () => {
    expect(fr(1000, 0)).toBe('MILLE ARIARYS');
    expect(fr(2000, 0)).toBe('DEUX MILLE ARIARYS');
    expect(fr(1001, 0)).toBe('MILLE UN ARIARYS');
  });

  test('MILLION(S) et MILLIARD(S)', () => {
    expect(fr(1000000, 0)).toBe('UN MILLION ARIARYS');
    expect(fr(2000000, 0)).toBe('DEUX MILLIONS ARIARYS');
    expect(fr(1000000000, 0)).toBe('UN MILLIARD ARIARYS');
    expect(fr(2000000000, 0)).toBe('DEUX MILLIARDS ARIARYS');
  });

  test('Décimales ET CENTIME(S)', () => {
    expect(fr(1250.25)).toBe('MILLE DEUX CENT CINQUANTE ARIARYS ET VINGT-CINQ CENTIMES');
    expect(fr(1250.01)).toBe('MILLE DEUX CENT CINQUANTE ARIARYS ET UN CENTIME');
    expect(fr(0.5)).toBe('ZERO ARIARY ET CINQUANTE CENTIMES');
  });

  test('Négatifs', () => {
    expect(fr(-500, 0)).toBe('CINQ CENTS ARIARYS');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests logique Anglaise
// ─────────────────────────────────────────────────────────────────────────────

describe('MONENLET_EN — Anglais', () => {
  const en = (n: number, d = 2) => convertEnglish(n, { decimals: d });

  test('Tirets composés', () => {
    expect(en(21, 0)).toBe('TWENTY-ONE ARIARYS');
    expect(en(71, 0)).toBe('SEVENTY-ONE ARIARYS');
    expect(en(99, 0)).toBe('NINETY-NINE ARIARYS');
  });

  test('Règle AND britannique', () => {
    expect(en(101, 0)).toBe('ONE HUNDRED AND ONE ARIARYS');
    expect(en(110, 0)).toBe('ONE HUNDRED AND TEN ARIARYS');
    expect(en(1001, 0)).toBe('ONE THOUSAND AND ONE ARIARYS');
    expect(en(1021, 0)).toBe('ONE THOUSAND AND TWENTY-ONE ARIARYS');
    expect(en(1100, 0)).toBe('ONE THOUSAND ONE HUNDRED ARIARYS');   // pas de AND
    expect(en(1101, 0)).toBe('ONE THOUSAND ONE HUNDRED AND ONE ARIARYS');
  });

  test('ONE devant THOUSAND/MILLION/BILLION', () => {
    expect(en(1000, 0)).toBe('ONE THOUSAND ARIARYS');
    expect(en(1000000, 0)).toBe('ONE MILLION ARIARYS');
    expect(en(1000000000, 0)).toBe('ONE BILLION ARIARYS');
  });

  test('Pas de S pluriel sur multiplicateurs', () => {
    expect(en(200, 0)).toBe('TWO HUNDRED ARIARYS');    // ≠ FR DEUX CENTS
    expect(en(2000000, 0)).toBe('TWO MILLION ARIARYS'); // ≠ FR DEUX MILLIONS
    expect(en(2000000000, 0)).toBe('TWO BILLION ARIARYS');
  });

  test('Décimales AND CENT(S)', () => {
    expect(en(1250.25)).toBe('ONE THOUSAND TWO HUNDRED AND FIFTY ARIARYS AND TWENTY-FIVE CENTS');
    expect(en(1250.01)).toBe('ONE THOUSAND TWO HUNDRED AND FIFTY ARIARYS AND ONE CENT');
  });

  test('EIGHTY (≠ FR QUATRE-VINGTS)', () => {
    expect(en(80, 0)).toBe('EIGHTY ARIARYS');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests interface unifiée convert()
// ─────────────────────────────────────────────────────────────────────────────

describe('convert() — Interface unifiée', () => {
  test('Retourne la structure complète', () => {
    const result = convert({ amount: 1250.25, lang: 'fr' });
    expect(result).toMatchObject({
      amount:          1250.25,
      lang:            'fr',
      lang_label:      'Français',
      currency:        'ARIARY',
      decimals:        2,
      result:          expect.stringContaining('MILLE'),
      input_formatted: '1 250,25',
    });
  });

  test('Devise personnalisée', () => {
    const result = convert({ amount: 100, lang: 'en', currency: 'USD', decimals: 0 });
    expect(result.result).toContain('USD');
  });

  test('Cohérence cross-langues sur même montant', () => {
    const amount = 1250;
    const mg = convert({ amount, lang: 'mg', decimals: 0 });
    const fr = convert({ amount, lang: 'fr', decimals: 0 });
    const en = convert({ amount, lang: 'en', decimals: 0 });

    // Tous réussis
    expect(mg.result.length).toBeGreaterThan(0);
    expect(fr.result.length).toBeGreaterThan(0);
    expect(en.result.length).toBeGreaterThan(0);

    // Différents (langues différentes)
    expect(mg.result).not.toBe(fr.result);
    expect(fr.result).not.toBe(en.result);
  });
});
