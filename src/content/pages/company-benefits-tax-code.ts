import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'company-benefits-tax-code', group: 'situations', order: 6,
  tool: { kind: 'rightcode', props: { job1: 35000, bik: 1570 } },
  mini: { kind: 'mini:benefits', props: { bik: 1570, pay: 35000 } },
  related: ['k-tax-code', 'tax-code-numbers', 'p2-tax-code-notice', 'check-my-tax-code', 'tax-code-changed'],
  sources: ['gov_benefits', 'gov_meaning', 'gov_p45', 'gov_k', 'gov_emergency', 'gov_employee_codes'],
  en: {
    slug: 'company-benefits-tax-code', nav: 'Company benefits', card: 'Company car, fuel or medical insurance: how a benefit in kind lowers the number in your code, down to a K code.',
    title: 'Company Benefits Tax Code: Car, Medical Cover and K Codes',
    description: 'A company car, fuel or medical insurance lowers your tax code: £1,570 of benefit turns 1257L into 1100L. See the extra tax each month and when a K code appears.',
    h1: 'Company benefits and your tax code',
    intro: 'A benefit in kind is taxed through your salary: HMRC takes its value off your allowance, and the code falls.',
    resume: (h) => {
      const Y = h.Y();
      const m = h.R.medicalExample;
      const extra = h.taxYear(m.code, 35000) - h.taxYear('1257L', 35000);
      return `Company benefits such as a car you can use privately, fuel for personal journeys, medical insurance, accommodation or a cheap loan are taxed through PAYE rather than billed separately. Your employer works out the yearly value of each benefit, and HMRC takes that value off your Personal Allowance before turning what is left into your code (${h.src('gov_benefits', 'GOV.UK, tax on company benefits')}). GOV.UK's own example is medical insurance worth ${h.gbp(m.benefit)}: the allowance of ${h.gbp(Y.personalAllowance)} drops to ${h.gbp(Y.personalAllowance - m.benefit)} and the code becomes ${m.code} (${h.src('gov_meaning', 'what your tax code means')}). On a salary of ${h.gbp(35000)}, that change costs ${h.pence(extra)} over ${Y.label}, about ${h.pence(Math.round(extra / 12))} a month, which is ${h.sc('ruk').rates[0]}% of the benefit. When benefits are worth more than the whole allowance, the code turns into a K code and an amount is added to your taxable pay instead. Some employers tax benefits directly through payroll, in which case no P11D is sent for them.`;
    },
    faqs: (h) => [
      { q: 'Why did my tax code drop after I got a company car?', a: 'Because the car has a taxable value for private use, including commuting. Your employer reports that value, and HMRC deducts it from your allowance so the tax is collected through your salary. The value depends on the list price, the fuel type and the CO2 emissions, and falls if you have the car part-time or contribute to its cost. Fuel paid for private trips is taxed on top.' },
      { q: 'When do company benefits turn my tax code into a K code?', a: `When their total value, with any other deductions, is larger than your Personal Allowance. A K code adds the excess to your pay before tax is worked out. A benefit of ${h.gbp(15000)} on a ${h.gbp(35000)} salary points to ${h.expected({ region: 'ruk', job1: 35000, bik: 15000 }).main}. The employer may not deduct more than half of your pay before tax in any pay period under a K code.` },
      { q: 'Do I still get a P11D if my employer payrolls my company benefits?', a: 'Not for those benefits. GOV.UK explains that when your employer takes the tax on a benefit directly from your pay, it does not need to submit a P11D for it, and it should write to you to explain the arrangement. You can still ask your employer for a record of the benefits it reported and their values, or contact HMRC if it cannot give you one.' },
      { q: 'Must I tell HMRC when a company benefit starts or stops?', a: 'Yes. GOV.UK says you must tell HMRC about any work benefit that you or your family begin or stop receiving, even when your employer already deducts tax for it. For a company car, report it only once you have started using it. Car and fuel changes can be made through the company car service, and HMRC then updates your code.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const pay = 35000;
      const rows = [h.R.medicalExample.benefit, 4000, 8000, 15000].map((b) => {
        const code = h.expected({ region: 'ruk', job1: pay, bik: b }).main;
        const extra = h.taxYear(code, pay) - h.taxYear('1257L', pay);
        return [h.gbp(b), code, h.pence(extra), h.pence(Math.round(extra / 12))];
      });
      return `
<h2>How a benefit becomes a smaller number</h2>
<p>HMRC builds a code by starting from your allowance and subtracting anything it needs to tax through your pay, then dropping the last digit. A benefit in kind is one of those subtractions. If you receive ${h.gbp(4000)} of benefits, your payroll gets ${h.gbp(Y.personalAllowance - 4000)} of tax-free pay instead of ${h.gbp(Y.personalAllowance)}, and the extra tax comes out evenly across the year. You do not pay a separate bill for the benefit; it simply rides on your salary.</p>
<p>What a benefit costs you depends on your top rate, not on the benefit alone. On ${h.gbp(pay)} the lost allowance is taxed at ${h.sc('ruk').rates[0]}%. On ${h.gbp(60000)}, the same medical insurance moves the code to ${h.expected({ region: 'ruk', job1: 60000, bik: h.R.medicalExample.benefit }).main} and costs ${h.pence(h.taxYear(h.R.medicalExample.code, 60000) - h.taxYear('1257L', 60000))} a year, because the slice of pay it exposes is taxed at ${h.sc('ruk').rates[1]}%.</p>
<p>The table shows four benefit values on a ${h.gbp(pay)} salary in England or Northern Ireland, compared with the standard code.</p>
${h.table(['Benefit value a year', 'Code', 'Extra tax a year', 'Extra each month'], rows, `Estimate for ${Y.label}, salary of ${h.gbp(pay)} paid monthly; ${h.R.medicalExample.code} is GOV.UK's worked example.`, ['r', 'l', 'r', 'r'])}
<p>The last row is the turning point. Benefits worth more than the allowance leave nothing to give, so the code switches to K and the number shows what is added to pay (${h.src('gov_k', 'K in your tax code')}). An employer using a ${h.a('k-tax-code', 'K code')} can never take over half of your pre-tax pay in any period.</p>
<!--tool:mini:kcap|{"k":243,"pay":2900}-->

<h2>Which benefits count</h2>
<p>A company car you or your family use privately is taxed on its value to you, which turns on the cost of the car, its fuel type and its CO2 emissions. Fuel your employer pays for personal journeys is a second benefit. Medical insurance is normally taxed on the premiums. Interest-free or cheap loans above a set size, and accommodation provided by your employer, are taxable too. Some benefits are free of tax, including meals in a staff canteen, a mobile phone and workplace parking, so they never reach your code.</p>
<p>When a benefit starts mid-year, you might see an emergency code for the rest of that year while HMRC catches up; GOV.UK calls this normal (${h.src('gov_emergency', 'emergency tax codes')}). Check that the benefit shows in your ${h.src('hmrc_check', 'HMRC online account')} at the right value, and correct it there if not.</p>

<h2>P11D, payrolled benefits and your records</h2>
<p>An employer can report benefits after the year on a P11D, or it can tax them through payroll as it goes. In the second case no P11D is needed and the employer writes to you to explain how it works (${h.src('gov_p45', 'P11D on GOV.UK')}). Either way, at the end of each tax year you should receive details of the benefits reported for you. Keep them: they are what you compare with your code if the figures look wrong.</p>
<p>When a benefit ends, such as handing back a company car, tell HMRC so that the deduction comes out of your code. Without that, your allowance stays reduced and too much tax is taken until the record is fixed. Any new code reaches you and the employer within ${h.R.codeChangeWorkingDays} working days, and if you overpaid in the meantime the excess is usually refunded through payroll.</p>`;
    },
  },
});
