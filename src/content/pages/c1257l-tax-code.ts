import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'c1257l-tax-code', group: 'codes', order: 8,
  tool: { kind: 'decoder', props: { code: 'C1257L', pay: 38000 } },
  mini: { kind: 'mini:wales', props: { pay: 38000 } },
  related: ['welsh-income-tax-rates', '1257l-tax-code', 's1257l-tax-code', 'tax-code-letters', 'tax-code-2027-28'],
  sources: ['gov_wales', 'ootlar_annex_a', 'employer_2627', 'paye_spec', 'hmrc_check', 'gov_meaning'],
  en: {
    slug: 'c1257l-tax-code', nav: 'C1257L', card: 'The Welsh version of the standard code: same allowance, Welsh rates, and the same tax as England this year.',
    title: 'C1257L Tax Code: Welsh Rates and What the C Prefix Changes',
    description: 'C1257L is the code for Welsh taxpayers: £12,570 tax-free and the Welsh rates, which give the same tax as England in 2026 to 2027. See who gets the C prefix.',
    h1: 'C1257L tax code',
    intro: 'The C marks a Welsh taxpayer. This year it changes where part of your tax goes, not how much you pay.',
    resume: (h) => {
      const Y = h.Y();
      const w = h.sc('wales');
      return `C1257L is the tax code HMRC gives to a Welsh taxpayer with one job or pension and the standard allowance. The number 1257 means ${h.gbp(Y.personalAllowance)} of tax-free pay for ${Y.label}, exactly as in England; the C tells the payroll to apply the ${h.src('gov_wales', 'Welsh rates of Income Tax')}. Those rates are built in two layers: the UK rates are cut by 10p in each pound for Welsh taxpayers, and the Senedd adds its own Welsh rates on top, as the ${h.src('ootlar_annex_a', 'Budget 2026 overview of tax rates')} explains. For ${Y.label} the result is ${w.rates.join(', ')}% on the basic, higher and additional bands, the same as in England and Northern Ireland. That is why C1257L and 1257L take the same amount: ${h.pence(h.taxYear('C1257L', 38000))} a year on a salary of ${h.gbp(38000)}, and ${h.pence(h.taxYear('C1257L', 60000))} on ${h.gbp(60000)}. The C still matters: it records that the Welsh rates set by the Senedd apply to you, and those rates could move away from England's in a later year. The Welsh rates for ${h.Y('2027-28').label} had not been published by 29 October 2026.`;
    },
    faqs: (h) => [
      { q: 'Does the C1257L tax code mean I pay more tax than in England?', a: `Not in ${h.Y().label}. The Welsh rates add back exactly what the UK rates take off for Welsh taxpayers, giving ${h.sc('wales').rates.join(', ')}% on the three bands, as in England. On any salary, C1257L and 1257L produce the same payslip deduction. The prefix records that you are a Welsh taxpayer, so that any future change to the Welsh rates is applied to your pay.` },
      { q: 'Who should have the C1257L code?', a: 'Anyone whose main home is in Wales and who has the standard allowance on one job or pension. With homes in Wales and elsewhere in the UK, the main home is usually where you spend most of your time, but it can be the other one if your possessions, your family or your registrations are there. After a move, Welsh rates apply if you lived in Wales longest during the tax year.' },
      { q: 'My payslip shows 1257L but I live in Wales: is that a problem for the C1257L rates?', a: `Usually it changes nothing on your pay in ${h.Y().label}, because the Welsh and English rates are the same. It does suggest HMRC holds an address outside Wales, and GOV.UK asks people whose main home is in Wales to update their address if HMRC may not have it. A future change in Welsh rates would otherwise not reach your payslip.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('wales');
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      const w = h.sc('wales');
      const bands = [[`${h.gbp(Y.personalAllowance + 1)} to ${h.gbp(e[0])}`, 'Basic', w.rates[0]], [`${h.gbp(e[0] + 1)} to ${h.gbp(top)}`, 'Higher', w.rates[1]], [`over ${h.gbp(top)}`, 'Additional', w.rates[2]]].map(([a, b, r]) => [String(b), String(a), `${r}%`]);
      const cmp = [18000, 30000, 50000, 90000].map((p) => [h.gbp(p), h.pence(h.taxYear('C1257L', p)), h.pence(h.taxYear('1257L', p)), h.pence(h.taxPeriod('C1257L', 'monthly', p / 12, 1))]);
      return `
<h2>How the Welsh rates are put together</h2>
<p>Wales does not set its own bands. It keeps the UK bands and allowance and changes the rates through a simple mechanism: for a Welsh taxpayer, the UK rates drop by 10p in the pound, and the Welsh rates set by the Senedd are added back. In ${Y.label} the Welsh rate is 10p in every band, so the totals match those of England. HMRC's ${h.src('paye_spec', 'PAYE specification')} carries separate Welsh values for every rate and band all the same, so payroll software can apply a different figure the year the Senedd chooses one. The specification dates the Welsh Rate of Income Tax from 6 April 2019 and states that it left the calculation rules unchanged: free pay, cumulative tax and the emergency basis work exactly as they do for any other code.</p>
${h.table(['Band', 'Income', 'Rate for Welsh taxpayers'], bands, `Income Tax for Welsh taxpayers, ${Y.label}, standard allowance; totals from ${h.src('gov_wales', 'GOV.UK')}.`, ['l', 'l', 'r'])}
<p>Like the Scottish rates, the Welsh rates apply to wages, pensions and most other taxable income. Savings interest and dividends are taxed at the same rates as in the rest of the UK.</p>

<h2>Tax with C1257L at different salaries</h2>
<p>Because every rate matches, the comparison is short: the second and third columns are identical. The monthly figure is the first payslip of the year with steady pay, using the ${h.pence(h.freePay(1257, 12))} of free pay that code 1257 gives each month.</p>
${h.table(['Yearly pay', 'With C1257L', 'With 1257L', 'Month 1 with C1257L'], cmp, `Income Tax, ${Y.label}; rates from ${h.src('employer_2627', 'GOV.UK rates for employers')}.`, ['l', 'r', 'r', 'r'])}

<h2>Who gets the C, and what to do after a move</h2>
<p>Living in Wales is what puts you on the Welsh rates. If you move in or out during the tax year, the Welsh rates apply only if Wales was where you lived the longest of any part of the UK between 6 April and 5 April. HMRC then backdates the change to the start of that year and the payroll adjusts the tax automatically. With a home in Wales and another in England, Scotland or Northern Ireland, HMRC needs to know which is the main one; possessions, family and where you are registered with a bank or doctor all point to it. Lorry drivers, offshore workers and members of the armed forces are the usual examples.</p>
<p>In each case the trigger is your address. Update it in your ${h.src('hmrc_check', 'HMRC online account')} or through GOV.UK's change of details service, and HMRC adds or removes the C. The emergency code is the exception: there is one emergency code for the whole UK, so a new starter in Wales sees 1257L M1, not C1257L M1, until HMRC sends the proper code.</p>

<h2>Other Welsh codes and the year ahead</h2>
<p>Every code can carry the C. ${h.src('gov_meaning', 'GOV.UK')} lists CBR for a second job at the Welsh basic rate of ${h.flat('CBR')}%, CD0 at ${h.flat('CD0')}% and CD1 at ${h.flat('CD1')}%, and C0T when the allowance is used up or details are missing. Marriage Allowance gives C1383M or C1131N. For ${h.Y('2027-28').label}, the UK Budget keeps the allowance at ${h.gbp(h.Y('2027-28').personalAllowance)}, but the Welsh rates are set with the Welsh budget and had not been published on 29 October 2026; until they are, the ${h.a('tax-code-2027-28', 'page on next year')} treats them as unknown.</p>`;
    },
  },
});
