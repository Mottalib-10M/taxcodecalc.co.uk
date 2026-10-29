import { definePage } from '../../lib/guide-types';

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

export default definePage({
  id: 'leaving-a-job-p45', group: 'situations', order: 18,
  tool: { kind: 'emergency', props: { freq: 'monthly', pay: 2200, start: 8, periods: 2, emergency: 'X', correct: '1257L' } },
  mini: { kind: 'mini:w1', props: { pay: 2200, start: 8 } },
  related: ['new-job-tax-code', 'no-p45-tax-code', 'emergency-tax-code', 'tax-refund-wrong-code', 'w1-m1-x-tax-codes'],
  sources: ['gov_p45', 'gov_emergency', 'gov_paidwrong', 'starter', 'gov_overunder', 'hmrc_check', 'employer_2627'],
  en: {
    slug: 'leaving-a-job-p45', nav: 'Leaving a job: P45', card: 'What your P45 records, which parts go to the next employer, and what happens to your code with or without it.',
    title: 'Leaving a Job P45: Your Tax Code Between Jobs Explained',
    description: 'Leaving a job? Your P45 carries your pay, tax and code to the next employer. See which parts to hand over, what to do without one and how gaps affect your tax.',
    h1: 'Leaving a job: your P45 and your tax code',
    intro: 'The form that takes your tax history from one payroll to the next, and the emergency code you risk without it.',
    resume: (h) => {
      const Y = h.Y();
      const e = h.emergency({ freq: 'monthly', pay: 2200, start: 8, periods: 2, emergency: `${Y.emergencyCode} M1`, correct: '1257L' });
      return `Your employer should hand you a P45 when you leave, showing your leaving date, your total pay and tax from 6 April to that date, your tax code and personal details such as your National Insurance number (${h.src('gov_p45', 'GOV.UK')}). It is the bridge to your next payroll: give Parts 2 and 3 of a paper P45 to the new employer and keep Part 1a. With it, the new employer can carry on your code cumulatively, counting the pay and tax already recorded. Without it, you fill in the ${h.src('starter', 'starter checklist')}, and if another job already paid you this tax year the employer uses ${Y.emergencyCode} on a month 1 basis until HMRC sends a code, which can take up to ${h.R.waitAfterNewJobDays} days. Leaving any earlier pay aside, for someone starting at ${h.gbp(2200)} a month in November, two months on ${Y.emergencyCode} M1 take ${h.pence(e.onEmergency)} where the cumulative code takes ${h.pence(e.right)}; the ${h.pence(e.back)} gap comes back in the ${e.switchPeriod ? MONTHS[e.switchPeriod - 1] : 'next'} pay once the proper code arrives. A lost P45 cannot be replaced.`;
    },
    faqs: (h) => [
      { q: 'What should I do with my P45 if I am not starting a new job straight away?', a: 'Keep it safe until you start working again, then give it to the new employer. If in the meantime you claim taxable benefits such as Jobseeker\'s Allowance, the P45 goes to Jobcentre Plus instead. If you need the figures for any other reason, your personal tax account and the HMRC app show pay and tax details from recent tax years.' },
      { q: 'My former employer never sent my P45: can I get a copy?', a: 'Ask the former employer first; GOV.UK says you should request it if it did not arrive. If it was lost, or the employer says it was sent and you never received it, no replacement can be issued. In that case fill in the starter checklist for your new employer instead, so payroll can choose a starting code from the statement you tick.' },
      { q: 'What happens if the pay or tax figures on my P45 are wrong?', a: 'Ask the employer you left to correct them and send you an amended P45. If that does not happen, tell HMRC through the Check your Income Tax online service that the details are wrong, and HMRC contacts the employer for the correct figures. If only the code on the P45 is wrong, hand it over anyway: HMRC should correct the code after your first pay.' },
      { q: 'Why did I owe tax after leaving one job and starting another in the same month?', a: 'Pay from two employers in the same month is a known cause. HMRC names finishing one job and starting another, with pay from both in the same month, as a typical reason for a year-end tax calculation letter. A debt found that way is usually collected through your code the following tax year if it is small enough.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows = [1800, 2200, 3000, 4000].map((pay) => {
        const em = h.emergency({ freq: 'monthly', pay, start: 8, periods: 1, emergency: `${Y.emergencyCode} M1`, correct: '1257L' });
        return [h.gbp(pay), h.pence(em.right), h.pence(em.onEmergency), h.pence(em.onEmergency - em.right)];
      });
      return `
<h2>What the P45 records</h2>
<p>A P45 is a summary of your tax year so far at the job you are leaving. It shows the date you left, the total pay and the total tax from 6 April up to that date, and the tax code in use, together with your personal details and National Insurance number (${h.src('gov_p45', 'GOV.UK')}). Your employer sends the same information to HMRC. Only employees receive one.</p>
<p>A paper P45 comes in parts. Parts 2 and 3 go to your next employer, and Part 1a is your copy to keep. If you stay with an employer until the end of the tax year, you get a P60 instead, which shows the tax paid on that job over the whole year.</p>

<h2>Handing it to your next employer</h2>
<p>The new employer uses the P45 to work out your tax code and to load your pay and tax to date into its payroll. That lets it continue on a cumulative basis: the tax on each pay is calculated on everything earned since 6 April, with the allowance of every month counted, including months spent between jobs. If you bring more than one P45, the employer uses the one with the latest leaving date and hands the other back to you.</p>
<p>Timing matters. If you give the P45 after your first payday, the employer keeps using the code reported on its first payroll submission, or the one HMRC has since sent, and adds your previous pay and tax where HMRC has not yet provided a code. If the code printed on the P45 itself is wrong, HMRC should correct it automatically after your first pay. The ${h.a('new-job-tax-code', 'new job guide')} follows the first weeks in more detail.</p>
<!--tool:mini:w1|{"pay":2200,"start":8}-->

<h2>Starting without a P45</h2>
<p>When the P45 is missing, the ${h.src('starter', 'starter checklist')} replaces it. Employers also ask for it when your last job ended before 6 April 2025. The statement you tick sets the starting code: the full allowance on a cumulative basis if this is your first job since 6 April with no Jobseeker's Allowance, Employment and Support Allowance or Incapacity Benefit; the allowance on a ${h.a('w1-m1-x-tax-codes', 'week 1 or month 1 basis')} if you had another job this year that has ended, or one of those benefits; BR if you still have another job or a pension.</p>
<p>The month 1 basis is the expensive case. It gives one month of allowance per pay and ignores everything before, so you pay more until HMRC sends a proper code. The table shows the first pay of a job starting in November with no earlier pay in the year, using the ${Y.label} rates for England and Northern Ireland.</p>
${h.table(['Monthly pay', 'Cumulative code', `${Y.emergencyCode} M1`, 'Extra on month 1 basis'], rows, `Tax on the first pay, Income Tax only; rates from ${h.src('employer_2627', 'GOV.UK')}. Earlier pay shown on a P45 would also be taken into account by the cumulative code.`, ['l', 'r', 'r', 'r'])}
<p>The extra is not lost. HMRC usually issues the correct code once it has details from your new and previous employers, which can take up to ${h.R.waitAfterNewJobDays} days from your start date (${h.src('gov_emergency', 'GOV.UK')}), and the cumulative code returns the excess on that payslip. The ${h.a('no-p45-tax-code', 'no P45 guide')} covers that path in full.</p>

<h2>Between jobs and at the year end</h2>
<p>If you stop working for a while and do not claim benefits, there is no payroll through which a refund could be paid, and GOV.UK says no refund is possible until HMRC has your income details, so make sure the P45 reaches either your next employer or, if you claim taxable benefits, Jobcentre Plus. After 5 April, HMRC gathers figures from employers, from pension providers and from the benefits office and writes between ${h.R.lettersFrom} and ${h.R.lettersTo} if you paid the wrong amount (${h.src('gov_overunder', 'GOV.UK')}); the ${h.a('tax-refund-wrong-code', 'refund guide')} explains each payment route. To check what HMRC holds for the current year in the meantime, use your ${h.src('hmrc_check', 'HMRC online account')}.</p>`;
    },
  },
});
