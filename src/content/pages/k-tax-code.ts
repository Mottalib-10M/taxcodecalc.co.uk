import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'k-tax-code', group: 'tools', order: 5,
  tool: { kind: 'kcode', props: { k: 475, pay: 1500, freq: 'monthly' } },
  mini: { kind: 'mini:kcap', props: { k: 1200, pay: 900 } },
  related: ['company-benefits-tax-code', 'state-pension-tax-code', 'underpaid-tax-code', 'tax-code-numbers', 'check-my-tax-code'],
  sources: ['gov_k', 'paye_spec', 'gov_meaning', 'gov_benefits', 'employer_2627'],
  en: {
    slug: 'k-tax-code', nav: 'K code calculator', card: 'What a K code adds to your pay, the tax it takes and the cap at half of each pay.',
    title: 'K Tax Code Calculator: Added Pay, Tax and the 50% Limit',
    description: 'A K code adds an amount to your pay before tax. Enter the number after the K and your pay to see the tax each payday, the 50% cap and what is held back.',
    h1: 'K tax code calculator',
    intro: 'The number after the K is an amount added to your pay before tax: what it costs on each payslip and where the limit stops it.',
    resume: (h) => {
      const r = h.taxPeriod('K475', 'monthly', 1500, 1);
      return `A tax code starting with K means HMRC has found more untaxed income, benefits or deductions to collect than your whole tax-free allowance, so the code works in reverse: instead of free pay, an amount is added to your pay before tax is worked out. The number is that amount without its last digit: ${h.R.kExample.code} adds ${h.gbp(h.R.kExample.add)} over the year. GOV.UK lists the usual reasons: tax owed from an earlier year collected through your wages or pension, the State Pension or taxable benefits paid without tax, company benefits such as a car, or savings interest above your Personal Savings Allowance (${h.src('gov_k', 'K in your tax code')}). On a monthly payroll, ${h.R.kExample.code} adds ${h.pence(h.freePay(475, 12))} to each month's pay; with ${h.gbp(1500)} a month it takes ${h.pence(r)} in tax. The tax taken in any one pay can never exceed ${h.Y().maxRate}% of that pay. SK and CK are the Scottish and Welsh versions.`;
    },
    faqs: (h) => [
      { q: 'How is the tax worked out with a K code?', a: `Payroll adds the K amount for the period to your pay, then taxes the total at the normal bands. For K475 that is ${h.pence(h.freePay(475, 12))} a month, the same figure HMRC's tables would give as free pay for code 475, only added instead of taken off. The cumulative method then compares the tax due to date with the tax already paid.` },
      { q: 'What happens to tax the 50% limit stops?', a: 'With a cumulative K code, the tax not taken in a low-paid period stays in the calculation and is collected in later periods if the pay allows. Whatever is still uncollected when the tax year closes does not appear on your P60; it is left for HMRC to settle with you, often through a code for the next year.' },
      { q: 'Can a K code be a mistake?', a: 'Yes, if HMRC has an out-of-date figure: a company car you handed back, a State Pension counted twice, a debt already paid or an estimate of interest that was too high. Your HMRC online account shows the items behind the code. Correct them there, and the number after the K goes down or the code returns to an L code.' },
      { q: 'Do SK and CK codes follow the same limit?', a: `Yes. The S or C only changes the bands and rates used on the total: Scottish rates from ${h.sc('scot').rates[0]}% to ${h.sc('scot').rates[5]}%, or the Welsh rates. The amount added to pay and the cap at ${h.Y().maxRate}% of each pay work the same way in every part of the UK.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [100, 475, 1000, 2000].map((k) => [`K${k}`, h.gbp(k * 10), h.pence(h.freePay(k, 12)), h.pence(h.taxPeriod(`K${k}`, 'monthly', 1800, 1))]);
      return `
<h2>What the number after the K adds</h2>
<p>For a normal code, the number times ten is the allowance. For a K code, the number times ten is the amount by which the items HMRC collects exceed the allowance. If your allowance is ${h.gbp(Y.personalAllowance)} and HMRC must collect tax on ${h.gbp(Y.personalAllowance + 4750)} of benefits and State Pension through this job, the difference of ${h.gbp(4750)} becomes K475. Payroll software turns it into an amount per period with the same table as free pay: the number times ten plus nine, divided by 12 or 52, rounded up (${h.src('paye_spec', 'PAYE specification')}).</p>
${h.table(['Code', 'Added over the year', 'Added each month', 'Tax on £1,800 in month 1'], rows, `${Y.label}, England and Northern Ireland rates, HMRC's payroll method.`, ['l', 'r', 'r', 'r'])}

<h2>The 50% limit, in practice</h2>
<p>Under a K code, no payroll may deduct tax worth more than 50% of the gross pay or pension for the period (${h.src('gov_k', 'GOV.UK')}). Payroll applies it pay by pay: if the tax worked out is higher than half of that pay, the deduction stops at half. On a cumulative code, the remainder is carried forward and taken later when your pay leaves room. A pensioner with a small workplace pension and a large State Pension is the typical case: the State Pension, paid without tax, can make the K amount larger than the pension itself.</p>
<!--tool:mini:kcap|{"k":2000,"pay":600}-->

<h2>Why HMRC uses a K code</h2>
<p>The code collects tax on income that has no tax taken off at source, through the one payment that does. Company benefits such as a car and fuel, medical insurance or a loan are reported by your employer and taxed through the code (${h.src('gov_benefits', 'tax on company benefits')}). The State Pension is paid gross, so its tax is collected from a workplace pension or a job. An underpayment from an earlier year, or a Self Assessment bill under the coding out limit of ${h.gbp(h.R.codingOutLimit)}, is added too. When these items together pass your allowance, the code turns into a K.</p>
<h2>Reading a K code on your payslip and in your account</h2>
<p>Your payslip shows only the code, for example K475 or SK475. The breakdown is in your ${h.src('hmrc_check', 'HMRC online account')} and on any coding notice: the Personal Allowance at the top, then each deduction with its amount, then the total that turns negative. Check each line against what you know. A car you no longer have, a pension counted at the wrong weekly rate, or an estimate of untaxed interest that is far above what your bank paid are the usual errors. Correcting the line changes the number, and HMRC sends the new code to the payroll within ${h.R.codeChangeWorkingDays} working days.</p>
<p>A K code on its own is not a sign of a mistake. If the items are right, it simply makes sure the tax on them is paid through the year instead of arriving as a bill after 5 April. The cumulative method also means that if the code changes during the year, the next payslip corrects the tax for the months already paid.</p>
<p>The ${h.a('check-my-tax-code', 'right code checker')} takes your benefits and State Pension and shows whether a K code is what your figures point to. The ${h.a('company-benefits-tax-code', 'company benefits page')} and the ${h.a('underpaid-tax-code', 'underpaid tax page')} explain each source of a K code, and the ${h.a('state-pension-tax-code', 'State Pension page')} the pensioner's case.</p>`;
    },
  },
});
