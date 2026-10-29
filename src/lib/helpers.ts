/** Writing helpers handed to every page: links, figures read from params-2026.json through the engine, tables. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import { formatNumberL, money, pct, dateL } from './format-l';
import { parseCode, yearTax, periodTax, runPayroll, periodAllowance, personalAllowance, codeFor, flatRate, scale, CURRENT, type YearId, type Freq, type Region } from './engine/paye';
import { liability, expectedCodes, emergencyRefund, type Situation } from './engine/situation';
import P from '../data/params-2026.json';

export type SourceKey = keyof typeof P.sources;
const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption: string | undefined, align: Array<'l' | 'r'>) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumberL(c)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** Every page id of the plan: a link to a planned page that is not written yet renders as text. */
export const PLANNED: string[] = [
  'what-does-my-tax-code-mean', 'check-my-tax-code', 'tax-per-payslip', 'emergency-tax-code', 'compare-tax-codes', 'k-tax-code',
  '1257l-tax-code', 'br-tax-code', 'd0-tax-code', 'd1-tax-code', '0t-tax-code', 'nt-tax-code', 's1257l-tax-code', 'c1257l-tax-code',
  'm-and-n-tax-codes', 'w1-m1-x-tax-codes', 't-tax-code', 'scottish-tax-codes', 'tax-code-numbers', 'tax-code-letters',
  'second-job-tax-code', 'pension-tax-code', 'state-pension-tax-code', 'new-job-tax-code', 'no-p45-tax-code', 'company-benefits-tax-code',
  'tax-code-over-100k', 'child-benefit-charge-tax-code', 'underpaid-tax-code', 'self-assessment-tax-code', 'wrong-tax-code',
  'tax-refund-wrong-code', 'p800-tax-calculation', 'p2-tax-code-notice', 'job-expenses-tax-code', 'tax-code-changed', 'student-tax-code',
  'leaving-a-job-p45', 'tax-code-2026-27', 'tax-code-2027-28', 'personal-allowance', 'how-paye-is-calculated', 'scottish-income-tax-rates',
  'welsh-income-tax-rates', 'tax-month-and-week',
];
export function helpers(lang: Locale = 'en', strict = false) {
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict && !PLANNED.includes(id)) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, lang)}">${text}</a>`;
  };
  const ext = (url: string, text: string) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`;
  const src = (k: SourceKey, text: string) => ext(P.sources[k].url, text);
  /** £ whole pounds, or with pence when the amount has them. */
  const gbp = (n: number) => money(n);
  /** £ from pence, always with pence (payslip style). */
  const pence = (p: number) => `£${formatNumberL(p / 100, 'en', 2)}`;
  const num = (n: number, d = 0) => formatNumberL(n, 'en', d);
  const pc = (x: number, d = 0) => pct(x, 'en', d);
  const Y = (y: YearId = CURRENT) => P.years[y];
  const sc = (r: Region, y: YearId = CURRENT) => { const s = scale(y, r); if (!s) throw new Error(`No ${r} scale for ${y}`); return s; };
  /** Gross income where each band ends (Personal Allowance and its taper included): rUK [50,270, 125,140]. */
  const bandEdges = (r: Region, y: YearId = CURRENT) => {
    const s = sc(r, y); const pa = Y(y).personalAllowance, lim = Y(y).incomeLimit; let cum = 0;
    // Gross pay where each band ends; inside the taper the allowance shrinks, so g − PA(g) = cum gives g = (cum + PA + lim / 2) / 1.5.
    return s.bands.map((b) => { cum += b; const g = cum + pa; return g <= lim ? g : Math.round((cum + pa + lim / 2) / 1.5); });
  };
  /** Tax in pence taken over a year of equal monthly pays with a code. */
  const taxYear = (code: string, annual: number, y: YearId = CURRENT) => yearTax(code, 'monthly', annual / 12, y);
  /** Tax in pence on pay period p with equal pays. */
  const taxPeriod = (code: string, freq: Freq, pay: number, p = 1, y: YearId = CURRENT) => periodTax(code, freq, pay, p, y)!.tax;
  const due = (s: Situation) => liability(s).tax;
  /** Payroll rows (pence) for consecutive pays from period 1. */
  const run = (code: string, pays: number[], freq: Freq = 'monthly', y: YearId = CURRENT) => runPayroll({ code, freq, pays, year: y });
  const ord = (n: number) => { const t = n % 100, u = n % 10; return `${formatNumberL(n)}${t >= 11 && t <= 13 ? 'th' : u === 1 ? 'st' : u === 2 ? 'nd' : u === 3 ? 'rd' : 'th'}`; };
  return {
    lang, a, ext, src, gbp, pence, num, pc, ord, P, Y, R: P.rules, B: P.budget2026, sc, bandEdges,
    code: parseCode, taxYear, taxPeriod, due, run, liability, expected: expectedCodes, emergency: emergencyRefund,
    freePay: periodAllowance, pa: personalAllowance, codeFor, flat: (c: string) => flatRate(parseCode(c), CURRENT),
    date: (iso: string) => dateL(iso),
    table: (h: string[], r: Array<Array<string | number>>, c?: string, al: Array<'l' | 'r'> = []) => table(h, r, c, al),
  };
}
export type Helpers = ReturnType<typeof helpers>;
