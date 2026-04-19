/**
 * MONENLET Core — Point d'entrée unifié
 * Expose les trois convertisseurs via une interface commune.
 */

import { convertMalagasy } from './malagasy';
import { convertFrench }   from './french';
import { convertEnglish }  from './english';

export type Lang = 'mg' | 'fr' | 'en';

export const SUPPORTED_LANGS: Lang[] = ['mg', 'fr', 'en'];

export const LANG_LABELS: Record<Lang, string> = {
  mg: 'Malgache',
  fr: 'Français',
  en: 'English',
};

export interface ConvertRequest {
  amount:    number;
  lang:      Lang;
  currency?: string;
  decimals?: number;
}

export interface ConvertResult {
  amount:          number;
  lang:            Lang;
  lang_label:      string;
  currency:        string;
  decimals:        number;
  result:          string;
  input_formatted: string;
}

/**
 * Formate un nombre avec séparateur de milliers (espace fine → espace normale).
 * ex: 1352689.60 → "1 352 689,60"
 */
function formatAmount(amount: number, decimals: number): string {
  const formatted = amount.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals > 0 ? decimals : 0,
    maximumFractionDigits: decimals > 0 ? decimals : 0,
  });
  // toLocaleString('fr-FR') utilise une espace fine insécable (U+202F)
  // On la remplace par une espace normale pour la portabilité
  return formatted.replace(/\u202f/g, '\u00a0').replace(/\u00a0/g, ' ');
}

/**
 * Convertit un montant dans la langue demandée.
 * Fonction centrale appelée par les routes HTTP.
 */
export function convert(req: ConvertRequest): ConvertResult {
  const { amount, lang, currency, decimals = 2 } = req;

  const opts = { currency, decimals };

  let result: string;
  let resolvedCurrency: string;

  switch (lang) {
    case 'mg':
      resolvedCurrency = currency ?? 'Ariary';
      result = convertMalagasy(amount, opts);
      break;
    case 'fr':
      resolvedCurrency = currency ?? 'ARIARY';
      result = convertFrench(amount, opts);
      break;
    case 'en':
      resolvedCurrency = currency ?? 'ARIARY';
      result = convertEnglish(amount, opts);
      break;
  }

  return {
    amount,
    lang,
    lang_label:      LANG_LABELS[lang],
    currency:        resolvedCurrency,
    decimals,
    result,
    input_formatted: formatAmount(amount, decimals),
  };
}

// Ré-exports directs pour usage programmatique
export { convertMalagasy, convertFrench, convertEnglish };
