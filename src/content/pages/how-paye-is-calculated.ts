import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'how-paye-is-calculated', group: 'rules', order: 4,
  tool: { kind: 'payslip', props: { code: '1257L', pay: 2500, freq: 'monthly', period: 7 } },
  mini: { kind: 'mini:w1', props: { pay: 2500, start: 7 } },
  related: ['tax-per-payslip', 'tax-month-and-week', 'w1-m1-x-tax-codes', 'emergency-tax-code', 'k-tax-code'],
  sources: ['paye_spec', 'employer_2627', 'p9x_2026', 'gov_emergency', 'gov_k'],
  en: {
    slug: 'how-paye-is-calculated', nav: 'How PAYE works', card: 'Read the tax on your payslip: running totals, free pay to date, bonus months, refunds and the 50% limit.',
    title: 'PAYE Calculation: How Tax Is Worked Out on Each Payslip',
    description: 'PAYE taxes your pay to date, not each payslip alone. A month-by-month example on £2,500, a bonus month, why refunds appear, week 1 basis and the 50% limit.',
    h1: 'How PAYE works out the tax on your payslip',
    intro: 'Your payslip tax is the latest step of a running total kept since 6 April. Here is that total, month by month, with real figures.',
    resume: (h) => {
      const r = h.sc('ruk').rates;
      return `PAYE does not tax each payslip on its own. With a normal cumulative code such as 1257L, your employer adds up all the pay you have received since 6 April, takes off the free pay for the same number of months (${h.pence(h.freePay(1257, 12))} per month for 1257L), works out the tax due on the rest using the bands for that point of the year, and then deducts only the difference between that figure and the tax already paid. On a steady ${h.gbp(2500)} a month, that gives ${h.pence(h.taxPeriod('1257L', 'monthly', 2500, 1))} in month 1 and ${h.pence(h.taxPeriod('1257L', 'monthly', 2500, 2))} in month 2: the few pence of difference come from rounding, not from a change. A bonus is taxed at the rate your total has reached, ${r[0]}% for most basic rate earners. Pay that falls below the free pay built up so far brings a refund. Codes marked W1, M1 or X ignore the running total, and no pay can lose more than ${h.Y().maxRate}% of itself in tax.`;
    },
    faqs: (h) => [
      { q: 'Why does the PAYE tax on my payslip change by a few pence each month?', a: `Because the tax is worked out on totals to date, and HMRC's routines round down at several steps. The month 1 bands are a twelfth of the yearly bands taken to four decimal places, and each month's tax is the new total minus the old one. On ${h.gbp(2500)} a month with 1257L you will see ${h.pence(h.taxPeriod('1257L', 'monthly', 2500, 1))} some months and ${h.pence(h.taxPeriod('1257L', 'monthly', 2500, 2))} others.` },
      { q: 'Is a bonus taxed at a higher rate under PAYE?', a: `Only if your total pay to date crosses into a higher band. With a cumulative code the bonus is added to your running total, and the tax on it is whatever rate that total has reached. A basic rate earner on ${h.gbp(2500)} a month who gets ${h.gbp(5000)} extra in month 9 pays ${h.gbp(5000 * h.sc('ruk').rates[0] / 100)} more tax that month, ${h.sc('ruk').rates[0]}% of the bonus.` },
      { q: 'Can PAYE give me a tax refund in the middle of the year?', a: 'Yes, with a cumulative code. If your total tax due to date falls below what you have already paid, the payslip shows a negative tax figure and the difference is added to your net pay. This happens after unpaid leave, a fall in pay, a new code with a higher number, or the switch from an emergency code to a normal one.' },
      { q: 'What happens to PAYE tax that cannot be taken because of the 50% limit?', a: 'On a cumulative code, the tax held back stays in the running total and payroll tries to collect it on later pays when there is room. On a week 1 or month 1 code, each pay stands alone, so the shortfall is not carried forward. Anything still unpaid at the end of the tax year is settled between you and HMRC, not by your employer.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      const pay = 2500;
      const fp = h.freePay(1257, 12);
      const tax = (n: number) => h.taxPeriod('1257L', 'monthly', pay, n);
      let toDate = 0;
      const all = Array.from({ length: 12 }, (_, i) => { toDate += tax(i + 1); return toDate; });
      const rows = [1, 2, 3, 6, 9, 12].map((n) => [
        `Month ${n}`, h.gbp(pay * n), h.pence(fp * n), h.pence(pay * n * 100 - fp * n), h.pence(all[n - 1]), h.pence(tax(n)),
      ]);
      const bonus = 5000;
      const bonusTax = tax(9) + bonus * r[0];
      const m1Bonus = h.taxPeriod('1257L M1', 'monthly', pay + bonus, 1);
      const em = h.emergency({ freq: 'monthly', pay, start: 7, periods: 2, emergency: `${Y.emergencyCode} M1`, correct: '1257L' });
      const kTax = h.taxPeriod('K2000', 'monthly', 600, 1);
      return `
<h2>Reading the running total: £2,500 a month on 1257L</h2>
<p>Most payslips show only this month's figures, but behind them payroll keeps a set of year-to-date totals. Each month it adds the new pay, multiplies the monthly free pay by the month number, and taxes the difference against bands that also grow one twelfth at a time. The tax on the payslip is simply the new tax to date minus the old one. Your P60 at the end of the year shows the last line of that running total.</p>
${h.table(['Tax month', 'Pay to date', 'Free pay to date', 'Taxable to date', 'Tax to date', 'Tax this month'], rows, `Code 1257L, ${Y.label}, same pay every month, England and Northern Ireland rates. Tax rounded as in HMRC's routines.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>By month 12 the tax to date is ${h.pence(all[11])}, which is what the whole year's salary of ${h.gbp(pay * 12)} owes. That is the point of the cumulative method: if nothing changes, the year ends with the right tax already paid and nothing to settle. The calculator at the top of the page shows the same totals for any code, pay and tax month.</p>

<h2>A bonus month</h2>
<p>Suppose the same employee gets a ${h.gbp(bonus)} bonus with the December pay, which is tax month 9. Payroll adds ${h.gbp(pay + bonus)} to the running total. The taxable pay to date is still well inside nine twelfths of the basic rate band, so the extra ${h.gbp(bonus)} is taxed at ${r[0]}%: the month's tax becomes ${h.pence(bonusTax)} instead of ${h.pence(tax(9))}, and January goes back to normal. Nothing is overcharged, because the bonus is spread against the allowance and bands of the whole year so far.</p>
<p>The picture is different on a month 1 code. There, the same ${h.gbp(pay + bonus)} is measured against one month's free pay and one twelfth of each band only, so part of the bonus lands in the higher rate band and the month's tax is ${h.pence(m1Bonus)}. The difference is not refunded later on that basis; it comes back only when HMRC issues a cumulative code or settles the year.</p>

<h2>Why refunds appear on a payslip</h2>
<p>Because the free pay builds up month after month whether or not you are paid, any month where the running total of pay falls behind the running total of free pay produces negative tax. Three common cases:</p>
<ul>
<li><strong>Starting work part way through the year.</strong> Someone with no earlier job who starts in October (month 7) on ${h.gbp(pay)} a month has seven months of free pay, ${h.pence(fp * 7)}, against one month of pay, so the cumulative code takes nothing at first.</li>
<li><strong>Leaving an emergency code.</strong> If that same person is put on ${Y.emergencyCode} M1 for two months, ${h.pence(em.onEmergency)} is taken. When the cumulative 1257L reaches the payroll, the tax due to date is ${h.pence(em.right)}, so ${h.pence(em.back)} comes back in one go.</li>
<li><strong>A lower month or a better code.</strong> Unpaid leave, a cut in hours or a new code with a higher number all lower the tax due to date below what has been paid, and the gap is refunded through net pay.</li>
</ul>
<!--tool:mini:w1|{"pay":2500,"start":7}-->

<h2>Week 1 and month 1 basis</h2>
<p>When a code ends in W1, M1 or X, payroll stops looking at the running total. Each pay is treated as if it were the first of the year: one week's or one month's free pay, the bands for period 1, and no credit for months already gone. On a steady salary from April, the two methods give about the same tax. They split apart when pay varies, when you start mid-year, or when you have had months without work, and the cumulative method is the one that matches the tax you actually owe for the year. GOV.UK explains when HMRC uses the ${h.src('gov_emergency', 'emergency basis')}; the ${h.a('w1-m1-x-tax-codes', 'W1, M1 and X page')} goes through the codes themselves.</p>

<h2>The 50% limit</h2>
<p>Whatever the code, payroll cannot take more than ${Y.maxRate}% of a single pay in tax, leaving aside payrolled benefits. It rarely matters for an L code, but it does for a ${h.a('k-tax-code', 'K code')}, which adds an amount to pay instead of taking one off. An employee on K2000 who earns ${h.gbp(600)} in a month would owe more than half the pay under the bands, so the payslip shows ${h.pence(kTax)}, exactly half, and the rest waits in the running total for a month with more room, as set out in HMRC's ${h.src('paye_spec', 'payroll specification')} and the ${h.src('gov_k', 'GOV.UK guidance on K codes')}. If a payslip does not match these patterns, the code in your ${h.src('hmrc_check', 'HMRC online account')} is the first thing to check.</p>`;
    },
  },
});
