import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'student-tax-code', group: 'situations', order: 17,
  tool: { kind: 'payslip', props: { code: '1257L', pay: 900, freq: 'monthly', period: 3 } },
  mini: { kind: 'mini:month', props: { code: '1257L', pay: 900 } },
  related: ['new-job-tax-code', 'no-p45-tax-code', 'second-job-tax-code', 'tax-refund-wrong-code', 'personal-allowance'],
  sources: ['starter', 'gov_meaning', 'employer_2627', 'gov_paidwrong', 'gov_p45', 'hmrc_check'],
  en: {
    slug: 'student-tax-code', nav: 'Students', card: 'Part-time and holiday jobs: the same allowance as anyone, the starter checklist, and why many students pay no tax.',
    title: 'Student Tax Code: Part-Time and Holiday Jobs Explained',
    description: 'Students get the same tax code and £12,570 allowance as anyone. See the code a part-time or summer job gives, when tax is taken and how to reclaim overpaid tax.',
    h1: 'Tax codes for students with a part-time or holiday job',
    intro: 'No special student code exists: the starter checklist decides your first code, and the Personal Allowance does the rest.',
    resume: (h) => {
      const Y = h.Y();
      const summer = h.emergency({ freq: 'monthly', pay: 1800, start: 4, periods: 2, emergency: '1257L', correct: '1257L' });
      return `There is no separate tax code for students. Employers run PAYE for students exactly as for any other employee, so a part-time or holiday job gets the same Personal Allowance of ${h.gbp(Y.personalAllowance)} for ${Y.label} and normally the same code, 1257L. With that code, monthly pay below the PAYE threshold of ${h.gbp(Y.payeThreshold.month)} has no Income Tax taken, and weekly pay below ${h.gbp(Y.payeThreshold.week)} the same; a term-time job paying ${h.gbp(900)} a month therefore pays nothing. Without a P45 you fill in HMRC's ${h.src('starter', 'starter checklist')}, and the statement you tick sets your first code: the allowance in full for a first job since 6 April, a month 1 basis if you already had a job this year, or BR if you have another job at the same time. A summer job paying ${h.gbp(1800)} in July and August after no work since April has ${h.pence(summer.onEmergency)} of tax taken in total, because the cumulative code gives you the unused allowance of the earlier months. Any tax overpaid comes back through payroll or after the year ends.`;
    },
    faqs: (h) => [
      { q: 'Do students pay tax on a summer job if they have not worked since April?', a: `Often little or none. With statement A on the starter checklist, the employer uses your full allowance on a cumulative basis, so the free pay from April onwards is all available to you. Two months of ${h.gbp(1800)} starting in July have tax of ${h.pence(h.emergency({ freq: 'monthly', pay: 1800, start: 4, periods: 2, emergency: '1257L', correct: '1257L' }).onEmergency)} taken. The same pay on a month 1 basis would lose more, which is why ticking the right statement matters.` },
      { q: 'Why does a student with two part-time jobs pay tax on the second one?', a: `Because the Personal Allowance can only be given once. When you tick statement C on the starter checklist, saying you already have another job, the second employer uses BR and taxes every pound at ${h.sc('ruk').rates[0]}%. If both jobs together earn less than the allowance, make sure both appear correctly in your HMRC online account: once HMRC holds the full picture, any tax overpaid on the second job is refunded.` },
      { q: 'Does a student loan change the tax code on a part-time job?', a: 'No. The tax code only deals with Income Tax. Student loan repayments are a separate deduction, and the starter checklist asks about them in their own questions. If you are still studying on the course the loan relates to, you skip the plan type question. Someone who left their course after 6 April this tax year does not start repaying until the next tax year.' },
      { q: 'How do students get back tax overpaid on a holiday job?', a: 'If HMRC sends your employer a corrected code while you still work there, the refund is paid in your wages. Once the job has ended, keep your P45 and give Parts 2 and 3 to your next employer, which lets the next payroll use your allowance properly. Otherwise HMRC checks everyone\'s tax after the year ends and writes if you paid too much.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const pays = [600, 900, 1200, 1600];
      const rows = pays.map((p) => [h.gbp(p), h.pence(h.taxPeriod('1257L', 'monthly', p, 1)), h.pence(h.taxPeriod('1257L M1', 'monthly', p, 1)), h.pence(h.taxPeriod('BR', 'monthly', p, 1))]);
      const summerA = h.emergency({ freq: 'monthly', pay: 1800, start: 4, periods: 2, emergency: '1257L', correct: '1257L' });
      const summerB = h.emergency({ freq: 'monthly', pay: 1800, start: 4, periods: 2, emergency: '1257L M1', correct: '1257L' });
      return `
<h2>Same allowance, same codes</h2>
<p>HMRC's guidance for employers is blunt: students are put through PAYE in the same way as other employees. Nothing in a code marks you as a student. The number still comes from your Personal Allowance, ${h.gbp(Y.personalAllowance)} in ${Y.label}, which gives the standard code 1257L, and the letter still describes your allowance rather than your status (${h.src('gov_meaning', 'GOV.UK')}). If you live in Scotland the code starts with S, and in Wales with C, because the rates follow your main home.</p>
<p>What makes student tax look different is the size and timing of the pay. Term-time jobs are often small, and holiday jobs are short. Both sit comfortably inside the allowance for many students, so the code mostly decides whether a little tax is taken now and given back later, or none is taken at all.</p>

<h2>The starter checklist decides your first code</h2>
<p>Most students start a job without a recent P45. The employer then asks you to fill in the ${h.src('starter', 'starter checklist')}, and three statements set the code used until HMRC sends its own:</p>
<ul>
<li><strong>Statement A</strong>: this is your first job since 6 April and you have had no Jobseeker's Allowance, Employment and Support Allowance or Incapacity Benefit since then. The employer uses the current Personal Allowance on a cumulative basis.</li>
<li><strong>Statement B</strong>: you had another job since 6 April that has ended, or one of those benefits. The allowance is used on a week 1 or month 1 basis.</li>
<li><strong>Statement C</strong>: you have another job now, or receive a pension. The employer uses BR.</li>
</ul>
<p>A student who already had a job earlier in the same tax year, even one that has ended, ticks B rather than A. The checklist also asks for your National Insurance number, if you know it, and your start date.</p>
<!--tool:mini:newjob|{"st":0,"pay":900}-->

<h2>Tax on typical student pay</h2>
<p>The table shows the tax taken in a single month at different pay levels under each starter statement, with the ${Y.label} rates for England and Northern Ireland.</p>
${h.table(['Monthly pay', 'Statement A (1257L)', 'Statement B (1257L M1)', 'Statement C (BR)'], rows, `First month of the tax year, Income Tax only; rates and thresholds from ${h.src('employer_2627', 'GOV.UK')}.`, ['r', 'r', 'r', 'r'])}
<p>The cumulative code matters most for holiday work. Take ${h.gbp(1800)} a month in July and August after no pay since April: statement A leaves ${h.pence(summerA.onEmergency)} of tax over the two months, statement B takes ${h.pence(summerB.onEmergency)}, because the month 1 basis ignores the allowance of April to June. The difference is not lost, but you wait to get it back.</p>

<h2>Student loans on the checklist</h2>
<p>The starter checklist has its own section on student and postgraduate loans, and HMRC asks you to fill it in if you have a loan, even when you do hand over a P45. If you are still studying on the course the loan relates to, you go straight to the declaration. The plan types listed are Plan 1, 2, 4 and 5 plus the postgraduate loan, and which applies depends on where you applied and when your course started. Loan deductions are separate from Income Tax and do not change your code.</p>

<h2>Getting overpaid tax back</h2>
<p>Overpayment usually happens with statement B or C, or when a second job takes BR while the first leaves part of the allowance unused. If HMRC updates your code while you still work there and has your income details, it asks the employer to refund you through your pay (${h.src('gov_paidwrong', 'GOV.UK')}). When a job ends, keep your ${h.src('gov_p45', 'P45')} and hand Parts 2 and 3 to your next employer. You can check the code and the income HMRC expects in your ${h.src('hmrc_check', 'HMRC online account')}; if nothing is fixed during the year, HMRC reviews your tax after 5 April and writes to you, as explained in the ${h.a('tax-refund-wrong-code', 'refund guide')}.</p>`;
    },
  },
});
