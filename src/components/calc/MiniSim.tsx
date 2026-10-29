/**
 * Page mini-tool (RECETTE §9.3): one to three fields, the figure of the page's subject in large type,
 * two to four lines of detail and a link to the full tool. Figures come from the site's engines
 * through `lib/mini-specs.ts`. First render = build defaults (§17.5); `data-chrome`: the widget's
 * labels count neither in words nor in page comparison.
 */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { getSpec } from '../../lib/mini-specs';
import { dayNum, isoOf } from '../../lib/engine/dates';

interface Props { kind: string; href?: string; defaults?: Record<string, number>; primary?: boolean; idPrefix?: string }

export default function MiniSim({ kind, href, defaults = {}, primary = false, idPrefix = 'm' }: Props) {
  const spec = getSpec(kind);
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(spec.inputs.map((i) => [i.id, defaults[i.id] ?? i.def])));
  const out = useMemo(() => spec.run(v), [v, spec]);
  const set = (id: string) => (x: number) => setV((o) => ({ ...o, [id]: x }));
  const fid = (i: string) => `${idPrefix}-${kind}-${i}`;
  const inputCls = 'h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
  return (
    <div data-chrome data-mini={kind} className={`not-prose rechner-mini rounded-xl border border-accent-200 bg-white p-4 sm:p-5 ${primary ? 'my-2' : 'my-8'}`}>
      <p className="text-base font-semibold text-navy-900">{spec.title}</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <form className="grid content-start gap-3" onSubmit={(e) => e.preventDefault()} {...(primary ? {} : { 'data-simulateur-secondaire': '' })}>
          {spec.inputs.map((i) => i.date
            ? <div key={i.id} className="grid min-w-0 grid-rows-subgrid row-span-3 content-start gap-y-0"><label htmlFor={fid(i.id)} className="mb-1 block text-sm font-medium text-navy-700">{i.label}</label><input id={fid(i.id)} type="date" value={isoOf(v[i.id])} onChange={(e) => { if (/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) set(i.id)(dayNum(e.target.value)); }} className={inputCls} />{i.help ? <p className="mt-1 text-xs text-navy-500">{i.help}</p> : <span />}</div>
            : i.options
            ? <SelectField key={i.id} id={fid(i.id)} label={i.label} value={String(v[i.id])} onChange={(x) => set(i.id)(Number(x))} options={i.options} help={i.help} />
            : <NumberField key={i.id} id={fid(i.id)} label={i.label} value={v[i.id]} onChange={set(i.id)} unit={i.unit} max={i.max} decimals={i.decimals} help={i.help} />)}
        </form>
        <div aria-live="polite" {...(primary ? { 'data-resultat': '' } : {})} className="rounded-lg bg-navy-50 p-4">
          <p className="text-sm font-medium text-navy-600">{out.head[0]}</p>
          <p className="tabular-nums mt-1 text-3xl font-bold text-navy-900">{out.head[1]}</p>
          <table className="mt-3 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {out.rows.map(([l, x]) => <tr key={l}><td className="py-1.5 pr-3 text-navy-600">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
          </tbody></table>
          {out.note && <p className="mt-2 text-xs text-navy-600">{out.note}</p>}
        </div>
      </div>
      {href && spec.cta && <a href={href} className="mt-4 inline-block text-sm font-medium text-accent-700 hover:underline">{spec.cta} →</a>}
    </div>
  );
}
