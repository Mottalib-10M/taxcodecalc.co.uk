/**
 * K code: the K number, pay and frequency → the amount added to pay, the tax worked out on it, the
 * 50 % limit and what is carried to later pays. lib/engine/paye.ts (runPayroll, regulatory limit).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { FREQS, PRIVACY, Row, isFreq, periodWord, pp, gb } from './kit';
import { parseCode, runPayroll, periodAllowance, PERIODS, type Freq, type Region } from '../../lib/engine/paye';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { k?: number; pay?: number; freq?: Freq; idPrefix?: string; primary?: boolean; methodHref?: string }
const REGIONS = [{ value: 'ruk', label: 'K (England, Northern Ireland)' }, { value: 'scot', label: 'SK (Scotland)' }, { value: 'wales', label: 'CK (Wales)' }];

export default function KCodeCalc({ k: k0 = 475, pay: p0 = 1500, freq: f0 = 'monthly', idPrefix = 'kc', primary = true, methodHref }: Props) {
  const [k, setK] = useState(k0);
  const [pay, setPay] = useState(p0);
  const [freq, setFreq] = useState<Freq>(f0);
  const [region, setRegion] = useState<Region>('ruk');
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    setK(num(u, 'k', k0)); setPay(num(u, 'pay', p0)); const ff = str(u, 'f', f0); if (isFreq(ff)) setFreq(ff);
    const rr = str(u, 'r', 'ruk'); if (['ruk', 'scot', 'wales'].includes(rr)) setRegion(rr as Region);
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ k, pay, f: freq, r: region === 'ruk' ? undefined : region }); }, [k, pay, freq, region, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const kk = Math.max(1, Math.round(k || 1));
  const code = parseCode(`${region === 'scot' ? 'S' : region === 'wales' ? 'C' : ''}K${kk}`);
  const table = freq === 'monthly' ? 12 : 52;
  const wk = freq === 'fortnightly' ? 2 : freq === 'fourweekly' ? 4 : 1;
  const add = periodAllowance(kk, table) * wk;
  const rows = useMemo(() => runPayroll({ code, freq, pays: Array.from({ length: PERIODS[freq] }, () => pay) }), [code.text, freq, pay]);
  const first = rows[0];
  const year = rows.reduce((t, r) => t + r.tax, 0);
  const held = rows[rows.length - 1] ? rows[rows.length - 1].taxDueToDate - year : 0;
  const w = periodWord(freq);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-kcode>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <NumberField id={id('k')} label="Number after the K" value={k} onChange={touch(setK)} max={99999} help="K475 → 475." />
          <SelectField id={id('r')} label="Code" value={region} onChange={touch((v: string) => setRegion(v as Region))} options={REGIONS} />
          <NumberField id={id('pay')} label={`Gross pay each ${w}`} value={pay} onChange={touch(setPay)} unit="£" max={200000} decimals={2} />
          <SelectField id={id('f')} label="Paid" value={freq} onChange={touch((v: string) => isFreq(v) && setFreq(v))} options={FREQS} />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {first ? <>
            <p className="text-sm font-medium text-navy-700">Tax each {w} with {code.text}</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{pp(first.tax)}</p>
            <p className="text-sm text-navy-700">{first.heldBack > 0 ? `Capped at half your pay: ${pp(first.heldBack)} is not taken this ${w}.` : `${gb(kk * 10)} a year is added to your pay before tax.`}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-accent-200">
              <Row label={`Added to pay each ${w}`}>{pp(add)}</Row>
              <Row label="Taxable pay">{pp(Math.round(pay * 100) + add)}</Row>
              <Row label="Half of the pay (limit)">{pp(Math.floor(Math.round(pay * 100) / 2))}</Row>
              <Row label="Tax over the year" strong>{pp(year)}</Row>
              {held > 0 && <Row label="Not collected by the end of the year">{pp(held)}</Row>}
            </tbody></table>
          </> : null}
          {methodHref && <div className="mt-3 print:hidden"><a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a></div>}
          <p className="mt-2 text-xs text-navy-600">Tax the limit stops at the end of the year is a matter between you and HMRC: it is not carried on your P60.</p>
        </div>
      </div>
    </div>
  );
}
