import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-per-payslip', group: 'tools', order: 3,
  tool: { kind: 'payslip', props: { code: '1257L', pay: 2800, freq: 'monthly', period: 7 } },
  mini: { kind: 'mini:taxmonth' },
  related: ['how-paye-is-calculated', 'w1-m1-x-tax-codes', 'tax-month-and-week', 'compare-tax-codes', 'emergency-tax-code'],
  sources: ['paye_spec', 'employer_2627', 'gov_meaning', 'gov_paidwrong'],
  en: {
    slug: 'tax-per-payslip', nav: 'Tax per payslip', card: 'The tax on one payslip by HMRC’s cumulative method: free pay, taxable pay and tax to date.',
    title: 'Tax Code Calculator: Income Tax on Each Payslip Explained',
    description: 'Enter your tax code, pay and pay period: the Income Tax on this payslip by HMRC’s cumulative method, with free pay, taxable pay to date and tax already paid.',
    h1: 'Tax code calculator for each payslip',
    intro: 'Code, pay, how often you are paid and the period number: the tax on this payslip, worked out the way payroll software does it.',
    resume: (h) => {
      const t7 = h.taxPeriod('1257L', 'monthly', 2800, 7);
      return `Payroll software does not divide your yearly tax into twelve equal parts. For each payslip it follows HMRC's ${h.src('paye_spec', 'Specification for PAYE Tax Table Routines')}: it adds up your pay since 6 April, takes off the free pay for the number of weeks or months gone, rounds the taxable pay down to the pound, applies the bands accrued to date and subtracts the tax you have already paid. The calculator above does the same with your code, your pay and the period number on your payslip. With 1257L and ${h.gbp(2800)} every month, month 7 shows ${h.pence(t7)} of tax, the same as every other month because the pay never changed. Change the pay, start in a later month or switch to a week 1 or month 1 code, and the figure moves: that is where refunds and unexpected deductions come from. It covers weekly, two-weekly, four-weekly and monthly pay for ${h.Y().label}, the year before and the year after.`;
    },
    faqs: (h) => [
      { q: 'Why does my payslip tax differ from a yearly calculator divided by 12?', a: `Because payroll counts the allowance and bands month by month and rounds at each step. With 1257L the free pay is ${h.pence(h.freePay(1257, 12))} a month, slightly more than a twelfth of the allowance, and taxable pay is rounded down to the pound. Over a full year of equal pay the result ends a few pounds below the yearly figure.` },
      { q: 'Which period number should I use?', a: 'The tax month or tax week printed on your payslip, often shown as period, tax period or month number. Month 1 is pay received from 6 April to 5 May, month 7 from 6 October to 5 November. Weekly pay counts tax weeks from 6 April. If your payslip does not show it, the date of payment gives it.' },
      { q: 'Why is there a negative figure in the tax line of my payslip?', a: 'A negative tax figure is a refund through payroll. With a cumulative code, if the tax due to date is lower than what you have paid, the difference is given back. It happens after a code goes up, after an emergency code is replaced, or when pay falls sharply during the year.' },
    ],
    body: (h) => {
      const pays = [2800, 2800, 2800, 5800, 2800, 2800];
      const run = h.run('1257L', pays);
      const rows = run.map((r) => [r.p, h.pence(r.pay), h.pence(r.payToDate), h.pence(r.allowanceToDate), h.pence(r.tax)]);
      const normal = run[0].tax, bonusTax = run[3].tax;
      return `
<h2>The four steps on every payslip</h2>
<p>First, pay to date: this period's taxable pay added to the total since 6 April. Second, free pay to date: the code's monthly or weekly free pay times the period number, ${h.pence(h.freePay(1257, 12))} a month for 1257L, so ${h.pence(h.freePay(1257, 12) * 7)} by month 7. Third, the tax due to date: the taxable pay to date, rounded down to the pound, taxed at the bands for the same fraction of the year. Fourth, the tax on this payslip: tax due to date minus tax already paid. A K code adds instead of taking off at step two, and BR, D0, D1 and NT skip it.</p>
<p>Taxable pay here means pay after any pension contributions taken under a net pay arrangement, and before National Insurance, which this calculator does not include.</p>

<h2>A month with a bonus</h2>
<p>Take ${h.gbp(2800)} a month with 1257L and a bonus of ${h.gbp(3000)} paid in month 4. The cumulative method taxes the bonus in the month it is paid, at the rate it reaches within the bands accrued to that month, then carries on normally. In a usual month the tax is ${h.pence(normal)}; in the bonus month it is ${h.pence(bonusTax)}, the normal tax plus ${h.pc(h.flat('BR') / 100)} of the extra ${h.gbp(3000)} here, because the total to date stays inside the basic rate band accrued by month 4.</p>
${h.table(['Month', 'Pay', 'Pay to date', 'Free pay to date', 'Tax'], rows, `1257L, ${h.Y().label}; free pay from HMRC's tables, tax by the cumulative method.`, ['r', 'r', 'r', 'r', 'r'])}
<p>A bigger bonus, or a higher salary, can cross the share of the higher rate threshold that has built up by that month even when the yearly pay stays in the basic rate band, because the bands are spread over the year. Nothing is lost: if the months after are normal, the cumulative total still ends where it should for the year.</p>
<!--tool:mini:month|{"code":"1257L M1","pay":2800}-->

<h2>Weekly, two-weekly and four-weekly pay</h2>
<p>Weekly payrolls use HMRC's week tables: ${h.pence(h.freePay(1257, 52))} of free pay a week for 1257L, and bands accrued over 52 weeks. Pay every two or four weeks uses the same week tables with the week number of the payment, so a two-weekly pay in week 10 is taxed with ten weeks of free pay and bands. That is why someone paid every four weeks has thirteen paydays a year rather than twelve, and why each one shows a little less tax than a monthly payslip of the same yearly salary.</p>

<h2>When the result does not match your payslip</h2>
<p>Check the code first: a code ending in W1, M1 or X works on the ${h.a('w1-m1-x-tax-codes', 'week 1 or month 1 basis')}, and each pay stands alone. Then check the period number and whether your pay was the same in every earlier period; if it was not, the cumulative figures on the payslip (pay to date, tax to date) are the ones to compare. A new job with a P45 also carries the previous employer's pay and tax into the calculation. If the code itself looks wrong, the ${h.a('check-my-tax-code', 'right code checker')} and your ${h.src('hmrc_check', 'HMRC online account')} are the next steps, and ${h.src('gov_paidwrong', 'GOV.UK')} explains how an overpayment comes back.</p>`;
    },
  },
});
