/**
 * From a situation to the codes HMRC would be expected to issue, the tax due for the year and the
 * tax PAYE takes with a given set of codes. Uses the rules published on GOV.UK (Personal Allowance
 * and taper, Marriage Allowance, State Pension collected through another code, company benefits and
 * job expenses in the code, BR or D codes on a second source) and the payroll engine of paye.ts.
 * It is an estimate of what HMRC's records would give, not HMRC's own calculation.
 */
import P from '../../data/params-2026.json';
import { CURRENT, parseCode, runPayroll, personalAllowance, annualBandTax, scaleOrLatest, codeFor, bandOf, type YearId, type Region, type Code } from './paye';

export type MA = 'none' | 'receive' | 'transfer';
export interface Situation {
  year?: YearId; region: Region;
  /** Annual pay from the main job or pension (taxed through PAYE). */
  job1: number;
  /** Annual pay from a second job or workplace pension (0 if none). */
  job2?: number;
  /** Annual State Pension (paid without tax taken off). */
  statePension?: number;
  /** Cash equivalent of company benefits taxed through the code. */
  bik?: number;
  /** Job expenses with tax relief given through the code. */
  expenses?: number;
  ma?: MA;
  /** Months of the tax year in the main job (12 = the whole year). */
  months?: number;
}

export interface Liability { income: number; pa: number; allowance: number; taxable: number; tax: number; band: number; scaleYear: YearId; fallback: boolean }
/** Tax due for the year on non-savings income (pence in `tax`, £ elsewhere). */
export function liability(s: Situation): Liability {
  const y = s.year ?? CURRENT;
  const months = Math.max(1, Math.min(12, s.months ?? 12));
  const job1 = (s.job1 * months) / 12;
  const income = job1 + (s.job2 ?? 0) + (s.statePension ?? 0) + (s.bik ?? 0);
  const net = Math.max(0, income - (s.expenses ?? 0));
  const pa = personalAllowance(net, y);
  const ma = P.years[y].marriageAllowance;
  const allowance = Math.max(0, pa + (s.ma === 'receive' ? ma : s.ma === 'transfer' ? -ma : 0));
  const taxable = Math.max(0, net - allowance);
  const { s: sc, year: scaleYear, fallback } = scaleOrLatest(y, s.region);
  return { income, pa, allowance, taxable, tax: annualBandTax(taxable, sc), band: bandOf(taxable, sc), scaleYear, fallback };
}

export interface Expected { main: string; second: string | null; free: number; note: string }
/** Codes the situation points to: allowances on the main source, BR or D on the second one. */
export function expectedCodes(s: Situation): Expected {
  const y = s.year ?? CURRENT;
  const L = liability(s);
  const letter = s.ma === 'receive' ? 'M' : s.ma === 'transfer' ? 'N' : 'L';
  // State Pension and benefits come off the allowance (they are taxed through this code); expenses add to it.
  const free = L.allowance + (s.expenses ?? 0) - (s.statePension ?? 0) - (s.bik ?? 0);
  const job2 = s.job2 ?? 0;
  const pre = s.region === 'scot' ? 'S' : s.region === 'wales' ? 'C' : '';
  if (job2 <= 0) return { main: codeFor(free, letter, s.region), second: null, free, note: '' };
  const sc = scaleOrLatest(y, s.region).s;
  const job1 = s.job1;
  if (free > 0 && job1 < free) {
    // The main pay does not use all the allowance: HMRC can give the rest to the second source.
    const mainPart = Math.ceil(job1 / 10) * 10;
    return { main: codeFor(mainPart, letter, s.region), second: codeFor(free - mainPart, letter, s.region), free, note: 'The allowance is split between the two sources because the main pay does not use all of it.' };
  }
  const band = bandOf(Math.max(0, job1 - Math.max(0, free)), sc);
  const rate = sc.rates[band];
  const second = rate <= sc.rates[sc.basic] ? `${pre}BR` : `${pre}D${band - sc.basic - 1}`;
  return { main: codeFor(free, letter, s.region), second, free, note: '' };
}

/** Tax (pence) PAYE takes over the year with given codes, paid monthly from the month of start. */
export function payeYear(code: string | Code, annual: number, year: YearId = CURRENT, months = 12): number {
  const c = typeof code === 'string' ? parseCode(code) : code;
  if (!c.ok || annual <= 0) return 0;
  const m = Math.max(1, Math.min(12, months));
  const pays = Array.from({ length: 12 }, (_, i) => (i >= 12 - m ? annual / 12 : 0));
  return runPayroll({ code: c, year, freq: 'monthly', pays }).reduce((t, r) => t + r.tax, 0);
}

export interface Check { liability: Liability; expected: Expected; paidExpected: number; paidCurrent: number; gap: number }
/** Compares what the current codes take with the tax due: gap > 0 means too much is taken (pence). */
export function checkCodes(s: Situation, currentMain: string, currentSecond?: string): Check {
  const y = s.year ?? CURRENT;
  const months = s.months ?? 12;
  const L = liability(s);
  const E = expectedCodes(s);
  const paidExpected = payeYear(E.main, s.job1, y, months) + (E.second && s.job2 ? payeYear(E.second, s.job2, y) : 0);
  const paidCurrent = payeYear(currentMain, s.job1, y, months) + (s.job2 ? payeYear(currentSecond || E.second || 'BR', s.job2, y) : 0);
  return { liability: L, expected: E, paidExpected, paidCurrent, gap: paidCurrent - L.tax };
}

/** Emergency code: tax taken on the emergency code for k periods, then the refund when the right code arrives. */
export function emergencyRefund(o: { freq: 'weekly' | 'monthly'; pay: number; start: number; periods: number; emergency: string; correct: string; year?: YearId }) {
  const y = o.year ?? CURRENT;
  const total = o.freq === 'monthly' ? 12 : 52;
  const start = Math.max(1, Math.min(total, Math.round(o.start)));
  const k = Math.max(1, Math.min(total - start + 1, Math.round(o.periods)));
  const until = Math.min(total, start + k);
  const pays = Array.from({ length: until }, (_, i) => (i + 1 >= start ? o.pay : 0));
  const rows = runPayroll({ code: o.emergency, year: y, freq: o.freq, pays, then: { code: o.correct, from: start + k } });
  const onEmergency = rows.filter((r) => r.p >= start && r.p < start + k).reduce((t, r) => t + r.tax, 0);
  const right = runPayroll({ code: o.correct, year: y, freq: o.freq, pays: pays.slice(0, start + k - 1) }).filter((r) => r.p >= start).reduce((t, r) => t + r.tax, 0);
  const switchRow = rows.find((r) => r.p === start + k) ?? null;
  return { onEmergency, right, back: onEmergency - right, switchPeriod: start + k <= total ? start + k : null, switchRow };
}
