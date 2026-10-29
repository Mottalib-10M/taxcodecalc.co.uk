import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'd0-tax-code', group: 'codes', order: 3,
  tool: { kind: 'compare', props: { a: 'BR', b: 'D0', pay: 8000 } },
  mini: { kind: 'mini:flat', props: { pay: 8000 } },
  related: ['br-tax-code', 'd1-tax-code', 'second-job-tax-code', 'scottish-tax-codes', 'tax-code-over-100k'],
  sources: ['gov_meaning', 'gov_employee_codes', 'paye_spec', 'employer_2627', 'hmrc_check', 'gov_overunder'],
  en: {
    slug: 'd0-tax-code', nav: 'D0', card: '40% on every pound of a second income, because your main pay already reaches the higher rate band.',
    title: 'D0 Tax Code: 40% Flat Rate on a Second Job or Pension Pay',
    description: 'D0 taxes all pay from a second job or pension at the 40% higher rate, with no allowance. See why HMRC uses it, what it takes and when BR leaves you owing tax.',
    h1: 'D0 tax code',
    intro: 'The second-income code for people whose main salary already reaches the higher rate band.',
    resume: (h) => {
      const e = h.bandEdges('ruk');
      return `D0 is a flat-rate code for a second job or pension. The employer gives no tax-free pay and charges every pound at the higher rate of ${h.flat('D0')}%, as ${h.src('gov_meaning', 'GOV.UK')} sets out in its table of letters. HMRC uses it when the income that carries your Personal Allowance already takes you past the end of the basic rate band, which for ${h.Y().label} is ${h.gbp(e[0])} of total income in England, Wales and Northern Ireland. In that situation, any extra pound you earn elsewhere is taxed at ${h.flat('D0')}%, so a second job paying ${h.gbp(8000)} a year owes ${h.pence(h.taxYear('D0', 8000))}, not the ${h.pence(h.taxYear('BR', 8000))} that ${h.a('br-tax-code', 'BR')} would take. Seen on a payslip, D0 looks harsh, but it usually matches the tax that is really due and avoids a bill after the year ends. It is wrong if the main salary falls below the higher rate threshold, or if the D0 job is now your only work. Wales uses CD0 at the same ${h.flat('CD0')}%; Scotland has no D0 at that rate, because SD0 means the intermediate rate of ${h.flat('SD0')}%.`;
    },
    faqs: (h) => [
      { q: 'Is the D0 code right if my main salary is under the higher rate threshold?', a: `Not usually. D0 assumes every pound of the second job lands in the higher rate band, which only happens when your total income is above ${h.gbp(h.bandEdges('ruk')[0])} and the main job fills the basic rate band. If your main pay is lower, D0 overtaxes the second job. Check the estimated pay HMRC holds for each job in your online account and correct it there.` },
      { q: 'Why does my D0 payslip take 40% of everything?', a: `Because D0 has no number, there is no free pay to subtract. HMRC's payroll specification tells the employer to round the pay down to the pound and charge the whole of it at the next rate above the basic rate, which is ${h.flat('D0')}% for ${h.Y().label}. The deduction stays proportional: double the pay and the tax doubles, with no band to climb.` },
      { q: 'What happens if HMRC leaves BR instead of D0 on my second job?', a: `The second job then takes ${h.flat('BR')}% while you owe ${h.flat('D0')}% on that income, so half the tax due on it is missing. HMRC finds the gap once it has your full income, usually after the tax year, and normally collects it by changing a later tax code. GOV.UK explains this on its page about tax overpayments and underpayments.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('ruk');
      const rows = [[55000, 6000], [62000, 8000], [70000, 12000], [90000, 15000]].map(([m, s]) => [h.gbp(m), h.gbp(s), h.pence(h.taxYear('BR', s)), h.pence(h.taxYear('D0', s)), h.pence(h.taxYear('D0', s) - h.taxYear('BR', s))]);
      return `
<h2>Reading D0 on a payslip</h2>
<p>D and a digit form a prefix code: no allowance, one rate. HMRC's ${h.src('paye_spec', 'PAYE specification')} numbers the rates in ascending order and defines D0 as the first rate above the basic rate, D1 as the one after it. For ${Y.label} that ladder is ${h.sc('ruk').rates.join(', ')}%, so D0 lands on ${h.flat('D0')}%. Pay of ${h.gbp(1000)} in a month loses ${h.pence(h.taxPeriod('D0', 'monthly', 1000, 1))}; pay of ${h.gbp(2500)} loses ${h.pence(h.taxPeriod('D0', 'monthly', 2500, 1))}. There is no allowance to spread across the months, so the cumulative and month 1 versions produce the same figure when the pay is steady.</p>
<p>The ${h.src('gov_employee_codes', 'employer guidance')} lists D0 next to BR as a code for a second job or pension, and payroll software treats them in the same way: the code tells the software which single rate to use, and nothing else.</p>
<p>One detail matters when the pay goes up and down. Run cumulatively, D0 compares the tax due on all pay since 6 April with the tax already deducted, and the difference can be negative: a month with lower pay, or a correction of an earlier overpayment, then shows a refund on the payslip. Run on a week 1 or month 1 basis, each pay stands alone and nothing from earlier periods is ever given back.</p>

<h2>Why HMRC picks D0 rather than BR</h2>
<p>Income Tax is charged on your total income, not job by job. If your main job pays ${h.gbp(62000)}, its pay already runs past ${h.gbp(e[0])}, the point where the basic rate band ends. Every pound from a second source sits on top of that and is taxed at ${h.flat('D0')}%. Using BR on that second source would take only ${h.flat('BR')}%, leaving the rest to be collected later.</p>
${h.table(['Main job, yearly', 'Second job, yearly', 'Tax on second job with BR', 'With D0', 'Gap BR leaves'], rows, `Income Tax on the second job only, ${Y.label}, England and Northern Ireland; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The last column is what you would owe after the year ends if BR had been used. HMRC usually ${h.src('gov_overunder', 'collects such an underpayment')} through your tax code over the following tax year, which means a lower allowance on your main job later on. D0 avoids that by taking the right amount as you go.</p>
<!--tool:mini:secondjob|{"j1":62000,"j2":8000}-->

<h2>When D0 should be challenged</h2>
<p>D0 rests on HMRC's estimate of your main pay. Two changes can make it wrong. A pay cut, reduced hours or unpaid leave may bring your total income back under ${h.gbp(e[0])}; the second job should then be on BR, at least in part. And if the main job ends, the D0 job may become your only income and should receive the Personal Allowance.</p>
<p>In each case, update the estimated pay or the end date of the job in your ${h.src('hmrc_check', 'HMRC online account')}. When a code needs to change, HMRC updates it and tells you and the employer within ${h.R.codeChangeWorkingDays} working days. While you wait, keep the payslips: a D0 that ran for months on a job that should have been on BR can produce an overpayment that comes back once the code is changed.</p>

<h2>D0 in Wales and Scotland</h2>
<p>A Welsh taxpayer sees CD0, which applies the Welsh higher rate of ${h.flat('CD0')}%. A Scottish taxpayer never sees D0 with the meaning above: in Scotland the codes start one step lower, so SD0 charges the intermediate rate of ${h.flat('SD0')}% and SD1 the higher rate of ${h.flat('SD1')}%. The ${h.a('scottish-tax-codes', 'Scottish codes page')} lists all of them. Above D0 comes ${h.a('d1-tax-code', 'D1')}, at ${h.flat('D1')}%, for people whose main pay already reaches the additional rate.</p>`;
    },
  },
});
