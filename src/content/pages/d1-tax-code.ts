import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'd1-tax-code', group: 'codes', order: 4,
  tool: { kind: 'compare', props: { a: 'D0', b: 'D1', pay: 20000 } },
  mini: { kind: 'mini:flat', props: { pay: 20000 } },
  related: ['d0-tax-code', 'tax-code-over-100k', 'second-job-tax-code', '0t-tax-code', 'scottish-tax-codes'],
  sources: ['gov_meaning', 'gov_rates', 'paye_spec', 'employer_2627', 'hmrc_check', 'gov_ani'],
  en: {
    slug: 'd1-tax-code', nav: 'D1', card: '45% on all of a second income when your main pay is already above £125,140.',
    title: 'D1 Tax Code: 45% Additional Rate on Every Pound of Extra Pay',
    description: 'D1 charges the 45% additional rate on all pay from a second job or pension, with no allowance. Find out when HMRC uses D1 and what it takes against D0 and BR.',
    h1: 'D1 tax code',
    intro: 'The top flat-rate code outside Scotland: every pound of this income at the additional rate.',
    resume: (h) => {
      const Y = h.Y();
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      return `D1 tells an employer or pension provider to tax everything it pays you at the additional rate of ${h.flat('D1')}%, with no tax-free amount. ${h.src('gov_meaning', 'GOV.UK')} describes it as a code usually used when you have more than one job or pension. It applies when the income that carries your main code already goes beyond ${h.gbp(top)}, the level above which ${h.src('gov_rates', 'the additional rate applies')} in England, Wales and Northern Ireland for ${Y.label}. At that level the Personal Allowance has gone completely, because it falls by half of the adjusted net income above ${h.gbp(Y.incomeLimit)}. Any further pound, from a board seat, a consultancy paid through payroll or a second pension, is then taxed at ${h.flat('D1')}%. A second job paying ${h.gbp(20000)} costs ${h.pence(h.taxYear('D1', 20000))} a year under D1, against ${h.pence(h.taxYear('D0', 20000))} under ${h.a('d0-tax-code', 'D0')} and ${h.pence(h.taxYear('BR', 20000))} under BR. The Welsh version is CD1, also at ${h.flat('CD1')}%. Scotland has no D1 at this rate: its flat codes run from SBR to SD3.`;
    },
    faqs: (h) => [
      { q: 'At what salary does a second job move to the D1 tax code?', a: `When the main source on its own already exceeds ${h.gbp(h.Y().incomeLimit + 2 * h.Y().personalAllowance)}, the whole of the second income falls in the additional rate band, so D1 at ${h.flat('D1')}% matches the tax due on it. Below that point, D0 or BR fits better. HMRC works from the pay estimates it holds, so a large bonus or a pay cut can shift the right code during the year.` },
      { q: 'Can the D1 tax code apply to a pension rather than a job?', a: 'Yes. GOV.UK lists D1 as a code for income from a job or a pension, usually where there is more than one. A senior employee who also draws a workplace pension, or a retired director still on a board, can see D1 on the smaller source. The rule is the same: no allowance, and the highest rate on every pound paid by that source.' },
      { q: 'Should my main job be on 0T if my second job is on D1?', a: `Often, yes. Above ${h.gbp(h.Y().incomeLimit + 2 * h.Y().personalAllowance)} of adjusted net income there is no Personal Allowance left, so the main job cannot have one either, and GOV.UK describes 0T as the code for an allowance that has been used up. The main job then taxes its pay through the normal bands, starting at the basic rate, while the second job sits on D1.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      const rows = [5000, 12000, 20000, 40000].map((s) => [h.gbp(s), h.pence(h.taxYear('BR', s)), h.pence(h.taxYear('D0', s)), h.pence(h.taxYear('D1', s))]);
      return `
<h2>What D1 does to each payment</h2>
<p>In HMRC's ${h.src('paye_spec', 'PAYE specification')}, the D codes count upwards from the basic rate: D0 is the next rate, D1 the one after. Outside Scotland the ladder for ${Y.label} has three steps, ${h.sc('ruk').rates.join(', ')}%, so D1 is the last code available; there is no D2 in England, Wales or Northern Ireland. The payroll rounds each payment down to the pound and charges ${h.flat('D1')}% on it. A monthly fee of ${h.gbp(1800)} therefore loses ${h.pence(h.taxPeriod('D1', 'monthly', 1800, 1))}, and a quarterly payment of ${h.gbp(5000)} on a cumulative D1 code loses ${h.pence(h.taxPeriod('D1', 'monthly', 5000, 1))} when it is paid.</p>
${h.table(['Second income, yearly', 'BR', 'D0', 'D1'], rows, `Income Tax on the second source over ${Y.label}, equal monthly payments; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r', 'r'])}
<p>The step from D0 to D1 is only ${h.flat('D1') - h.flat('D0')} percentage points, but it adds up on a sizeable second income: on ${h.gbp(40000)} a year it means ${h.pence(h.taxYear('D1', 40000) - h.taxYear('D0', 40000))} more than D0 would take.</p>

<h2>The income levels behind D1</h2>
<p>Two thresholds meet at ${h.gbp(top)}. The first is the end of the higher rate band: the basic and higher bands together cover ${h.gbp(h.sc('ruk').bands[0] + h.sc('ruk').bands[1])} of taxable income. The second is the taper of the Personal Allowance, explained by HMRC's guide to ${h.src('gov_ani', 'adjusted net income')}: from ${h.gbp(Y.incomeLimit)} upwards, the allowance falls by half of each extra pound of income, so ${h.gbp(Y.personalAllowance)} has gone by ${h.gbp(top)}. Above that figure there is no allowance and no band left to fill, which is why any second source can safely be taxed at the top rate without being overtaxed.</p>
<p>Between ${h.gbp(Y.incomeLimit)} and ${h.gbp(top)} the picture is different. Your main code shrinks month after month as the allowance tapers, and a second source in that zone is usually on D0 rather than D1. The ${h.a('tax-code-over-100k', 'page on codes above £100,000')} follows that taper step by step.</p>
<p>A worked case shows how the two codes split the work. Take a salary of ${h.gbp(150000)} and a workplace pension of ${h.gbp(20000)} drawn at the same time. The salary has no allowance left, so it carries 0T and is taxed through the bands from the first pound. The pension sits wholly above ${h.gbp(top)} and carries D1: ${h.pence(h.taxPeriod('D1', 'monthly', 20000 / 12, 1))} comes off each monthly payment, ${h.pence(h.taxYear('D1', 20000))} over the year, which is exactly the additional rate on that income.</p>
<!--tool:mini:taper|{"inc":140000}-->

<h2>When D1 is not right</h2>
<p>D1 depends on HMRC's estimate of your main pay. If a bonus that HMRC expected is not paid, or your pay is cut and your income falls under ${h.gbp(top)}, part of the second income should fall at ${h.flat('D0')}% and D1 overtaxes it. If your main role ends, the remaining source may need an allowance, or at least a lower rate. In each case, update the estimated income for every job and pension in your ${h.src('hmrc_check', 'HMRC online account')}; HMRC changes the codes that need changing and tells the employer within ${h.R.codeChangeWorkingDays} working days.</p>
<p>The reverse error also exists. A second job left on D0 or BR while your income is far above ${h.gbp(top)} takes too little each month. The shortfall is collected later through a reduced code or a bill, so correcting it early costs nothing extra.</p>

<h2>CD1 in Wales and the Scottish codes</h2>
<p>Welsh taxpayers see CD1, which applies the Welsh additional rate of ${h.flat('CD1')}%. Scottish taxpayers have a longer ladder of six rates, so the same idea uses different labels: SD2 charges the advanced rate of ${h.flat('SD2')}% and SD3 the top rate of ${h.flat('SD3')}%. A Scottish SD1 is the higher rate of ${h.flat('SD1')}%, not the additional rate. The ${h.a('scottish-tax-codes', 'Scottish codes page')} sets out when each one applies.</p>`;
    },
  },
});
