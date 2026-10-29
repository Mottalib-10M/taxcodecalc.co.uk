/**
 * Tax code decoder (home): a code as printed on a payslip or P2 notice → the tax-free amount behind
 * it, what each letter means, cumulative or emergency basis, the rates it applies, and the tax it
 * takes from a given pay compared with 1257L. Everything comes from lib/engine/paye.ts.
 * First render = build defaults (RECETTE §17.5); the shared link is applied after mount.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CodeField, PRIVACY, Row, YEAR_OPTIONS, isYear, pp, gb } from './kit';
import { parseCode, codeAllowance, periodAllowance, yearTax, flatRate, scaleOrLatest, LETTERS, REGION_NAME, type YearId, type Code } from '../../lib/engine/paye';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import P from '../../data/params-2026.json';

interface Props { code?: string; pay?: number; idPrefix?: string; primary?: boolean; methodHref?: string }

export function describe(c: Code, y: YearId): { head: string; value: string; lines: string[] } {
  const rates = REGION_NAME[c.region];
  const basis = c.nonCum ? `Emergency basis (${c.basis}): each pay is taxed on its own, as if it were the first of the year` : 'Cumulative: allowance and bands build up through the tax year, so over- or under-payments correct themselves';
  if (c.kind === 'NT') return { head: 'Tax taken on this income', value: 'None', lines: ['NT means no tax is taken from this job or pension, whatever the pay.', basis] };
  if (c.kind === 'BR' || c.kind === 'D') {
    const r = flatRate(c, y);
    const what = c.kind === 'BR' ? 'basic' : scaleOrLatest(y, c.region).s.names[scaleOrLatest(y, c.region).s.basic + 1 + c.d];
    return { head: 'Tax-free amount from this job', value: '£0', lines: [`Every pound from this job is taxed at ${r}% (the ${what} rate), with no Personal Allowance: usually a second job or pension.`, `${rates}`, basis] };
  }
  const a = codeAllowance(c);
  if (c.kind === 'K') return { head: 'Amount added to your taxable pay', value: gb(-a) + ' a year', lines: [`K${c.num}: HMRC adds ${gb(-a)} to your pay before tax is worked out, to collect tax on income or benefits that are more than your allowance.`, `No more than half of each pay can be taken in tax (the 50% limit).`, rates, basis] };
  const letter = LETTERS[c.letter] ?? '';
  return { head: 'Tax-free pay from this job', value: gb(a) + ' a year', lines: [c.num === 0 ? 'No tax-free allowance on this job: 0T taxes all of it at the normal bands.' : `${c.num} × 10 = ${gb(a)}, and the letter ${c.letter} means ${letter}.`, rates, basis] };
}

export default function Decoder({ code: c0 = '1257L', pay: p0 = 32000, idPrefix = 'dc', primary = true, methodHref }: Props) {
  const [code, setCode] = useState(c0);
  const [pay, setPay] = useState(p0);
  const [y, setY] = useState<YearId>(P.current as YearId);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    const cc = str(u, 'code', c0); if (parseCode(cc).ok) setCode(cc.toUpperCase());
    setPay(num(u, 'pay', p0)); const yy = str(u, 'y', y); if (isYear(yy)) setY(yy);
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ code, pay, y }); }, [code, pay, y, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const c = useMemo(() => parseCode(code), [code]);
  const d = c.ok ? describe(c, y) : null;
  const monthly = c.ok && (c.kind === 'suffix' || c.kind === 'K') ? periodAllowance(c.num, 12) : 0;
  const taxYear = c.ok ? yearTax(c, 'monthly', pay / 12, y) : 0;
  const std = yearTax(c.ok && c.region === 'scot' ? 'S1257L' : c.ok && c.region === 'wales' ? 'C1257L' : '1257L', 'monthly', pay / 12, y);
  const fb = c.ok ? scaleOrLatest(y, c.region) : null;
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-decoder>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <CodeField id={id('code')} label="Your tax code" value={code} onChange={touch(setCode)} help="As on your payslip, P2 notice or HMRC app, e.g. 1257L, BR, K475, S1257L M1." className="sm:col-span-2" />
          <NumberField id={id('pay')} label="Yearly pay from this job" value={pay} onChange={touch(setPay)} unit="£" max={1000000} />
          <SelectField id={id('y')} label="Tax year" value={y} onChange={touch((v: string) => isYear(v) && setY(v))} options={YEAR_OPTIONS} />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {d ? <>
            <p className="text-sm font-medium text-navy-700">{d.head}</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{d.value}</p>
            <ul className="mt-2 space-y-1 text-sm text-navy-800">{d.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-accent-200">
              {monthly > 0 && <Row label={c.kind === 'K' ? 'Added to pay each month' : 'Tax-free pay each month'}>{pp(monthly)}</Row>}
              <Row label={`Tax over the year on ${gb(pay)}`} strong>{pp(taxYear)}</Row>
              <Row label="That is, each month">{pp(Math.round(taxYear / 12))}</Row>
              <Row label={`With ${c.region === 'scot' ? 'S1257L' : c.region === 'wales' ? 'C1257L' : '1257L'} instead`}>{pp(std)}</Row>
            </tbody></table>
            {fb?.fallback && <p className="mt-2 text-xs font-medium text-amber-800">{c.region === 'scot' ? 'Scottish' : 'Welsh'} rates for {P.years[y].label} are not published yet: {fb.year} rates are used until they are.</p>}
          </> : <p className="text-sm text-navy-700">Type a code to see what it means.</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 print:hidden">
            <a href={P.sources.hmrc_check.url} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex h-10 items-center rounded-lg bg-accent-700 px-4 text-sm font-medium text-white hover:bg-accent-800">Check or correct it with HMRC</a>
            {methodHref && <a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a>}
          </div>
          <p className="mt-2 text-xs text-navy-600">Estimate with HMRC’s payroll method and the same pay every month. Only HMRC can change your code.</p>
        </div>
      </div>
    </div>
  );
}
