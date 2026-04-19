/**
 * MONENLET — Logique Anglaise (British banking standard)
 *
 * Règles linguistiques :
 *  - Tiret entre dizaine et unité : TWENTY-ONE
 *  - AND après HUNDRED quand reste > 0 : ONE HUNDRED AND ONE
 *  - AND après THOUSAND uniquement si reste < 100 : ONE THOUSAND AND ONE
 *  - ONE THOUSAND (contrairement au FR "MILLE" sans "UN")
 *  - HUNDRED / THOUSAND / MILLION / BILLION : jamais de S pluriel
 */

const UNITS_EN: string[] = [
  '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
  'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
  'SEVENTEEN', 'EIGHTEEN', 'NINETEEN',
];

const TENS_EN: string[] = [
  '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY',
  'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
];

function nombreEN(n: number): string {
  if (n === 0) return 'ZERO';

  if (n <= 19) return UNITS_EN[n];

  if (n <= 99) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? TENS_EN[t] : `${TENS_EN[t]}-${UNITS_EN[u]}`;
  }

  if (n <= 999) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    const base = `${UNITS_EN[h]} HUNDRED`;
    return r > 0 ? `${base} AND ${nombreEN(r)}` : base;
  }

  if (n <= 999_999) {
    const q = Math.floor(n / 1_000);
    const r = n % 1_000;
    const base = `${nombreEN(q)} THOUSAND`;
    if (r === 0) return base;
    // AND uniquement si reste < 100
    return r < 100 ? `${base} AND ${nombreEN(r)}` : `${base} ${nombreEN(r)}`;
  }

  if (n <= 999_999_999) {
    const q = Math.floor(n / 1_000_000);
    const r = n - q * 1_000_000;
    const base = `${nombreEN(q)} MILLION`;
    return r > 0 ? `${base} ${nombreEN(r)}` : base;
  }

  if (n <= 999_999_999_999) {
    const q = Math.floor(n / 1_000_000_000);
    const r = n - q * 1_000_000_000;
    const base = `${nombreEN(q)} BILLION`;
    return r > 0 ? `${base} ${nombreEN(r)}` : base;
  }

  return '#NUMBER TOO LARGE';
}

export interface ConvertOptions {
  currency?: string;
  decimals?: number;
}

/**
 * Converts a numeric amount into English words (British banking standard).
 * @param amount  Amount to convert (negative → Abs)
 * @param options currency (default "ARIARY"), decimals (default 2)
 * @returns Uppercase string per British banking conventions
 */
export function convertEnglish(amount: number, options: ConvertOptions = {}): string {
  const currency = options.currency ?? 'ARIARY';
  const decimals = options.decimals ?? 2;

  amount = Math.abs(amount);
  amount = Math.round(amount * 100) / 100;

  const entier = Math.floor(amount);
  const cents  = decimals > 0
    ? Math.round((amount - entier) * Math.pow(10, decimals))
    : 0;

  let result = nombreEN(entier);

  if (currency.toUpperCase() === 'ARIARY') {
    result += entier > 1 ? ' ARIARYS' : ' ARIARY';
  } else {
    result += ' ' + currency;
  }

  if (decimals > 0 && cents > 0) {
    result += ` AND ${nombreEN(cents)} CENT${cents > 1 ? 'S' : ''}`;
  }

  return result.trim();
}
