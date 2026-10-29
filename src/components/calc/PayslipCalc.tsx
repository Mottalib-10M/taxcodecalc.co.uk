/**
 * Tax taken each pay period: code, pay, frequency and period number → the tax on this payslip by
 * HMRC's cumulative method (free pay to date, taxable pay to date, tax due to date minus tax already
 * paid), with the 50 % limit and the week 1 / month 1 figure for comparison. lib/engine/paye.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CodeField, FREQS, PRIVACY, Row, YEAR_OPTIONS, isFreq, isYear, periodWord, pp } from './kit';
import { parseCode, runPayroll, PERIODS, type Freq, type YearId } from '../../lib/engine/paye';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import P from '../../data/params-2026.json';

interface Props { code?: string; pay?: number; freq?: Freq; period?: number; idPrefix?: string; primary?: boolean; methodHref?: string }

export default function PayslipCalc({ code: c0 = '1257L', pay: p0 = 2800, freq: f0 = 'monthly', period: n0 = 7, idPrefix = 'ps', primary = true, methodHref }: Props) {
  const [code, setCode] = useState(c0);
  const [pay, setPay] = useState(p0);
  const [freq, setFreq] = useState<Freq>(f0);
  const [n, setN] = useState(n0);
  const [y, setY] = useState<YearId>(P.current as YearId);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    const cc = str(u, 'code', c0); if (parseCode(cc).ok) setCode(cc.toUpperCase());
    const ff = str(u, 'f', f0); if (isFreq(ff)) setFreq(ff);
    setPay(num(u, 'pay', p0)); setN(num(u, 'n', n0)); const yy = str(u, 'y', y); if (isYear(yy)) setY(yy);
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ code, pay, f: freq, n, y }); }, [code, pay, freq, n, y, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const max = PERIODS[freq];
  const p = Math.max(1, Math.min(max, Math.round(n || 1)));
  const c = useMemo(() => parseCode(code), [code]);
  const rows = useMemo(() => (c.ok ? runPayroll({ code: c, year: y, freq, pays: Array.from({ length: p }, () => pay) }) : []), [c, y, freq, p, pay]);
  const r = rows[rows.length - 1];
  const paidBefore = rows.slice(0, -1).reduce((t, x) => t + x.tax, 0);
  const alt = useMemo(() => {
    if (!c.ok || c.kind === 'BR' || c.kind === 'D' || c.kind === 'NT') return null;
    const other = parseCode(c.nonCum ? code.replace(/\s*(W1|M1|X|NONCUM)$/i, '') : `${c.text} ${freq === 'monthly' ? 'M1' : 'W1'}`);
    const rr = runPayroll({ code: other, year: y, freq, pays: Array.from({ length: p }, () => pay) });
    return rr.length ? { label: other.text, tax: rr[rr.length - 1].tax } : null;
  }, [c, code, y, freq, p, pay]);
  const w = periodWord(freq);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-payslip>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <CodeField id={id('code')} label="Tax code on the payslip" value={code} onChange={touch(setCode)} />
          <SelectField id={id('f')} label="Paid" value={freq} onChange={touch((v: string) => isFreq(v) && setFreq(v))} options={FREQS} />
          <NumberField id={id('pay')} label={`Gross pay each ${w}`} value={pay} onChange={touch(setPay)} unit="£" max={500000} decimals={2} help="Before tax, after pension contributions taken under net pay." />
          <NumberField id={id('n')} label={freq === 'monthly' ? 'Tax month (1 = April pay day)' : 'Pay period number'} value={n} onChange={touch(setN)} max={max} help={`1 to ${max}; the same pay is assumed in every earlier period.`} />
          <SelectField id={id('y')} label="Tax year" value={y} onChange={touch((v: string) => isYear(v) && setY(v))} options={YEAR_OPTIONS} className="sm:col-span-2" />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {r ? <>
            <p className="text-sm font-medium text-navy-700">Tax on this payslip ({w} {p})</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{pp(r.tax)}</p>
            <p className="text-sm text-navy-700">{r.tax < 0 ? 'A refund: more tax was paid earlier than is due to date.' : c.nonCum ? 'Worked out on this pay alone.' : 'Tax due to date minus tax already paid.'}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-accent-200">
              <Row label="Pay to date">{pp(c.nonCum ? r.pay : r.payToDate)}</Row>
              {r.allowanceToDate !== 0 && <Row label={r.allowanceToDate > 0 ? 'Free pay to date' : 'Additional pay to date (K)'}>{pp(Math.abs(r.allowanceToDate))}</Row>}
              <Row label="Taxable pay to date">{pp(Math.max(0, r.taxable))}</Row>
              <Row label="Tax due to date">{pp(r.taxDueToDate)}</Row>
              {!c.nonCum && <Row label="Tax already paid">{pp(paidBefore)}</Row>}
              {r.heldBack > 0 && <Row label="Not taken (50% limit)">{pp(r.heldBack)}</Row>}
              {alt && <Row label={`With ${alt.label}`}>{pp(alt.tax)}</Row>}
            </tbody></table>
          </> : <p className="text-sm text-navy-700">Type a valid code to see the tax.</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 print:hidden">
            {methodHref && <a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a>}
          </div>
          <p className="mt-2 text-xs text-navy-600">HMRC’s cumulative method for {P.years[y].label}. A real payslip can differ if your pay changed during the year or a past employer’s figures were used.</p>
        </div>
      </div>
    </div>
  );
}
