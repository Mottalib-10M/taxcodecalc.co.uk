import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'underpaid-tax-code', group: 'situations', order: 10,
  tool: { kind: 'mini:underpaid', props: { owed: 600, rate: 0 } },
  mini: { kind: 'mini:p2', props: { old: 1257, neu: 957, pay: 30000 } },
  related: ['p800-tax-calculation', 'self-assessment-tax-code', 'k-tax-code', 'tax-code-changed', 'wrong-tax-code'],
  sources: ['gov_overunder', 'gov_paidwrong', 'gov_k', 'gov_sp_tax', 'hmrc_check', 'employer_2627'],
  en: {
    slug: 'underpaid-tax-code', nav: 'Underpaid tax', card: 'Tax you owe from last year taken through a lower code: the new number and the extra tax on each payslip.',
    title: 'Underpaid Tax Code: Owed Tax Collected Through Your Pay',
    description: 'Owe HMRC under £3,000? See how the debt is taken through next year\'s tax code, the new code number it gives and the extra tax on every payslip for 12 months.',
    h1: 'Underpaid tax collected through your tax code',
    intro: 'A lower code from April, spread over twelve payslips: the arithmetic HMRC uses and the cases where a bill arrives instead.',
    resume: (h) => {
      const Y = h.Y();
      const basic = h.sc('ruk').rates[0];
      const cut = Math.ceil((600 * 100) / basic);
      const code = h.codeFor(Y.personalAllowance - cut, 'L', 'ruk');
      const extra = h.taxYear(code, 30000) - h.taxYear('1257L', 30000);
      return `When a year closes with too little Income Tax paid, HMRC usually recovers the gap by lowering the number in your code for the next tax year, as GOV.UK explains on its ${h.src('gov_overunder', 'overpayments and underpayments guide')}. It happens on its own when three conditions meet: you pay tax through an employer or pension provider, your income above the Personal Allowance is big enough to carry the extra tax, and you owe less than ${h.gbp(h.R.codingOutLimit)}. The debt is then spread in equal instalments over ${h.R.codingOutMonths} months beginning when the next tax year starts. Since every pound removed from your allowance costs tax at your top rate, the allowance falls by the debt divided by that rate. A basic rate taxpayer who owes ${h.gbp(600)} loses ${h.gbp(cut)} of allowance at ${basic}%, so 1257L turns into ${code}, about ${h.gbp(600 / h.R.codingOutMonths)} more each month. On a ${h.gbp(30000)} salary the payroll engine gives ${h.pence(extra)} of extra tax over the year. Larger sums, or tax that pay cannot absorb, come as a Simple Assessment bill.`;
    },
    faqs: (h) => [
      { q: 'Can I pay an underpayment directly rather than have it taken through my tax code?', a: 'Yes. GOV.UK says you can pay what the tax calculation letter shows before the next tax year begins, and then your code is not reduced for it. If you leave it, HMRC lowers the code from April and your employer or pension provider collects the debt alongside your normal tax, so nothing else needs to be arranged.' },
      { q: 'Why does a small underpayment cut my tax code number so much?', a: `Because the code holds tax-free pay, not tax. Taking an amount off your allowance only costs you that amount times your tax rate. To collect ${h.gbp(600)} from a basic rate taxpayer, HMRC has to remove ${h.gbp(600 * 100 / h.sc('ruk').rates[0])} of allowance, which is ${h.num(600 * 10 / h.sc('ruk').rates[0])} points off the code number. At the higher rate the cut is half as deep for the same debt.` },
      { q: `What happens to an underpayment of ${h.gbp(h.R.codingOutLimit)} or more instead of coding out?`, a: `Coding out only applies below ${h.gbp(h.R.codingOutLimit)}. Above that, or when HMRC cannot take the tax from your wages or pension, GOV.UK says you get a Simple Assessment letter. It sets out what you owe, how to pay it and the deadline for payment. Tax on the State Pension that cannot be collected through another code can also be billed this way.` },
      { q: 'Can HMRC spread an underpaid amount across more than one tax year?', a: 'GOV.UK says where possible HMRC changes your tax code so the tax is collected over one tax year or several. Whether it uses more than one year depends on how much room your income leaves above the Personal Allowance. Your HMRC online account shows the code in use and the income estimate it rests on, so you can follow what is being recovered.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const [basic, higher] = h.sc('ruk').rates;
      const row = (owed: number, rate: number, pay: number) => {
        const cut = Math.ceil((owed * 100) / rate);
        const code = h.codeFor(Y.personalAllowance - cut, 'L', 'ruk');
        return [h.gbp(owed), `${rate}%`, h.gbp(cut), code, h.pence(h.taxYear(code, pay) - h.taxYear('1257L', pay))];
      };
      const rows = [row(300, basic, 30000), row(900, basic, 30000), row(1800, basic, 30000), row(900, higher, 70000), row(2400, higher, 70000)];
      return `
<h2>The three conditions for coding out</h2>
<p>HMRC does not ask your permission before recovering a small debt through payroll. It happens by default when your Income Tax is paid through an employer or pension provider, when you earn enough above the Personal Allowance to cover the extra deductions, and when the total owed sits under ${h.gbp(h.R.codingOutLimit)} (${h.src('gov_overunder', 'GOV.UK')}). The extra tax is then taken out of your pay or pension, usually in equal parts across the ${h.R.codingOutMonths} months that start with the following tax year. You see it as a lower number in the code shown on your April payslip, not as a separate line.</p>
<p>The same route is used for tax that builds up on income nobody taxes at source. The ${h.a('state-pension-tax-code', 'State Pension')} is paid gross, and HMRC normally collects its tax by changing the code on your wages or another pension; when that is not possible, the ${h.src('gov_sp_tax', 'DWP and HMRC guidance')} says a Simple Assessment may follow after the year ends.</p>

<h2>Turning a debt into a new code number</h2>
<p>A tax code describes how much you can earn tax-free, so HMRC cannot simply add the debt to it. It removes enough allowance for the extra tax at your rate to equal what you owe: debt divided by rate. At ${basic}%, each ${h.gbp(100)} owed costs ${h.gbp(10000 / basic)} of allowance; at ${higher}%, it costs ${h.gbp(10000 / higher)}. The table runs these cuts through the PAYE engine with equal monthly pay. Small gaps between the debt and the extra tax come from the rounding of the code number and of HMRC's tables.</p>
${h.table(['Owed', 'Rate', 'Allowance removed', 'Code next year', 'Extra tax over the year'], rows, `Basic rate rows on ${h.gbp(30000)}, higher rate rows on ${h.gbp(70000)}, England and Northern Ireland, ${Y.label} rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['r', 'r', 'r', 'l', 'r'])}
<p>When the debt is larger than the allowance left, the code number goes below zero and becomes a ${h.a('k-tax-code', 'K code')}. GOV.UK lists paying tax owed from an earlier year as one of the usual reasons for a K. Even then, the ${h.src('gov_k', 'K code rule')} stops your employer from taking more than half of your pay before tax in any pay period.</p>
<!--tool:mini:p2|{"old":1257,"neu":${h.codeFor(Y.personalAllowance - Math.ceil(90000 / basic), 'L', 'ruk').replace('L', '')},"pay":30000}-->

<h2>Where an underpayment usually comes from</h2>
<p>Most debts trace back to a code that did not match your income during the year. HMRC's own list of causes includes a wrong code built on wrong information, finishing one job and starting another with pay from both in the same month, a workplace pension that started paying, and Employment and Support Allowance or Jobseeker's Allowance received in the year. A benefit from your employer that was not yet in the code, or savings interest above your Personal Savings Allowance, has the same effect. If any of those applied to you, the ${h.a('wrong-tax-code', 'wrong code guide')} shows how to correct the record before the shortfall grows.</p>
<p>HMRC finds the gap after the year ends, once employers and pension providers have sent their figures, and writes to you between ${h.R.lettersFrom} and ${h.R.lettersTo}. The ${h.a('p800-tax-calculation', 'P800 tax calculation')} letter states the amount and tells you it will be collected through your code. Where HMRC already knows of the shortfall during the year, it can also estimate what you owe at the point your code is updated.</p>

<h2>When a bill comes instead of a lower code</h2>
<p>Coding out stops at the limit. A debt at or above ${h.gbp(h.R.codingOutLimit)}, tax that cannot be taken automatically from your income, or an amount your PAYE pay is too small to absorb, all lead to a Simple Assessment letter with its own payment deadline. HMRC also writes to explain other ways to pay whenever it cannot collect through payroll. If you are in Self Assessment, none of this applies: the return itself picks up the difference, and a balance under the limit can still be ${h.a('self-assessment-tax-code', 'paid through your code')} if you file in time.</p>

<h2>Checking the amount before April</h2>
<p>Open your ${h.src('hmrc_check', 'HMRC online account')}: it shows your current code, your Personal Allowance and the income HMRC expects you to receive, and whether the code has changed. If the figures in your calculation look wrong, GOV.UK asks you to contact HMRC and say which amounts are incorrect and what they should be; HMRC either issues a new calculation or explains why it disagrees. If the amounts are right but you prefer a clean code, paying the sum before the next tax year starts means your April code no longer carries it.</p>`;
    },
  },
});
