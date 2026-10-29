/** Small shared pieces of the site's tools: a date field with the same look as SelectField. */
export const inputCls = 'h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';
export const isIso = (s: string | null | undefined): s is string => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
interface DateProps { id: string; label: string; value: string; onChange: (v: string) => void; help?: string }
export function DateField({ id, label, value, onChange, help }: DateProps) {
  return (
    <div className="grid min-w-0 grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} onChange={(e) => { if (isIso(e.target.value)) onChange(e.target.value); }} className={inputCls} />
      {help ? <p className="mt-1 text-xs text-navy-500">{help}</p> : <span />}
    </div>
  );
}
export const PRIVACY = 'Everything you enter stays in this browser: nothing is sent or stored.';
