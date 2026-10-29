import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'personal-allowance', group: 'rules', order: 3,
  tool: { kind: 'mini:taper', props: { inc: 112000 } },
  mini: { kind: 'mini:allowance', props: { num: 1257 } },
  related: ['tax-code-over-100k', 'm-and-n-tax-codes', 'tax-code-numbers', 'tax-code-2027-28', 'child-benefit-charge-tax-code'],
  sources: ['gov_rates', 'gov_ani', 'gov_marriage', 'gov_blind', 'ootlar_annex_a', 'ratesallow', 'paye_spec'],
  en: {
    slug: 'personal-allowance', nav: 'Personal Allowance', card: 'The £12,570 tax-free amount, how it shrinks above £100,000 and how extra allowances change the code.',
    title: 'Personal Allowance 2026/27: £12,570, Taper and Your Tax Code',
    description: 'The Personal Allowance is £12,570 in 2026/27 and 2027/28. See how it falls above £100,000, how Marriage and Blind Person’s Allowance add to it, and the code.',
    h1: 'Personal Allowance',
    intro: 'The tax-free amount behind the number in your code: its size, who gets less, who gets more, and how it turns into a code.',
    resume: (h) => {
      const Y = h.Y();
      const zero = Y.incomeLimit + 2 * Y.personalAllowance;
      return `The Personal Allowance is the income you can receive in a tax year before any Income Tax is due: ${h.gbp(Y.personalAllowance)} in ${Y.label}, the same as in ${h.Y('2025-26').label}, and ${h.src('ootlar_annex_a', 'the Budget of 28 October 2026')} keeps it at ${h.gbp(h.Y('2027-28').personalAllowance)} for ${h.Y('2027-28').label}. It is the starting point of every tax code: HMRC adjusts it for your circumstances and drops the last digit, which is why the standard code reads 1257L. The allowance is cut by £1 for every £2 of adjusted net income above ${h.gbp(Y.incomeLimit)}, so on ${h.gbp(110000)} only ${h.gbp(h.pa(110000))} is left, giving ${h.codeFor(h.pa(110000), 'L', 'ruk')}, and from ${h.gbp(zero)} nothing remains. It can also grow: Marriage Allowance moves ${h.gbp(Y.marriageAllowance)} from a lower earner to a spouse or civil partner, and ${h.src('gov_blind', "Blind Person's Allowance")} adds ${h.gbp(Y.blindPersonsAllowance)} this year.`;
    },
    faqs: (h) => [
      { q: 'Is the Personal Allowance frozen at £12,570 until 2028?', a: `It is ${h.gbp(h.Y().personalAllowance)} in ${h.Y().label}, and the Budget of 28 October 2026 sets the same ${h.gbp(h.Y('2027-28').personalAllowance)} for ${h.Y('2027-28').label}, which ends on 5 April 2028. Figures for later years are not in the tables published with that Budget, so anything beyond April 2028 would have to come from a later announcement.` },
      { q: 'Do pension contributions reduce income for the Personal Allowance taper?', a: `The taper uses adjusted net income, not gross salary. Pension contributions paid gross, or grossed up when the provider has already added basic rate relief, come off your income, as do Gift Aid donations grossed up the same way. Lowering adjusted net income to ${h.gbp(h.Y().incomeLimit)} or below brings the full allowance back for the year.` },
      { q: 'How does Blind Person’s Allowance change the Personal Allowance in my tax code?', a: `It is added on top. With the standard allowance plus ${h.gbp(h.Y().blindPersonsAllowance)} in ${h.Y().label}, the tax-free total is ${h.gbp(h.Y().personalAllowance + h.Y().blindPersonsAllowance)} and the code becomes ${h.codeFor(h.Y().personalAllowance + h.Y().blindPersonsAllowance, 'L', 'ruk')}. You claim it by contacting HMRC, and if you cannot use all of it, it can be transferred to a spouse or civil partner.` },
      { q: 'Can I lose part of my Personal Allowance by transferring it to my partner?', a: `Yes, that is how Marriage Allowance works. The lower earner gives up ${h.gbp(h.Y().marriageAllowance)}, so their own code falls to ${h.codeFor(h.Y().personalAllowance - h.Y().marriageAllowance, 'N', 'ruk')} while the partner's rises to ${h.codeFor(h.Y().personalAllowance + h.Y().marriageAllowance, 'M', 'ruk')}. The partner's tax falls by up to ${h.gbp(h.R.maSaving)} a year. The lower earner may pay a little tax, but the couple still pays less overall.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const pa = Y.personalAllowance;
      const zero = Y.incomeLimit + 2 * pa;
      const incomes = [Y.incomeLimit, 105000, 110000, 115000, 120000, zero];
      const rows = incomes.map((i) => [h.gbp(i), h.gbp(h.pa(i)), h.codeFor(h.pa(i), 'L', 'ruk'), h.pence(h.due({ region: 'ruk', job1: i }))]);
      const extra = h.due({ region: 'ruk', job1: 110000 }) - h.due({ region: 'ruk', job1: Y.incomeLimit });
      const gross = 112000, pens = 8000, ani = gross - pens;
      const years = (['2025-26', '2026-27', '2027-28'] as const).map((y) => [h.Y(y).label, h.gbp(h.Y(y).personalAllowance), h.gbp(h.Y(y).marriageAllowance), h.gbp(h.Y(y).blindPersonsAllowance)]);
      return `
<h2>From allowance to code number</h2>
<p>A tax code is the Personal Allowance after HMRC has added what increases it and subtracted what it collects through your pay, divided by ten. With nothing to adjust, ${h.gbp(pa)} becomes 1257. Your employer never sees the allowance itself, only the code, and turns it back into free pay for each pay period: ${h.pence(h.freePay(1257, 12))} a month or ${h.pence(h.freePay(1257, 52))} a week for 1257, following HMRC's ${h.src('paye_spec', 'payroll specification')}, which adds £9 to the number times ten before dividing, so the free pay ends up a few pence above an exact twelfth.</p>
<p>That conversion explains why two people with the same salary can see different tax. One with ${h.codeFor(pa + Y.marriageAllowance, 'M', 'ruk')} gets ${h.pence(h.freePay(1383, 12))} of free pay a month, one with ${h.codeFor(pa - Y.marriageAllowance, 'N', 'ruk')} only ${h.pence(h.freePay(1131, 12))}. Type any code number into the converter below to see the free pay it gives.</p>
<!--tool:mini:allowance|{"num":1383}-->
${h.table(['Tax year', 'Personal Allowance', 'Marriage Allowance', "Blind Person's Allowance"], years, `From ${h.src('ratesallow', 'HMRC rates and allowances')} and ${h.src('ootlar_annex_a', 'Budget 2026, Annex A')}.`, ['l', 'r', 'r', 'r'])}

<h2>The taper above £100,000</h2>
<p>Above ${h.gbp(Y.incomeLimit)}, the allowance loses £1 for every £2 of ${h.src('gov_ani', 'adjusted net income')} over the limit, whatever your age. Adjusted net income starts from all your taxable income (pay, benefits in kind, pensions, interest, dividends, rents) and takes off certain reliefs: trading losses, pension contributions paid without relief, and the grossed-up amount of Gift Aid donations and of pension contributions where the provider has already claimed basic rate relief. Take a salary of ${h.gbp(gross)} with ${h.gbp(pens)} paid gross into a pension: adjusted net income is ${h.gbp(ani)}, so the allowance is ${h.gbp(h.pa(ani))} and the code ${h.codeFor(h.pa(ani), 'L', 'ruk')}.</p>
${h.table(['Adjusted net income', 'Allowance left', 'Code if all from one job', 'Income Tax for the year'], rows, 'England and Northern Ireland rates, income all from employment.', ['l', 'r', 'l', 'r'])}
<p>The cost is steep. Going from ${h.gbp(Y.incomeLimit)} to ${h.gbp(110000)} adds ${h.pence(extra)} of Income Tax on ${h.gbp(10000)} of extra income, because each pound earned in that zone is taxed at the higher rate and also removes fifty pence of allowance that would otherwise have covered income taxed at the same rate. Payroll only applies the code it receives, so if the code still gives the full allowance while your income is above the limit, too little tax is taken and the gap has to be collected later. The ${h.a('tax-code-over-100k', 'page on codes above £100,000')} covers how that is collected.</p>

<h2>Marriage Allowance</h2>
<p>A married couple or civil partners can move ${h.gbp(Y.marriageAllowance)} of allowance from one to the other when the giver's income is below the Personal Allowance and the receiver pays no more than the basic rate, which usually means income up to ${h.gbp(h.bandEdges('ruk')[0])}, or up to ${h.gbp(h.R.scotMaRecipientMax)} for a Scottish taxpayer paying the starter, basic or intermediate rate. Unmarried couples who live together cannot claim. The ${h.src('gov_marriage', 'claim')} can be backdated to ${h.date(h.R.maBackdateFrom)} for each year you were eligible, and it renews every year until one of you cancels it. HMRC then changes both codes: the letter N marks the giver, M the receiver. Details are on the ${h.a('m-and-n-tax-codes', 'M and N codes page')}.</p>

<h2>Blind Person's Allowance</h2>
<p>This is an extra allowance on top of the Personal Allowance: ${h.gbp(h.Y('2025-26').blindPersonsAllowance)} in ${h.Y('2025-26').label}, ${h.gbp(Y.blindPersonsAllowance)} in ${Y.label} and ${h.gbp(h.Y('2027-28').blindPersonsAllowance)} in ${h.Y('2027-28').label}. In England and Wales you qualify if your local council lists you as blind or severely sight impaired and you hold a certificate saying so. In Scotland and Northern Ireland the test is that you cannot do work for which eyesight is essential. Both spouses can get it if both are eligible, and an unused part can pass to a spouse or civil partner on form 575. Once HMRC has it, the code number rises, for example to ${h.codeFor(pa + Y.blindPersonsAllowance, 'L', 'ruk')}; you can check the result in your ${h.src('hmrc_check', 'HMRC online account')}.</p>`;
    },
  },
});
