/**
 * MONENLET — Logique Malgache
 * Conversion d'un montant numérique en lettres malgaches (lecture ascendante).
 *
 * Règles linguistiques :
 *  - Ordre ASCENDANT : petit groupe → grand groupe
 *  - amby   : connecteur unité + dizaine   (ex: 9 amby valopolo = 89)
 *  - sy     : connecteur groupe + groupe   (ex: eninjato sy roa arivo)
 *  - faingo : virgule décimale
 *  - iraika : forme de "1" avant "amby"    (ex: iraika amby folo = 11)
 *  - arivo  : 1 000 exact → "arivo" seul (jamais "iray arivo")
 *  - alina  : 10 000 × 1 → "iray alina" (iray obligatoire)
 */

const UNITE: Record<number, string> = {
  1: 'iray', 2: 'roa',    3: 'telo',   4: 'efatra',
  5: 'dimy', 6: 'enina',  7: 'fito',   8: 'valo',   9: 'sivy',
};

const DIZAINE: Record<number, string> = {
  10: 'folo',      20: 'roapolo',   30: 'telopolo',
  40: 'efapolo',   50: 'dimampolo', 60: 'enimpolo',
  70: 'fitopolo',  80: 'valopolo',  90: 'sivifolo',
};

const CENTAINE: Record<number, string> = {
  1: 'zato',     2: 'roanjato',  3: 'telonjato', 4: 'efajato',
  5: 'dimanjato',6: 'eninjato',  7: 'fitonjato', 8: 'valonjato',
  9: 'sivinjato',
};

function uniteAmby(n: number): string {
  return n === 1 ? 'iraika' : (UNITE[n] ?? '');
}

function deuxChiffres(n: number): string {
  const u = n % 10;
  const d = n - u;
  if (u === 0) return DIZAINE[d] ?? '';
  if (d === 0) return UNITE[u] ?? '';
  return `${uniteAmby(u)} amby ${DIZAINE[d]}`;
}

function troisChiffres(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (r > 0) parts.push(deuxChiffres(r));
  if (h > 0) parts.push(CENTAINE[h] ?? '');
  return parts.join(' sy ');
}

function nombreEntier(n: number): string {
  if (n === 0) return 'aotra';

  const milliards = Math.floor(n / 1_000_000_000);
  const resteApresMilliards = n - milliards * 1_000_000_000;
  const millions = Math.floor(resteApresMilliards / 1_000_000);
  const reste = resteApresMilliards - millions * 1_000_000;

  const g_ud    = reste % 100;
  const g_cent  = Math.floor(reste / 100) % 10;
  const g_arivo = Math.floor(reste / 1_000) % 10;
  const g_alina = Math.floor(reste / 10_000) % 10;
  const g_hetsy = Math.floor(reste / 100_000) % 10;

  const parts: string[] = [];

  if (g_ud    > 0) parts.push(deuxChiffres(g_ud));
  if (g_cent  > 0) parts.push(CENTAINE[g_cent] ?? '');

  // arivo : 1 → "arivo" seul (jamais "iray arivo")
  if      (g_arivo === 1) parts.push('arivo');
  else if (g_arivo >  1) parts.push(`${UNITE[g_arivo]} arivo`);

  // alina : 1 → "iray alina" (iray obligatoire)
  if (g_alina >= 1) parts.push(`${UNITE[g_alina]} alina`);

  // hetsy / tapitrisa / lavitrisa : toujours avec l'unité
  if (g_hetsy  >= 1) parts.push(`${UNITE[g_hetsy]} hetsy`);
  if (millions >= 1) parts.push(`${troisChiffres(millions)} tapitrisa`);
  if (milliards >= 1) parts.push(`${troisChiffres(milliards)} lavitrisa`);

  return parts.join(' sy ');
}

export interface ConvertOptions {
  currency?: string;
  decimals?: number;
}

/**
 * Convertit un montant numérique en lettres malgaches.
 * @param amount  Montant à convertir (négatif → Abs)
 * @param options currency (défaut "Ariary"), decimals (défaut 2)
 * @returns Chaîne en malgache, première lettre en majuscule
 */
export function convertMalagasy(amount: number, options: ConvertOptions = {}): string {
  const currency = options.currency ?? 'Ariary';
  const decimals = options.decimals ?? 2;

  amount = Math.abs(amount);
  amount = Math.round(amount * 100) / 100;

  if (amount === 0) {
    return `Aotra ${currency}`;
  }

  const entier  = Math.floor(amount);
  const centimes = decimals > 0
    ? Math.round((amount - entier) * Math.pow(10, decimals))
    : 0;

  let result = nombreEntier(entier) + ' ' + currency;
  if (centimes > 0) {
    result += ' faingo ' + deuxChiffres(centimes);
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}
