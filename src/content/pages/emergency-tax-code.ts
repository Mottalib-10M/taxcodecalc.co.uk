import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'emergency-tax-code', group: 'tools', order: 4,
  tool: { kind: 'emergency', props: { freq: 'monthly', pay: 2600, start: 6, periods: 2, emergency: 'X', correct: '1257L' } },
  mini: { kind: 'mini:w1', props: { pay: 2600, start: 6 } },
  related: ['w1-m1-x-tax-codes', 'new-job-tax-code', 'no-p45-tax-code', 'tax-refund-wrong-code', 'tax-per-payslip'],
  sources: ['gov_emergency', 'p9x_2026', 'employer_2627', 'paye_spec', 'gov_update', 'starter'],
  demarche: true,
  en: {
    slug: 'emergency-tax-code', nav: 'Emergency tax refund', card: 'How much an emergency code took too much, and on which payslip it should come back.',
    title: 'Emergency Tax Code: Refund Calculator and When You Get It',
    description: 'On 1257L W1, M1 or X? See how much emergency tax you paid, how much comes back when HMRC sends your real code, and on which payslip the refund should appear.',
    h1: 'Emergency tax code: how much comes back',
    intro: 'Your payslip shows W1, M1, X or NONCUM: the tax taken so far, the tax that was due, and the pay where the difference returns.',
    resume: (h) => {
      const Y = h.Y();
      const e = h.emergency({ freq: 'monthly', pay: 2600, start: 6, periods: 2, emergency: `${Y.emergencyCode} M1`, correct: '1257L' });
      return `An emergency tax code is your normal code run on a week 1 or month 1 basis: for ${Y.label} HMRC's ${h.src('p9x_2026', 'P9X notice')} sets it at ${Y.emergencyCode} W1 or ${Y.emergencyCode} M1, shown as X when pay dates vary or as NONCUM by some payroll software. Each pay gets only one week's or one month's allowance, ${h.pence(h.freePay(1257, 12))} a month, as if it were the first pay of the year. Someone who starts a job in September after months without work loses the allowance of April to August while the emergency code runs. With ${h.gbp(2600)} a month and two months on ${Y.emergencyCode} M1, ${h.pence(e.onEmergency)} is taken where the cumulative 1257L would have taken ${h.pence(e.right)}, so ${h.pence(e.back)} should come back in one go on the first payslip that uses the proper code. HMRC usually sends that code once it has your details, which can take up to ${h.R.waitAfterNewJobDays} days after you start.`;
    },
    faqs: (h) => [
      { q: 'How long does an emergency tax code last?', a: `Usually until HMRC has the income details from your new and previous employers and sends a proper code, which can take up to ${h.R.waitAfterNewJobDays} days from the start of the job. Where too little tax has been paid, GOV.UK says the emergency code may stay in place for the rest of the tax year, with a normal code from the new year.` },
      { q: 'Do I get emergency tax back automatically?', a: 'Yes, in most cases. When the cumulative code reaches your payroll, the software compares the tax due to date with what you paid and gives the difference back on that payslip. If the year ends before that happens, HMRC works out the difference after 5 April and sends a tax calculation letter that explains how to get the refund.' },
      { q: 'Is BR an emergency tax code?', a: 'Not in the W1 or M1 sense. BR is what an employer uses when the starter checklist says you have another job or pension. It is cumulative but has no allowance at all, so if this is in fact your only job, BR takes 20% from the first pound and the overpayment comes back once HMRC corrects the code.' },
      { q: 'Why did my emergency code not give a refund when it changed?', a: 'Because the cumulative code only gives back what the year so far allows. If an earlier job already used your allowance, or you were paid in the same month by two employers, the tax due to date may be close to what you paid. In that case the new code mainly corrects future pay, and anything left is settled after the year ends.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const months = [1, 4, 6, 9].map((s) => { const e = h.emergency({ freq: 'monthly', pay: 2200, start: s, periods: 2, emergency: `${Y.emergencyCode} M1`, correct: '1257L' }); return [`Month ${s}`, h.pence(e.onEmergency), h.pence(e.right), h.pence(e.back)]; });
      return `
<h2>Why the emergency basis takes more</h2>
<p>A normal code is cumulative: the payroll adds your pay since 6 April, takes off the free pay for every month of the year so far and charges tax on the rest. The emergency basis cuts that link. Each pay is treated in isolation, with the free pay of week 1 or month 1 only, and the tax already paid is never compared with the tax due for the year (${h.src('paye_spec', 'PAYE specification, paragraph 8')}). For someone who earns the same amount from April, the two methods give almost the same tax. For someone who starts in the middle of the year, or whose pay goes up and down, the emergency basis takes more, because the unused allowance of earlier months is ignored.</p>
<p>The table shows the effect of two monthly pays of ${h.gbp(2200)} on ${Y.emergencyCode} M1, depending on the month the job started, compared with plain 1257L over the same two months, with no other income earlier in the year.</p>
${h.table(['First pay', `On ${Y.emergencyCode} M1`, 'Due with 1257L', 'Comes back'], months, `Two monthly pays of ${h.gbp(2200)}, ${Y.label}, HMRC's payroll method.`, ['l', 'r', 'r', 'r'])}

<h2>When an employer uses an emergency code</h2>
<p>A new employer needs your previous pay and tax to use the right code. If you hand over the P45 from your last job, parts 2 and 3 give them the code and the figures. Without it, you fill in the ${h.src('starter', 'starter checklist')}: statement A, first job since 6 April with no Jobseeker’s Allowance, Employment and Support Allowance or Incapacity Benefit since then, leads to ${Y.emergencyCode} on a cumulative basis; statement B, this is now your only job but you had other pay this year, leads to ${Y.emergencyCode} on a week 1 or month 1 basis; statement C, another job or a State, workplace or private pension, leads to BR. GOV.UK also says you may be put on an emergency code when company benefits or the State Pension start, so that the tax for the year comes out right (${h.src('gov_emergency', 'emergency tax codes')}).</p>
<!--tool:mini:newjob|{"st":1,"pay":2600}-->

<h2>What to do while you are on it</h2>
<p>Give the P45 to the new employer if you have it, or ask the previous employer for it. Check that your new job appears in your ${h.src('hmrc_check', 'HMRC online account')}, and add the previous job's figures if they are missing. After ${h.R.waitAfterNewJobDays} days, if the code still ends in W1, M1 or X and you think it is wrong, update your details there or contact HMRC (${h.src('gov_update', 'GOV.UK')}). Once HMRC issues the new code, it reaches you and your employer within ${h.R.codeChangeWorkingDays} working days, and a monthly payroll should use it on the next or the following payslip; a weekly one on the third.</p>
<p>The refund appears as a negative tax figure, or a much lower one, on that payslip. If it does not, put the old and new payslips side by side and use the ${h.a('tax-per-payslip', 'payslip calculator')} for the period number shown, to see what the cumulative code should give. A refund left at the end of the year comes through a ${h.a('p800-tax-calculation', 'P800 letter')} instead.</p>`;
    },
  },
});
