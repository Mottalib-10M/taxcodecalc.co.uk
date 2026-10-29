import { definePage } from '../../lib/guide-types';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

export default definePage({
  id: 'tax-refund-wrong-code', group: 'situations', order: 13,
  tool: { kind: 'emergency', props: { freq: 'monthly', pay: 2500, start: 1, periods: 5, emergency: 'BR', correct: '1257L' } },
  mini: { kind: 'mini:refund', props: { paid: 4200, pay: 30000 } },
  related: ['wrong-tax-code', 'p800-tax-calculation', 'emergency-tax-code', 'leaving-a-job-p45', 'check-my-tax-code'],
  sources: ['gov_paidwrong', 'gov_overunder', 'gov_claim_refund', 'gov_p45', 'hmrc_check', 'employer_2627'],
  demarche: true,
  en: {
    slug: 'tax-refund-wrong-code', nav: 'Refund after a wrong code', card: 'Overpaid on the wrong code: the refund in your pay, or the P800 route after April, with the time each one takes.',
    title: 'Tax Refund After a Wrong Code: How and When It Is Paid',
    description: 'Overpaid on the wrong tax code? Most refunds come back in your pay once the new code is used; if not, a P800 follows after April, paid in 5 working days online.',
    h1: 'Getting a refund after a wrong tax code',
    intro: 'Two routes bring overpaid tax back: your own payroll once the corrected code arrives, or HMRC directly after the tax year ends.',
    resume: (h) => {
      const e = h.emergency({ freq: 'monthly', pay: 2500, start: 1, periods: 5, emergency: 'BR', correct: '1257L' });
      return `Tax overpaid because of a wrong code usually comes back through your own pay, not by a separate payment. When HMRC updates the code, it checks whether it holds all your income details for the year; if it does, it asks your employer or pension provider to pay back the difference through your wages, normally when the new code is first used (${h.src('gov_paidwrong', 'GOV.UK')}). Monthly paid staff should see it on the next or the following pay, weekly paid staff on the third. Example: ${h.gbp(2500)} a month taxed on BR from April to August pays ${h.pence(e.onEmergency)} where 1257L would have taken ${h.pence(e.right)}, so ${h.pence(e.back)} returns in the ${MONTHS[(e.switchPeriod ?? 1) - 1]} payslip. If HMRC lacks some figures, the refund waits until after 5 April: a P800 letter arrives between ${h.R.lettersFrom} and ${h.R.lettersTo}, and money claimed online is sent within ${h.R.refundOnlineWorkingDays} working days, a requested cheque within ${h.R.refundChequeWeeks} weeks, and an automatic cheque within ${h.R.refundAutoChequeDays} days of the letter.`;
    },
    faqs: (h) => [
      { q: 'Why has the refund for my wrong tax code not appeared on my payslip yet?', a: 'Either your employer has not applied the new code yet, or HMRC is missing some of your income details for the year. A refund through pay only happens when HMRC has the full picture. If you changed jobs, give the new employer your P45; if the code itself has not reached payroll after the usual delay, ask your employer to check they have received it.' },
      { q: 'What do I need to claim a P800 refund for a wrong tax code online?', a: `You need the reference number printed on the P800 letter and your National Insurance number. Claims made online, by bank transfer, are paid within ${h.R.refundOnlineWorkingDays} working days. You can also claim through your personal tax account or the HMRC app as long as you hold a UK bank account, or ask online for a cheque, which takes up to ${h.R.refundChequeWeeks} weeks.` },
      { q: 'Is a refund for a wrong code over several tax years paid separately for each year?', a: `Not when HMRC sends a cheque automatically. GOV.UK says that if you are owed tax for more than one year, the cheque covers the whole amount in a single payment. It arrives no more than ${h.R.refundAutoChequeDays} days after the date on your letter, and you do not need to contact HMRC or make any claim for it.` },
      { q: 'Can I get a wrong code refund before the tax year ends if I have stopped working?', a: 'Only if HMRC already has your income details. GOV.UK says no refund can be made until HMRC receives the figures from your employer, your pension provider or the benefits office. Make sure your former employer sends you a P45. If you are claiming taxable benefits, the P45 goes to Jobcentre Plus. Otherwise the overpayment is worked out after the year closes and a letter follows.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [[1, 3], [1, 6], [5, 3], [5, 6]].map(([start, k]) => {
        const e = h.emergency({ freq: 'monthly', pay: 2500, start, periods: k, emergency: 'BR', correct: '1257L' });
        return [`${MONTHS[start - 1]}, ${k} months`, h.pence(e.onEmergency), h.pence(e.right), h.pence(e.back), e.switchPeriod ? MONTHS[e.switchPeriod - 1] : 'after 5 April'];
      });
      return `
<h2>Route one: the refund inside your next pay</h2>
<p>A cumulative code compares the tax due on everything you have earned since 6 April with the tax already taken. When the corrected code reaches payroll, that comparison is made with the right allowance, and any excess is handed back on the same payslip as negative tax. This is why ${h.src('gov_paidwrong', 'GOV.UK')} describes the refund as something your employer or pension provider pays in your wages once HMRC has asked them to.</p>
<p>Two conditions apply. HMRC must have all your income details for the tax year, and your employer must have loaded the new code. Monthly payrolls should use it on the next or the following pay, weekly payrolls on the third pay. The table shows what comes back when a ${h.gbp(2500)} monthly salary has been wrongly coded BR for a few months before 1257L arrives.</p>
${h.table(['BR from, for', 'Taken on BR', 'Due on 1257L', 'Comes back', 'In the pay of'], rows, `Monthly pay of ${h.gbp(2500)}, no other income, ${Y.label} rates for England and Northern Ireland from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r', 'r', 'l'])}
<p>The emergency calculator at the top lets you change the wrong code, the months and the pay. The same arithmetic applies to an ${h.a('emergency-tax-code', 'emergency code')} that has been replaced, only with a smaller gap.</p>

<h2>When the payroll route is blocked</h2>
<p>HMRC cannot repay what it cannot measure. If your record is missing a previous job, a pension or a benefit, no refund is made until those details arrive from the employer, pension provider or benefits office. After a change of job, the quickest way to unblock it is to give the ${h.src('gov_p45', 'P45')} from the old job to the new employer, or to ask the old employer for one if it never came. The ${h.a('leaving-a-job-p45', 'P45 guide')} explains which parts to hand over.</p>
<p>If you are not sure the code is wrong at all, first compare it with your situation in the ${h.src('hmrc_check', 'HMRC online account')} and update what is missing. The ${h.a('wrong-tax-code', 'wrong code checklist')} lists the usual mismatches.</p>

<h2>Route two: the P800 after the tax year ends</h2>
<p>When the year closes on 5 April without the refund being paid, HMRC collects the year's figures from employers, from pension providers and from the benefits office, checks what you paid and writes to you if the total is wrong (${h.src('gov_overunder', 'GOV.UK')}). These ${h.a('p800-tax-calculation', 'tax calculation letters')} are sent between ${h.R.lettersFrom} and ${h.R.lettersTo} of the next tax year, and they say which way the money will come:</p>
<ul>
<li>claim online, by bank transfer: paid within ${h.R.refundOnlineWorkingDays} working days, using the reference on the letter and your National Insurance number;</li>
<li>ask online for a cheque: sent within ${h.R.refundChequeWeeks} weeks;</li>
<li>personal tax account or HMRC app: available if you have a UK bank account;</li>
<li>automatic cheque: when the letter says so, it arrives by post within ${h.R.refundAutoChequeDays} days of the letter's date, with no claim needed.</li>
</ul>
<!--tool:mini:refund|{"paid":4200,"pay":30000}-->

<h2>Checking the amount you get back</h2>
<p>Your P60 shows the tax taken by each employer over the year and is the document GOV.UK names as proof when claiming back overpaid tax. Add up the P60s, plus the P45 of any job you left during the year, compare the total with the tax due on your income, and the difference should match the refund. If a P800 uses amounts you believe are wrong, tell HMRC which figures are incorrect and what they should be; HMRC either sends a new calculation or explains why it disagrees.</p>
<p>Refunds for reasons other than a job or a pension, such as job expenses or a redundancy payment, follow their own routes, described in HMRC's ${h.src('gov_claim_refund', 'refund checker')}. If the letter goes the other way and shows tax owed, the ${h.a('underpaid-tax-code', 'underpayment guide')} explains how it is collected.</p>`;
    },
  },
});
