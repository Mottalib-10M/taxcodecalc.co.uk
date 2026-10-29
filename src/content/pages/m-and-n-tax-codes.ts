import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'm-and-n-tax-codes', group: 'codes', order: 9,
  tool: { kind: 'compare', props: { a: '1257L', b: '1383M', pay: 30000 } },
  mini: { kind: 'mini:marriage', props: { low: 9000, high: 30000 } },
  related: ['1257l-tax-code', 'tax-code-numbers', 'personal-allowance', 's1257l-tax-code', 'tax-code-letters'],
  sources: ['gov_marriage', 'gov_meaning', 'gov_employee_codes', 'hmrc_check', 'paye_spec'],
  en: {
    slug: 'm-and-n-tax-codes', nav: 'M and N', card: 'Marriage Allowance in your code: 1383M for the partner who receives £1,260, 1131N for the one who gives it.',
    title: 'M and N Tax Codes: Marriage Allowance, 1383M and 1131N',
    description: 'M and N mark Marriage Allowance: 1383M if you receive £1,260 of a partner\'s allowance, 1131N if you transfer it. See who qualifies, the saving and backdating.',
    h1: 'M and N tax codes',
    intro: 'Two letters for one claim: the partner who receives the allowance gets M, the partner who gives it gets N.',
    resume: (h) => {
      const Y = h.Y();
      const m = h.codeFor(Y.personalAllowance + Y.marriageAllowance, 'M', 'ruk');
      const n = h.codeFor(Y.personalAllowance - Y.marriageAllowance, 'N', 'ruk');
      return `The letters M and N appear when a married couple or civil partners use ${h.src('gov_marriage', 'Marriage Allowance')}. The lower earner transfers ${h.gbp(Y.marriageAllowance)} of their Personal Allowance to the partner. The partner who receives it gets an M code: ${h.gbp(Y.personalAllowance)} plus ${h.gbp(Y.marriageAllowance)} gives ${h.gbp(Y.personalAllowance + Y.marriageAllowance)}, written ${m}. The partner who gives it gets an N code: ${h.gbp(Y.personalAllowance - Y.marriageAllowance)} left, written ${n}. The receiving partner's tax falls by up to ${h.gbp(h.R.maSaving)} in ${Y.label}; on a salary of ${h.gbp(30000)}, ${m} takes ${h.pence(h.taxYear(m, 30000))} over the year against ${h.pence(h.taxYear('1257L', 30000))} with 1257L. To qualify, the lower earner must normally have income below the Personal Allowance and the partner must pay tax at no more than the basic rate, which usually means income up to ${h.gbp(h.bandEdges('ruk')[0])}, or up to ${h.gbp(h.R.scotMaRecipientMax)} in Scotland, where the intermediate rate is allowed. A claim can be backdated to ${h.date(h.R.maBackdateFrom)} for each year you were eligible, and the transfer then renews automatically each year until it is cancelled.`;
    },
    faqs: (h) => [
      { q: 'Why does my code end in M when my partner has the N tax code?', a: `Because your partner transferred part of their allowance to you. Their code drops by ${h.gbp(h.Y().marriageAllowance)} and ends in N, yours rises by the same amount and ends in M. With the standard allowance that gives ${h.codeFor(h.Y().personalAllowance + h.Y().marriageAllowance, 'M', 'ruk')} for you and ${h.codeFor(h.Y().personalAllowance - h.Y().marriageAllowance, 'N', 'ruk')} for them. Other deductions in either code can make the numbers different.` },
      { q: 'Can the partner with the N tax code end up paying tax?', a: `Yes, if their income is above the reduced allowance of ${h.gbp(h.Y().personalAllowance - h.Y().marriageAllowance)}. GOV.UK points out that the transferring partner may pay some tax, but the couple can still come out ahead, because the receiving partner saves up to ${h.gbp(h.R.maSaving)}. On an income of ${h.gbp(11800)}, the N code costs ${h.pence(h.taxYear('1131N', 11800))} over the year, less than the saving.` },
      { q: 'How far back can a Marriage Allowance claim behind an M or N code go?', a: `GOV.UK allows a claim to be backdated to ${h.date(h.R.maBackdateFrom)} for any tax year in which you were both eligible. The receiving partner's bill for each earlier year is reduced using the allowance that applied that year. GOV.UK sends backdated claims through a separate application route from the standard online claim, so check that route before applying.` },
      { q: 'What happens to an M or N tax code when Marriage Allowance is cancelled?', a: 'If you cancel because your income changed, the transfer runs until the end of the tax year on 5 April and the codes stop carrying it after that date. If you have split up, HMRC may backdate the change to 6 April of the current year, which can leave one of you with tax underpaid for the year. Either partner can cancel when the relationship ends.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('ruk');
      const regions = [['ruk', 'England and Northern Ireland'], ['scot', 'Scotland'], ['wales', 'Wales']] as const;
      const rows = regions.map(([r, label]) => [label, h.codeFor(Y.personalAllowance + Y.marriageAllowance, 'M', r), h.codeFor(Y.personalAllowance - Y.marriageAllowance, 'N', r)]);
      const pay = [20000, 30000, 45000].map((p) => [h.gbp(p), h.pence(h.taxYear('1257L', p)), h.pence(h.taxYear('1383M', p)), h.pence(h.taxYear('1257L', p) - h.taxYear('1383M', p))]);
      return `
<h2>The two codes side by side</h2>
<p>The number in each code is simply the new allowance with its last digit dropped. GOV.UK's ${h.src('gov_meaning', 'table of letters')} defines M as part of your partner's Personal Allowance received under Marriage Allowance, and N as part of yours transferred to your partner. In the ${h.src('gov_employee_codes', 'employer guidance')}, both letters are taxed at the normal rates on whatever pay is left after the allowance, exactly as an L code would be.</p>
${h.table(['Where you live', 'Code of the partner who receives', 'Code of the partner who transfers'], rows, `Codes with the standard allowance and no other deduction, ${Y.label}.`, ['l', 'l', 'l'])}
<p>If either partner has company benefits, job expenses or a State Pension in the code, the numbers move away from 1383 and 1131, but the letters stay: whatever the number, an M or an N shows that a transfer is in place.</p>

<h2>What the M code saves</h2>
<p>For the receiving partner, the extra ${h.gbp(Y.marriageAllowance)} of allowance removes basic rate tax on that slice of income, worth ${h.gbp(h.R.maSaving)} over a full year. On the payslip, the monthly free pay rises from ${h.pence(h.freePay(1257, 12))} to ${h.pence(h.freePay(1383, 12))}.</p>
${h.table(['Receiving partner, yearly pay', 'Tax with 1257L', 'Tax with 1383M', 'Saving'], pay, `Income Tax, ${Y.label}, England and Northern Ireland, equal monthly pay.`, ['l', 'r', 'r', 'r'])}
<p>The full saving needs income above ${h.gbp(Y.personalAllowance + Y.marriageAllowance)}, so that the whole extra allowance is used. Below that, the M code still cuts the tax, but by less.</p>

<h2>Who can claim</h2>
<p>All of these must apply, according to ${h.src('gov_marriage', 'GOV.UK')}:</p>
<ul>
<li>you are married or in a civil partnership; living together is not enough;</li>
<li>the lower earner pays no Income Tax, or has income below the Personal Allowance, usually ${h.gbp(Y.personalAllowance)};</li>
<li>the other partner pays tax at the basic rate, usually income between ${h.gbp(Y.personalAllowance + 1)} and ${h.gbp(e[0])} before the transfer; in Scotland the starter, basic or intermediate rate, usually up to ${h.gbp(h.R.scotMaRecipientMax)}.</li>
</ul>
<p>Receiving a pension or living abroad does not prevent a claim, provided you receive a Personal Allowance. If either of you was born before 6 April 1935, Married Couple's Allowance may be worth more, and the two cannot be held together. Once HMRC accepts the claim, the new allowances are backdated to 6 April of the current year, and the cumulative payroll returns the extra tax through the next payslips.</p>
<!--tool:mini:compare|{"code":"1257L","code2":"1383M","pay":30000}-->

<h2>Keeping the codes right</h2>
<p>The transfer renews each April until someone cancels it, so the M and N should reappear every year. Check both codes in your ${h.src('hmrc_check', 'HMRC online account')} when a new year starts or after a change of job. If the lower earner's income rises above the allowance, or the receiving partner moves into the higher rate band, the claim should be cancelled; the person who made the claim does that, unless the relationship has ended. If you complete a Self Assessment return, you do not need to fill in its Marriage Allowance section while your codes already end in M or N.</p>
<p>A bereavement changes the codes in a specific way. If the partner who received the allowance dies, their estate is treated as having the larger allowance and yours returns to the normal ${h.gbp(Y.personalAllowance)}, so your N code goes back to an ordinary one. If the partner who transferred the allowance dies, your larger allowance of ${h.gbp(Y.personalAllowance + Y.marriageAllowance)} stays until 5 April and the M remains on your code until then. If your partner died after 5 April 2022, a claim is still possible by phoning HMRC's Income Tax helpline.</p>`;
    },
  },
});
