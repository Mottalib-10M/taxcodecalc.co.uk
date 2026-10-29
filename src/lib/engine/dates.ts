/**
 * Calendar dates as whole days (UTC), no time zone: "2026-10-24" <-> day number.
 * The clock is never read here: "today" always comes from the caller (hydration, RECETTE §17.5).
 * Dates civiles en jours entiers (UTC), sans fuseau ni heure : « 2026-10-24 » ↔ numéro de jour.
 * Aucune lecture de l'horloge ici : « aujourd'hui » est toujours passé par l'appelant (hydratation, RECETTE §17.5).
 */
export type Iso = string; // « AAAA-MM-JJ »

export function dayNum(d: Iso): number {
  const [y, m, j] = d.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, j) / 86400000);
}
export function isoOf(n: number): Iso {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}
export function addDays(d: Iso, n: number): Iso {
  return isoOf(dayNum(d) + n);
}
/** Ajoute des années civiles ; un 29 février tombe au 28 février d'une année non bissextile. */
export function addYears(d: Iso, n: number): Iso {
  const [y, m, j] = d.split('-').map(Number);
  const yy = y + n;
  const last = new Date(Date.UTC(yy, m, 0)).getUTCDate();
  return `${yy}-${String(m).padStart(2, '0')}-${String(Math.min(j, last)).padStart(2, '0')}`;
}
export function addMonths(d: Iso, n: number): Iso {
  const [y, m, j] = d.split('-').map(Number);
  const t = y * 12 + (m - 1) + n;
  const yy = Math.floor(t / 12), mm = (t % 12) + 1;
  const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
  return `${yy}-${String(mm).padStart(2, '0')}-${String(Math.min(j, last)).padStart(2, '0')}`;
}
export const maxIso = (...xs: Iso[]) => xs.reduce((a, b) => (a > b ? a : b));
export const minIso = (...xs: Iso[]) => xs.reduce((a, b) => (a < b ? a : b));

/** 0 = Sunday … 6 = Saturday. */
export const weekday = (d: Iso) => new Date(dayNum(d) * 86400000).getUTCDay();
/** Whole days from a to b (b − a). */
export const daysBetween = (a: Iso, b: Iso) => dayNum(b) - dayNum(a);
/** Adds `n` working days (Monday to Friday, skipping the bank holidays given). */
export function addWorkingDays(d: Iso, n: number, holidays: readonly string[]): Iso {
  const H = new Set(holidays);
  let x = d, left = n;
  while (left > 0) { x = addDays(x, 1); const w = weekday(x); if (w !== 0 && w !== 6 && !H.has(x)) left--; }
  return x;
}
