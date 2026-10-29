/**
 * "Am I on the right tax code?": one or two jobs or pensions, State Pension, company benefits, job
 * expenses, Marriage Allowance and the month the job started → the codes the situation points to,
 * the tax due for the year and the gap with what the current codes take. lib/engine/situation.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { CodeField, PRIVACY, Row, YEAR_OPTIONS, isYear, pp, gb } from './kit';
import { parseCode, type Region, type YearId } from '../../lib/engine/paye';
import { checkCodes, type MA } from '../../lib/engine/situation';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import P from '../../data/params-2026.json';

interface Props { region?: Region; job1?: number; job2?: number; sp?: number; bik?: number; expenses?: number; ma?: MA; current?: string; idPrefix?: string; primary?: boolean; methodHref?: string }
const REGIONS = [{ value: 'ruk', label: 'England or Northern Ireland' }, { value: 'scot', label: 'Scotland' }, { value: 'wales', label: 'Wales' }];
const MAS = [{ value: 'none', label: 'No' }, { value: 'receive', label: 'Yes, my partner transfers to me' }, { value: 'transfer', label: 'Yes, I transfer to my partner' }];
const MONTHS = ['April (whole year)', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map((m, i) => ({ value: String(12 - i), label: m }));

export default function RightCode({ region: r0 = 'ruk', job1: j10 = 34000, job2: j20 = 0, sp: sp0 = 0, bik: b0 = 0, expenses: e0 = 0, ma: m0 = 'none', current: c0 = '1257L', idPrefix = 'rc', primary = true, methodHref }: Props) {
  const [region, setRegion] = useState<Region>(r0);
  const [job1, setJob1] = useState(j10);
  const [job2, setJob2] = useState(j20);
  const [sp, setSp] = useState(sp0);
  const [bik, setBik] = useState(b0);
  const [exp, setExp] = useState(e0);
  const [ma, setMa] = useState<MA>(m0);
  const [months, setMonths] = useState(12);
  const [cur, setCur] = useState(c0);
  const [cur2, setCur2] = useState('BR');
  const [y, setY] = useState<YearId>(P.current as YearId);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!primary) return;
    const u = readParams(window.location.search);
    const rr = str(u, 'r', r0); if (['ruk', 'scot', 'wales'].includes(rr)) setRegion(rr as Region);
    setJob1(num(u, 'j1', j10)); setJob2(num(u, 'j2', j20)); setSp(num(u, 'sp', sp0)); setBik(num(u, 'bik', b0)); setExp(num(u, 'ex', e0));
    const mm = str(u, 'ma', m0); if (['none', 'receive', 'transfer'].includes(mm)) setMa(mm as MA);
    setMonths(Math.max(1, Math.min(12, num(u, 'm', 12))));
    const cc = str(u, 'code', c0); if (parseCode(cc).ok) setCur(cc.toUpperCase());
    const c2 = str(u, 'code2', 'BR'); if (parseCode(c2).ok) setCur2(c2.toUpperCase());
    const yy = str(u, 'y', y); if (isYear(yy)) setY(yy);
  }, []);
  useEffect(() => { if (primary && touched) updateURL({ r: region, j1: job1, j2: job2 || undefined, sp: sp || undefined, bik: bik || undefined, ex: exp || undefined, ma: ma === 'none' ? undefined : ma, m: months === 12 ? undefined : months, code: cur, code2: job2 ? cur2 : undefined, y }); }, [region, job1, job2, sp, bik, exp, ma, months, cur, cur2, y, touched]);
  const touch = <T,>(f: (v: T) => void) => (v: T) => { setTouched(true); f(v); };
  const id = (s: string) => `${idPrefix}-${s}`;
  const spYear = Math.round(sp * 52 * 100) / 100;
  const ok = parseCode(cur).ok && (!job2 || parseCode(cur2).ok);
  const res = useMemo(() => (ok ? checkCodes({ year: y, region, job1, job2, statePension: spYear, bik, expenses: exp, ma, months }, cur, job2 ? cur2 : undefined) : null), [ok, y, region, job1, job2, spYear, bik, exp, ma, months, cur, cur2]);
  const gap = res ? res.gap : 0;
  const near = Math.abs(gap) < 2000;
  return (
    <div className="not-prose rounded-xl border border-accent-200 bg-white p-4 sm:p-5" data-rightcode>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          <CodeField id={id('code')} label="Code on your main job or pension" value={cur} onChange={touch(setCur)} />
          <NumberField id={id('j1')} label="Yearly pay from it" value={job1} onChange={touch(setJob1)} unit="£" max={1000000} />
          <NumberField id={id('j2')} label="Second job or workplace pension, yearly" value={job2} onChange={touch(setJob2)} unit="£" max={1000000} help="0 if you have only one." />
          {job2 > 0 ? <CodeField id={id('code2')} label="Code on the second one" value={cur2} onChange={touch(setCur2)} /> : <SelectField id={id('r')} label="You live in" value={region} onChange={touch((v: string) => setRegion(v as Region))} options={REGIONS} />}
          {job2 > 0 && <SelectField id={id('r2')} label="You live in" value={region} onChange={touch((v: string) => setRegion(v as Region))} options={REGIONS} />}
          <NumberField id={id('sp')} label="State Pension each week" value={sp} onChange={touch(setSp)} unit="£" max={2000} decimals={2} help="0 if none: it is paid without tax taken off." />
          <NumberField id={id('bik')} label="Company benefits, yearly value" value={bik} onChange={touch(setBik)} unit="£" max={200000} help="Car, fuel, medical insurance taxed through your code." />
          <NumberField id={id('ex')} label="Job expenses with tax relief" value={exp} onChange={touch(setExp)} unit="£" max={100000} help="Uniform, professional fees, mileage gap." />
          <SelectField id={id('ma')} label="Marriage Allowance" value={ma} onChange={touch((v: string) => setMa(v as MA))} options={MAS} />
          <SelectField id={id('m')} label="Main job started in" value={String(months)} onChange={touch((v: string) => setMonths(Number(v)))} options={MONTHS} help="No other pay earlier in the tax year." />
          <SelectField id={id('y')} label="Tax year" value={y} onChange={touch((v: string) => isYear(v) && setY(v))} options={YEAR_OPTIONS} />
          <p className="text-xs text-navy-600 sm:col-span-2">{PRIVACY}</p>
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-accent-50 p-4">
          {res ? <>
            <p className="text-sm font-medium text-navy-700">Your situation points to</p>
            <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{res.expected.main}{res.expected.second && job2 ? <span className="text-2xl"> + {res.expected.second}</span> : null}</p>
            <p className="text-sm text-navy-700">{near ? 'Your current code takes about the right tax for the year.' : gap > 0 ? `Your current code takes about ${pp(gap)} too much this year.` : `Your current code takes about ${pp(-gap)} too little this year.`}</p>
            <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-accent-200">
              <Row label="Tax due for the year" strong>{pp(res.liability.tax)}</Row>
              <Row label={`Taken with ${cur}${job2 ? ' + ' + cur2 : ''}`}>{pp(res.paidCurrent)}</Row>
              <Row label="Taken with the expected code">{pp(res.paidExpected)}</Row>
              <Row label="Personal Allowance">{gb(res.liability.pa)}</Row>
              {spYear > 0 && <Row label="State Pension for the year">{gb(spYear)}</Row>}
            </tbody></table>
            {res.expected.note && <p className="mt-2 text-xs text-navy-700">{res.expected.note}</p>}
            {res.liability.fallback && <p className="mt-2 text-xs font-medium text-amber-800">{region === 'scot' ? 'Scottish' : 'Welsh'} rates for {P.years[y].label} are not published yet: {res.liability.scaleYear} rates are used until they are.</p>}
          </> : <p className="text-sm text-navy-700">Type valid codes to compare.</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 print:hidden">
            <a href={P.sources.hmrc_check.url} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex h-10 items-center rounded-lg bg-accent-700 px-4 text-sm font-medium text-white hover:bg-accent-800">Update your details with HMRC</a>
            {methodHref && <a href={methodHref} className="text-sm text-navy-700 underline">How this is worked out</a>}
          </div>
          <p className="mt-2 text-xs text-navy-600">Estimate on employment and pension income only. HMRC sets your code from its own records; savings, property and other income can change it.</p>
        </div>
      </div>
    </div>
  );
}
