import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'check-my-tax-code', group: 'tools', order: 2,
  tool: { kind: 'rightcode', props: { region: 'ruk', job1: 34000, job2: 0, current: '1257L' } },
  mini: { kind: 'mini:secondjob', props: { j1: 26000, j2: 9000 } },
  related: ['wrong-tax-code', 'second-job-tax-code', 'company-benefits-tax-code', 'pension-tax-code', 'tax-refund-wrong-code'],
  sources: ['hmrc_check', 'gov_update', 'gov_meaning', 'gov_rates', 'gov_marriage', 'gov_sp_tax', 'gov_benefits'],
  demarche: true,
  en: {
    slug: 'check-my-tax-code', nav: 'Am I on the right code?', card: 'Your jobs, pensions, benefits and allowances: the code they point to and the tax gap over the year.',
    title: 'Check My Tax Code: Am I on the Right Code This Year?',
    description: 'Enter your jobs, pensions, benefits and Marriage Allowance: the tax code your situation points to, the tax due for the year and how far your code is off.',
    h1: 'Check my tax code: am I on the right one?',
    intro: 'Your incomes and allowances on one side, the code on your payslip on the other: the code they point to and the gap over the year.',
    resume: (h) => {
      const Y = h.Y();
      const wrong = h.due({ region: 'ruk', job1: 26000, job2: 9000 });
      const br = h.taxYear('1257L', 26000) + h.taxYear('BR', 9000);
      const both = h.taxYear('1257L', 26000) + h.taxYear('1257L', 9000);
      return `Your tax code is right when it collects, over the year, the tax due on everything HMRC taxes through your pay. That starts from the Personal Allowance of ${h.gbp(Y.personalAllowance)} for ${Y.label}, reduced above ${h.gbp(Y.incomeLimit)} of income, raised or lowered by ${h.gbp(Y.marriageAllowance)} of Marriage Allowance, lowered by company benefits and the State Pension, and raised by job expenses. A second job or pension gets no allowance of its own: BR, or D0 when your main pay is already in the higher rate band. Take ${h.gbp(26000)} from a main job and ${h.gbp(9000)} from a second: the tax due is ${h.pence(wrong)}. With 1257L and BR, payroll takes ${h.pence(br)}; with 1257L on both jobs it takes only ${h.pence(both)}, and the shortfall comes back as a bill or a lower code next year. The checker above makes this comparison for your figures and gives the code they point to.`;
    },
    faqs: (h) => [
      { q: 'Where do I find the code HMRC has given each job?', a: 'On each payslip, on your P60 after the year ends, and in your HMRC online account or app, which lists every employment and pension with its code and explains the figures behind it. If you have two jobs or a job and a pension, each one has its own code, and both should appear there.' },
      { q: 'Can my employer change my tax code?', a: 'No. An employer or pension provider must use the code HMRC sends, or the one worked out from a P45 or starter checklist until HMRC sends one. If you think the code is wrong, update your details with HMRC; the corrected code goes to you and the employer, and the employer applies it.' },
      { q: 'What if the checker gives a different code from my payslip?', a: `First look at what HMRC knows that the checker does not: savings interest, rental income, an underpayment from an earlier year, or a benefit your employer reported. Your online account lists each item. If an item is wrong or missing, correct it there. HMRC sends a new code within ${h.R.codeChangeWorkingDays} working days, and any overpaid tax usually comes back through payroll.` },
      { q: 'Does the checker include National Insurance?', a: 'No. It deals only with Income Tax and the code, because National Insurance does not depend on your tax code. Pension contributions taken from your pay under a net pay arrangement should be left out of the pay you enter, since tax relief is already given by reducing taxable pay before the code is applied.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const sp = Math.round(h.R.statePensionWeekly2627 * 52);
      const cases = [
        ['One job, nothing else', h.expected({ region: 'ruk', job1: 34000 }).main],
        [`Company medical insurance worth ${h.gbp(h.R.medicalExample.benefit)}`, h.expected({ region: 'ruk', job1: 34000, bik: h.R.medicalExample.benefit }).main],
        [`Marriage Allowance received`, h.expected({ region: 'ruk', job1: 34000, ma: 'receive' }).main],
        [`Two jobs, ${h.gbp(26000)} and ${h.gbp(9000)}`, `${h.expected({ region: 'ruk', job1: 26000, job2: 9000 }).main} and ${h.expected({ region: 'ruk', job1: 26000, job2: 9000 }).second}`],
        [`Workplace pension ${h.gbp(9000)} and full State Pension`, h.expected({ region: 'ruk', job1: 9000, statePension: sp }).main],
        [`Income of ${h.gbp(110000)}`, h.expected({ region: 'ruk', job1: 110000 }).main],
        [`Job expenses of ${h.gbp(600)}`, h.expected({ region: 'ruk', job1: 34000, expenses: 600 }).main],
      ];
      return `
<h2>What the checker compares</h2>
<p>It does two calculations. The first is the tax due for the year on your employment and pension income, with the allowances and rates that apply to you in ${Y.label} (${h.src('gov_rates', 'Income Tax rates and allowances')}). The second is the tax your current codes take over the year with HMRC's payroll method, from the month the job started. The gap between the two is what you would be over- or undercharged by 5 April if nothing changed. It also builds the code your figures point to, the way HMRC describes it: the allowance, minus what is taxed through the code, plus what gives relief, with the last digit dropped (${h.src('gov_meaning', 'what your tax code means')}).</p>
${h.table(['Situation', 'Code it points to'], cases, `England and Northern Ireland, ${Y.label}. State Pension at ${h.gbp(h.R.statePensionWeekly2627)} a week.`, ['l', 'l'])}

<h2>The usual reasons a code is off</h2>
<p>Most gaps come from information HMRC did not have or has not updated. A second job coded 1257L as well as the first gives two allowances, so too little tax is taken. A main job coded BR after a change of employer takes too much. A ${h.a('company-benefits-tax-code', 'company car')} handed back, a State Pension counted at the wrong weekly rate, or Marriage Allowance claimed but not yet in the code all shift the number. When you start a job without a P45, an ${h.a('emergency-tax-code', 'emergency code')} can run for a few months before the right one arrives.</p>
<!--tool:mini:compare|{"code":"1257L","code2":"BR","pay":24000}-->

<h2>Pensioners, Scotland and Wales</h2>
<p>If you receive the State Pension, enter its weekly amount: it is paid without tax taken off, so HMRC usually collects its tax through the code on a workplace pension or a job, which lowers that code sharply (${h.src('gov_sp_tax', 'how your State Pension is taxed')}). With the full new State Pension of ${h.gbp(h.R.statePensionWeekly2627)} a week, almost all of the allowance goes. Choose Scotland or Wales if you live there: the checker then gives an S or C code and uses the Scottish or Welsh rates. Marriage Allowance only works one way per couple: the partner who receives it gets an M code, the one who gives it an N code (${h.src('gov_marriage', 'Marriage Allowance')}).</p>

<h2>Putting it right with HMRC</h2>
<p>Only HMRC can change your code. Sign in to the ${h.src('hmrc_check', 'Check your Income Tax service')} or the HMRC app, check each employment, pension, benefit and expense, and update anything that is wrong or missing; that is the quickest route according to ${h.src('gov_update', 'GOV.UK')}. HMRC then tells you and your employer the new code within ${h.R.codeChangeWorkingDays} working days. A monthly payroll should use it on the next or the following payslip, a weekly payroll on the third. If you started a new job, wait ${h.R.waitAfterNewJobDays} days for HMRC to receive the income details before contacting it.</p>
<p>When the new code is cumulative and you have paid too much, the difference comes back on the payslip that first uses it. The ${h.a('tax-refund-wrong-code', 'refund page')} covers the cases where it does not, and the ${h.a('underpaid-tax-code', 'underpaid tax page')} what happens when you owe.</p>`;
    },
  },
});
