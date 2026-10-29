import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'new-job-tax-code', group: 'situations', order: 4,
  tool: { kind: 'emergency', props: { freq: 'monthly', pay: 2300, start: 7, periods: 2, correct: '1257L' } },
  mini: { kind: 'mini:newjob', props: { st: 0, pay: 2300 } },
  related: ['no-p45-tax-code', 'emergency-tax-code', 'leaving-a-job-p45', 'w1-m1-x-tax-codes', 'second-job-tax-code'],
  sources: ['starter', 'gov_p45', 'gov_emergency', 'gov_update', 'p9x_2026', 'gov_employee_codes'],
  demarche: true,
  en: {
    slug: 'new-job-tax-code', nav: 'New job', card: 'P45 or starter checklist: the code your new employer uses on the first payslip and how long the switch takes.',
    title: 'New Job Tax Code: P45, Starter Checklist and First Payslip',
    description: 'New job? See which tax code your employer uses from your P45 or starter checklist statement A, B or C, what your first payslip takes and when it changes.',
    h1: 'Tax code when you start a new job',
    intro: 'What your new employer needs from you, the code it picks on day one, and when HMRC replaces it.',
    resume: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      return `A new employer sets your first tax code from one of two documents. If you hand over parts 2 and 3 of the P45 from your last job, payroll copies the code and the pay and tax to date printed on it, and your tax carries on as if nothing had changed (${h.src('gov_p45', 'GOV.UK, P45')}). Without a P45 you fill in the ${h.src('starter', 'starter checklist')} and tick one statement. Statement A, first job since 6 April with no Jobseeker's Allowance, Employment and Support Allowance or Incapacity Benefit, gives the current Personal Allowance on a cumulative basis: ${Y.emergencyCode} for ${Y.label} under HMRC's ${h.src('p9x_2026', 'P9X notice')}. Statement B, another job or one of those benefits earlier in the year, gives the same allowance on a week 1 or month 1 basis. Statement C, another job or a pension still running, gives BR, with every pound taxed at ${r[0]}%. HMRC then sends a proper code once it has the figures from both employers, which can take up to ${h.R.waitAfterNewJobDays} days from your start date.`;
    },
    faqs: (h) => [
      { q: 'Which starter checklist statement should I tick for a new job?', a: 'Answer the questions in order. If you have another job or receive a State, workplace or private pension, tick C. If not, but since 6 April you had a job that ended or received Jobseeker\'s Allowance, Employment and Support Allowance or Incapacity Benefit, tick B. If none of that applies, tick A. A wrong answer puts the new job on the wrong code from its very first pay.' },
      { q: 'How long until my new job gets its proper tax code?', a: `HMRC updates the code once it has your details from the new and the previous employer, which GOV.UK says can take up to ${h.R.waitAfterNewJobDays} days from the day you start. Wait that long before contacting HMRC about it. After a change, HMRC tells you and the employer within ${h.R.codeChangeWorkingDays} working days, and on a monthly payroll the new code should show on the next or the following payslip.` },
      { q: 'Should my new employer use the tax code printed on my P45?', a: 'Normally yes. The P45 carries your code, your leaving date and your pay and tax since 6 April, which lets payroll continue the cumulative calculation. If the code on it is wrong, GOV.UK still says to give it to your new employer: HMRC should correct the code automatically after your first pay. If it is still wrong after that, update your details online.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const months = ['April', 'July', 'October', 'January'];
      const rows = [1, 4, 7, 10].map((s, i) => {
        const e = h.emergency({ freq: 'monthly', pay: 2300, start: s, periods: 1, emergency: `${Y.emergencyCode} M1`, correct: Y.emergencyCode });
        return [months[i], h.pence(e.right), h.pence(e.onEmergency), h.pence(h.taxPeriod('BR', 'monthly', 2300, 1))];
      });
      return `
<h2>What the new employer needs before your first pay</h2>
<p>Your new employer must tell HMRC about you through its payroll submission on or before your first payday, and it needs a code to do so. The P45 from your last job is the best source: it shows your leaving date, the pay and tax since 6 April and the code you were on. Give the employer parts 2 and 3 and keep part 1A for your own records. If the P45 turns up after your first pay has already been reported, the ${h.src('starter', 'employer instructions')} say to switch to the code on parts 2 and 3 at that point.</p>
<p>No P45, or a first job ever, means the starter checklist instead. It is a short form that you give to the employer, not to HMRC. Alongside the statement it asks about student and postgraduate loans, so the right deductions start with your first payslip.</p>

<h2>Statements A, B and C and the code each one gives</h2>
<p>The three statements decide how much allowance payroll applies straight away. The table follows HMRC's method for a pay of ${h.gbp(2300)} a month, with ${Y.emergencyCode} as the current allowance for ${Y.label}, and shows the tax on the first payslip depending on when the job starts.</p>
${h.table(['First pay in', 'Statement A, cumulative', 'Statement B, month 1', 'Statement C, BR'], rows, `Income Tax on the first monthly pay, England and Northern Ireland, ${Y.label}.`, ['l', 'r', 'r', 'r'])}
<p>Statement A gains in value the later you start: the cumulative code gives you the allowance of every month since April, so a first job that begins in October may take no tax at first. Statement B ignores those months because you may already have used the allowance in an earlier job. Statement C never gives allowance at all. Payroll keeps whichever code it reported until HMRC sends a new one, so the choice matters for weeks, not just one payslip (${h.src('gov_employee_codes', 'tax codes for employers')}).</p>
<!--tool:mini:newjob|{"st":1,"pay":2300}-->

<h2>Your first payslips</h2>
<p>Look at the code printed on the payslip. A code ending in W1, M1 or X, or the word NONCUM, means the emergency basis, where each pay is treated on its own (${h.src('gov_emergency', 'emergency tax codes')}). It is usually temporary. When HMRC has the income details from both employers, it sends a code to you and the employer, and if too much was taken the excess is normally returned through your pay. If too little was taken, GOV.UK says you can stay on the emergency code until the year's tax is right.</p>
<p>Being paid by your old and new employer in the same month is one of the situations GOV.UK names as a reason for a tax calculation letter after the year ends, so keep your last payslip from the previous job.</p>

<h2>When to act yourself</h2>
<p>Give HMRC ${h.R.waitAfterNewJobDays} days from your start date. After that, if the code still looks wrong, sign in to your ${h.src('hmrc_check', 'HMRC online account')}, check that the old job shows an end date and the new one an estimated pay that is realistic, and correct what is missing (${h.src('gov_update', 'how to update your code')}). If your old employer never gave you a P45, ask them for one: see ${h.a('no-p45-tax-code', 'starting without a P45')}.</p>`;
    },
  },
});
