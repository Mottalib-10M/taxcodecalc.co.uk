/** Mini-tools (RECETTE §9.3). Each subject is described once in `lib/mini-specs.ts`. */
export interface MiniInput {
  id: string; label: string;
  /** default value; for a date input, the day number of an example date (dayNum('2026-03-02')) */
  def: number;
  unit?: string; max?: number; decimals?: number; help?: string;
  options?: Array<{ value: string; label: string }>;
  /** date field (value = day number since 1970-01-01, UTC) */
  date?: boolean;
}
export interface MiniOut { head: [string, string]; rows: Array<[string, string]>; note?: string }
export interface MiniSpec { title: string; cta: string; ctaPage?: string; inputs: MiniInput[]; run: (v: Record<string, number>) => MiniOut }
