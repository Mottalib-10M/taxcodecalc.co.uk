import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'w1-m1-x-tax-codes', group: 'codes', order: 10,
  tool: { kind: 'payslip', props: { code: '1257L M1', pay: 2200, freq: 'monthly', period: 8 } },
  mini: { kind: 'mini:w1', props: { pay: 2200, start: 8 } },
  related: ['emergency-tax-code', 'new-job-tax-code', 'no-p45-tax-code', 'how-paye-is-calculated', 'tax-month-and-week'],
  sources: ['gov_emergency', 'gov_employee_codes', 'paye_spec', 'p9x_2026', 'employer_2627', 'starter', 'hmrc_check'],
  en: {
    slug: 'w1-m1-x-tax-codes', nav: 'W1, M1, X', card: 'Codes ending in W1, M1, X or NONCUM: each pay taxed on its own, and why that can cost you until the code changes.',
    title: 'W1, M1 and X Tax Codes: Week 1 and Month 1 Basis Explained',
    description: 'A code ending in W1, M1, X or NONCUM taxes each pay alone, ignoring earlier months. See how it differs from cumulative, when it applies and how long it lasts.',
    h1: 'W1, M1 and X tax codes',
    intro: 'The endings that switch off the running total: what they do to your tax, and when they go away.',
    resume: (h) => {
      const Y = h.Y();
      const e = h.emergency({ freq: 'monthly', pay: 2200, start: 8, periods: 2, emergency: '1257L M1', correct: '1257L' });
      return `W1, M1 and X are endings, not codes of their own. Added after a code such as 1257L, they tell the payroll to work out tax on a week 1 or month 1 basis: each pay is treated on its own, as if it were the first pay of the tax year, with one week's or one month's share of the allowance and the bands. ${h.src('gov_emergency', 'GOV.UK')} calls these emergency tax codes. W1 is used for weekly pay, M1 for monthly pay and X when pay dates vary; some payroll software prints NONCUM instead. The normal method is cumulative: pay and allowance are added up from 6 April, so a month with low pay or a late start gives the unused allowance back later. On the emergency basis that never happens. Someone starting in November on ${h.gbp(2200)} a month pays ${h.pence(h.taxPeriod('1257L M1', 'monthly', 2200, 1))} each month on 1257L M1; after two months on it, the switch to a cumulative 1257L returns ${h.pence(e.back)} through the next payslip. For ${Y.label}, the emergency code is ${Y.emergencyCode} with W1, M1 or X. It usually lasts until HMRC has your details, but can stay until the end of the tax year.`;
    },
    faqs: (h) => [
      { q: 'How long will the M1 or W1 on my tax code last?', a: `Usually until HMRC receives your details from the new and the previous employer and sends a full code, which can take up to ${h.R.waitAfterNewJobDays} days from your start date. In some cases the ending stays until 5 April: when you start company benefits or the State Pension, or when not enough tax has been paid. It is never carried into the next tax year.` },
      { q: 'Why does the X ending appear instead of W1 or M1 on a tax code?', a: 'GOV.UK says X is used when your pay dates vary, rather than falling every week or every month. The effect is the same as W1 or M1: each payment is taxed on its own, using the tables for the period that has passed since the last payment, and no allowance from earlier periods is carried forward.' },
      { q: 'Do W1 and M1 codes always mean I pay too much tax?', a: 'No. With steady pay from 6 April, a month 1 basis takes almost exactly what the cumulative basis would. The cost appears when you started part way through the year, had a gap without work, or your pay varies: the allowance of quiet months is lost instead of being carried forward. If too much was taken, it comes back once a cumulative code arrives or after the year ends.' },
      { q: 'What does NONCUM mean next to my tax code?', a: 'NONCUM is short for non-cumulative. GOV.UK explains that, depending on the employer’s payroll software, it can appear on a payslip instead of W1, M1 or X. It has the same meaning: an emergency basis on which each pay is taxed alone. Treat it exactly like an M1 ending and check your code in your HMRC online account if it does not go.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [4, 6, 8, 10].map((start) => {
        const e = h.emergency({ freq: 'monthly', pay: 2200, start, periods: 2, emergency: '1257L M1', correct: '1257L' });
        const month = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'][start - 1];
        return [month, h.pence(e.onEmergency), h.pence(e.right), h.pence(e.back)];
      });
      return `
<h2>Cumulative against week 1 or month 1</h2>
<p>HMRC's ${h.src('paye_spec', 'PAYE specification')} describes two routines. In the cumulative one, the payroll adds this pay to all pay since 6 April, subtracts the free pay for the same number of weeks or months, works out the tax due to date and takes off the tax already paid. In the week 1 or month 1 routine, set out in section 8 of the specification, each payment is handled in isolation: the free pay for week 1 or month 1 is subtracted from this pay alone, and the tax is worked out as for the first pay of the year.</p>
<p>The ${h.src('gov_employee_codes', 'employer guidance')} puts it in one line: calculate the tax only on what the employee is paid in the current period, not the whole year. With code 1257L, that means ${h.pence(h.freePay(1257, 12))} of free pay in any month and ${h.pence(h.freePay(1257, 52))} in any week, no matter how many months have gone by.</p>

<h2>What month 1 costs a late starter</h2>
<p>The table follows someone who had no income earlier in the year, starts a job on ${h.gbp(2200)} a month, spends two months on 1257L M1 and then receives a cumulative 1257L. The last column is the tax handed back on the first payslip with the new code.</p>
${h.table(['First pay in', 'Tax taken on 1257L M1', 'Due on cumulative 1257L', 'Comes back'], rows, `Income Tax only, ${Y.label}, England and Northern Ireland, two months on the emergency basis.`, ['l', 'r', 'r', 'r'])}
<p>The later the start, the larger the refund, because cumulative tax counts the allowance of every month since April. A person who starts in April loses nothing, since there are no earlier months to count.</p>
<!--tool:mini:emergency|{"pay":2200,"start":8,"k":2}-->

<h2>When an employer uses the emergency basis</h2>
<ul>
<li><strong>A new job without a P45.</strong> On the ${h.src('starter', 'starter checklist')}, statement B, for someone who has had another job or certain benefits since 6 April, gives the current allowance on a week 1 or month 1 basis.</li>
<li><strong>A new employer without your details.</strong> GOV.UK says the code is usually temporary and HMRC updates it once it has the information from both employers.</li>
<li><strong>Company benefits or the State Pension starting.</strong> GOV.UK describes an emergency code in that case as normal; it can last until 5 April.</li>
<li><strong>Tax still owed.</strong> If not enough tax has been paid, you can stay on the emergency code until the right amount for the year has been collected.</li>
</ul>

<h2>Rules that only apply on the emergency basis</h2>
<p>Three details from the specification are easy to miss. First, with a K code on a week 1 or month 1 basis, any tax held back by the limit of ${h.Y().maxRate}% of pay is simply lost to the calculation: it is not carried to the next period and does not appear on the P45 or P60. Second, when HMRC raises codes in the middle of the year under a general notice, employees whose code runs on a week 1 or month 1 basis get no refund from that change. Third, at the turn of the year the ending is dropped: HMRC's ${h.src('p9x_2026', 'P9X notice')} tells employers not to carry any week 1 or month 1 marking into the new tax year, and every suffix code restarts on a cumulative basis on 6 April.</p>
<p>If the ending is still on your payslip more than ${h.R.waitAfterNewJobDays} days after you started, check your employments and estimated pay in your ${h.src('hmrc_check', 'HMRC online account')}. The emergency codes for ${Y.label} are listed in the ${h.src('employer_2627', 'rates and thresholds for employers')}.</p>`;
    },
  },
});
