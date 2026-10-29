/**
 * Two tax codes side by side: the same pay through code A and code B → tax each pay and over the
 * year, and the difference. lib/engine/paye.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CodeField, FREQS, PRIVACY, Row, isFreq, periodWord, pp, gb } from './kit';
import { parseCode, yearTax, periodTax, codeAllowance, PERIODS, type Freq } from '../../lib/engine/paye';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { a?: string; b?: string; pay?: number; freq?: Freq; idPrefix?: string; primary?: boolean; methodHref?: string }

export default function CompareCodes({ a: a0 = '1257L', b: b0 = 'BR', pay: p0 = 36000, freq: f0 = 'monthly', idPrefix = 'cc', primary = true, methodHref }: Props) {
  const [a, setA] = useState(a0);
  const [b, setB] = useState(b0);
  const [pay, setPay] = useState(p0);
  const [freq, setFreq] = useState<Freq>(f0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    const aa = str(u, 'a', a0); if (parseCode(aa).ok) setA(aa.toUpperCase());
    const bb = str(u, 'b', b0); if (parseCode(bb).ok) setB(bb.toUpperCase());
    setPay(num(u, 'pay', p0)); const ff = str(u, 'f', f0); if (isFreq(ff)) setFreq(ff);
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ a, b, pay, f: freq }); }, [a, b, pay, freq, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const ca = useMemo(() => parseCode(a), [a]);
  const cb = useMemo(() => parseCode(b), [b]);
  const per = pay / PERIODS[freq];
  const ya = ca.ok ? yearTax(ca, freq, per) : 0;
  const yb = cb.ok ? yearTax(cb, freq, per) : 0;
  const fa = ca.ok ? periodTax(ca, freq, per, 1)!.tax : 0;
  const fb = cb.ok ? periodTax(cb, freq, per, 1)!.tax : 0;
  const diff = yb - ya;
  const w = periodWord(freq);
  const allow = (c: typeof ca) => (c.kind === 'suffix' || c.kind === 'K' ? gb(codeAllowance(c)) : c.kind === 'NT' ? 'no tax' : 'none');
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-compare>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <CodeField id={id('a')} label="Code A" value={a} onChange={touch(setA)} />
          <CodeField id={id('b')} label="Code B" value={b} onChange={touch(setB)} />
          <NumberField id={id('pay')} label="Yearly pay from this job" value={pay} onChange={touch(setPay)} unit="£" max={1000000} />
          <SelectField id={id('f')} label="Paid" value={freq} onChange={touch((v: string) => isFreq(v) && setFreq(v))} options={FREQS} />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {ca.ok && cb.ok ? <>
            <p className="text-sm font-medium text-navy-700">{diff === 0 ? 'Both codes take the same tax' : `${cb.text} takes ${diff > 0 ? 'more' : 'less'} over the year`}</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{pp(Math.abs(diff))}</p>
            <table className="mt-3 w-full text-sm"><thead><tr><th className="py-1 text-left font-medium text-navy-600"></th><th className="py-1 text-right font-medium text-navy-600">{ca.text}</th><th className="py-1 text-right font-medium text-navy-600">{cb.text}</th></tr></thead><tbody className="divide-y divide-accent-200">
              <tr><td className="py-1.5 pr-2 text-navy-700">Tax-free amount</td><td className="tabular-nums py-1.5 text-right">{allow(ca)}</td><td className="tabular-nums py-1.5 text-right">{allow(cb)}</td></tr>
              <tr><td className="py-1.5 pr-2 text-navy-700">Tax, first {w}</td><td className="tabular-nums py-1.5 text-right">{pp(fa)}</td><td className="tabular-nums py-1.5 text-right">{pp(fb)}</td></tr>
              <tr><td className="py-1.5 pr-2 text-navy-700">Tax over the year</td><td className="tabular-nums py-1.5 text-right font-semibold">{pp(ya)}</td><td className="tabular-nums py-1.5 text-right font-semibold">{pp(yb)}</td></tr>
              <tr><td className="py-1.5 pr-2 text-navy-700">Take-home after tax</td><td className="tabular-nums py-1.5 text-right">{gb(pay - ya / 100)}</td><td className="tabular-nums py-1.5 text-right">{gb(pay - yb / 100)}</td></tr>
            </tbody></table>
          </> : <p className="text-sm text-navy-700">Type two valid codes.</p>}
          {methodHref && <div className="mt-3 print:hidden"><a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a></div>}
          <p className="mt-2 text-xs text-navy-600">Same pay every {w}, HMRC’s cumulative method, Income Tax only (no National Insurance).</p>
        </div>
      </div>
    </div>
  );
}
