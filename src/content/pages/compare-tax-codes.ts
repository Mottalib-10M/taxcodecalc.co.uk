import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'compare-tax-codes', group: 'tools', order: 6,
  tool: { kind: 'compare', props: { a: '1257L', b: 'BR', pay: 36000, freq: 'monthly' } },
  mini: { kind: 'mini:p2', props: { old: 1257, neu: 1131, pay: 30000 } },
  related: ['tax-code-changed', 'p2-tax-code-notice', 'br-tax-code', '0t-tax-code', 'check-my-tax-code'],
  sources: ['gov_meaning', 'paye_spec', 'employer_2627', 'gov_update'],
  en: {
    slug: 'compare-tax-codes', nav: 'Compare two codes', card: 'The same pay through two codes: tax each pay, over the year and take-home side by side.',
    title: 'Compare Tax Codes: Two Codes on the Same Pay Side by Side',
    description: 'Put two tax codes on the same salary: tax on the first payslip, tax over the year and take-home pay side by side: an old and a new code, BR against 1257L or 0T.',
    h1: 'Compare two tax codes',
    intro: 'Old code against new, BR against 1257L, 0T against your normal code: the same pay through both, payslip by payslip and over the year.',
    resume: (h) => {
      const a = h.taxYear('1257L', 36000), b = h.taxYear('BR', 36000), c = h.taxYear('0T', 36000), d = h.taxYear('1100L', 36000);
      return `Two codes on the same pay can take very different amounts of tax, and the difference is rarely obvious from the codes themselves. On ${h.gbp(36000)} a year paid monthly, 1257L takes ${h.pence(a)} over the year by HMRC's cumulative method. The same pay on BR, with no allowance and everything at ${h.flat('BR')}%, takes ${h.pence(b)}, which is ${h.pence(b - a)} more. On 0T, also without allowance but with the normal bands, it takes ${h.pence(c)}. A smaller change, from 1257L to 1100L after a company benefit of ${h.gbp(h.R.medicalExample.benefit)}, costs ${h.pence(d - a)} over the year. The comparator above runs both codes through the same payroll calculation for your pay and frequency, so you can see what a new code from HMRC changes before it reaches your payslip, or how far a wrong code is from the right one.`;
    },
    faqs: (h) => [
      { q: 'Why is the difference between two codes larger in the first month?', a: 'With cumulative codes the first payslip already reflects one month of the allowance gap, and if a new code arrives mid-year the next payslip corrects all the months before at once. The yearly figure is the one to compare. Codes ending in W1 or M1 never catch up, so their gap repeats every pay.' },
      { q: 'Is 0T worse than BR?', a: `It depends on the pay. Both give no allowance. BR charges ${h.flat('BR')}% on everything; 0T applies the normal bands, so on high pay part of it is taxed at ${h.flat('D0')}%. On a salary that stays in the basic rate band the two give the same yearly tax, and above it 0T takes more.` },
      { q: 'Can I ask HMRC to use a different code?', a: 'You can ask HMRC to correct the figures behind your code: a benefit, an expense, an estimate of your pay or a missing job. The code that results must still match your circumstances, so there is no choosing a code for convenience. Changes go through your HMRC online account, the app or by contacting HMRC, not through your employer.' },
    ],
    body: (h) => {
      const pay = 36000;
      const codes = ['1257L', '1383M', '1131N', '1100L', 'BR', '0T', 'K475', 'S1257L'];
      const rows = codes.map((c) => [c, h.pence(h.taxPeriod(c, 'monthly', pay / 12, 1)), h.pence(h.taxYear(c, pay)), h.gbp(pay - h.taxYear(c, pay) / 100)]);
      return `
<h2>Eight codes on ${h.gbp(pay)} a year</h2>
<p>The table runs one salary through codes people commonly find on their payslips in ${h.Y().label}. The figures are Income Tax only, with equal monthly pay, from HMRC's payroll method (${h.src('paye_spec', 'PAYE specification')}).</p>
${h.table(['Code', 'Tax in month 1', 'Tax over the year', 'Pay after tax'], rows, `${h.gbp(pay)} a year paid monthly, ${h.Y().label}; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r', 'r'])}
<p>Three groups stand out. Codes with an allowance (1257L, 1383M, 1131N, 1100L) differ by ${h.pc(h.flat('BR') / 100)} of the change in allowance while the pay stays in the basic rate band. Codes without one (BR, 0T) remove the whole allowance. K codes go further and add to taxable pay, and an S prefix switches to the six Scottish bands.</p>

<h2>Reading a change of code</h2>
<p>When HMRC sends a new code, the change in its number times ten is the change in your tax-free pay, and the tax effect is that amount times your top rate. From 1257L to 1131N is ${h.gbp(h.Y().marriageAllowance)} less allowance, about ${h.gbp(h.R.maSaving)} more tax over the year for a basic rate taxpayer; the partner receiving it on 1383M pays the same amount less. A change of letter alone, L to T for example, does not change the tax: the number does.</p>
<!--tool:mini:compare|{"code":"0T","code2":"BR","pay":60000}-->

<h2>Cumulative codes against the week 1 basis</h2>
<p>The comparator also shows what an emergency basis does. Put 1257L in one box and 1257L M1 in the other with the same yearly pay: the totals are almost the same, because equal monthly pay gets one month's allowance either way. The gap appears when pay is uneven or when the job starts after April, because the cumulative code gives back the allowance of the months already gone while the month 1 basis never does. The ${h.a('emergency-tax-code', 'emergency tax calculator')} handles that case with a start month.</p>
<p>The same logic explains a refund on a payslip after a code goes up. Say HMRC moves you from 1100L to 1257L in month 7: the cumulative calculation recomputes the tax due to date with the higher allowance for all seven months, sees that too much was paid in months 1 to 6, and gives the difference back on that payslip. The yearly figures in the comparator are what each code would take if it applied all year, so the refund is roughly the yearly gap times the share of the year already paid.</p>

<h2>Scottish and Welsh prefixes</h2>
<p>Comparing 1257L with S1257L on the same pay shows what moving to or from Scotland means for your Income Tax: the allowance is the same, but the six Scottish bands start at ${h.sc('scot').rates[0]}% and reach ${h.sc('scot').rates[3]}% from a lower point than the higher rate in England. C1257L gives the same result as 1257L in ${h.Y().label}, because the Welsh rates add up to the English ones in every band.</p>

<h2>When to compare</h2>
<p>Use it when a ${h.a('p2-tax-code-notice', 'coding notice')} arrives, when your payslip shows a code you did not expect, or when you have two jobs and want to see what happens if the allowance sits on one or the other. For the full picture of which code fits your situation, the ${h.a('check-my-tax-code', 'right code checker')} takes all your incomes. Only HMRC can issue a new code: updates go through your ${h.src('hmrc_check', 'HMRC online account')}, as ${h.src('gov_update', 'GOV.UK')} explains.</p>`;
    },
  },
});
