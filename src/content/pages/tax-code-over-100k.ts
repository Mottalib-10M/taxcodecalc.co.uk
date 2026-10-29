import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-code-over-100k', group: 'situations', order: 7,
  tool: { kind: 'rightcode', props: { job1: 110000 } },
  mini: { kind: 'mini:taper', props: { inc: 110000 } },
  related: ['personal-allowance', '0t-tax-code', 'child-benefit-charge-tax-code', 'underpaid-tax-code', 'check-my-tax-code'],
  sources: ['gov_rates', 'gov_ani', 'employer_2627', 'gov_meaning', 'gov_update'],
  en: {
    slug: 'tax-code-over-100k', nav: 'Income over £100,000', card: 'Above £100,000 the allowance shrinks by £1 for every £2: the code that follows and the 60% slice of pay.',
    title: 'Tax Code Over £100k: Personal Allowance Taper and 60% Band',
    description: 'Earning over £100,000? Your Personal Allowance falls by £1 for every £2 above it and is gone at £125,140. See the code that follows and the 60% effective rate.',
    h1: 'Tax code when you earn over £100,000',
    intro: 'Past the income limit, each extra pound costs you allowance too: how the code shrinks to 0T.',
    resume: (h) => {
      const Y = h.Y();
      const zero = Y.incomeLimit + 2 * Y.personalAllowance;
      const r = h.sc('ruk').rates;
      const e = h.expected({ region: 'ruk', job1: 110000 });
      return `Once your adjusted net income goes above ${h.gbp(Y.incomeLimit)}, your Personal Allowance is cut by £1 for every £2 over that limit, and at ${h.gbp(zero)} nothing of the ${h.gbp(Y.personalAllowance)} is left (${h.src('gov_rates', 'GOV.UK, Income Tax rates')}). HMRC passes that cut into your code. On a salary of ${h.gbp(110000)}, the allowance falls to ${h.gbp(h.pa(110000))} and the expected code is ${e.main}; from ${h.gbp(zero)} upwards the code is 0T, meaning no tax-free pay at all. Between those two figures each extra £2 of income is taxed at ${r[1]}% and also removes £1 of allowance, which is itself then taxed at ${r[1]}%, so the slice from ${h.gbp(Y.incomeLimit)} to ${h.gbp(zero)} costs ${r[1] * 1.5}p in every pound. Adjusted net income is not just salary: it is your taxable income after deducting certain reliefs such as gross pension contributions and grossed-up Gift Aid, which is why those payments can restore part of the allowance (${h.src('gov_ani', 'HMRC, adjusted net income')}). The figures here are for ${Y.label}.`;
    },
    faqs: (h) => [
      { q: 'What tax code should I have on a salary of more than £100,000?', a: `It depends on how far above the limit you are. HMRC takes £1 of allowance away for each £2 of adjusted net income over ${h.gbp(h.Y().incomeLimit)}, so ${h.gbp(110000)} points to ${h.expected({ region: 'ruk', job1: 110000 }).main} and ${h.gbp(120000)} to ${h.expected({ region: 'ruk', job1: 120000 }).main}. At ${h.gbp(h.Y().incomeLimit + 2 * h.Y().personalAllowance)} or more the allowance is gone and the code becomes 0T. Company benefits or other deductions lower it further.` },
      { q: 'Why is income between £100,000 and £125,140 taxed at 60%?', a: `There is no 60% band in law. The effect comes from adding two things: the higher rate of ${h.sc('ruk').rates[1]}% on each extra pound, plus the loss of 50p of allowance per pound, which exposes another 50p to ${h.sc('ruk').rates[1]}%. Together that is ${h.sc('ruk').rates[1] * 1.5}p per pound. Going from ${h.gbp(100000)} to ${h.gbp(110000)} adds ${h.pence(h.due({ region: 'ruk', job1: 110000 }) - h.due({ region: 'ruk', job1: 100000 }))} of tax.` },
      { q: 'Can pension contributions bring back my Personal Allowance above £100,000?', a: 'They can, because the taper works on adjusted net income rather than gross pay. Pension contributions paid gross are deducted, and contributions where the provider already added basic rate relief are deducted at their grossed-up value, £1.25 for each £1 you paid. Gift Aid donations are grossed up the same way. If that brings your income back towards the limit, part or all of the allowance returns.' },
      { q: 'Why does my code over £100,000 leave me owing tax at the end of the year?', a: 'Your code is built on HMRC\'s estimate of your income. If a bonus, a pay rise or untaxed income takes you further above the limit than that estimate, your payroll keeps giving allowance you no longer have, and the shortfall appears later. Keeping the estimated income in your online account up to date lets HMRC set a code that matches what you actually earn.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const zero = Y.incomeLimit + 2 * Y.personalAllowance;
      const r = h.sc('ruk').rates;
      const rows = [100000, 105000, 110000, 115000, 120000, zero, 140000].map((p) => [h.gbp(p), h.gbp(h.pa(p)), h.expected({ region: 'ruk', job1: p }).main, h.pence(h.due({ region: 'ruk', job1: p }))]);
      const short = h.due({ region: 'ruk', job1: 110000 }) - h.taxYear('1257L', 110000);
      return `
<h2>The taper step by step</h2>
<p>The rule is mechanical. Take your adjusted net income, subtract ${h.gbp(Y.incomeLimit)}, halve the result and take that from the allowance of ${h.gbp(Y.personalAllowance)}. At ${h.gbp(zero)} the allowance reaches zero and stays there. The table applies it to salaries from one job in England or Northern Ireland with no other income, benefits or reliefs.</p>
${h.table(['Adjusted net income', 'Personal Allowance left', 'Expected code', 'Tax for the year'], rows, `Estimate for ${Y.label}; rates and limit from ${h.src('employer_2627', 'Rates and thresholds for employers')}.`, ['r', 'r', 'l', 'r'])}
<p>Above ${h.gbp(zero)}, income is taxed at the additional rate of ${r[2]}%, and the code stays at 0T. Scottish taxpayers lose their allowance on the same scale but pay Scottish rates on top, so their code reads S0T at the end of the taper.</p>
<p>A worked case makes the arithmetic visible. At ${h.gbp(115000)}, the excess over the limit is ${h.gbp(115000 - Y.incomeLimit)}; half of it, ${h.gbp((115000 - Y.incomeLimit) / 2)}, comes off the allowance, leaving ${h.gbp(h.pa(115000))}. Drop the last digit and add the letter, and the code is ${h.expected({ region: 'ruk', job1: 115000 }).main}. Compared with ${h.gbp(100000)}, the extra ${h.gbp(15000)} of income carries ${h.pence(h.due({ region: 'ruk', job1: 115000 }) - h.due({ region: 'ruk', job1: 100000 }))} of additional Income Tax, which is ${r[1] * 1.5}% of it. Above ${h.gbp(zero)}, each extra pound costs ${r[2]}p and nothing more, so the marginal rate actually falls at that point.</p>

<h2>What goes wrong when the code is not updated</h2>
<p>A code is only as good as the income HMRC expects you to earn. Suppose your record still shows a salary under the limit and the payroll keeps 1257L while you actually earn ${h.gbp(110000)}. Over the year PAYE would take ${h.pence(h.taxYear('1257L', 110000))}, while the tax due is ${h.pence(h.due({ region: 'ruk', job1: 110000 }))}: a gap of ${h.pence(short)}, exactly ${r[1]}% of the allowance you were no longer entitled to. That gap is then collected through a later code or a letter after the year. See ${h.a('underpaid-tax-code', 'how owed tax is collected through a code')}.</p>
<p>The cure is to keep the estimate in your ${h.src('hmrc_check', 'HMRC online account')} realistic, including expected bonuses and taxable benefits. HMRC can then issue a code that takes the taper into account from the start (${h.src('gov_update', 'updating your details')}).</p>
<!--tool:mini:compare|{"code":"1257L","code2":"0T","pay":125140}-->

<h2>Adjusted net income: what reduces it</h2>
<p>The taper is tested on adjusted net income, not on the figure on your contract. HMRC's guidance builds it in four steps: add up taxable income, including employment pay and benefits, pensions, savings interest, dividends and rental profit; deduct reliefs such as pension contributions paid without tax relief and trading losses; deduct grossed-up Gift Aid; then deduct grossed-up pension contributions made where the provider claimed basic rate relief (${h.src('gov_ani', 'adjusted net income')}). Salary is only the starting point, so savings or a rental flat can push you over the limit even when your pay alone sits below it.</p>
<p>The same measure decides the ${h.a('child-benefit-charge-tax-code', 'High Income Child Benefit Charge')}, which starts at a lower level. A household above both thresholds can therefore see two separate deductions working on the same code.</p>`;
    },
  },
});
