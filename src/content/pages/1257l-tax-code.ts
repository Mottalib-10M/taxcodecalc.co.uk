import { definePage } from '../../lib/guide-types';

export default definePage({
  id: '1257l-tax-code', group: 'codes', order: 1,
  tool: { kind: 'decoder', props: { code: '1257L', pay: 30000 } },
  mini: { kind: 'mini:allowance', props: { num: 1257 } },
  related: ['w1-m1-x-tax-codes', 's1257l-tax-code', 'm-and-n-tax-codes', 'tax-per-payslip', 'check-my-tax-code'],
  sources: ['gov_meaning', 'employer_2627', 'paye_spec', 'p9x_2026', 'ootlar_annex_a'],
  en: {
    slug: '1257l-tax-code', nav: '1257L', card: 'The standard code: £12,570 tax-free, cumulative, and what it takes from your pay each month.',
    title: '1257L Tax Code: Meaning, Tax-Free Pay and Monthly Tax',
    description: '1257L is the standard UK tax code: £12,570 tax-free a year, about £1,048 a month. See the tax it takes on your pay and when 1257L is not the right code.',
    h1: '1257L tax code',
    intro: 'The code most people with one job or pension have: what it gives you tax-free and what it takes from your pay.',
    resume: (h) => {
      const Y = h.Y();
      return `1257L is the tax code HMRC gives to most people who have one job or one pension and nothing that changes their allowance. The number 1257 is the tax-free amount with its last digit dropped: ${h.gbp(Y.personalAllowance)}, the Personal Allowance for ${Y.label}, which ${h.src('ootlar_annex_a', 'the Budget of 28 October 2026')} keeps at the same level for ${h.Y('2027-28').label}. The letter L means the standard allowance, with no Marriage Allowance, benefit or deduction mixed in. On a monthly payroll the code gives ${h.pence(h.freePay(1257, 12))} of free pay each month and ${h.pence(h.freePay(1257, 52))} each week, slightly above a twelfth of the allowance because HMRC's tables add £9 to the code number times ten. The rest of the pay is taxed at ${h.sc('ruk').rates.join(', ')}% in England and Northern Ireland. On ${h.gbp(30000)} a year it takes ${h.pence(h.taxYear('1257L', 30000))} of Income Tax over the year. 1257L is cumulative: if it ends in W1, M1 or X it becomes the emergency code instead.`;
    },
    faqs: (h) => [
      { q: 'Is 1257L the right code for me?', a: `It is right when you have one job or pension, no taxable company benefits, no untaxed income HMRC collects through your pay, no Marriage Allowance and an income under ${h.gbp(h.Y().incomeLimit)}. A second job usually needs BR, the State Pension or a company car usually lowers the number, and Marriage Allowance changes the letter to M or N.` },
      { q: 'Why is my code 1257L M1 instead of 1257L?', a: 'M1 means month 1 basis, the emergency version of the code. Each month is taxed on its own with one twelfth of the allowance, so the unused allowance of earlier months does not come back. It is usual just after starting a job. HMRC normally replaces it with plain 1257L once it has your income details.' },
      { q: 'How much tax-free pay does 1257L give each month?', a: `Payroll software uses ${h.pence(h.freePay(1257, 12))} of free pay per month, from HMRC's table for code 1257. The PAYE threshold quoted for employers is rounded to ${h.gbp(h.Y().payeThreshold.month)} a month and ${h.gbp(h.Y().payeThreshold.week)} a week. If you earn less than that in a month with 1257L, no Income Tax is taken that month.` },
      { q: 'Will 1257L change in April 2027?', a: `The Budget of 28 October 2026 keeps the Personal Allowance at ${h.gbp(h.Y('2027-28').personalAllowance)} for ${h.Y('2027-28').label}, so the standard code stays 1257L. HMRC confirms the emergency code for the year in its P9X notice, usually published in January or February before the tax year starts.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('ruk');
      const rows = [20000, 30000, 45000, 60000].map((p) => [h.gbp(p), h.pence(h.taxPeriod('1257L', 'monthly', p / 12, 1)), h.pence(h.taxYear('1257L', p))]);
      return `
<h2>What each part of 1257L means</h2>
<p>The number is the allowance divided by ten: ${h.gbp(Y.personalAllowance)} becomes 1257. HMRC starts from your Personal Allowance, takes off anything it collects through your pay, such as company benefits, and adds anything that gives relief, such as job expenses, then drops the last digit (${h.src('gov_meaning', 'GOV.UK')}). With nothing to add or take off, the number stays 1257. The letter L says you get the standard allowance. Without a prefix, the code applies the rates for England and Northern Ireland; S1257L applies the Scottish rates and C1257L the Welsh ones.</p>
<p>Unless the code ends in W1, M1 or X, it is cumulative. Your employer adds up your pay since 6 April, takes off the free pay for the same number of weeks or months and works out the tax due to date. If you started in October after months without work, the allowance of April to September counts too, and your first payslips may show little or no tax.</p>

<h2>Tax taken with 1257L at different salaries</h2>
<p>These figures follow HMRC's payroll method for ${Y.label} with the same pay every month and no other income. The basic rate applies up to ${h.gbp(e[0])} of gross pay, the higher rate up to ${h.gbp(e[1])}. Above ${h.gbp(Y.incomeLimit)} the allowance shrinks, so 1257L is no longer the right code.</p>
${h.table(['Yearly pay', 'Tax in month 1', 'Tax over the year'], rows, `Income Tax only, England and Northern Ireland, ${Y.label}; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r'])}
<!--tool:mini:month|{"code":"1257L","pay":2500}-->

<h2>When 1257L is not the right code</h2>
<p>A second job or pension cannot get a second Personal Allowance, so it is normally coded ${h.a('br-tax-code', 'BR')}, and only one source shows 1257L. The ${h.a('state-pension-tax-code', 'State Pension')} is paid without tax taken off, so its yearly amount comes off the code on your other pension or job. ${h.a('company-benefits-tax-code', 'Company benefits')} such as a car or medical insurance lower the number: GOV.UK's example of medical insurance worth ${h.gbp(h.R.medicalExample.benefit)} gives ${h.R.medicalExample.code}. ${h.a('m-and-n-tax-codes', 'Marriage Allowance')} adds or removes ${h.gbp(Y.marriageAllowance)} and changes the letter. Above ${h.gbp(Y.incomeLimit)} of adjusted net income, the ${h.a('tax-code-over-100k', 'allowance tapers')} and the number falls.</p>
<p>If one of these applies and your payslip still shows 1257L, the tax taken may be too low, and the shortfall is collected later through a lower code. If none applies and you see a different code, check your record in your ${h.src('hmrc_check', 'HMRC online account')}, where each job and pension is listed with the figures that make up its code.</p>

<h2>1257L and the emergency code</h2>
<p>For ${Y.label}, HMRC's ${h.src('p9x_2026', 'P9X notice')} sets the emergency code at ${Y.emergencyCode}, used on a week 1 or month 1 basis when an employer has no P45 or starter details. It looks the same as the standard code with W1, M1 or X at the end. The difference is in the arithmetic: on the emergency basis, each pay gets only one week's or one month's allowance, and earlier months are ignored. The ${h.a('emergency-tax-code', 'emergency tax calculator')} shows what comes back when HMRC switches you to plain 1257L.</p>`;
    },
  },
});
