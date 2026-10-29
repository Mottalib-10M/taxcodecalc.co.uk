/**
 * Emergency tax: pay, frequency, the emergency code, the first pay period and how many pays were
 * taxed on it, then the right code → how much comes back, and in which pay it should appear.
 * lib/engine/situation.ts (emergencyRefund), itself on the payroll engine.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CodeField, PRIVACY, Row, pp } from './kit';
import { parseCode, CURRENT } from '../../lib/engine/paye';
import { emergencyRefund } from '../../lib/engine/situation';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import P from '../../data/params-2026.json';

interface Props { freq?: 'weekly' | 'monthly'; pay?: number; start?: number; periods?: number; emergency?: string; correct?: string; idPrefix?: string; primary?: boolean; methodHref?: string }
const MONTH_NAMES = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
const FREQS = [{ value: 'monthly', label: 'Monthly' }, { value: 'weekly', label: 'Weekly' }];

export default function EmergencyCalc({ freq: f0 = 'monthly', pay: p0 = 2600, start: s0 = 6, periods: k0 = 2, emergency: e0 = 'X', correct: c0 = '1257L', idPrefix = 'em', primary = true, methodHref }: Props) {
  const [freq, setFreq] = useState<'weekly' | 'monthly'>(f0);
  const [pay, setPay] = useState(p0);
  const [start, setStart] = useState(s0);
  const [k, setK] = useState(k0);
  const [em, setEm] = useState(e0);
  const [correct, setCorrect] = useState(c0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    const ff = str(u, 'f', f0); if (ff === 'weekly' || ff === 'monthly') setFreq(ff);
    setPay(num(u, 'pay', p0)); setStart(num(u, 's', s0)); setK(num(u, 'k', k0));
    const ee = str(u, 'e', e0); if (['X', 'BR', '0T'].includes(ee)) setEm(ee);
    const cc = str(u, 'code', c0); if (parseCode(cc).ok) setCorrect(cc.toUpperCase());
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ f: freq, pay, s: start, k, e: em, code: correct }); }, [freq, pay, start, k, em, correct, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const total = freq === 'monthly' ? 12 : 52;
  const basis = freq === 'monthly' ? 'M1' : 'W1';
  const ec = P.years[CURRENT].emergencyCode ?? '1257L';
  const emergency = em === 'X' ? `${ec} ${basis}` : em === 'BR' ? 'BR' : `0T ${basis}`;
  const EMS = [{ value: 'X', label: `${ec} ${basis} (or X, NONCUM)` }, { value: 'BR', label: 'BR (starter checklist C)' }, { value: '0T', label: `0T ${basis}` }];
  const ok = parseCode(correct).ok;
  const r = useMemo(() => (ok ? emergencyRefund({ freq, pay, start, periods: k, emergency, correct }) : null), [ok, freq, pay, start, k, emergency, correct]);
  const when = (p: number) => (freq === 'monthly' ? `${MONTH_NAMES[p - 1]} pay (month ${p})` : `week ${p} pay`);
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-emergency>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <SelectField id={id('f')} label="Paid" value={freq} onChange={touch((v: string) => setFreq(v === 'weekly' ? 'weekly' : 'monthly'))} options={FREQS} />
          <NumberField id={id('pay')} label={`Gross pay each ${freq === 'monthly' ? 'month' : 'week'}`} value={pay} onChange={touch(setPay)} unit="£" max={200000} decimals={2} />
          <SelectField id={id('e')} label="Emergency code used" value={em} onChange={touch(setEm)} options={EMS} />
          <CodeField id={id('code')} label="Code HMRC then sends" value={correct} onChange={touch(setCorrect)} help="Usually 1257L if this is your only job." />
          <NumberField id={id('s')} label={freq === 'monthly' ? 'First pay in tax month' : 'First pay in tax week'} value={start} onChange={touch(setStart)} max={total} help={freq === 'monthly' ? '1 = April, 6 = September, 12 = March.' : '1 = first week from 6 April.'} />
          <NumberField id={id('k')} label="Pays taxed on the emergency code" value={k} onChange={touch(setK)} max={total} />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {r ? <>
            <p className="text-sm font-medium text-navy-700">{r.back >= 0 ? 'Should come back to you' : 'Still to pay'}</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{pp(Math.abs(r.back))}</p>
            <p className="text-sm text-navy-700">{r.switchPeriod ? `In your ${when(r.switchPeriod)}, if the new code reaches payroll by then.` : 'After the end of the tax year: by a P800 letter, or with the first pay of the new year if HMRC updates it in time.'}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-accent-200">
              <Row label={`Tax on ${emergency}`}>{pp(r.onEmergency)}</Row>
              <Row label={`Tax with ${parseCode(correct).text} over the same pays`}>{pp(r.right)}</Row>
              {r.switchRow && <Row label="Tax line on that payslip" strong>{pp(r.switchRow.tax)}</Row>}
            </tbody></table>
          </> : <p className="text-sm text-navy-700">Type a valid code.</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 print:hidden">
            <a href={P.sources.hmrc_check.url} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex h-10 items-center rounded-lg bg-accent-700 px-4 text-sm font-medium text-white hover:bg-accent-800">Check your code with HMRC</a>
            {methodHref && <a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a>}
          </div>
          <p className="mt-2 text-xs text-navy-600">Assumes no other pay earlier in the tax year. With a P45 from an earlier job, the refund depends on the tax already paid there.</p>
        </div>
      </div>
    </div>
  );
}
