/**
 * PAYE engine, written from HMRC's Specification for PAYE Tax Table Routines (version 24.0):
 * code parsing (§2, §12), free pay and additional pay (§4.3), cumulative tax by Income Tests and
 * Tax Formulae with 4-decimal truncation (§3.3.4, §4.4), the 50 % regulatory limit (§4.5.2),
 * BR, D, NT codes (§5–§7) and the week 1 / month 1 basis (§8–§11). Amounts are handled in pence,
 * and intermediate constants in ten-thousandths of a pound, so that rounding follows the
 * specification exactly. Every rate and band comes from params-2026.json.
 */
import P from '../../data/params-2026.json';

export type YearId = keyof typeof P.years;
export type Region = 'ruk' | 'scot' | 'wales';
export type Freq = 'weekly' | 'fortnightly' | 'fourweekly' | 'monthly';
export interface Scale { bands: number[]; rates: number[]; basic: number; names: string[] }
export const YEARS = Object.keys(P.years) as YearId[];
export const CURRENT: YearId = P.current as YearId;
export const year = (y: YearId = CURRENT) => P.years[y];

/** The band scale for a year and region; null when it is not published yet (Scotland, Wales 2027-28). */
export function scale(y: YearId, r: Region): Scale | null {
  const Y = P.years[y] as unknown as Record<Region, Scale | null>;
  return Y[r] ?? null;
}
/** Scale actually used: a scale that is not published falls back on the latest year that has one. */
export function scaleOrLatest(y: YearId, r: Region): { s: Scale; year: YearId; fallback: boolean } {
  const s = scale(y, r);
  if (s) return { s, year: y, fallback: false };
  const prev = [...YEARS].reverse().find((x) => scale(x, r));
  return { s: scale(prev!, r)!, year: prev!, fallback: true };
}

export type Kind = 'suffix' | 'K' | 'BR' | 'D' | 'NT';
export interface Code {
  raw: string; ok: boolean; error?: string;
  /** Normalised code, e.g. "S1257L M1". */
  text: string;
  region: Region; kind: Kind;
  /** Numeric part (suffix and K codes). */
  num: number;
  /** Suffix letter: L, M, N, T (suffix codes only). */
  letter: string;
  /** D0 → 0, D1 → 1 … */
  d: number;
  /** Week 1 / month 1 basis (W1, M1, X, NONCUM). */
  nonCum: boolean; basis: '' | 'W1' | 'M1' | 'X';
}

/** Reads a code as printed on a payslip or a P2 notice: "1257L", "S1257L M1", "K475", "CBR", "SD1", "0T W1". */
export function parseCode(input: string): Code {
  const raw = input;
  let s = (input ?? '').toUpperCase().replace(/\s+/g, ' ').trim();
  const base: Code = { raw, ok: false, text: '', region: 'ruk', kind: 'suffix', num: 0, letter: '', d: 0, nonCum: false, basis: '' };
  let basis: Code['basis'] = '';
  const m = s.match(/^(.*?)[\s/]*(W1|M1|X|NONCUM|WK1|MTH1)$/);
  if (m && m[1]) { s = m[1].trim(); const b = m[2]; basis = b === 'W1' || b === 'WK1' ? 'W1' : b === 'M1' || b === 'MTH1' ? 'M1' : 'X'; }
  s = s.replace(/\s+/g, '');
  let region: Region = 'ruk';
  if (s.length > 1 && s[0] === 'S') { region = 'scot'; s = s.slice(1); }
  else if (s.length > 1 && s[0] === 'C') { region = 'wales'; s = s.slice(1); }
  const out = (o: Partial<Code>): Code => {
    const c = { ...base, region, basis, nonCum: basis !== '', ok: true, ...o } as Code;
    const pre = region === 'scot' ? 'S' : region === 'wales' ? 'C' : '';
    const body = c.kind === 'BR' ? 'BR' : c.kind === 'NT' ? 'NT' : c.kind === 'D' ? `D${c.d}` : c.kind === 'K' ? `K${c.num}` : `${c.num}${c.letter}`;
    c.text = `${pre}${body}${basis ? ' ' + basis : ''}`;
    return c;
  };
  if (s === 'BR') return out({ kind: 'BR' });
  if (s === 'NT') return region === 'ruk' ? out({ kind: 'NT' }) : { ...base, error: 'NT has no Scottish or Welsh version: there is no SNT or CNT code.' };
  let mm = s.match(/^D(\d)$/);
  if (mm) {
    const sc = scale(CURRENT, region)!;
    const d = Number(mm[1]);
    if (sc.basic + 1 + d >= sc.rates.length) return { ...base, error: `D${d} does not exist${region === 'scot' ? ' in Scotland (SD0 to SD3)' : ' (D0 and D1 only)'}.` };
    return out({ kind: 'D', d });
  }
  mm = s.match(/^K(\d{1,5})$/);
  if (mm) return Number(mm[1]) > 0 ? out({ kind: 'K', num: Number(mm[1]) }) : { ...base, error: 'A K code always has a number above zero.' };
  mm = s.match(/^(\d{1,5})([LMNT])$/);
  if (mm) return out({ kind: 'suffix', num: Number(mm[1]), letter: mm[2] });
  return { ...base, error: 'Not a tax code: type it as it appears on your payslip, for example 1257L, BR, K475 or S1257L M1.' };
}

export const PERIODS: Record<Freq, number> = { weekly: 52, fortnightly: 26, fourweekly: 13, monthly: 12 };
/** Weeks in one pay period (weekly tables are used for fortnightly and four-weekly pay, CWG2). */
const WEEKS: Record<Freq, number> = { weekly: 1, fortnightly: 2, fourweekly: 4, monthly: 1 };
const tableOf = (f: Freq) => (f === 'monthly' ? 12 : 52);

/** Free pay (suffix) or additional pay (K) for week 1 or month 1, in pence: §4.3.1, quotient method. */
export function periodAllowance(num: number, table: 52 | 12): number {
  if (num <= 0) return 0;
  const q = Math.floor((num - 1) / 500);
  const r = ((num - 1) % 500) + 1;
  const f = Math.ceil(((r * 10 + 9) * 100) / table);
  return f + q * (table === 52 ? 9616 : 41667);
}

interface Consts { c: number[]; v: number[]; k: number[] }
/** Thresholds (c), Cvalues (v, £) and threshold taxes (k) for table period n: Definitions 9–11. */
function consts(s: Scale, n: number, table: number): Consts {
  const c: number[] = [], v: number[] = [], k: number[] = [];
  let cum = 0, tax = 0;
  for (let i = 0; i < s.bands.length; i++) {
    cum += s.bands[i];
    tax += s.bands[i] * s.rates[i];          // pence when rates are percentages
    c.push(Math.floor((cum * 10000 * n) / table));      // ten-thousandths of £
    v.push(Math.ceil(c[i] / 10000));                     // £1 above
    k.push(Math.floor((tax * 100 * n) / table));         // ten-thousandths of £
  }
  return { c, v, k };
}
/** Tax due to date (pence) on taxable pay to date Un (pence), table period n: §4.4. */
export function taxToDate(un: number, s: Scale, n: number, table: number): number {
  if (un <= 0) return 0;
  const { c, v, k } = consts(s, n, table);
  let i = 0;
  while (i < v.length && un > v[i] * 100) i++;
  const tn = Math.floor(un / 100);
  const c0 = i === 0 ? 0 : c[i - 1];
  const k0 = i === 0 ? 0 : k[i - 1];
  const l = k0 + Math.floor(((tn * 10000 - c0) * s.rates[i]) / 100);
  return Math.floor(l / 100);
}
/** Annual tax (pence) on taxable income in £ with the full-year bands. */
export function annualBandTax(taxable: number, s: Scale): number {
  return taxToDate(Math.round(Math.max(0, taxable) * 100), s, 1, 1);
}
/** Flat rate of a BR or D code (percentage). */
export function flatRate(c: Code, y: YearId): number {
  const s = scaleOrLatest(y, c.region).s;
  return c.kind === 'BR' ? s.rates[s.basic] : s.rates[Math.min(s.rates.length - 1, s.basic + 1 + c.d)];
}

export interface PeriodRow {
  p: number; pay: number; payToDate: number;
  /** Free pay (positive) or additional pay (negative) to date, pence. */
  allowanceToDate: number;
  taxable: number; taxDueToDate: number; tax: number;
  /** Tax not taken this period because of the 50 % limit (pence). */
  heldBack: number;
}
export interface RunInput {
  code: Code | string; year?: YearId; freq: Freq; pays: number[]; bik?: number[];
  /** Code from period `from` on (HMRC's new code reaching the payroll), the first code before. */
  then?: { code: Code | string; from: number };
}

/**
 * Runs the payroll for consecutive pay periods 1..pays.length of the tax year (amounts in £ per
 * period, 0 when nothing was paid in a period). Returns one row per period, amounts in pence.
 * Tax paid to date carries over a change of code, as on a real payroll record.
 */
export function runPayroll({ code, year: y = CURRENT, freq, pays, bik = [], then }: RunInput): PeriodRow[] {
  const c1 = typeof code === 'string' ? parseCode(code) : code;
  const c2 = then ? (typeof then.code === 'string' ? parseCode(then.code) : then.code) : null;
  if (!c1.ok || (c2 && !c2.ok)) return [];
  const table = tableOf(freq);
  const wk = WEEKS[freq];
  const maxRate = P.years[y].maxRate;
  const rows: PeriodRow[] = [];
  let payToDate = 0, taxPaid = 0;
  pays.forEach((payL, idx) => {
    const p = idx + 1;
    const c = c2 && then && p >= then.from ? c2 : c1;
    const sc = scaleOrLatest(y, c.region).s;
    const a1 = c.kind === 'suffix' || c.kind === 'K' ? periodAllowance(c.num, table as 52 | 12) : 0;
    const pay = Math.round((payL || 0) * 100);
    const pb = Math.round((bik[idx] || 0) * 100);
    payToDate += pay;
    const n = c.nonCum ? wk : p * wk;                 // table period: week 1 basis uses the weeks in one period
    const cumPay = c.nonCum ? pay : payToDate;
    let allowance = 0, taxable = 0, due = 0;
    if (c.kind === 'NT') { taxable = cumPay; due = 0; }
    else if (c.kind === 'BR' || c.kind === 'D') { taxable = Math.floor(cumPay / 100) * 100; due = Math.floor((taxable * flatRate(c, y)) / 100); }
    else {
      allowance = c.kind === 'K' ? -a1 * n : a1 * n;
      taxable = cumPay - allowance;
      due = c.kind === 'suffix' && taxable <= 0 ? 0 : taxToDate(taxable, sc, n, table);
    }
    let tax = c.nonCum ? due : due - taxPaid;
    let heldBack = 0;
    if (c.kind === 'suffix' || c.kind === 'K') {
      const limit = pay > 0 ? Math.floor(((pay - pb) * maxRate) / 100) : 0;
      if (tax > limit) { heldBack = tax - limit; tax = limit; }
    }
    if (c.nonCum && tax < 0) tax = 0;
    taxPaid += tax;
    rows.push({ p, pay, payToDate, allowanceToDate: allowance, taxable, taxDueToDate: due, tax, heldBack });
  });
  return rows;
}

/** Tax for one period number with the same pay every period, cumulative or not. */
export function periodTax(code: string | Code, freq: Freq, pay: number, p = 1, y: YearId = CURRENT): PeriodRow | null {
  const rows = runPayroll({ code, year: y, freq, pays: Array.from({ length: Math.max(1, Math.min(PERIODS[freq], p)) }, () => pay) });
  return rows.length ? rows[rows.length - 1] : null;
}
/** Tax over a full year with the same pay every period (pence). */
export function yearTax(code: string | Code, freq: Freq, pay: number, y: YearId = CURRENT): number {
  return runPayroll({ code, year: y, freq, pays: Array.from({ length: PERIODS[freq] }, () => pay) }).reduce((t, r) => t + r.tax, 0);
}

/** Personal Allowance after the taper: £1 less for every £2 of adjusted net income above the limit. */
export function personalAllowance(ani: number, y: YearId = CURRENT): number {
  const Y = P.years[y];
  const over = Math.max(0, ani - Y.incomeLimit);
  return Math.max(0, Y.personalAllowance - Math.floor(over / 2));
}

/** Tax-free amount behind a code, in £ per year (the number × 10; for K, the amount added to pay). */
export function codeAllowance(c: Code): number {
  return c.kind === 'suffix' ? c.num * 10 : c.kind === 'K' ? -c.num * 10 : 0;
}
/** Code number for a tax-free amount: drop the last digit (suffix) or the K amount rounded so that the code collects at least it. */
export function codeFor(amount: number, letter: string, region: Region): string {
  const pre = region === 'scot' ? 'S' : region === 'wales' ? 'C' : '';
  if (amount >= 10) return `${pre}${Math.floor(amount / 10)}${letter}`;
  if (amount >= 0) return `${pre}0T`;
  return `${pre}K${Math.ceil(-amount / 10)}`;
}

/** Band name for taxable income (above the allowance) in a scale. */
export function bandOf(taxable: number, s: Scale): number {
  let cum = 0;
  for (let i = 0; i < s.bands.length; i++) { cum += s.bands[i]; if (taxable <= cum) return i; }
  return s.bands.length;
}

export const LETTERS: Record<string, string> = {
  L: 'the standard tax-free Personal Allowance',
  M: 'Marriage Allowance received: 10% of your partner’s Personal Allowance is added',
  N: 'Marriage Allowance transferred: 10% of your Personal Allowance has gone to your partner',
  T: 'your allowance includes other calculations by HMRC',
};
export const REGION_NAME: Record<Region, string> = { ruk: 'England or Northern Ireland rates', scot: 'Scottish rates', wales: 'Welsh rates' };
