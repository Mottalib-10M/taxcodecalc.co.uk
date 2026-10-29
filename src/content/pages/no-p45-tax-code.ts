import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'no-p45-tax-code', group: 'situations', order: 5,
  tool: { kind: 'emergency', props: { freq: 'monthly', pay: 2600, start: 7, periods: 3, emergency: 'X', correct: '1257L' } },
  mini: { kind: 'mini:newjob', props: { st: 1, pay: 2600 } },
  related: ['new-job-tax-code', 'emergency-tax-code', 'leaving-a-job-p45', 'tax-refund-wrong-code', 'p800-tax-calculation'],
  sources: ['gov_p45', 'starter', 'gov_emergency', 'gov_paidwrong', 'gov_overunder', 'gov_update'],
  demarche: true,
  en: {
    slug: 'no-p45-tax-code', nav: 'No P45', card: 'Lost or never sent: the code a new employer uses without a P45, and how the extra tax comes back.',
    title: 'No P45 Tax Code: Starter Checklist, Emergency Tax, Refund',
    description: 'No P45? Your new employer uses the starter checklist, often with an emergency code. See what it takes, what to ask for and how the overpaid tax returns.',
    h1: 'Tax code with no P45',
    intro: 'A missing P45 does not stop you starting work, but it changes the code on your first payslips.',
    resume: (h) => {
      const Y = h.Y();
      const due = h.due({ region: 'ruk', job1: 31200, months: 8 });
      const before = h.taxPeriod('1257L', 'monthly', 2600, 1) + h.taxPeriod('1257L', 'monthly', 2600, 2);
      const m1 = h.taxPeriod(`${Y.emergencyCode} M1`, 'monthly', 2600, 1) * 6;
      return `Without a P45, your new employer cannot see what you earned and paid since 6 April, so it asks you to fill in the ${h.src('starter', 'starter checklist')} instead. If you had another job earlier in the tax year, you tick statement B and payroll uses ${Y.emergencyCode} on a month 1 or week 1 basis, an emergency code that gives each pay only one period of allowance. Lost P45s cannot be replaced (${h.src('gov_p45', 'GOV.UK')}), but you can still ask the old employer to send one if they never did, and HMRC receives every employer's figures in any case. The cost of the emergency basis depends on gaps. Someone paid ${h.gbp(2600)} a month in April and May, out of work until October, then back at the same pay, has ${h.pence(before + m1)} taken over the year on month 1, against ${h.pence(due)} due. The difference, ${h.pence(before + m1 - due)}, normally comes back through payroll once HMRC sends a cumulative code, or after 5 April through a tax calculation letter.`;
    },
    faqs: (h) => [
      { q: 'Can I get a replacement P45 if I lost the one from my old job?', a: 'No. GOV.UK is clear that a lost P45 cannot be replaced, including when your employer says it was sent and it never arrived. You do not need it to start working: fill in the starter checklist for the new employer instead. If you need the figures for another reason, your pay and tax for recent years are in your personal tax account and the HMRC app.' },
      { q: 'Which starter checklist statement applies when I have no P45 from an earlier job this year?', a: 'Statement B, if the earlier job has ended and you have no other work or pension now. It also covers having received Jobseeker\'s Allowance, Employment and Support Allowance or Incapacity Benefit since 6 April. Statement B gives the current allowance on a week 1 or month 1 basis. If the earlier job is still going, the right answer is statement C, which means BR on the new job.' },
      { q: 'Do I get back the extra tax paid while I had no P45?', a: `Usually yes, once HMRC has both employers' figures. It then sends a cumulative code, and the new employer refunds the difference through your pay, often on the next or the following monthly payslip. If the tax year ends first, HMRC compares the total paid with the total due and sends a letter between ${h.R.lettersFrom} and ${h.R.lettersTo} explaining how to get the money.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const pay = 2600;
      const due = h.due({ region: 'ruk', job1: pay * 12, months: 8 });
      const before = h.taxPeriod('1257L', 'monthly', pay, 1) + h.taxPeriod('1257L', 'monthly', pay, 2);
      const one = h.taxPeriod(`${Y.emergencyCode} M1`, 'monthly', pay, 1);
      const rows = [
        ['Old job, April and May, cumulative code', h.pence(before)],
        [`New job, October to March, ${Y.emergencyCode} M1`, `${h.pence(one * 6)} (${h.pence(one)} a month)`],
        ['Total taken over the year', h.pence(before + one * 6)],
        ['Tax due on the year\'s pay', h.pence(due)],
        ['Taken too much', h.pence(before + one * 6 - due)],
      ];
      return `
<h2>Why a P45 matters to the new payroll</h2>
<p>The P45 carries three things the new employer cannot guess: your code, your leaving date, and your pay and tax since the tax year began. With them, payroll continues a cumulative calculation, giving you the allowance for every month of the year so far and crediting the tax you already paid. Without them, it has to assume the worst about what came before. That is why GOV.UK warns that, with no P45, the tax taken in your new job might be wrong (${h.src('gov_p45', 'your P45, P60 and P11D')}).</p>
<p>Three situations lead to the same place. Your old employer never issued one: ask them for it, since they should give it to you when you leave. It went missing: no copy can be made. Or this is your first job, or an extra job alongside another: there is no P45 to give. In each case you complete the starter checklist and the employer picks the code from the statement you tick.</p>

<h2>What the emergency basis costs after a gap</h2>
<p>With steady pay all year, month 1 and cumulative codes take almost the same tax each month. The difference shows when you spent months without income. Take ${h.gbp(pay)} a month from an old job in April and May, nothing from June to September, then the same pay from October with no P45 and statement B ticked.</p>
${h.table(['Item', 'Income Tax'], rows, `England and Northern Ireland rates, ${Y.label}; emergency code from HMRC's ${h.src('p9x_2026', 'P9X')}.`, ['l', 'r'])}
<p>The four empty months each carried about a twelfth of the allowance, and the month 1 basis never lets the new payroll use it. On a cumulative code, the October payslip alone would have absorbed that unused allowance. Use the calculator at the top to try your own pay and start month; choose the X version when your pay dates vary from one period to the next.</p>
<!--tool:mini:w1|{"pay":2600,"start":7}-->

<h2>What comes back, and how</h2>
<p>HMRC usually updates your code once it holds the details from both your new and your previous employer, which can take up to ${h.R.waitAfterNewJobDays} days from your start date. The new code goes to you and to the employer, and if it shows you overpaid, the employer refunds the difference through your pay: on the next or the following payslip if you are paid monthly, on the third if weekly (${h.src('gov_paidwrong', 'GOV.UK')}). If the old employer's pay and tax figures are wrong, ask them for an amended P45; failing that, tell HMRC through the ${h.src('hmrc_check', 'Check your Income Tax online service')}, which will contact the employer.</p>
<p>If the year ends before the code is fixed, HMRC reconciles the figures from every employer after 5 April and sends a ${h.a('p800-tax-calculation', 'P800 tax calculation')} or a Simple Assessment letter (${h.src('gov_overunder', 'overpayments and underpayments')}). A P800 refund claimed online arrives within ${h.R.refundOnlineWorkingDays} working days; a cheque sent automatically comes within ${h.R.refundAutoChequeDays} days of the letter.</p>`;
    },
  },
});
