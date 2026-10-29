import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-code-numbers', group: 'codes', order: 13,
  tool: { kind: 'mini:allowance', props: { num: 1100 } },
  mini: { kind: 'mini:benefits', props: { pay: 35000 } },
  related: ['tax-code-letters', '1257l-tax-code', 'company-benefits-tax-code', 'state-pension-tax-code', 'p2-tax-code-notice'],
  sources: ['gov_meaning', 'gov_employee_codes', 'paye_spec', 'gov_sp_tax', 'gov_new_sp', 'gov_marriage', 'gov_k', 'gov_relief', 'gov_blind', 'hmrc_check'],
  en: {
    slug: 'tax-code-numbers', nav: 'Code numbers', card: 'How HMRC builds the number in your code, why it is a tenth of your tax-free pay, and what it means each month.',
    title: 'Tax Code Numbers: How HMRC Works Out the Figure in Your Code',
    description: 'The number in a tax code is your tax-free pay with the last digit dropped. See how HMRC builds it from allowance, deductions and additions: 1100L, 1383M.',
    h1: 'Tax code numbers',
    intro: 'From your Personal Allowance to the four digits on your payslip, and from those digits to the free pay of each month.',
    resume: (h) => {
      const Y = h.Y();
      const m = h.R.medicalExample;
      return `The number in a tax code is the yearly amount you can earn tax-free from that job or pension, with its last digit dropped. ${h.src('gov_meaning', 'GOV.UK')} describes how HMRC builds it: start from the Personal Allowance of ${h.gbp(Y.personalAllowance)}, take off income you have not paid tax on and other deductions such as company benefits, add anything that gives relief, then swap the last digit for a letter. With nothing to adjust, that gives 1257. GOV.UK's own example is medical insurance worth ${h.gbp(m.benefit)}, which leaves ${h.gbp(Y.personalAllowance - m.benefit)} and the code ${m.code}. Marriage Allowance moves ${h.gbp(Y.marriageAllowance)} between partners, giving ${h.codeFor(Y.personalAllowance + Y.marriageAllowance, 'M', 'ruk')} and ${h.codeFor(Y.personalAllowance - Y.marriageAllowance, 'N', 'ruk')}. The State Pension, paid without tax taken off, comes off the code on another pension or job, which is why many pensioners have low numbers. To read a code the other way, multiply the number by ten. The payroll then spreads it: code 1257 gives ${h.pence(h.freePay(1257, 12))} of free pay a month and ${h.pence(h.freePay(1257, 52))} a week, from HMRC's tables. When deductions exceed the allowance, the number moves behind a K and is added to pay instead.`;
    },
    faqs: (h) => [
      { q: 'Why is my tax code number lower than 1257?', a: `Something is being taken off your ${h.gbp(h.Y().personalAllowance)} allowance. The usual items are company benefits such as a car or medical insurance, a State Pension paid alongside a job or pension, untaxed income, tax owed from an earlier year, or the High Income Child Benefit Charge. Your HMRC online account lists each deduction and its amount, which you can compare with your own figures.` },
      { q: 'Can a tax code number be higher than 1257?', a: `Yes. Additions raise it. Receiving Marriage Allowance adds ${h.gbp(h.Y().marriageAllowance)} and gives ${h.codeFor(h.Y().personalAllowance + h.Y().marriageAllowance, 'M', 'ruk')}. Tax relief on job expenses claimed through your code adds the amount of the expenses, and Blind Person's Allowance adds ${h.gbp(h.Y().blindPersonsAllowance)} for ${h.Y().label}. Each one raises the free pay on every payslip.` },
      { q: 'Why is the free pay of a tax code number not exactly a twelfth?', a: `HMRC's specification builds the monthly free pay from the code number times ten, plus £9, divided by twelve and rounded up to the next penny. That is why code 1257 gives ${h.pence(h.freePay(1257, 12))} a month rather than an exact twelfth of ${h.gbp(h.Y().personalAllowance)}. The PAYE threshold of ${h.gbp(h.Y().payeThreshold.month)} a month quoted for employers is the rounded figure.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const sp = Math.round(h.R.statePensionWeekly2627 * (h.R.statePensionWeeksOld + h.R.statePensionWeeksNew) * 100) / 100;
      const examples: Array<[string, number, string]> = [
        ['Standard allowance only', Y.personalAllowance, 'L'],
        [`Medical insurance of ${h.gbp(h.R.medicalExample.benefit)}`, Y.personalAllowance - h.R.medicalExample.benefit, 'L'],
        [`Marriage Allowance received`, Y.personalAllowance + Y.marriageAllowance, 'M'],
        [`Marriage Allowance transferred`, Y.personalAllowance - Y.marriageAllowance, 'N'],
        [`Job expenses of ${h.gbp(600)} with relief`, Y.personalAllowance + 600, 'L'],
        [`Full new State Pension (${h.gbp(sp)} a year) on top of a workplace pension`, Y.personalAllowance - sp, 'L'],
      ];
      const rows = examples.map(([what, amt, l]) => [what, h.gbp(amt), h.codeFor(amt, l, 'ruk'), h.pence(h.freePay(Math.floor(amt / 10), 12))]);
      const block = h.freePay(1001, 12) - h.freePay(501, 12);
      return `
<h2>From allowance to code: worked examples</h2>
<p>Each line below starts from the ${h.gbp(Y.personalAllowance)} allowance for ${Y.label}, applies one change and drops the last digit. Dropping the digit always rounds down: ${h.gbp(Y.personalAllowance - Y.marriageAllowance)} becomes 1131, not 1132.</p>
${h.table(['Situation', 'Tax-free amount', 'Code', 'Free pay each month'], rows, `England and Northern Ireland, ${Y.label}. Medical insurance example from ${h.src('gov_meaning', 'GOV.UK')}; Marriage Allowance from ${h.src('gov_marriage', 'GOV.UK')}.`, ['l', 'r', 'l', 'r'])}
<p>The State Pension line explains a common surprise. The ${h.src('gov_new_sp', 'full new State Pension')} pays ${h.gbp(h.R.statePensionWeekly2627)} a week. HMRC counts ${h.R.statePensionWeeksOld} week at the rate before April and ${h.R.statePensionWeeksNew} weeks at the rate after it, as set out in its guide to ${h.src('gov_sp_tax', 'how the State Pension is taxed')}. At the same rate all year that is ${h.gbp(sp)}, which uses nearly all of the allowance and leaves a code of ${h.codeFor(Y.personalAllowance - sp, 'L', 'ruk')} on the workplace pension.</p>

<h2>From code back to pay</h2>
<p>The ${h.src('gov_employee_codes', 'employer guidance')} reads codes the other way: multiply the number by ten to get the income that can be earned before tax. With 1257L and a salary of ${h.gbp(27000)}, taxable income is ${h.gbp(27000 - Y.personalAllowance)}. Payroll software needs a figure per pay period, so HMRC's ${h.src('paye_spec', 'specification for PAYE tax routines')} turns the number into free pay for week 1 or month 1. For numbers up to 500, it takes the number times ten, adds £9, divides by 52 or 12 and rounds up to the penny.</p>
<p>Larger numbers are cut into blocks of 500. Each full block is worth a fixed ${h.pence(block)} a month (${h.pence(h.freePay(1001, 52) - h.freePay(501, 52))} a week), and the remainder is valued with the small-number rule. Code 1257 is two blocks plus 257: ${h.pence(2 * block)} plus ${h.pence(h.freePay(257, 12))}, which makes ${h.pence(h.freePay(1257, 12))}. If the number divides exactly by 500, one block is treated as the remainder, so 1500 is two blocks plus 500. In month 2 the free pay doubles, in month 3 it triples, and so on through the year on a cumulative code.</p>
<!--tool:mini:p2|{"old":1257,"neu":1100,"pay":32000}-->

<h2>When the number goes negative: K codes</h2>
<p>If deductions are larger than the allowance, there is nothing tax-free left, and the excess must be taxed. HMRC then puts a K in front of the number. ${h.src('gov_k', 'GOV.UK')} gives the example of ${h.R.kExample.code}: ${h.gbp(h.R.kExample.add)} is added to your pay before tax is worked out, the opposite of free pay. The same block method applies, and the tax taken in any period is capped at ${Y.maxRate}% of the pay. The ${h.a('k-tax-code', 'K code page')} covers this in detail.</p>
<p>One rule ties all of this together: the letter never changes the arithmetic. HMRC's specification says the suffix plays no part in the calculation, so 1100L, 1100M or 1100T produce the same free pay and the same tax. Only the number and any prefix, S for Scotland, C for Wales or K for an addition to pay, change what leaves your payslip.</p>

<h2>Checking your own number</h2>
<p>Your ${h.src('hmrc_check', 'HMRC online account')} shows the build of your code line by line: the allowance, each deduction, each addition and the result. Compare each line with your own records. A benefit you no longer receive, a State Pension figure from a previous year or an expense claim that has not been added are typical examples of a line that needs correcting. Changes there reach your employer as a new code, and a cumulative payroll corrects the tax for the months already paid.</p>`;
    },
  },
});
