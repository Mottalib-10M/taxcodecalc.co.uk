import { definePage } from '../../lib/guide-types';

export default definePage({
  id: '0t-tax-code', group: 'codes', order: 5,
  tool: { kind: 'compare', props: { a: '1257L', b: '0T', pay: 24000 } },
  mini: { kind: 'mini:zero', props: { pay: 2000 } },
  related: ['no-p45-tax-code', 'emergency-tax-code', 'tax-code-over-100k', 'leaving-a-job-p45', 'br-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'p9x_2026', 'starter', 'gov_p45', 'hmrc_check', 'employer_2627'],
  en: {
    slug: '0t-tax-code', nav: '0T', card: 'No tax-free pay at all, but the normal bands still apply: why 0T appears and how to get off it.',
    title: '0T Tax Code: No Tax-Free Pay, Bands Applied From Pound One',
    description: '0T gives no Personal Allowance: tax starts at the basic rate on the first pound, higher bands above. See why 0T appears, what it costs and how to get off it.',
    h1: '0T tax code',
    intro: 'Zero allowance on this job or pension, either because it is used up or because the employer lacks your details.',
    resume: (h) => {
      const Y = h.Y();
      return `0T means the employer or pension provider gives you no tax-free pay at all. Unlike ${h.a('br-tax-code', 'BR')}, it does not charge one flat rate: the normal bands still apply, so the first slice of pay is taxed at ${h.sc('ruk').rates[0]}%, and the higher rates follow if the pay is large enough. ${h.src('gov_meaning', 'GOV.UK')} gives two reasons for it: your Personal Allowance is already fully used, or you started a new job and the employer does not have the details needed to give you a proper code. On a salary of ${h.gbp(24000)} paid monthly, 0T takes ${h.pence(h.taxYear('0T', 24000))} over the year, against ${h.pence(h.taxYear('1257L', 24000))} with 1257L: a difference of ${h.pence(h.taxYear('0T', 24000) - h.taxYear('1257L', 24000))}, which is the tax on the ${h.gbp(Y.personalAllowance)} allowance you are not getting. Scottish taxpayers see S0T and Welsh taxpayers C0T. When 0T is followed by W1, M1 or X, each pay is taxed on its own and nothing comes back until HMRC issues a new code. If your allowance is not really used up, check your record in your ${h.src('hmrc_check', 'HMRC online account')}.`;
    },
    faqs: (h) => [
      { q: 'Why is my new job on 0T when the emergency code is 1257L?', a: `For ${h.Y().label}, HMRC's P9X notice sets the emergency code at ${h.Y().emergencyCode}. A new employer reaches 0T when it has neither a P45 nor enough starter details to pick a code, which GOV.UK lists as one of the two usual reasons for 0T. Giving the employer your P45 or a completed starter checklist usually moves you to a code with an allowance.` },
      { q: 'Does the 0T code mean I pay 20% on everything?', a: `No, that is BR. With 0T the pay goes through the normal bands from the first pound: ${h.sc('ruk').rates[0]}% on the first slice, then ${h.sc('ruk').rates[1]}% and ${h.sc('ruk').rates[2]}% for the parts above. On modest pay the two codes take the same amount, but on a large salary 0T takes more, because higher rates apply once the basic rate band for the period is full.` },
      { q: 'Why was my pay after leaving taxed with 0T?', a: 'HMRC’s P9X notice tells employers that payments made after an employee has left, once the P45 has already been issued, are taxed with 0T on a non-cumulative basis. Employees whose code had an S prefix get S0T and those with a C prefix get C0T. A final bonus or holiday pay sent after the P45 can therefore lose more tax than usual.' },
      { q: 'When is 0T the correct tax code for a whole year?', a: `When there really is no allowance left for that source. The clearest case is adjusted net income of ${h.gbp(h.Y().incomeLimit + 2 * h.Y().personalAllowance)} or more, where the whole Personal Allowance has tapered away. It can also fit a job when deductions such as company benefits or untaxed income use up exactly the allowance. If deductions go beyond it, HMRC uses a K code instead.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [1500, 2000, 3000, 6000].map((m) => [h.gbp(m), h.pence(h.taxPeriod('0T M1', 'monthly', m, 1)), h.pence(h.taxPeriod('BR', 'monthly', m, 1)), h.pence(h.taxPeriod('1257L', 'monthly', m, 1))]);
      return `
<h2>Why an employer uses 0T</h2>
<p>The ${h.src('gov_employee_codes', 'employer guidance on tax codes')} describes 0T as tax taken from all income with no Personal Allowance. Payroll offices meet it in four situations:</p>
<ul>
<li><strong>Missing details.</strong> A new employee has not handed over a P45 or enough information to work out a code. The ${h.src('starter', 'starter checklist')} exists to avoid this: statement A, B or C gives the employer a code with an allowance, or BR.</li>
<li><strong>Payments after leaving.</strong> HMRC's ${h.src('p9x_2026', 'P9X notice')} says that once a P45 has been given, later payments are taxed with 0T, S0T or C0T on a non-cumulative basis.</li>
<li><strong>A one-off payment.</strong> GOV.UK's guidance for employers who pay someone only once tells them to use 0T and to run it on a week 1 or month 1 basis.</li>
<li><strong>Allowance used up.</strong> High income or deductions in your code leave nothing to give, so HMRC sends 0T to the employer itself.</li>
</ul>
<p>The first three are temporary or one-off. The fourth is a real code that can stay for the whole tax year.</p>

<h2>What 0T takes from a monthly pay</h2>
<p>On a month 1 basis, the payroll applies one twelfth of each band to the month's pay, with no free pay. For ${Y.label}, that means a twelfth of the ${h.gbp(h.sc('ruk').bands[0])} basic rate band at ${h.sc('ruk').rates[0]}%, then the higher rate on anything above it in the same month. The table compares the first month on 0T M1 with the same pay on BR and on 1257L.</p>
${h.table(['Monthly pay', '0T M1', 'BR', '1257L'], rows, `Income Tax in one month, ${Y.label}, England and Northern Ireland; rates and thresholds from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r', 'r'])}
<p>Up to about ${h.gbp(Math.floor(h.sc('ruk').bands[0] / 12))} a month, 0T and BR take the same amount. Above it, 0T charges the higher rate on the excess, so it costs more than BR on large monthly pay. Compared with 1257L, the gap on ordinary pay is roughly the basic rate on ${h.pence(h.freePay(1257, 12))}, the free pay you would otherwise receive each month.</p>

<h2>Getting off 0T</h2>
<p>If your allowance is not used up, the code should not stay. Give the new employer the P45 from your previous job; GOV.UK's ${h.src('gov_p45', 'page on the P45')} says HMRC should then correct the code after your first pay. Without a P45, fill in the starter checklist. HMRC can take up to ${h.R.waitAfterNewJobDays} days from your start date to receive your details and send a new code, so wait that long before chasing.</p>
<p>After that, sign in to your ${h.src('hmrc_check', 'HMRC online account')} and check that your employments, pensions and estimated pay are complete. When the new code reaches a cumulative payroll, the allowance from 6 April that you missed is given back through lower tax on the next payslip. While the code still ends in W1, M1 or X, that catch-up does not happen; the ${h.a('emergency-tax-code', 'emergency tax calculator')} shows how much should come back once it changes.</p>

<h2>S0T and C0T</h2>
<p>The prefix only changes the bands. S0T runs pay through the six Scottish rates starting at the starter rate of ${h.sc('scot').rates[0]}%, while C0T uses the Welsh rates, which match those of England for ${Y.label}. The reasons for the code are the same in all three nations, and so is the way out: complete records with HMRC.</p>
<p>One contrast is worth knowing. HMRC's payroll specification says there is a single emergency code for the whole of the UK, so the S and C prefixes are never added to it. A zero-allowance code, by contrast, does carry the prefix. If you live in Scotland and see 0T without the S, your address on HMRC's record may be out of date, which is worth checking at the same time as the code.</p>`;
    },
  },
});
