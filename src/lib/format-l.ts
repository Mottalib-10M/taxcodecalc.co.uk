/** Formatting for the en-GB pages (RECETTE §4: one locale). */
export type L = 'en';
const TAG = 'en-GB';
export const langTag = (_lang: L = 'en') => TAG;
const cache = new Map<string, Intl.NumberFormat>();
function nf(o: Intl.NumberFormatOptions) {
  const k = JSON.stringify(o);
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(TAG, o));
  return cache.get(k)!;
}
export const formatNumberL = (v: number, _lang: L = 'en', d = 0) => nf({ minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
/** £1,709 ; pence only when the amount has them (£115.50). */
export const money = (v: number, _cur: 'GBP' = 'GBP', _lang: L = 'en') => {
  const cents = Math.round(v * 100) % 100 !== 0;
  return `£${formatNumberL(v, 'en', cents ? 2 : 0)}`;
};
export const pct = (v: number, _lang: L = 'en', d = 0) => `${formatNumberL(v * 100, 'en', d)}%`;
/** "2026-10-24" → "24 October 2026" (UTC, never shifts a day). */
export const dateL = (iso: string, _lang: L = 'en') => new Date(`${iso}T00:00:00Z`).toLocaleDateString(TAG, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
