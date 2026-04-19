/**
 * MONENLET — Logique Française
 * Conversion d'un montant numérique en lettres françaises (normes bancaires).
 *
 * Règles linguistiques :
 *  - "ET" pour 21, 31, 41, 51, 61, 71 uniquement
 *  - Tiret entre dizaine et unité (sauf cas "ET")
 *  - QUATRE-VINGTS : S uniquement pour 80 exact
 *  - CENT : S uniquement si multiple exact > 100 (200, 300...)
 *  - MILLE : jamais précédé de "UN"
 *  - MILLION(S) / MILLIARD(S) : pluriel si > 1
 */

const UNITE_FR: string[] = [
  '', 'UN', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX', 'SEPT', 'HUIT', 'NEUF',
  'DIX', 'ONZE', 'DOUZE', 'TREIZE', 'QUATORZE', 'QUINZE', 'SEIZE',
  'DIX-SEPT', 'DIX-HUIT', 'DIX-NEUF',
];

const DIZAINE_FR: string[] = [
  '', '', 'VINGT', 'TRENTE', 'QUARANTE', 'CINQUANTE', 'SOIXANTE',
];

function nombreFR(n: number): string {
  if (n === 0) return 'ZERO';

  if (n <= 19) return UNITE_FR[n];

  if (n <= 69) {
    const d = Math.floor(n / 10);
    const u = n % 10;
    const base = DIZAINE_FR[d];
    if (u === 0) return base;
    if (u === 1) return `${base} ET UN`;
    return `${base}-${UNITE_FR[u]}`;
  }

  if (n <= 79) {
    if (n === 71) return 'SOIXANTE ET ONZE';
    return `SOIXANTE-${nombreFR(n - 60)}`;
  }

  if (n <= 99) {
    if (n === 80) return 'QUATRE-VINGTS';
    if (n === 81) return 'QUATRE-VINGT-UN';
    return `QUATRE-VINGT-${nombreFR(n - 80)}`;
  }

  if (n <= 999) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const centBase = h === 1 ? 'CENT' : `${UNITE_FR[h]} CENT`;
    if (r === 0) return h > 1 ? `${centBase}S` : centBase;
    return `${centBase} ${nombreFR(r)}`;
  }

  if (n <= 999_999) {
    const q = Math.floor(n / 1_000);
    const r = n % 1_000;
    const milleBase = q === 1 ? 'MILLE' : `${nombreFR(q)} MILLE`;
    return r > 0 ? `${milleBase} ${nombreFR(r)}` : milleBase;
  }

  if (n <= 999_999_999) {
    const q = Math.floor(n / 1_000_000);
    const r = n - q * 1_000_000;
    const milBase = q === 1 ? 'UN MILLION' : `${nombreFR(q)} MILLIONS`;
    return r > 0 ? `${milBase} ${nombreFR(r)}` : milBase;
  }

  if (n <= 999_999_999_999) {
    const q = Math.floor(n / 1_000_000_000);
    const r = n - q * 1_000_000_000;
    const mrdBase = q === 1 ? 'UN MILLIARD' : `${nombreFR(q)} MILLIARDS`;
    return r > 0 ? `${mrdBase} ${nombreFR(r)}` : mrdBase;
  }

  return '#NOMBRE TROP GRAND';
}

export interface ConvertOptions {
  currency?: string;
  decimals?: number;
}

/**
 * Convertit un montant numérique en lettres françaises.
 * @param amount  Montant à convertir (négatif → Abs)
 * @param options currency (défaut "ARIARY"), decimals (défaut 2)
 * @returns Chaîne en majuscules selon les normes françaises
 */
export function convertFrench(amount: number, options: ConvertOptions = {}): string {
  const currency = options.currency ?? 'ARIARY';
  const decimals = options.decimals ?? 2;

  amount = Math.abs(amount);
  amount = Math.round(amount * 100) / 100;

  const entier   = Math.floor(amount);
  const centimes = decimals > 0
    ? Math.round((amount - entier) * Math.pow(10, decimals))
    : 0;

  let result = nombreFR(entier);

  if (currency.toUpperCase() === 'ARIARY') {
    result += entier > 1 ? ' ARIARYS' : ' ARIARY';
  } else {
    result += ' ' + currency;
  }

  if (decimals > 0 && centimes > 0) {
    result += ` ET ${nombreFR(centimes)} CENTIME${centimes > 1 ? 'S' : ''}`;
  }

  return result.trim();
}
