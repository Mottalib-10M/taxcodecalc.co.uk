/** Shared pieces of the site's tools: the tax code field, the frequency and year choices, result rows. */
import type { ReactNode } from 'react';
import { parseCode, YEARS, type Freq, type YearId } from '../../lib/engine/paye';
import P from '../../data/params-2026.json';

export const inputCls = 'h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-3 text-lg uppercase tracking-wide text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
export const PRIVACY = 'Everything you type stays in this browser: nothing is sent or stored.';

interface CodeProps { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; className?: string }
export function CodeField({ id, label, value, onChange, help, className = '' }: CodeProps) {
  const c = parseCode(value);
  const msg = value.trim() && !c.ok ? c.error : help;
  return (
    <div className={`grid min-w-0 grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" value={value} spellCheck={false} autoComplete="off" autoCapitalize="characters" maxLength={14}
        onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9 /]/g, ''))} className={inputCls} aria-describedby={msg ? `${id}-help` : undefined} aria-invalid={value.trim() !== '' && !c.ok} />
      {msg ? <p id={`${id}-help`} className={`mt-1 text-xs ${value.trim() && !c.ok ? 'font-medium text-amber-800' : 'text-navy-500'}`}>{msg}</p> : <span />}
    </div>
  );
}

export const FREQS: Array<{ value: Freq; label: string }> = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Every two weeks' },
  { value: 'fourweekly', label: 'Every four weeks' },
];
export const YEAR_OPTIONS = YEARS.map((y) => ({ value: y, label: `${P.years[y].label}${y === P.current ? ' (this year)' : ''}` }));
export const isYear = (s: string): s is YearId => (YEARS as string[]).includes(s);
export const isFreq = (s: string): s is Freq => FREQS.some((f) => f.value === s);
export const periodWord = (f: Freq) => (f === 'monthly' ? 'month' : f === 'weekly' ? 'week' : 'pay period');

export function Row({ label, children, strong = false }: { label: string; children: ReactNode; strong?: boolean }) {
  return <tr><td className="py-1.5 pr-3 text-navy-700">{label}</td><td className={`tabular-nums py-1.5 text-right ${strong ? 'font-semibold text-navy-900' : 'font-medium text-navy-900'}`}>{children}</td></tr>;
}
/** £ from pence, always with pence (payslip style). */
export const pp = (pence: number) => `${pence < 0 ? '−' : ''}£${(Math.abs(pence) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
/** £ from pounds, whole. */
export const gb = (pounds: number) => `${pounds < 0 ? '−' : ''}£${Math.round(Math.abs(pounds)).toLocaleString('en-GB')}`;
