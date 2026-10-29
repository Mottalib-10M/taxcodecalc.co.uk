import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'second-job-tax-code', group: 'situations', order: 1,
  tool: { kind: 'rightcode', props: { job1: 28000, job2: 7000, current: '1257L' } },
  mini: { kind: 'mini:secondjob', props: { j1: 28000, j2: 7000 } },
  related: ['br-tax-code', 'd0-tax-code', 'check-my-tax-code', 'underpaid-tax-code', 'new-job-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'starter', 'gov_update', 'gov_paidwrong', 'employer_2627'],
  en: {
    slug: 'second-job-tax-code', nav: 'Second job', card: 'Two jobs, one allowance: which job gets 1257L, why the other shows BR or D0, and when the allowance is split.',
    title: 'Second Job Tax Code: BR, D0 or a Split Personal Allowance',
    description: 'Two jobs share one Personal Allowance. See which job should carry 1257L, why the other is coded BR or D0, when HMRC splits the allowance, and the tax due.',
    h1: 'Tax code for a second job',
    intro: 'Two payslips, two codes, one allowance: how HMRC divides it and what each job should take.',
    resume: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      const e = h.expected({ region: 'ruk', job1: 28000, job2: 7000 });
      const low = h.expected({ region: 'ruk', job1: 9000, job2: 7000 });
      return `With two jobs you still have only one Personal Allowance, ${h.gbp(Y.personalAllowance)} in ${Y.label}, so HMRC issues a separate code for each employer and puts the allowance where it does the most good. Normally the job that pays more keeps the allowance and shows ${e.main}, while the smaller job gets ${e.second}: every pound there is taxed at ${r[0]}% because no tax-free amount is left. If your main pay already reaches the higher-rate band, the second job is coded D0 and taxed at ${r[1]}%, and above the additional-rate threshold D1 at ${r[2]}% (${h.src('gov_meaning', 'GOV.UK letters table')}). Take a main job of ${h.gbp(28000)} and a weekend job of ${h.gbp(7000)}: the expected codes are ${e.main} and ${e.second}, and the tax due for the year is ${h.pence(h.due({ region: 'ruk', job1: 28000, job2: 7000 }))}. When the main pay is below the allowance, the unused part can move across: ${h.gbp(9000)} plus ${h.gbp(7000)} points to ${low.main} on the first job and ${low.second} on the second. The ${h.a('br-tax-code', 'BR code')} itself is explained on its own page.`;
    },
    faqs: (h) => [
      { q: 'Which of my two jobs should get the 1257L code?', a: `Usually the one that pays more over the year, because it can use the full ${h.gbp(h.Y().personalAllowance)} of tax-free pay. The job you started first is not automatically the main one. If your record shows the allowance on the smaller job, the bigger job is taxed from the first pound and the year can end with a refund or a bill, so check which employer HMRC treats as primary.` },
      { q: 'Can my Personal Allowance be split between a first and a second job?', a: `Yes, when the main job pays less than the allowance. HMRC can give the first job a code that matches its pay and pass the rest to the second job, so neither payslip loses tax-free pay. With ${h.gbp(9000)} and ${h.gbp(7000)}, the estimate points to ${h.expected({ region: 'ruk', job1: 9000, job2: 7000 }).main} and ${h.expected({ region: 'ruk', job1: 9000, job2: 7000 }).second}. You ask for it by updating the estimated pay of each job in your HMRC online account.` },
      { q: 'Why is my second job taxed at the higher rate with D0?', a: `D0 means all pay from that job is taxed at ${h.sc('ruk').rates[1]}%. HMRC uses it when the main job already takes you past ${h.gbp(h.bandEdges('ruk')[0])}, so each extra pound you earn elsewhere falls in the higher band anyway. It is not a penalty: BR would leave a shortfall of ${h.sc('ruk').rates[1] - h.sc('ruk').rates[0]}p in every pound, collected later through a lower code.` },
      { q: 'What happens if both of my jobs use 1257L at the same time?', a: `Each employer then gives you a full allowance, so you receive ${h.gbp(h.Y().personalAllowance * 2)} of tax-free pay when only half of it is due. On a second job of ${h.gbp(7000)}, 1257L takes ${h.pence(h.taxYear('1257L', 7000))} over the year where BR would take ${h.pence(h.taxYear('BR', 7000))}. HMRC normally recovers the gap by reducing a later code or with a calculation letter after 5 April.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      const e = h.bandEdges('ruk');
      const cases: Array<[number, number]> = [[9000, 7000], [28000, 7000], [45000, 12000], [62000, 9000]];
      const rows = cases.map(([a, b]) => {
        const x = h.expected({ region: 'ruk', job1: a, job2: b });
        return [h.gbp(a), h.gbp(b), x.main, x.second ?? '-', h.pence(h.due({ region: 'ruk', job1: a, job2: b }))];
      });
      return `
<h2>One allowance, two payrolls</h2>
<p>An employer only sees the pay it runs itself. It has no idea whether you earn ${h.gbp(5000)} or ${h.gbp(50000)} somewhere else, so it relies entirely on the code HMRC sends. That is why ${h.src('gov_meaning', 'GOV.UK')} explains that you get one code per employment or pension: each one tells a single payroll how much tax-free pay it may use. Added together, the tax-free amounts across your codes should never go beyond your own allowance of ${h.gbp(Y.personalAllowance)}.</p>
<p>When you start the extra job without a P45, the new employer asks you to fill in the ${h.src('starter', 'starter checklist')}. Ticking statement C, the one for people who already have another job or a pension, tells payroll to use BR straight away. Tick A or B by mistake and the new job also gets an allowance, so the year's deductions fall short of the bill.</p>

<h2>Expected codes for common pairs of jobs</h2>
<p>The table runs the estimate used by the checker above on four pairs of salaries, with no benefits, expenses or Marriage Allowance, for England and Northern Ireland. With the standard allowance, the basic band covers gross pay up to ${h.gbp(e[0])}.</p>
${h.table(['Main job', 'Second job', 'Main code', 'Second code', 'Tax due for the year'], rows, `Estimate for ${Y.label}; rates from ${h.src('employer_2627', 'Rates and thresholds for employers')}.`, ['r', 'r', 'l', 'l', 'r'])}
<p>The pattern is simple. A low main salary leaves room in the allowance, so it is shared. A middle salary keeps the whole allowance and the extra job pays ${r[0]}% on everything. Once the main salary passes the basic band, the extra job is coded D0 and every pound of it costs ${r[1]}p in tax. Scottish taxpayers see SBR, SD0, SD1, SD2 or SD3 instead, because Scotland has more bands (${h.a('scottish-tax-codes', 'Scottish codes')}).</p>

<h2>Splitting the allowance when the main pay is low</h2>
<p>Picture ${h.gbp(9000)} from a part-time contract and ${h.gbp(7000)} from evening shifts. On BR, the evening job would lose ${h.pence(h.taxYear('BR', 7000))} over the year, yet total income of ${h.gbp(16000)} only owes ${h.pence(h.due({ region: 'ruk', job1: 9000, job2: 7000 }))}. Giving the first job a code close to its own pay and moving what is left to the second job brings the deductions in line with the bill. You can ask for this by entering realistic yearly pay for each employer in your ${h.src('hmrc_check', 'HMRC online account')}, which is the route GOV.UK gives for correcting the details behind a code (${h.src('gov_update', 'if your code is wrong')}).</p>
<!--tool:mini:compare|{"code":"1257L","code2":"BR","pay":7000}-->

<h2>Two mistakes that cost money</h2>
<p><strong>The allowance on both jobs.</strong> Each payroll applies ${h.gbp(Y.personalAllowance)} of free pay and too little tax leaves your pay all year. Nothing warns you until HMRC matches the two employers' figures. GOV.UK says the shortfall is then recovered by changing your code, over one or more tax years where possible, or set out in a letter after the year ends (${h.src('gov_paidwrong', 'paid too little tax')}). See ${h.a('underpaid-tax-code', 'how owed tax goes into a code')}.</p>
<p><strong>BR on your only job.</strong> This can happen when one job ends but the record still shows it as live, so the remaining one is treated as secondary. With no allowance at all, ${h.gbp(20000)} a year on BR loses ${h.pence(h.taxYear('BR', 20000))} against ${h.pence(h.taxYear('1257L', 20000))} with 1257L. Make sure your old employer has reported your leaving date, then update the record online. When the new code reaches payroll, the excess is normally refunded through your pay.</p>
<p>Once HMRC changes a code it tells you and the employer within ${h.R.codeChangeWorkingDays} working days. If you are paid monthly, expect it on the next payslip or the one after.</p>`;
    },
  },
});
