import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'self-assessment-tax-code', group: 'situations', order: 11,
  tool: { kind: 'mini:sacode', props: { bill: 1200, paye: 30000 } },
  mini: { kind: 'mini:underpaid', props: { owed: 1200, rate: 0 } },
  related: ['underpaid-tax-code', 'p800-tax-calculation', 'tax-code-changed', 'k-tax-code', 'check-my-tax-code'],
  sources: ['gov_sa_code', 'gov_overunder', 'gov_k', 'hmrc_check', 'employer_2627'],
  demarche: true,
  en: {
    slug: 'self-assessment-tax-code', nav: 'Self Assessment through your code', card: 'Paying a Self Assessment balance through PAYE: the conditions, the refusals and what it costs each month.',
    title: 'Self Assessment Through Your Tax Code: Rules and Limits',
    description: 'Pay a Self Assessment bill under £3,000 through your PAYE code: the filing dates that allow it, the cases HMRC refuses, and the extra tax taken each month.',
    h1: 'Paying Self Assessment through your tax code',
    intro: 'A balance from your tax return, collected by your employer or pension provider over the next tax year: who qualifies and what it does to each payslip.',
    resume: (h) => {
      const bill = 1200;
      const usual = h.due({ region: 'ruk', job1: 30000 });
      return `A Self Assessment balance can be collected through your PAYE tax code instead of being paid to HMRC in one go, provided three conditions all hold, according to ${h.src('gov_sa_code', 'GOV.UK')}: the bill is under ${h.gbp(h.R.codingOutLimit)}, you already pay tax through PAYE as an employee or with a workplace or private pension, and your return reached HMRC by ${h.R.saPaperBy} on paper or by ${h.R.saOnlineBy} online. When they do, HMRC sets it up on its own unless you asked on your return for it not to. The amount is then spread evenly over ${h.R.codingOutMonths} months and deducted from your salary or pension, on top of your normal deductions. A ${h.gbp(bill)} bill means about ${h.gbp(bill / h.R.codingOutMonths)} more each month. HMRC refuses when your PAYE income is too small, when the total would exceed half of that income, or when you would end up paying more than twice your usual tax: on ${h.gbp(30000)} of salary the usual tax is ${h.pence(usual)}, so the ceiling is generous; on a small part-time wage it is not.`;
    },
    faqs: (h) => [
      { q: 'Can I lower my Self Assessment bill with a part payment so it fits in my tax code?', a: `No. GOV.UK says the limit of ${h.gbp(h.R.codingOutLimit)} applies to what you owed on the return, and a bill at or above that amount that you reduced by paying part of it cannot then be collected through PAYE. The whole balance must be paid by one of the other methods, by the payment deadline that applies to your return.` },
      { q: 'How can I check online that a Self Assessment payment made outside my tax code has arrived?', a: 'Sign in to your HMRC online account. Electronic or online payments sent recently appear in the Your balance section, while other methods take longer to show. Once HMRC has processed the payment, it moves to View payments and credits. If nothing appears after several days, GOV.UK suggests asking your bank to confirm that the payment actually left your account.' },
      { q: 'Can I refuse to pay my Self Assessment bill through my tax code?', a: 'Yes. Collection through the code is automatic when you qualify, but the tax return lets you say that you do not want it. If you make that request, you pay the balance directly to HMRC by the normal deadline instead. This can suit you if you prefer your monthly pay to stay the same over the next year.' },
      { q: 'Can a self-employed person pay Class 2 National Insurance through a PAYE code?', a: 'Only in a narrow case. GOV.UK says Class 2 National Insurance cannot be collected through your tax code unless it has been due since before 6 April 2015. For anything more recent, a self-employed person who also has a job must use one of the other payment methods and meet the deadline, even if the Income Tax part goes through the code.' },
    ],
    body: (h) => {
      const bill = 1500;
      const rows = [12000, 16000, 20000, 25000, 40000].map((pay) => {
        const usual = h.due({ region: 'ruk', job1: pay }) / 100;
        const total = usual + bill;
        const ok = bill < h.R.codingOutLimit && total <= pay / 2 && total <= usual * 2;
        return [h.gbp(pay), h.gbp(Math.round(usual)), h.gbp(Math.round(total)), h.gbp(Math.round(usual * 2)), ok ? 'yes' : 'no, pay directly'];
      });
      const Y = h.Y();
      const basic = h.sc('ruk').rates[0];
      return `
<h2>The three conditions and the filing dates</h2>
<p>Coding out a Self Assessment balance is not something you apply for separately. HMRC does it when each of these is true (${h.src('gov_sa_code', 'GOV.UK')}):</p>
<ul>
<li>you owe less than ${h.gbp(h.R.codingOutLimit)} on the tax bill;</li>
<li>PAYE already takes your tax, for instance as an employee or through a company pension;</li>
<li>your paper return arrived by ${h.R.saPaperBy}, or your online return by ${h.R.saOnlineBy}.</li>
</ul>
<p>The two dates are the practical hurdle. Filing on paper gives you a shorter window than filing online, and a return sent after the relevant date cannot use your code, even if the amount and the income would otherwise qualify. If you want the balance spread through your pay, file online early in the autumn and do not ask, on the return, for the balance to be kept out of your code.</p>

<h2>The cases where HMRC will not use your code</h2>
<p>Meeting the three conditions is not the end of it. GOV.UK lists four situations in which the bill stays outside PAYE: your PAYE income is too low for HMRC to collect it; the collection would mean paying more than half of your PAYE income in tax; you would end up paying more than twice your normal tax; or you owed ${h.gbp(h.R.codingOutLimit)} or more and paid part of it to get under the limit. The table applies the two income tests to a ${h.gbp(bill)} bill at several salaries, with the ${Y.label} rates for England and Northern Ireland.</p>
${h.table(['PAYE pay', 'Usual tax', 'Usual tax plus bill', 'Twice the usual tax', 'Through the code?'], rows, `Illustration of the GOV.UK tests on a ${h.gbp(bill)} balance; Income Tax only, rates from ${h.src('employer_2627', 'GOV.UK')}. HMRC makes the final decision.`, ['r', 'r', 'r', 'r', 'l'])}
<p>The pattern is clear. On a modest wage the usual tax is small, so even a mid-sized bill more than doubles it and the twice-the-usual test fails. Once the usual tax reaches the size of the bill, the twice-the-usual test is met, and on these salaries the half-of-pay test is met too. The calculator at the top runs the same checks on your own figures.</p>

<h2>What the coded balance does to your payslips</h2>
<p>Once accepted, the balance is deducted in equal amounts from your salary or pension over ${h.R.codingOutMonths} months, together with your usual tax. In practice HMRC lowers the number in your code so that the allowance lost, taxed at your rate, matches the debt; the same arithmetic as for an ${h.a('underpaid-tax-code', 'ordinary underpayment')}. A basic rate payer with a ${h.gbp(bill)} balance loses ${h.gbp(Math.ceil(bill * 100 / basic))} of allowance, so 1257L becomes ${h.codeFor(Y.personalAllowance - Math.ceil(bill * 100 / basic), 'L', 'ruk')}.</p>
<!--tool:mini:p2|{"old":1257,"neu":${h.codeFor(Y.personalAllowance - Math.ceil(bill * 100 / basic), 'L', 'ruk').replace('L', '')},"pay":30000}-->
<p>If the balance is larger than the allowance you have left, the code can turn into a ${h.a('k-tax-code', 'K code')}. The ${h.src('gov_k', 'K code rule')} still caps the deduction at half of your pay before tax in each period, so the tax taken never swallows a whole payslip.</p>

<h2>Checking that the balance has been coded</h2>
<p>Your ${h.src('hmrc_check', 'HMRC online account')} shows your current code and tells you whether it has changed. Compare the new number with your previous code: a drop that matches the balance divided by your rate is the coded Self Assessment debt. If it does not appear and the payment date is approaching, check your Self Assessment statement in the same account and pay the balance directly; the coding route only covers what HMRC has actually put into the code.</p>
<p>A Self Assessment taxpayer does not receive a ${h.a('p800-tax-calculation', 'P800 letter')}. Under- and overpayments are settled through the return itself, which is why the filing date decides whether your pay can absorb the balance.</p>

<h2>Class 2 National Insurance and other exceptions</h2>
<p>If you are self-employed as well as employed, watch the National Insurance part of the bill. Class 2 National Insurance cannot go through the code unless it has been due since before 6 April 2015. Any part of the bill that cannot be coded has to be paid by the deadline using another method, so check your statement line by line rather than assuming the whole balance is covered.</p>`;
    },
  },
});
