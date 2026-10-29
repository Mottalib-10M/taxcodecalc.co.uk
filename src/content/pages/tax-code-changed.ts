import { definePage } from '../../lib/guide-types';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

export default definePage({
  id: 'tax-code-changed', group: 'situations', order: 16,
  tool: { kind: 'compare', props: { a: '1257L', b: '1100L', pay: 32000, freq: 'monthly' } },
  mini: { kind: 'mini:p2', props: { old: 1257, neu: 1100, pay: 32000 } },
  related: ['p2-tax-code-notice', 'wrong-tax-code', 'company-benefits-tax-code', 'm-and-n-tax-codes', 'compare-tax-codes'],
  sources: ['gov_taxcodes', 'hmrc_check', 'gov_update', 'gov_employee_codes', 'gov_marriage', 'employer_2627'],
  en: {
    slug: 'tax-code-changed', nav: 'Tax code changed', card: 'The usual reasons a code moves, where to see the reason, and what the new number does to your pay.',
    title: 'Tax Code Changed: Reasons and the Effect on Your Pay',
    description: 'Your tax code changed? See the usual reasons HMRC gives, where to find the reason for yours, and how much more or less tax the new code takes from each payslip.',
    h1: 'Tax code changed: why, and what it does to your pay',
    intro: 'A new code means HMRC thinks you should pay a different amount of tax. Find the trigger, then measure the change on your payslip.',
    resume: (h) => {
      const pay = 32000;
      const d = (h.taxYear('1100L', pay) - h.taxYear('1257L', pay)) / 12;
      const ma = (h.taxYear('1257L', pay) - h.taxYear('1383M', pay)) / 12;
      return `HMRC changes a tax code when it believes you should be paying a different amount of tax, almost always because your income or circumstances have moved. ${h.src('gov_taxcodes', 'GOV.UK')} lists the common triggers: a new job, a second job or pension, taxable state benefits, a change in your weekly State Pension, company benefits starting or stopping, savings interest above your Personal Savings Allowance, a Marriage Allowance claim, expenses with tax relief, the High Income Child Benefit Charge collected through pay, a Winter Fuel Payment or Pension Age Winter Heating Payment to repay, and tax owed after a wrong code. To see the reason for your own change, sign in to the ${h.src('hmrc_check', 'Check your Income Tax online service')}. The effect is easy to measure: on ${h.gbp(pay)} a year, moving from 1257L to 1100L, as when ${h.gbp(h.R.medicalExample.benefit)} of medical insurance is added, takes about ${h.pence(d)} more each month, while receiving Marriage Allowance and moving to 1383M takes about ${h.pence(ma)} less.`;
    },
    faqs: (h) => [
      { q: 'Why has my tax code changed when nothing in my life has changed?', a: 'Something in HMRC\'s record usually has. An employer may have reported a new benefit or a revised salary, a pension provider may have sent new figures, or HMRC may be collecting a small debt from an earlier year. Interest on savings above your Personal Savings Allowance can also do it. The online service names the item that moved, so check it before assuming a mistake.' },
      { q: 'Will a tax code change give me a large refund or a large deduction in one payslip?', a: `It can. Most codes are cumulative, so the first payroll run on the new code recalculates the tax on all your pay since 6 April. A higher number can return several months of excess at once; a lower one can collect the shortfall for those months. The limit of ${h.Y().maxRate}% of pay before tax caps how much any one payslip can carry.` },
      { q: 'Can I be told by email each time my tax code changes?', a: 'Yes. When checking your code online or through the HMRC app, you can sign up for paperless notifications, and HMRC then emails you whenever the code changes. HMRC also usually contacts you to explain how it worked out a new code. The same account shows the codes you had in previous tax years if you want to compare.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const pay = 32000;
      const monthly = pay / 12;
      const usualA = h.taxPeriod('1257L', 'monthly', monthly, 1);
      const usualB = h.taxPeriod('1100L', 'monthly', monthly, 1);
      const rows = [4, 7, 10].map((m) => {
        const e = h.emergency({ freq: 'monthly', pay: monthly, start: 1, periods: m - 1, emergency: '1257L', correct: '1100L' });
        return [MONTHS[m - 1], h.pence(usualA), h.pence(e.switchRow ? e.switchRow.tax : 0), h.pence(usualB)];
      });
      const swaps = [['1257L', '1100L', 'company benefit added'], ['1257L', '1383M', 'Marriage Allowance received'], ['1257L', '1131N', 'Marriage Allowance transferred'], ['1257L', 'BR', 'source treated as a second job'], ['1257L', 'K475', 'deductions above the allowance']].map(([a, b, why]) => {
        const d = h.taxYear(b, pay) - h.taxYear(a, pay);
        return [`${a} to ${b}`, why, `${d >= 0 ? '+' : '−'}${h.pence(Math.abs(d) / 12)}`];
      });
      return `
<h2>The usual reasons for a new code</h2>
<p>Your code tells payroll how much you can earn tax-free from one job or pension, so anything that changes that amount changes the code. HMRC's own list (${h.src('gov_taxcodes', 'GOV.UK')}) groups into three kinds of event:</p>
<ul>
<li><strong>more income to tax</strong>: starting a new job, income from an additional job or pension, taxable state benefits, a rise in your weekly State Pension, savings interest above your Personal Savings Allowance;</li>
<li><strong>work benefits and reliefs</strong>: your employer telling HMRC that a benefit such as a car or medical insurance has started or stopped, or a claim for expenses that get tax relief;</li>
<li><strong>charges and corrections</strong>: Marriage Allowance claimed, the High Income Child Benefit Charge paid through your wages or pension, a Winter Fuel Payment or Pension Age Winter Heating Payment to pay back, or tax owed after you were on the wrong code.</li>
</ul>
<p>A new job without your previous income details can also put you on an emergency code, which ends in W1, M1 or X. With ${h.src('gov_marriage', 'Marriage Allowance')}, the letter changes as well as the number: M for the partner who receives the transfer, N for the one who gives it.</p>

<h2>Finding the reason for your change</h2>
<p>The ${h.src('hmrc_check', 'Check your Income Tax service')} is where HMRC explains a change. Once signed in, it shows your code and Personal Allowance, the income it expects from each job and pension, the tax you can expect to pay this year, and whether the code has changed. HMRC usually writes to explain how it calculated a new code too; the ${h.a('p2-tax-code-notice', 'P2 coding notice guide')} shows how to read that letter line by line.</p>
<p>If the reason is wrong, for example a benefit you never received or a job you left months ago, update the details in the same service. GOV.UK says a code that needs correcting is reissued to you and your employer within ${h.R.codeChangeWorkingDays} working days. The ${h.a('wrong-tax-code', 'wrong code guide')} covers the rest of that process.</p>

<h2>What the new code does to your pay</h2>
<p>The table shows the monthly effect of common changes on a ${h.gbp(pay)} salary, using the ${Y.label} rates for England and Northern Ireland. The compare tool at the top runs any pair of codes on your own pay.</p>
${h.table(['Change', 'Typical cause', 'Tax each month'], swaps, `Average monthly difference over a full year on ${h.gbp(pay)}; Income Tax only, rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'l', 'r'])}
<!--tool:mini:p2|{"old":1257,"neu":1100,"pay":32000}-->

<h2>The payslip where the change lands</h2>
<p>Employers receive the new code from HMRC and should update the payroll record before your next pay (${h.src('gov_employee_codes', 'GOV.UK')}). Because most codes are cumulative, that first payslip does not just apply the new monthly rate: it recalculates the tax due on everything paid since 6 April and takes or returns the difference. A lower code in the middle of the year therefore costs more in its first month than in later ones. With the same ${h.gbp(pay)} salary moving from 1257L to 1100L:</p>
${h.table(['New code first used in', 'Tax a month before', 'Tax that month', 'Tax a month after'], rows, 'Monthly pay, cumulative codes, no other income.', ['l', 'r', 'r', 'r'])}
<p>The later in the year the change arrives, the bigger that one-off catch-up. A rise in the code number works the other way, returning the excess in one go. Whatever the direction, payroll cannot take more than half of your pay before tax in a single period. If you receive the notice too late in the year for your employer to use it, the employer applies it in the new tax year instead.</p>`;
    },
  },
});
