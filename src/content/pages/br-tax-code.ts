import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'br-tax-code', group: 'codes', order: 2,
  tool: { kind: 'compare', props: { a: '1257L', b: 'BR', pay: 9000 } },
  mini: { kind: 'mini:flat', props: { pay: 9000 } },
  related: ['second-job-tax-code', 'd0-tax-code', '0t-tax-code', 'new-job-tax-code', 'wrong-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'starter', 'paye_spec', 'employer_2627', 'hmrc_check'],
  en: {
    slug: 'br-tax-code', nav: 'BR', card: 'Every pound taxed at 20%: why a second job or pension gets BR, and what to do when BR sits on your only job.',
    title: 'BR Tax Code: 20% on Every Pound of a Second Job or Pension',
    description: 'BR means no tax-free pay on this job: every pound is taxed at the basic rate of 20%. See when BR fits a second job and when it is wrong on your only job.',
    h1: 'BR tax code',
    intro: 'A code with no number: the whole of this pay is taxed at the basic rate, with no allowance at all.',
    resume: (h) => {
      const Y = h.Y();
      return `BR stands for basic rate. An employer or pension provider using BR gives you no tax-free pay at all and takes ${h.flat('BR')}% from every pound you earn there, from the first pound to the last. It is the code ${h.src('gov_meaning', 'GOV.UK')} links to a second job or a second pension: your ${h.gbp(Y.personalAllowance)} Personal Allowance for ${Y.label} is already used by your main job, so this source starts taxing straight away. A second job paying ${h.gbp(9000)} a year loses ${h.pence(h.taxYear('BR', 9000))} to Income Tax under BR, against ${h.pence(h.taxYear('1257L', 9000))} if the same pay carried 1257L. BR is right when the main job uses the whole allowance and keeps you below the higher rate threshold of ${h.gbp(h.bandEdges('ruk')[0])}. It is wrong when the BR job is now your only income, for instance after the main job ended. In Scotland the same code is written SBR and in Wales CBR, both at ${h.flat('SBR')}%. You correct it through your ${h.src('hmrc_check', 'HMRC online account')}, not through your employer.`;
    },
    faqs: (h) => [
      { q: 'Why does my second job have the BR tax code?', a: `Your Personal Allowance is given through one source of income, and GOV.UK describes BR as the code usually used when you have more than one job or pension. Every pound of the second job is then taxed at ${h.flat('BR')}%. If the main job really uses the whole ${h.gbp(h.Y().personalAllowance)} and you stay in the basic rate band, the tax taken on the second job matches what you owe on it.` },
      { q: 'My only job is on BR: am I paying too much tax?', a: `Very likely. With BR, the first ${h.gbp(h.Y().personalAllowance)} of pay is taxed instead of being free, which costs up to ${h.gbp(h.Y().personalAllowance * h.flat('BR') / 100)} over a full year. It often happens when a main job ends and the second job is left on BR. Update your jobs in your HMRC online account so that HMRC moves the allowance to the job you still have.` },
      { q: 'Why did ticking statement C give me the BR code?', a: 'Statement C on the starter checklist says you have another job or receive a State, workplace or private pension. The employer guidance printed on that form tells the new employer to use BR in that case, with no allowance at all. The employer keeps that code until HMRC sends a new one, which can be different once HMRC holds the details of every job and pension you have.' },
      { q: 'Does BR ever give a tax refund in the middle of the year?', a: 'It can when BR is run cumulatively. HMRC’s payroll specification works out the tax due on the pay to date and subtracts the tax already taken, so a fall in pay or a correction can produce a refund on a later payslip. On a week 1 or month 1 basis, each pay is taxed on its own and nothing from earlier periods is given back.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('ruk');
      const rows = [4000, 9000, 15000, 25000].map((p) => [h.gbp(p), h.pence(h.taxPeriod('BR', 'monthly', p / 12, 1)), h.pence(h.taxYear('BR', p)), h.pence(h.taxYear('1257L', p))]);
      return `
<h2>How BR works on a payslip</h2>
<p>A BR code has no number, so the payroll has no free pay to subtract. HMRC's ${h.src('paye_spec', 'specification for PAYE tax routines')} says the whole of the pay to date is rounded down to the pound and charged at the basic rate, whatever its size. With ${h.gbp(750)} paid in a month, the deduction is ${h.pence(h.taxPeriod('BR', 'monthly', 750, 1))}; with ${h.gbp(1500)}, it is ${h.pence(h.taxPeriod('BR', 'monthly', 1500, 1))}. The rate never climbs to ${h.sc('ruk').rates[1]}%, even if the second job pays a lot: if your combined income crosses into the higher band, HMRC would use ${h.a('d0-tax-code', 'D0')} instead.</p>
<p>The ${h.src('gov_employee_codes', 'employer guidance on tax codes')} lists BR as the usual code for a second job or a pension. That is why it shows up on the payslip of a weekend job, an evening shift or a small occupational pension paid next to a salary.</p>
${h.table(['Yearly pay on the BR job', 'Tax in month 1', 'Tax over the year with BR', 'Same pay with 1257L'], rows, `Income Tax only, ${Y.label}, equal monthly pay; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r', 'r'])}

<h2>When BR is the right code</h2>
<p>BR fits when three things are true. Your main job or pension carries the Personal Allowance and uses all of it. Your total income stays under ${h.gbp(e[0])}, the point where the basic rate band ends for most people. And the second source is paid through PAYE. In that case the ${h.flat('BR')}% taken on the second job matches the tax you actually owe on that income, and the year closes with no surprise.</p>
<p>New employers also reach BR through the ${h.src('starter', 'starter checklist')}. Statement A gives the standard allowance, statement B gives it on a week 1 or month 1 basis, and statement C, for people who already have a job or receive a pension, gives BR. The employer keeps that code until HMRC sends a new one, which HMRC aims to do within ${h.R.codeChangeWorkingDays} working days of a change it accepts.</p>
<!--tool:mini:secondjob|{"j1":30000,"j2":9000}-->

<h2>When BR is the wrong code</h2>
<p>The common mistake is BR left on what has become your only job. Picture someone who had a full-time post and a Saturday job, then left the full-time post in the summer. If the Saturday job still runs BR, none of the allowance is being used anywhere, and every payslip overpays. The same thing happens when a retired person's main pension stops or is transferred and the remaining one stays on BR.</p>
<p>BR is also wrong in the opposite direction. If the main salary already reaches the higher rate band, ${h.flat('BR')}% on the second job is too little and the gap turns into an underpayment that HMRC collects later. That case calls for D0 at ${h.flat('D0')}%. The ${h.a('second-job-tax-code', 'second job page')} compares the codes for two incomes side by side.</p>
<p>To fix either case, sign in to your ${h.src('hmrc_check', 'HMRC online account')}, check that each employment and pension is listed with the right estimated pay, and update anything missing. Your employer keeps applying the code it was given until HMRC sends a new one, so the change has to start with your record. If the overpayment has already happened, the ${h.a('tax-refund-wrong-code', 'refund page')} explains how it comes back.</p>

<h2>SBR and CBR: the same idea in Scotland and Wales</h2>
<p>If your main home is in Scotland, the code reads SBR and charges the Scottish basic rate of ${h.flat('SBR')}%, not the starter rate of ${h.sc('scot').rates[0]}%. If you live in Wales it reads CBR, charging the Welsh basic rate of ${h.flat('CBR')}%. The letter in front tells the payroll which set of rates applies; the logic of no allowance and one flat rate stays the same. The ${h.a('scottish-tax-codes', 'Scottish codes page')} shows the SD codes that replace D0 and D1 north of the border.</p>`;
    },
  },
});
