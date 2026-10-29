import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'welsh-income-tax-rates', group: 'rules', order: 6,
  tool: { kind: 'decoder', props: { code: 'C1257L', pay: 38000 } },
  mini: { kind: 'mini:wales', props: { pay: 38000 } },
  related: ['c1257l-tax-code', 'tax-code-2026-27', 'tax-code-2027-28', 'scottish-income-tax-rates', 'tax-code-letters'],
  sources: ['gov_wales', 'employer_2627', 'paye_spec', 'p9x_2026', 'ootlar_annex_a', 'gov_rates'],
  en: {
    slug: 'welsh-income-tax-rates', nav: 'Welsh rates', card: 'Welsh rates of income tax: who pays them, the C code, and why the totals match England this year.',
    title: 'Welsh Income Tax Rates 2026/27: C Codes and Welsh Bands',
    description: 'Welsh rates of income tax for 2026/27: 20%, 40% and 45% in total, the same as England, a C at the start of the code, who pays them and when 2027/28 is set.',
    h1: 'Welsh Income Tax rates',
    intro: 'Part of the Income Tax on Welsh wages and pensions is set in Wales. Here is how that part works, and why the total is the same as in England.',
    resume: (h) => {
      const Y = h.Y();
      const w = h.sc('wales');
      const e = h.bandEdges('wales');
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      return `If your main home is in Wales, you pay the Welsh rates of income tax on your wages and pensions, and HMRC puts a C in front of your tax code, so the standard code is C1257L. Since 6 April 2019, the UK rates on that income are reduced by 10p in every pound for Welsh taxpayers and the Senedd sets a Welsh rate that is added back in each band. For ${Y.label} the totals come out at ${w.rates[0]}% on gross income from ${h.gbp(Y.personalAllowance + 1)} to ${h.gbp(e[0])}, ${w.rates[1]}% up to ${h.gbp(top)} and ${w.rates[2]}% above, exactly the rates paid in England and Northern Ireland. A salary of ${h.gbp(38000)} therefore loses ${h.pence(h.taxYear('C1257L', 38000))} to Income Tax over the year, on C1257L or on 1257L alike. Savings interest and dividends are taxed as in the rest of the UK. The Welsh rates for ${h.Y('2027-28').label} have not been published yet.`;
    },
    faqs: (h) => [
      { q: 'Do Welsh taxpayers pay more Income Tax than people in England?', a: `Not in ${h.Y().label}. The Welsh rate added in each band exactly replaces the amount the UK takes off, so the totals are ${h.sc('wales').rates.join(', ')}%, the same as in England and Northern Ireland, on the same bands. A C1257L payslip and a 1257L payslip with the same pay show the same tax. The C still matters: it records that you are a Welsh taxpayer, which would change your tax as soon as the Senedd chose different rates.` },
      { q: 'What does the C in a Welsh tax code like C1257L or CBR mean?', a: 'It tells payroll to apply the Welsh rates of income tax. The rest of the code works as everywhere else: C1257L gives the standard allowance, CBR taxes a second job at the basic rate, CD0 and CD1 at the higher and additional rates, and C0T gives no allowance. Two codes never take the C: NT and the single UK emergency code.' },
      { q: 'Who has to pay the Welsh rates of income tax?', a: 'People who live in Wales, judged by their main home. If you move into or out of Wales, you pay the Welsh rates for a tax year only when you lived in Wales longer than anywhere else in the UK in that year. With homes in Wales and elsewhere, the main home is normally where you live most of the time, owned, rented or free.' },
      { q: 'When will the Welsh income tax rates for 2027/28 be set?', a: `They are set by the Senedd with the Welsh budget for ${h.Y('2027-28').label} and had not been published when this page was written, on 29 October 2026. The UK Budget of 28 October 2026 already confirms the Personal Allowance of ${h.gbp(h.Y('2027-28').personalAllowance)} and the band widths, which apply in Wales as well.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const w = h.sc('wales');
      const e = h.bandEdges('wales');
      const pa = Y.personalAllowance;
      const top = Y.incomeLimit + 2 * pa;
      const cap = (x: string) => x[0].toUpperCase() + x.slice(1);
      const bands = [
        ['Personal Allowance', `up to ${h.gbp(pa)}`, '0%'],
        [cap(w.names[0]), `${h.gbp(pa + 1)} to ${h.gbp(e[0])}`, `${w.rates[0]}%`],
        [cap(w.names[1]), `${h.gbp(e[0] + 1)} to ${h.gbp(top)}`, `${w.rates[1]}%`],
        [cap(w.names[2]), `over ${h.gbp(top)}`, `${w.rates[2]}%`],
      ];
      const pays = [22000, 38000, 60000, 130000];
      const cmp = pays.map((p) => [h.gbp(p), h.pence(h.taxYear('C1257L', p)), h.pence(h.taxYear('1257L', p)), h.pence(h.taxPeriod('CBR', 'monthly', p / 12, 1))]);
      return `
<h2>How the Welsh rates are built</h2>
<p>Income Tax on wages and pensions in Wales has two layers. The UK government charges its rates minus 10p in the pound, as the Budget overview of 28 October 2026 describes, and the Senedd chooses a Welsh rate for each band that is added on top. The bands and the Personal Allowance used in Wales are the same as in England. HMRC's ${h.src('paye_spec', 'payroll specification')} has carried separate Welsh rates since 6 April 2019, so payroll software can apply a different total if the Senedd ever chooses one.</p>
<p>So far it has not. For ${Y.label}, ${h.src('gov_wales', 'GOV.UK')} lists the same totals and thresholds as for England and Northern Ireland, which means the Welsh rate in each band equals the amount the UK takes off.</p>
${h.table(['Band', 'Gross yearly income', 'Total rate'], bands, `Welsh taxpayer with the standard Personal Allowance, ${Y.label}; also in the ${h.src('employer_2627', 'employer rates')}.`, ['l', 'l', 'r'])}

<h2>C1257L and the other C codes</h2>
<p>The C is the only thing that marks you out as a Welsh taxpayer on a payslip. The number and letter are worked out exactly as elsewhere, so C1257L gives ${h.pence(h.freePay(1257, 12))} of free pay a month, and a code with company benefits or Marriage Allowance simply gains the C in front, for example ${h.codeFor(pa + Y.marriageAllowance, 'M', 'wales')}. A second job is normally CBR at ${h.flat('CBR')}%, or CD0 and CD1 when the main pay already reaches the higher or additional band. After a P45 has been issued, any later payment is taxed on C0T on a non-cumulative basis for someone whose code had a C, under HMRC's ${h.src('p9x_2026', 'P9X notice')}. NT never takes a C, and neither does the emergency code ${Y.emergencyCode}.</p>
${h.table(['Yearly pay', 'C1257L', '1257L', 'CBR, one month'], cmp, `Income Tax for ${Y.label}; CBR shown for one month of a second job paying the same.`, ['l', 'r', 'r', 'r'])}
<!--tool:mini:wales|{"pay":60000}-->
<p>Because the totals match, a missing or extra C does not change your tax this year. It still matters, because a wrong status would show in your pay the moment the Senedd set rates that differ from England's. The ${h.a('c1257l-tax-code', 'C1257L page')} covers the code on its own.</p>

<h2>Who pays the Welsh rates</h2>
<p>The test is where you live. Someone who moves into or out of Wales pays the Welsh rates for a tax year only if Wales was where they lived longest of any part of the UK in that year, which runs from 6 April to 5 April. When HMRC changes your status, the new rates are backdated to the start of the year of the move, and the tax on your wages or pension is adjusted automatically over the rest of the year.</p>
<p>With a home in Wales and another elsewhere in the UK, the main home decides. Normally that is the place where you live and pass most of your time, owned, rented or lived in for free, but a home where you spend less time can still count if it holds most of your belongings, is where your family lives, or is where you are registered for banking, a GP or car insurance. This often applies to lorry drivers, offshore workers and members of the armed forces. If your code shows a C and you do not live in Wales, or the other way round, update your address with HMRC; your ${h.src('hmrc_check', 'HMRC online account')} shows the code and the address it holds. People who file a Self Assessment return online also have a box to say they pay the Welsh rates.</p>

<h2>What is known about 2027/28</h2>
<p>${h.Y('2027-28').walesExpected}. ${h.src('ootlar_annex_a', 'Annex A of the UK Budget')} already fixes the Personal Allowance at ${h.gbp(h.Y('2027-28').personalAllowance)} and the basic rate band at ${h.gbp(h.sc('ruk', '2027-28').bands[0])} for that year, and both apply in Wales. The Budget also creates separate property income rates from April 2027 and lets the Welsh Government set its own; these do not touch wages. Until the Welsh rates are published, the calculators on this site use the ${Y.label} Welsh rates for ${h.Y('2027-28').label} and say so. The ${h.a('tax-code-2027-28', 'page on next year')} follows the other changes.</p>`;
    },
  },
});
