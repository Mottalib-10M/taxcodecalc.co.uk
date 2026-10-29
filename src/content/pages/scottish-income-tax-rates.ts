import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'scottish-income-tax-rates', group: 'rules', order: 5,
  tool: { kind: 'rightcode', props: { region: 'scot', job1: 40000, current: 'S1257L' } },
  mini: { kind: 'mini:scotland', props: { pay: 40000 } },
  related: ['s1257l-tax-code', 'scottish-tax-codes', 'tax-code-2026-27', 'tax-code-2027-28', 'welsh-income-tax-rates'],
  sources: ['gov_scot', 'employer_2627', 'employer_2526', 'gov_scot_news', 'paye_spec', 'p9x_2026', 'gov_marriage'],
  en: {
    slug: 'scottish-income-tax-rates', nav: 'Scottish rates', card: 'Six Scottish bands from 19% to 48%, the gross thresholds for 2026/27 and how S codes apply them.',
    title: 'Scottish Income Tax Rates 2026/27: Bands and Tax Codes',
    description: 'Scottish Income Tax 2026/27: six rates from 19% to 48%, the gross pay where each band starts, the change from 2025/26, S tax codes and the 2027/28 rates date.',
    h1: 'Scottish Income Tax rates',
    intro: 'The six Scottish bands on wages and pensions, where each one starts in gross pay, and how the S at the start of your code applies them.',
    resume: (h) => {
      const s = h.sc('scot');
      const e = h.bandEdges('scot');
      const Y = h.Y();
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      return `Scottish taxpayers pay Income Tax on wages and pensions at six rates in ${Y.label}: ${s.names.map((n, i) => `${n} ${s.rates[i]}%`).join(', ')}. With the standard Personal Allowance of ${h.gbp(Y.personalAllowance)}, the starter rate runs up to ${h.gbp(e[0])} of gross income, the basic rate to ${h.gbp(e[1])}, the intermediate rate to ${h.gbp(e[2])}, the higher rate to ${h.gbp(e[3])} and the advanced rate to ${h.gbp(top)}, above which the top rate applies. Payroll knows to use these bands because your code starts with S, as in S1257L. Savings interest and dividends are taxed at the same rates as in the rest of the UK. Compared with England, someone on S1257L pays slightly less up to about ${h.gbp(e[1] + s.bands[0])} and more above it: on ${h.gbp(40000)}, ${h.pence(h.taxYear('S1257L', 40000))} against ${h.pence(h.taxYear('1257L', 40000))}. Rates for ${h.Y('2027-28').label} come with the Scottish Budget on ${h.date(h.Y('2027-28').scotExpected as string)}.`;
    },
    faqs: (h) => [
      { q: 'Who counts as a Scottish taxpayer for Income Tax?', a: 'Anyone whose main home is in Scotland. Your main home is normally the home you live in and spend most of your time in, owned or rented. If you move during the tax year, you are Scottish for the whole year when you lived in Scotland longer than anywhere else in the UK. Without a fixed home, the days spent in Scotland, counted by where you were at midnight, decide. Members of the Scottish Parliament also pay it.' },
      { q: 'Which Scottish tax codes start with S, and which never do?', a: `Codes for Scottish taxpayers carry an S: S1257L, SBR at ${h.sc('scot').rates[1]}%, SD0 at ${h.sc('scot').rates[2]}% up to SD3 at ${h.sc('scot').rates[5]}%, S0T and SK codes. Two codes never take the prefix: NT, because there is no SNT, and the emergency code ${h.Y().emergencyCode}, which has a single version for the whole UK.` },
      { q: 'Are Scottish Income Tax rates for 2027/28 published yet?', a: `Not yet. The Scottish Government announced on 28 October 2026 that the Scottish Budget, which sets the rates and bands for the year from 6 April 2027, will be published on ${h.date(h.Y('2027-28').scotExpected as string)}. The UK Personal Allowance of ${h.gbp(h.Y('2027-28').personalAllowance)} for that year is already confirmed and applies in Scotland too.` },
      { q: 'What if HMRC still has an English address for me after moving to Scotland?', a: 'Your code may lack the S and you would be taxed at the wrong rates. You must tell HMRC about the new address. Once HMRC changes your status, the Scottish rates are backdated to 6 April of the year of your move, and your employer or pension provider corrects the tax over the rest of the year.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const Y0 = h.Y('2025-26');
      const s = h.sc('scot');
      const e = h.bandEdges('scot');
      const e0 = h.bandEdges('scot', '2025-26');
      const pa = Y.personalAllowance;
      const top = Y.incomeLimit + 2 * pa;
      const cap = (x: string) => x[0].toUpperCase() + x.slice(1);
      const band = (ed: number[], i: number) => (i < 5 ? `${h.gbp(i === 0 ? pa + 1 : ed[i - 1] + 1)} to ${h.gbp(i < 4 ? ed[i] : top)}` : `over ${h.gbp(top)}`);
      const rows = s.names.map((n, i) => [cap(n), `${s.rates[i]}%`, i < 5 ? h.gbp(s.bands[i]) : 'no limit', band(e, i), band(e0, i)]);
      const pays = [18000, 25000, 33000, 40000, 55000, 80000];
      const cmp = pays.map((p) => { const a = h.taxYear('S1257L', p), b = h.taxYear('1257L', p); return [h.gbp(p), h.pence(a), h.pence(b), `${a >= b ? '+' : '−'}${h.pence(Math.abs(a - b))}`]; });
      return `
<h2>The six bands in gross pay</h2>
<p>HMRC's ${h.src('employer_2627', 'rates for employers')} list each Scottish band as an amount above the Personal Allowance. Most people think in salary, so the table converts them into gross yearly income with the standard allowance, next to the ${Y0.label} thresholds. The allowance and its taper above ${h.gbp(Y.incomeLimit)} are set for the whole UK; Scotland sets only the rates and the band widths.</p>
${h.table(['Band', 'Rate', 'Width above the allowance', `Gross income, ${Y.label}`, `Gross income, ${Y0.label}`], rows, `Sources: ${h.src('gov_scot', 'GOV.UK, Scottish Income Tax')} and ${h.src('employer_2526', 'employer rates 2025 to 2026')}.`, ['l', 'r', 'r', 'l', 'l'])}
<p>The changes for ${Y.label} sit at the bottom of the scale. The starter band widened from ${h.gbp(h.sc('scot', '2025-26').bands[0])} to ${h.gbp(s.bands[0])} and the basic band now ends at ${h.gbp(e[1])} rather than ${h.gbp(e0[1])}. From the higher rate upwards, nothing moved: ${s.rates[3]}% from ${h.gbp(e[2] + 1)}, ${s.rates[4]}% from ${h.gbp(e[3] + 1)} and ${s.rates[5]}% above ${h.gbp(top)}.</p>

<h2>Scotland against the rest of the UK</h2>
<p>The starter rate saves one percentage point on the first slice of taxable income, and the intermediate rate costs one point on income above the basic band. The two cancel out at roughly ${h.gbp(e[1] + s.bands[0])} of gross pay. Above ${h.gbp(e[2])}, the gap widens quickly, because the Scottish higher rate of ${s.rates[3]}% starts well before the ${h.gbp(h.bandEdges('ruk')[0])} threshold used in England, Wales and Northern Ireland.</p>
${h.table(['Yearly pay', 'S1257L', '1257L', 'Difference'], cmp, `Income Tax for ${Y.label} with equal monthly pay, worked with HMRC's ${h.src('paye_spec', 'payroll routines')}.`, ['l', 'r', 'r', 'r'])}
<!--tool:mini:scotland|{"pay":55000}-->
<p>The higher threshold also matters for ${h.src('gov_marriage', 'Marriage Allowance')}: in Scotland the partner who receives it must pay no more than the intermediate rate, which usually means income up to ${h.gbp(h.R.scotMaRecipientMax)}.</p>

<h2>How the S code applies the rates</h2>
<p>The S tells payroll software to switch to the Scottish band table; the number and letter work exactly as elsewhere, so S1257L gives the same ${h.pence(h.freePay(1257, 12))} of free pay a month as 1257L. A second job is usually coded SBR, which taxes all of it at the Scottish basic rate of ${s.rates[1]}%, or SD0, SD1, SD2 and SD3 when your main pay already reaches the intermediate, higher, advanced or top band. The ${h.a('scottish-tax-codes', 'Scottish codes page')} lists them all.</p>
<p>If your status changes during the year, payroll keeps your pay and tax to date and simply continues the cumulative calculation with the Scottish bands from that point, so the year evens out. Payments made after you have left a job and received a P45 are taxed on S0T if your code had an S, as set out in HMRC's ${h.src('p9x_2026', 'P9X notice')}. The emergency code, on the other hand, never has an S, so someone on ${Y.emergencyCode} M1 who lives in Scotland is taxed at the rates used for England and Northern Ireland until HMRC issues the proper code.</p>

<h2>Who pays and what comes next</h2>
<p>Scottish Income Tax applies to people who live in Scotland. With a home in Scotland and another elsewhere in the UK, what counts is your main home: usually where you spend most of your time, but it can be the other one if that is where your possessions are, where your family lives, or where you are registered with a bank or a GP. Mobile workers, students and people with no fixed home compare the days they spent in Scotland with the days elsewhere, counting where they were at midnight. If your code lacks the S, or has one it should not, check your address in your ${h.src('hmrc_check', 'HMRC online account')}.</p>
<p>For the year from 6 April 2027, the ${h.src('gov_scot_news', 'Scottish Government')} will publish its Budget on ${h.date(h.Y('2027-28').scotExpected as string)}. Calculators on this site keep the ${Y.label} Scottish bands for ${h.Y('2027-28').label} until then and say so; the ${h.a('tax-code-2027-28', '2027/28 page')} lists what is already confirmed for the whole UK.</p>`;
    },
  },
});
