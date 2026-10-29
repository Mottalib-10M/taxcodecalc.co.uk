import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 's1257l-tax-code', group: 'codes', order: 7,
  tool: { kind: 'decoder', props: { code: 'S1257L', pay: 40000 } },
  mini: { kind: 'mini:scotland', props: { pay: 40000 } },
  related: ['scottish-tax-codes', 'scottish-income-tax-rates', '1257l-tax-code', 'c1257l-tax-code', 'tax-code-2027-28'],
  sources: ['gov_scot', 'employer_2627', 'paye_spec', 'gov_scot_news', 'hmrc_check', 'gov_marriage'],
  en: {
    slug: 's1257l-tax-code', nav: 'S1257L', card: 'The standard code for Scottish taxpayers: same £12,570 allowance, six Scottish rates from 19% to 48%.',
    title: 'S1257L Tax Code: Scottish Rates on the Standard Allowance',
    description: 'S1257L gives the standard £12,570 allowance with the six Scottish Income Tax rates for 2026 to 2027. See who gets the S prefix and what it changes on pay.',
    h1: 'S1257L tax code',
    intro: 'The standard allowance with Scottish bands: what the S changes and who it applies to.',
    resume: (h) => {
      const Y = h.Y();
      const s = h.sc('scot');
      const e = h.bandEdges('scot');
      return `S1257L is the standard tax code of a Scottish taxpayer. The number is the same as in the rest of the UK: ${h.gbp(Y.personalAllowance)} of tax-free pay for ${Y.label}, written as 1257. The S tells the employer or pension provider to use the ${h.src('gov_scot', 'Scottish Income Tax rates')} instead of those of England and Northern Ireland. There are six rates above the allowance: ${s.rates.map((r, i) => `${s.names[i]} ${r}%`).join(', ')}. The starter band ends at ${h.gbp(e[0])} of income, the basic band at ${h.gbp(e[1])}, the intermediate band at ${h.gbp(e[2])} and the higher band at ${h.gbp(e[3])}. As a result, someone on ${h.gbp(25000)} pays ${h.pence(h.taxYear('S1257L', 25000))} a year with S1257L against ${h.pence(h.taxYear('1257L', 25000))} with 1257L, while at ${h.gbp(60000)} the Scottish bill is ${h.pence(h.taxYear('S1257L', 60000))} against ${h.pence(h.taxYear('1257L', 60000))}. You get the S if you live in Scotland, or if Scotland is your main home when you have more than one. The rates for ${h.Y('2027-28').label} are not published yet: the ${h.src('gov_scot_news', 'Scottish Budget')} is expected on ${h.date(h.Y('2027-28').scotExpected as string)}.`;
    },
    faqs: (h) => [
      { q: 'Who gets the S1257L tax code instead of 1257L?', a: 'GOV.UK says living in Scotland makes you liable to Scottish Income Tax. It may also apply after a move to or from Scotland during the year, when you have one home in Scotland and another in a different part of the UK and the Scottish one is your main home, when you have no home but spend more days in Scotland, or when you sit as a member of the Scottish Parliament.' },
      { q: 'Is S1257L cheaper or dearer than 1257L?', a: `It depends on your pay. With the ${h.sc('scot').rates[0]}% starter rate, a Scottish taxpayer on ${h.gbp(25000)} pays ${h.pence(h.taxYear('1257L', 25000) - h.taxYear('S1257L', 25000))} less over the year than with 1257L. Higher up, the intermediate and higher rates reverse that: at ${h.gbp(40000)} S1257L costs ${h.pence(h.taxYear('S1257L', 40000) - h.taxYear('1257L', 40000))} more, and the gap widens as pay rises.` },
      { q: 'What happens to my S1257L code if I move to England?', a: 'Tell HMRC your new address. Scottish rates apply for the tax year if Scotland was where you lived longest of any part of the UK in that year. If HMRC changes your rate, the change is backdated to 6 April of the year of the move and the tax on your pay is adjusted automatically, so the whole year ends up on the right rates.' },
      { q: 'When will the Scottish rates behind S1257L for 2027 to 2028 be known?', a: `The Scottish Government has said its Budget will be presented on ${h.date(h.Y('2027-28').scotExpected as string)}. The Scottish Parliament sets the rates and bands for Scottish taxpayers, so the UK Budget of 28 October 2026 did not fix them. Until then, any Scottish figure for that year is an estimate, while the Personal Allowance of ${h.gbp(h.Y('2027-28').personalAllowance)} is already confirmed.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const s = h.sc('scot');
      const e = h.bandEdges('scot');
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      const from = [Y.personalAllowance, e[0], e[1], e[2], e[3], top];
      const to = [e[0], e[1], e[2], e[3], top];
      const bandRows = s.rates.map((r, i) => [s.names[i][0].toUpperCase() + s.names[i].slice(1), i < 5 ? `${h.gbp(from[i] + 1)} to ${h.gbp(to[i])}` : `over ${h.gbp(top)}`, `${r}%`]);
      const cmp = [20000, 30000, 45000, 80000].map((p) => [h.gbp(p), h.pence(h.taxYear('S1257L', p)), h.pence(h.taxYear('1257L', p)), h.pence(h.taxYear('S1257L', p) - h.taxYear('1257L', p))]);
      return `
<h2>The Scottish bands behind S1257L in ${Y.label}</h2>
<p>The allowance is UK-wide; the bands above it are set in Scotland. The figures below are total income with the standard ${h.gbp(Y.personalAllowance)} allowance, as shown on ${h.src('gov_scot', 'GOV.UK')}. Payroll software uses the same bands expressed above the PAYE threshold, published in the ${h.src('employer_2627', 'rates and thresholds for employers')}.</p>
${h.table(['Rate', 'Income', 'Scottish rate'], bandRows, `Scottish Income Tax, ${Y.label}, standard Personal Allowance. The allowance tapers away above ${h.gbp(Y.incomeLimit)}.`, ['l', 'l', 'r'])}
<p>Scottish rates cover wages, pensions and most other taxable income. Savings interest and dividends are taxed at the same rates as in the rest of the UK, so an S code affects only what comes through PAYE and similar income.</p>

<h2>S1257L against 1257L at different salaries</h2>
<p>The starter band gives a small saving at modest pay; the intermediate rate of ${s.rates[2]}% and the higher rate of ${s.rates[3]}% take it back further up. The higher rate also starts earlier, at ${h.gbp(e[2] + 1)} rather than ${h.gbp(h.bandEdges('ruk')[0] + 1)}.</p>
${h.table(['Yearly pay', 'With S1257L', 'With 1257L', 'Difference'], cmp, `Income Tax over ${Y.label}, equal monthly pay, no other income.`, ['l', 'r', 'r', 'r'])}
<p>On a payslip the difference is spread over the year. Someone paid ${h.gbp(2500)} a month loses ${h.pence(h.taxPeriod('S1257L', 'monthly', 2500, 1))} in month 1 with S1257L, against ${h.pence(h.taxPeriod('1257L', 'monthly', 2500, 1))} with 1257L. At ${h.gbp(4000)} a month the figures are ${h.pence(h.taxPeriod('S1257L', 'monthly', 4000, 1))} and ${h.pence(h.taxPeriod('1257L', 'monthly', 4000, 1))}. The free pay itself, ${h.pence(h.freePay(1257, 12))} a month, is identical: only the rates applied to the rest change.</p>
<!--tool:mini:bands|{"pay":45000,"region":1}-->

<h2>How HMRC decides you are a Scottish taxpayer</h2>
<p>Living in Scotland is the plain case. With two homes, the one that counts is your main home: normally the place where you live and pass most of your time, owned, rented or lived in for free. The home where you spend less time can still count if most of your possessions are there, your spouse or civil partner lives there, or your bank, doctor and car insurance are registered there. Lorry drivers, offshore workers and members of the armed forces often face this question.</p>
<p>If you cannot tell which home is your main one, or you have none, GOV.UK says to count days: a day is spent wherever you are at midnight, and spending more days in Scotland than in the rest of the UK makes you a Scottish taxpayer for the whole year. After a move, HMRC backdates the new rate to 6 April of that year. Keep your address up to date in your ${h.src('hmrc_check', 'HMRC online account')}: GOV.UK warns that the rate applied to you may be wrong if HMRC does not have your new address after a move to or from Scotland.</p>

<h2>Variants of S1257L and what comes next</h2>
<p>The emergency version, 1257L M1 or W1, never carries an S: HMRC's ${h.src('paye_spec', 'specification')} says there is a single emergency code for the whole UK. Codes that change the allowance keep the prefix, such as S1383M for someone receiving ${h.a('m-and-n-tax-codes', 'Marriage Allowance')}, where the partner's income must stay under ${h.gbp(h.R.scotMaRecipientMax)} in Scotland (${h.src('gov_marriage', 'GOV.UK')}). Flat codes for a second job become SBR, SD0 and upwards, explained on the ${h.a('scottish-tax-codes', 'Scottish codes page')}. For ${h.Y('2027-28').label}, the allowance stays at ${h.gbp(h.Y('2027-28').personalAllowance)}, so the code should stay S1257L, but the Scottish bands are only expected with the Budget on ${h.date(h.Y('2027-28').scotExpected as string)}.</p>`;
    },
  },
});
