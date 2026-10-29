/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/guides';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS_ORDER, groupLabel } from '../i18n/nav';
import params from '../data/params-2026.json';

const words = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function GET() {
  const Y = params.years[params.current as keyof typeof params.years];
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Free UK tax code checker: decodes any PAYE tax code (1257L, BR, D0, D1, 0T, NT, K codes, S and C prefixes, W1/M1/X emergency basis), works out the tax on a payslip with HMRC's cumulative method (Specification for PAYE Tax Table Routines v24.0), estimates the code a situation points to (second job, pension, State Pension, company benefits, Marriage Allowance) and the tax gap over the year, and what comes back after an emergency code. ${Y.label}: Personal Allowance £${Y.personalAllowance.toLocaleString('en-GB')}, emergency code ${Y.emergencyCode}. Also 2027 to 2028 rates from the Budget of 28 October 2026. Independent site, not HMRC. Calculators run in the browser. Published by Radif Partners. Last updated ${words(LAST_UPDATED)}.`,
    '',
    '## Data',
    `- Rates, thresholds and the payroll method read on HMRC and HM Treasury publications on GOV.UK, retrieved ${words(params.retrieved_at)} (Open Government Licence v3.0).`,
    '',
    `- [Tax code checker](${SITE_URL}${route('home', 'en')}): what a code means, the tax-free pay behind it and the tax it takes`,
    '',
    ...GROUPS_ORDER.flatMap((g) => [`## ${groupLabel(g, 'en', false)}`, ...PAGES.filter((p) => p.group === g).map((p) => `- [${p.en.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.en.card}`), '']),
    '## About',
    `- [Method and sources](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
