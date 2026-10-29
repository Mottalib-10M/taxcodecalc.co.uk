/**
 * Mini-tools of the pages (RECETTE §9.3): one subject = one calculation, always through the engines
 * (`lib/engine/paye.ts`, `lib/engine/situation.ts`) and params-2026.json, never a second formula.
 * Inputs are numbers; a choice is the index of an option.
 */
import type { MiniSpec, MiniInput } from './mini-types';
import P from '../data/params-2026.json';
import { money, formatNumberL, dateL } from './format-l';
import { dayNum, isoOf } from './engine/dates';
import { parseCode, yearTax, periodTax, periodAllowance, personalAllowance, codeFor, codeAllowance, runPayroll, scaleOrLatest, flatRate, CURRENT, type Region } from './engine/paye';
import { liability, expectedCodes, emergencyRefund } from './engine/situation';

const Y = P.years[CURRENT];
const R = P.rules;
const n0 = (v: number) => formatNumberL(v);
const pp = (pence: number) => `${pence < 0 ? '−' : ''}£${formatNumberL(Math.abs(pence) / 100, 'en', 2)}`;
const gb = (v: number) => money(Math.round(v));
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, Math.round(x)));

/** Codes offered in the mini-tools' lists (index = value). */
export const CODES = ['1257L', '1257L M1', 'BR', 'D0', 'D1', '0T', 'NT', 'K475', 'S1257L', 'C1257L', '1383M', '1131N', '1100L', 'SBR', 'SD0', 'SD1', 'CBR', '1257L W1', '0T M1', 'S1257L M1'];
const CODE_OPTS = CODES.map((c, i) => ({ value: String(i), label: c }));
export const codeIndexOf = (c: string) => { const i = CODES.indexOf(c); if (i < 0) throw new Error(`Code not in the mini-tools list: ${c}`); return i; };
const codeAt = (i: number | undefined) => CODES[clamp(i ?? 0, 0, CODES.length - 1)];
const codeInput = (def = '1257L', label = 'Tax code'): MiniInput => ({ id: 'code', label, def: codeIndexOf(def), options: CODE_OPTS });
const REGIONS: Region[] = ['ruk', 'scot', 'wales'];
const REGION_OPTS = [{ value: '0', label: 'England or Northern Ireland' }, { value: '1', label: 'Scotland' }, { value: '2', label: 'Wales' }];
const regionInput = (def = 0): MiniInput => ({ id: 'region', label: 'You live in', def, options: REGION_OPTS });
const regionAt = (i: number | undefined) => REGIONS[clamp(i ?? 0, 0, 2)];
const pre = (r: Region) => (r === 'scot' ? 'S' : r === 'wales' ? 'C' : '');
const std = (r: Region) => `${pre(r)}1257L`;
const yearly = (code: string, annual: number) => yearTax(code, 'monthly', annual / 12);
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

const SPECS: Record<string, () => MiniSpec> = {
  /** Tax on a monthly pay with a code. */
  month: () => ({
    title: 'Tax each month with a code', cta: 'Tax on any payslip', ctaPage: 'tax-per-payslip',
    inputs: [codeInput(), { id: 'pay', label: 'Gross pay each month', def: 2500, unit: '£', max: 100000, decimals: 2 }],
    run: (v) => {
      const code = codeAt(v.code); const pay = v.pay ?? 0;
      const r1 = periodTax(code, 'monthly', pay, 1)!; const yr = yearTax(code, 'monthly', pay);
      return { head: [`Tax in month 1 with ${code}`, pp(r1.tax)], rows: [['Tax over 12 months', pp(yr)], ['Average each month', pp(Math.round(yr / 12))], ['With 1257L instead', pp(yearTax('1257L', 'monthly', pay))]], note: parseCode(code).nonCum ? 'Emergency basis: every month is taxed like month 1.' : undefined };
    },
  }),
  /** The allowance behind a code number. */
  allowance: () => ({
    title: 'Tax-free pay behind a code number', cta: 'Decode the whole code', ctaPage: 'home',
    inputs: [{ id: 'num', label: 'Number in the code', def: 1257, max: 99999, help: '1257L → 1257' }],
    run: (v) => {
      const n = clamp(v.num ?? 0, 0, 99999);
      return { head: ['Tax-free a year', gb(n * 10)], rows: [['Free pay in month 1', pp(periodAllowance(n, 12))], ['Free pay in week 1', pp(periodAllowance(n, 52))], ['Against the Personal Allowance', `${n * 10 >= Y.personalAllowance ? '+' : '−'}${gb(Math.abs(n * 10 - Y.personalAllowance))}`]], note: 'HMRC’s tables add £9 to the code number × 10, so the free pay is a few pence above a twelfth of it.' };
    },
  }),
  /** BR, D0, D1 on a second source. */
  flat: () => ({
    title: 'Tax on a second job with BR, D0 or D1', cta: 'Check which code fits', ctaPage: 'second-job-tax-code',
    inputs: [{ id: 'pay', label: 'Yearly pay from the second job', def: 9000, unit: '£', max: 500000 }, regionInput()],
    run: (v) => {
      const r = regionAt(v.region); const pay = v.pay ?? 0; const p = pre(r);
      const rows: Array<[string, string]> = (r === 'scot' ? ['SBR', 'SD0', 'SD1', 'SD2'] : [`${p}BR`, `${p}D0`, `${p}D1`]).map((c) => [`${c} (${flatRate(parseCode(c), CURRENT)}%)`, pp(yearly(c, pay))]);
      return { head: [`With ${p}BR, over the year`, pp(yearly(`${p}BR`, pay))], rows: [...rows, [`With ${p}0T`, pp(yearly(`${p}0T`, pay))]] };
    },
  }),
  /** K code and the 50 % limit. */
  kcap: () => ({
    title: 'K code: tax and the 50% limit', cta: 'Full K code calculator', ctaPage: 'k-tax-code',
    inputs: [{ id: 'k', label: 'Number after the K', def: 475, max: 99999 }, { id: 'pay', label: 'Gross pay each month', def: 1200, unit: '£', max: 100000, decimals: 2 }],
    run: (v) => {
      const k = clamp(v.k ?? 1, 1, 99999); const pay = v.pay ?? 0; const r = periodTax(`K${k} M1`, 'monthly', pay, 1)!;
      return { head: ['Tax this month', pp(r.tax)], rows: [['Added to pay', pp(periodAllowance(k, 12))], ['Limit: half the pay', pp(Math.floor(Math.round(pay * 100) / 2))], ['Not taken because of the limit', pp(r.heldBack)]] };
    },
  }),
  /** Emergency code refund. */
  emergency: () => ({
    title: 'What comes back after an emergency code', cta: 'Emergency tax calculator', ctaPage: 'emergency-tax-code',
    inputs: [{ id: 'pay', label: 'Gross pay each month', def: 2400, unit: '£', max: 100000, decimals: 2 }, { id: 'start', label: 'First pay in', def: 6, options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) }, { id: 'k', label: 'Months on the emergency code', def: 2, max: 12 }],
    run: (v) => {
      const e = emergencyRefund({ freq: 'monthly', pay: v.pay ?? 0, start: v.start ?? 1, periods: v.k ?? 1, emergency: `${Y.emergencyCode} M1`, correct: '1257L' });
      return { head: ['Should come back', pp(Math.max(0, e.back))], rows: [['Taken on 1257L M1', pp(e.onEmergency)], ['Due with 1257L', pp(e.right)], ['Comes back in', e.switchPeriod ? `${MONTHS[e.switchPeriod - 1]} pay` : 'after 5 April']], note: 'Assumes no other job earlier in the tax year.' };
    },
  }),
  /** Week 1 / month 1 against cumulative. */
  w1: () => ({
    title: 'Month 1 basis against cumulative', cta: 'Tax on any payslip', ctaPage: 'tax-per-payslip',
    inputs: [{ id: 'pay', label: 'Gross pay each month', def: 2200, unit: '£', max: 100000, decimals: 2 }, { id: 'start', label: 'First pay in', def: 8, options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) }],
    run: (v) => {
      const pay = v.pay ?? 0; const s = clamp(v.start ?? 1, 1, 12);
      const m1 = periodTax('1257L M1', 'monthly', pay, 1)!.tax;
      const rows = runPayroll({ code: '1257L', freq: 'monthly', pays: Array.from({ length: s }, (_, i) => (i + 1 >= s ? pay : 0)) });
      const cum = rows[rows.length - 1].tax;
      return { head: ['First pay, 1257L M1', pp(m1)], rows: [['First pay, 1257L cumulative', pp(cum)], ['Difference on that pay', pp(m1 - cum)], ['Free pay used by cumulative', pp(periodAllowance(1257, 12) * s)]], note: 'Cumulative counts the allowance of the months before the job started.' };
    },
  }),
  /** Codes for two jobs. */
  secondjob: () => ({
    title: 'Codes for two jobs', cta: 'Am I on the right code?', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'j1', label: 'Main job, yearly', def: 28000, unit: '£', max: 1000000 }, { id: 'j2', label: 'Second job, yearly', def: 7000, unit: '£', max: 1000000 }, regionInput()],
    run: (v) => {
      const s = { region: regionAt(v.region), job1: v.j1 ?? 0, job2: v.j2 ?? 0 };
      const e = expectedCodes(s); const L = liability(s);
      return { head: ['Expected codes', `${e.main} + ${e.second ?? '-'}`], rows: [['Tax due for the year', pp(L.tax)], ['Second job with 1257L by mistake', pp(yearly(std(s.region), s.job2))], ['Second job with its expected code', pp(yearly(e.second ?? 'BR', s.job2))]], note: e.note || undefined };
    },
  }),
  /** Pension code with State Pension. */
  pension: () => ({
    title: 'Code on a workplace pension', cta: 'Check your whole situation', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'pen', label: 'Workplace or private pension, yearly', def: 9000, unit: '£', max: 1000000 }, { id: 'sp', label: 'State Pension each week', def: R.statePensionWeekly2627, unit: '£', max: 2000, decimals: 2 }, regionInput()],
    run: (v) => {
      const sp = Math.round((v.sp ?? 0) * 52 * 100) / 100; const s = { region: regionAt(v.region), job1: v.pen ?? 0, statePension: sp };
      const e = expectedCodes(s); const L = liability(s);
      return { head: ['Expected code on the pension', e.main], rows: [['State Pension for the year', gb(sp)], ['Tax due for the year', pp(L.tax)], ['Taken by the pension with that code', pp(yearly(e.main, s.job1))]], note: 'The State Pension is paid gross; its tax is collected through the code on your other pension or job.' };
    },
  }),
  /** Taxable State Pension for the year. */
  statepension: () => ({
    title: 'Taxable State Pension for the year', cta: 'Code on a pension', ctaPage: 'pension-tax-code',
    inputs: [{ id: 'old', label: 'Weekly rate before April', def: R.statePensionWeekly2627, unit: '£', max: 2000, decimals: 2 }, { id: 'neu', label: 'Weekly rate after April', def: R.statePensionWeekly2627, unit: '£', max: 2000, decimals: 2 }],
    run: (v) => {
      const t = (v.old ?? 0) * R.statePensionWeeksOld + (v.neu ?? 0) * R.statePensionWeeksNew;
      return { head: ['Taxable State Pension', money(Math.round(t * 100) / 100)], rows: [[`${R.statePensionWeeksOld} week at the old rate`, money(v.old ?? 0)], [`${R.statePensionWeeksNew} weeks at the new rate`, money(Math.round((v.neu ?? 0) * R.statePensionWeeksNew * 100) / 100)], ['Left of the Personal Allowance', gb(Math.max(0, Y.personalAllowance - t))], ['Code if nothing else changes', codeFor(Y.personalAllowance - t, 'L', 'ruk')]] };
    },
  }),
  /** Marriage Allowance. */
  marriage: () => ({
    title: 'Marriage Allowance: codes and saving', cta: 'Check your code', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'low', label: 'Lower earner, yearly income', def: 9000, unit: '£', max: 1000000 }, { id: 'high', label: 'Partner, yearly income', def: 32000, unit: '£', max: 1000000 }, regionInput()],
    run: (v) => {
      const r = regionAt(v.region); const low = v.low ?? 0, high = v.high ?? 0;
      const sc = scaleOrLatest(CURRENT, r).s; const basicTop = Y.personalAllowance + sc.bands.slice(0, sc.basic + 1).reduce((a, b) => a + b, 0) + (r === 'scot' ? sc.bands[2] : 0);
      const ok = low <= Y.personalAllowance && high > Y.personalAllowance && high <= basicTop;
      const before = liability({ region: r, job1: low }).tax + liability({ region: r, job1: high }).tax;
      const after = liability({ region: r, job1: low, ma: 'transfer' }).tax + liability({ region: r, job1: high, ma: 'receive' }).tax;
      return { head: [ok ? 'Couple saves' : 'Not eligible as entered', ok ? pp(before - after) : '£0'], rows: [['Codes', ok ? `${codeFor(Y.personalAllowance - Y.marriageAllowance, 'N', r)} and ${codeFor(Y.personalAllowance + Y.marriageAllowance, 'M', r)}` : '-'], ['Amount transferred', gb(Y.marriageAllowance)], ['Partner’s income limit', gb(basicTop)]], note: 'The lower earner must earn under the Personal Allowance, the partner pay tax at the basic rate at most (intermediate in Scotland).' };
    },
  }),
  /** Personal Allowance taper. */
  taper: () => ({
    title: 'Personal Allowance above £100,000', cta: 'Check your code', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'inc', label: 'Adjusted net income', def: 112000, unit: '£', max: 2000000 }],
    run: (v) => {
      const inc = v.inc ?? 0; const pa = personalAllowance(inc);
      return { head: ['Personal Allowance left', gb(pa)], rows: [['Code if this is all from one job', codeFor(pa, 'L', 'ruk')], ['Allowance lost', gb(Y.personalAllowance - pa)], ['Extra tax from the lost allowance (40%)', gb((Y.personalAllowance - pa) * 0.4)]], note: `£1 of allowance goes for every £2 above ${gb(Y.incomeLimit)}; none is left at ${gb(Y.incomeLimit + 2 * Y.personalAllowance)}.` };
    },
  }),
  /** Company benefits in the code. */
  benefits: () => ({
    title: 'Company benefits and your code', cta: 'Check your whole situation', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'bik', label: 'Yearly value of the benefit', def: R.medicalExample.benefit, unit: '£', max: 200000 }, { id: 'pay', label: 'Yearly salary', def: 35000, unit: '£', max: 1000000 }],
    run: (v) => {
      const bik = v.bik ?? 0; const pay = v.pay ?? 0; const s = { region: 'ruk' as Region, job1: pay, bik };
      const e = expectedCodes(s); const extra = yearly(e.main, pay) - yearly('1257L', pay);
      return { head: ['New code', e.main], rows: [['Extra tax over the year', pp(extra)], ['Each month', pp(Math.round(extra / 12))], ['Tax-free amount left', gb(Y.personalAllowance - bik)]] };
    },
  }),
  /** Job expenses in the code. */
  expenses: () => ({
    title: 'Job expenses and your code', cta: 'Check your whole situation', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'ex', label: 'Yearly expenses with relief', def: 600, unit: '£', max: 100000 }, { id: 'pay', label: 'Yearly salary', def: 30000, unit: '£', max: 1000000 }],
    run: (v) => {
      const ex = v.ex ?? 0; const pay = v.pay ?? 0; const e = expectedCodes({ region: 'ruk', job1: pay, expenses: ex });
      const saved = yearly('1257L', pay) - yearly(e.main, pay);
      return { head: ['New code', e.main], rows: [['Tax saved over the year', pp(saved)], ['Each month', pp(Math.round(saved / 12))]] };
    },
  }),
  /** Underpayment coded out. */
  underpaid: () => ({
    title: 'Owed tax collected through your code', cta: 'Check your code', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'owed', label: 'Tax owed', def: 600, unit: '£', max: 100000 }, { id: 'rate', label: 'Your top rate', def: 0, options: [{ value: '0', label: 'Basic, 20%' }, { value: '1', label: 'Higher, 40%' }] }],
    run: (v) => {
      const owed = v.owed ?? 0; const rate = (v.rate ?? 0) === 1 ? 40 : 20; const cut = Math.ceil((owed * 100) / rate);
      const ok = owed < R.codingOutLimit;
      return { head: [ok ? 'Code next tax year' : 'Too much to code out', ok ? codeFor(Y.personalAllowance - cut, 'L', 'ruk') : 'P800 or Simple Assessment'], rows: [['Allowance taken off', gb(cut)], [`Extra each month over ${R.codingOutMonths}`, money(Math.round((owed / R.codingOutMonths) * 100) / 100)], ['Limit for coding out', `under ${gb(R.codingOutLimit)}`]], note: 'HMRC reduces the code by the amount owed divided by your rate, so the extra tax adds up to the debt.' };
    },
  }),
  /** Self Assessment through the code. */
  sacode: () => ({
    title: 'Pay a Self Assessment bill through your code', cta: 'Check your code', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'bill', label: 'Self Assessment bill', def: 1200, unit: '£', max: 100000 }, { id: 'paye', label: 'Yearly PAYE pay or pension', def: 30000, unit: '£', max: 1000000 }],
    run: (v) => {
      const bill = v.bill ?? 0; const paye = v.paye ?? 0; const normal = liability({ region: 'ruk', job1: paye }).tax / 100;
      const ok = bill < R.codingOutLimit && bill + normal <= paye * 0.5 && bill + normal <= 2 * normal && bill > 0;
      return { head: [ok ? 'Can be collected through the code' : 'Cannot go through the code', ok ? `${gb(bill / 12)} a month` : 'Pay HMRC directly'], rows: [['Under the limit', bill < R.codingOutLimit ? 'yes' : 'no'], ['Usual tax on the PAYE pay', gb(normal)], ['Total no more than twice the usual tax', bill + normal <= 2 * normal ? 'yes' : 'no']], note: `File online by ${R.saOnlineBy} (paper by ${R.saPaperBy}) for this to apply.` };
    },
  }),
  /** High Income Child Benefit Charge. */
  hicbc: () => ({
    title: 'High Income Child Benefit Charge', cta: 'Check your code', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'inc', label: 'Adjusted net income', def: 70000, unit: '£', max: 1000000 }, { id: 'cb', label: 'Child Benefit received in the year', def: 2200, unit: '£', max: 20000 }],
    run: (v) => {
      const inc = v.inc ?? 0; const cb = v.cb ?? 0; const pc = Math.max(0, Math.min(100, Math.floor((inc - R.hicbcFrom) / R.hicbcStep)));
      const charge = Math.floor((cb * pc) / 100);
      return { head: ['Charge for the year', gb(charge)], rows: [['Share paid back', `${pc}%`], ['Through PAYE, each month', gb(charge / 12)], ['Allowance cut at 40%', gb(Math.ceil(charge / 0.4))]], note: `1% for every ${gb(R.hicbcStep)} above ${gb(R.hicbcFrom)}; all of it from ${gb(R.hicbcAll)}.` };
    },
  }),
  /** Scotland against the rest of the UK. */
  scotland: () => ({
    title: 'Scottish rates against England', cta: 'Decode an S code', ctaPage: 'home',
    inputs: [{ id: 'pay', label: 'Yearly salary', def: 40000, unit: '£', max: 1000000 }],
    run: (v) => {
      const pay = v.pay ?? 0; const s = yearly('S1257L', pay), e = yearly('1257L', pay);
      return { head: ['Tax with S1257L', pp(s)], rows: [['With 1257L (England)', pp(e)], ['Difference over the year', pp(s - e)], ['Each month', pp(Math.round((s - e) / 12))]] };
    },
  }),
  /** Wales. */
  wales: () => ({
    title: 'Welsh rates with a C code', cta: 'Decode a C code', ctaPage: 'home',
    inputs: [{ id: 'pay', label: 'Yearly salary', def: 38000, unit: '£', max: 1000000 }],
    run: (v) => {
      const pay = v.pay ?? 0; const c = yearly('C1257L', pay), e = yearly('1257L', pay);
      return { head: ['Tax with C1257L', pp(c)], rows: [['With 1257L', pp(e)], ['Difference', pp(c - e)]], note: 'The Welsh rates of income tax are 10p in each band, so the totals match England in 2026 to 2027.' };
    },
  }),
  /** 2026-27 against 2027-28. */
  y2728: () => ({
    title: 'Tax in 2027 to 2028 against this year', cta: 'Decode your code', ctaPage: 'home',
    inputs: [{ id: 'pay', label: 'Yearly salary', def: 45000, unit: '£', max: 1000000 }],
    run: (v) => {
      const pay = v.pay ?? 0; const a = yearTax('1257L', 'monthly', pay / 12, '2026-27'), b = yearTax('1257L', 'monthly', pay / 12, '2027-28');
      return { head: ['Tax in 2027 to 2028, England', pp(b)], rows: [['In 2026 to 2027', pp(a)], ['Difference', pp(b - a)], ['Scottish rates 2027 to 2028', `due ${dateL(P.years['2027-28'].scotExpected as string)}`]] };
    },
  }),
  /** Overpaid tax refund. */
  refund: () => ({
    title: 'Overpaid tax and how it comes back', cta: 'Am I on the right code?', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'paid', label: 'Tax taken this year (payslips, P60)', def: 4200, unit: '£', max: 1000000, decimals: 2 }, { id: 'pay', label: 'Taxable pay this year', def: 30000, unit: '£', max: 1000000 }],
    run: (v) => {
      const due = liability({ region: 'ruk', job1: v.pay ?? 0 }).tax / 100; const diff = (v.paid ?? 0) - due;
      return { head: [diff >= 0 ? 'Overpaid' : 'Underpaid', money(Math.round(Math.abs(diff) * 100) / 100)], rows: [['Tax due with 1257L', money(Math.round(due * 100) / 100)], ['Refund online', `${R.refundOnlineWorkingDays} working days after claiming`], ['Refund by cheque', `within ${R.refundChequeWeeks} weeks`]], note: 'Employment income in England, Wales or Northern Ireland with the standard allowance.' };
    },
  }),
  /** Starter checklist statements. */
  newjob: () => ({
    title: 'Starter checklist: which code?', cta: 'Emergency tax calculator', ctaPage: 'emergency-tax-code',
    inputs: [{ id: 'st', label: 'Statement ticked', def: 0, options: [{ value: '0', label: 'A: first job since 6 April' }, { value: '1', label: 'B: only job now, other pay this year' }, { value: '2', label: 'C: another job or pension too' }] }, { id: 'pay', label: 'Gross pay each month', def: 2300, unit: '£', max: 100000, decimals: 2 }],
    run: (v) => {
      const st = clamp(v.st ?? 0, 0, 2); const code = st === 0 ? `${Y.emergencyCode}` : st === 1 ? `${Y.emergencyCode} M1` : 'BR';
      return { head: ['Code the employer uses', code], rows: [['Tax in the first month', pp(periodTax(code, 'monthly', v.pay ?? 0, 1)!.tax)], ['Basis', st === 0 ? 'cumulative' : st === 1 ? 'month 1, until HMRC sends a code' : 'all at 20%']] };
    },
  }),
  /** Date to tax month and week. */
  taxmonth: () => ({
    title: 'Tax month and week of a pay day', cta: 'Tax on that payslip', ctaPage: 'tax-per-payslip',
    inputs: [{ id: 'day', label: 'Pay day', def: dayNum('2026-10-30'), date: true }],
    run: (v) => {
      const d = isoOf(v.day ?? dayNum('2026-10-30')); const [yy, mm, dd] = d.split('-').map(Number);
      const startY = mm > 4 || (mm === 4 && dd >= 6) ? yy : yy - 1; const start = dayNum(`${startY}-04-06`);
      const week = Math.floor((dayNum(d) - start) / 7) + 1;
      const month = ((mm - 4 + 12) % 12) + 1 - (dd < 6 ? 1 : 0);
      const tm = month <= 0 ? 12 : month;
      return { head: ['Tax month', n0(tm)], rows: [['Tax week', n0(week)], ['Tax year', `${startY} to ${startY + 1}`], ['Tax year started', dateL(`${startY}-04-06`)]] };
    },
  }),
  /** Two codes compared. */
  compare: () => ({
    title: 'Two codes on the same pay', cta: 'Compare any two codes', ctaPage: 'compare-tax-codes',
    inputs: [codeInput('1257L', 'Code A'), { ...codeInput('BR', 'Code B'), id: 'code2' }, { id: 'pay', label: 'Yearly pay', def: 30000, unit: '£', max: 1000000 }],
    run: (v) => {
      const a = codeAt(v.code), b = codeAt(v.code2); const ta = yearly(a, v.pay ?? 0), tb = yearly(b, v.pay ?? 0);
      return { head: [`${b} against ${a}, over the year`, `${tb >= ta ? '+' : '−'}${pp(Math.abs(tb - ta))}`], rows: [[`Tax with ${a}`, pp(ta)], [`Tax with ${b}`, pp(tb)], ['Each month', pp(Math.round(Math.abs(tb - ta) / 12))]] };
    },
  }),
  /** Code number change from a P2 notice. */
  p2: () => ({
    title: 'What a new code number changes', cta: 'Am I on the right code?', ctaPage: 'check-my-tax-code',
    inputs: [{ id: 'old', label: 'Old code number', def: 1257, max: 99999 }, { id: 'neu', label: 'New code number', def: 1100, max: 99999 }, { id: 'pay', label: 'Yearly pay', def: 32000, unit: '£', max: 1000000 }],
    run: (v) => {
      const a = `${clamp(v.old ?? 0, 0, 99999)}L`, b = `${clamp(v.neu ?? 0, 0, 99999)}L`; const ta = yearly(a, v.pay ?? 0), tb = yearly(b, v.pay ?? 0);
      return { head: ['Change in tax each month', `${tb >= ta ? '+' : '−'}${pp(Math.round(Math.abs(tb - ta) / 12))}`], rows: [['Allowance change', `${codeAllowance(parseCode(b)) >= codeAllowance(parseCode(a)) ? '+' : '−'}${gb(Math.abs(codeAllowance(parseCode(b)) - codeAllowance(parseCode(a))))}`], [`Tax over the year with ${a}`, pp(ta)], [`Tax over the year with ${b}`, pp(tb)]] };
    },
  }),
  /** Annual tax by band. */
  bands: () => ({
    title: 'Income Tax for the year by band', cta: 'Decode your code', ctaPage: 'home',
    inputs: [{ id: 'pay', label: 'Yearly taxable pay', def: 50000, unit: '£', max: 2000000 }, regionInput()],
    run: (v) => {
      const r = regionAt(v.region); const L = liability({ region: r, job1: v.pay ?? 0 }); const sc = scaleOrLatest(CURRENT, r).s;
      return { head: ['Income Tax for the year', pp(L.tax)], rows: [['Personal Allowance', gb(L.pa)], ['Taxed income', gb(L.taxable)], ['Top band reached', `${sc.names[Math.min(L.band, sc.names.length - 1)]}, ${sc.rates[Math.min(L.band, sc.rates.length - 1)]}%`], ['Each month', pp(Math.round(L.tax / 12))]] };
    },
  }),
  /** 0T and NT. */
  zero: () => ({
    title: '0T or NT on a pay', cta: 'Decode your code', ctaPage: 'home',
    inputs: [{ id: 'pay', label: 'Gross pay each month', def: 1800, unit: '£', max: 100000, decimals: 2 }],
    run: (v) => {
      const pay = v.pay ?? 0;
      return { head: ['Tax each month with 0T', pp(yearTax('0T', 'monthly', pay) / 12)], rows: [['With 1257L', pp(yearTax('1257L', 'monthly', pay) / 12)], ['With NT', '£0.00'], ['With BR', pp(periodTax('BR', 'monthly', pay, 1)!.tax)]] };
    },
  }),
};

export const MINI_KINDS = Object.keys(SPECS);
export function getSpec(kind: string): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown mini-tool: ${kind}`);
  return f();
}
