import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 't-tax-code', group: 'codes', order: 11,
  tool: { kind: 'decoder', props: { code: '1257T', pay: 30000 } },
  mini: { kind: 'mini:p2', props: { old: 1257, neu: 1150, pay: 30000 } },
  related: ['tax-code-letters', 'tax-code-numbers', 'p2-tax-code-notice', 'check-my-tax-code', 'wrong-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'paye_spec', 'p9x_2026', 'hmrc_check', 'gov_update'],
  en: {
    slug: 't-tax-code', nav: 'T', card: 'A code ending in T: same rates as L, but an allowance HMRC reviews by hand instead of updating it automatically.',
    title: 'T Tax Code: Other Calculations in Your Personal Allowance',
    description: 'A code ending in T, such as 1257T, means your allowance includes other calculations HMRC needs to review. See what changes on pay and why HMRC sets it by hand.',
    h1: 'T tax code',
    intro: 'A letter that changes nothing in the arithmetic, but a lot in how HMRC handles your code.',
    resume: (h) => {
      const Y = h.Y();
      return `A tax code ending in T, such as 1257T or 1150T, means your Personal Allowance includes other calculations. ${h.src('gov_meaning', 'GOV.UK')} gives exactly that definition, and the ${h.src('gov_employee_codes', 'employer guidance')} adds that T is used when HMRC has to go through some items with you. For your pay, the T works like an L. The number is still the tax-free amount with the last digit dropped, the free pay is the same, and the pay above it is taxed at ${h.sc('ruk').rates.join(', ')}% according to the bands for ${Y.label}. On ${h.gbp(30000)} a year, 1257T takes ${h.pence(h.taxYear('1257T', 30000))}, the same as 1257L. The difference is administrative. HMRC's ${h.src('paye_spec', 'PAYE specification')} says the suffix plays no part in the tax calculation; it tells employers which codes they may change themselves when HMRC issues a general uplift. Codes ending in L, M or N can be raised that way, but T codes cannot: HMRC amends them one by one with an individual notice. If your code ends in T, check the items behind it in your ${h.src('hmrc_check', 'HMRC online account')}.`;
    },
    faqs: (h) => [
      { q: 'Do I pay more tax with a T tax code than with an L code?', a: `No, not for the same number. The letter does not enter the payroll calculation, so 1257T and 1257L give identical free pay of ${h.pence(h.freePay(1257, 12))} a month and identical tax. What can differ is the number: a T code often comes with a number that reflects adjustments HMRC is reviewing, and that number drives the tax, not the letter.` },
      { q: 'Why will my T tax code not change in a new tax year like other codes?', a: 'HMRC’s payroll specification says that suffix codes can be raised by employers under a general authority on forms P7X or P9X, which covers codes ending in L, M and N. Codes ending in T are left out of those general changes. If a T code needs a new number, HMRC sends the employer an individual notice instead, so it only moves when HMRC reviews it.' },
      { q: 'How do I find out what the T in my tax code is reviewing?', a: 'GOV.UK does not list the items behind a T code. The calculation of your allowance, including deductions, additions and the estimated income HMRC uses, is shown in your HMRC online account and on any coding notice HMRC sends. If an item there is wrong or out of date, update it in the account; HMRC updates the code if it needs to change.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [[1257, 30000], [1150, 30000], [1050, 42000], [900, 25000]].map(([n, p]) => [`${n}T`, h.gbp(n * 10), h.pence(h.freePay(n, 12)), h.gbp(p), h.pence(h.taxYear(`${n}T`, p)), h.pence(h.taxYear(`${n}L`, p))]);
      return `
<h2>What the T changes, and what it does not</h2>
<p>Every suffix letter sits at the end of a number. The number is what the payroll uses: multiply it by ten for the yearly tax-free amount, then spread it across the weeks or months using HMRC's tables. The letter only labels the situation. For L, that label is the standard allowance; for M and N, a Marriage Allowance transfer; for T, an allowance worked out with other calculations that HMRC wants to keep under review.</p>
${h.table(['Code', 'Tax-free a year', 'Free pay each month', 'Yearly pay', 'Tax with the T code', 'Tax with the same number and L'], rows, `Income Tax, ${Y.label}, England and Northern Ireland, equal monthly pay. Examples of code numbers, not HMRC figures.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The last two columns are equal on every line. If your code moved from 1257L to 1150T, the extra tax comes from the lower number, not from the T.</p>

<h2>Why HMRC keeps T codes apart</h2>
<p>The ${h.src('paye_spec', 'PAYE specification')} explains what suffixes are really for. When HMRC raises allowances, it can send a general authority to every employer: form P7X for a change during the year, form P9X for a change from 6 April. Employers then add the same amount to every code carrying the suffixes named in it, which are L, M and N. Prefix codes such as BR, D0 or K are not changed that way, and neither are codes ending in T. Those are amended, where needed, by an individual notice from HMRC, a form P6 during the year or a P9 for the new year.</p>
<p>In practice, a T code is one that HMRC reviews individually rather than letting it move with a general change. For the coming year, HMRC's ${h.src('p9x_2026', 'P9X notice')} tells employers to carry forward the existing code for anyone who does not receive a new one, so a T code simply continues on 6 April unless HMRC sends a replacement.</p>
<!--tool:mini:allowance|{"num":1150}-->

<h2>What to do when your code ends in T</h2>
<p>A T code is not a mistake in itself. It is worth checking, though, because the review it signals can lag behind your real situation. Sign in to your ${h.src('hmrc_check', 'HMRC online account')} and look at the calculation of your allowance: the starting Personal Allowance of ${h.gbp(Y.personalAllowance)}, every deduction taken off and every addition made, and the income HMRC expects you to receive this year. Compare it with your payslips and with any benefits or expenses you know about.</p>
<p>If something is wrong, update it there. GOV.UK's page on ${h.src('gov_update', 'updating a tax code')} says HMRC then sends the new code to you and your employer within ${h.R.codeChangeWorkingDays} working days, and it should reach a monthly payslip within one or two pay days. Once the items under review are settled, the code may return to an L with the right number, or keep the T with an updated one.</p>

<h2>T codes next to the other letters</h2>
<p>Do not confuse the suffix with the T inside ${h.a('0t-tax-code', '0T')} and ${h.a('nt-tax-code', 'NT')}. The specification treats T as the suffix of both: 0T is a zero allowance with the normal bands, and NT means no tax at all. A code such as 1257T has a real allowance and normal rates. The ${h.a('tax-code-letters', 'table of letters')} places T among all the others, and the ${h.a('tax-code-numbers', 'page on code numbers')} shows how the number in front is built.</p>`;
    },
  },
});
