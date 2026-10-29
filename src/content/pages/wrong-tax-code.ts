import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'wrong-tax-code', group: 'situations', order: 12,
  tool: { kind: 'rightcode', props: { region: 'ruk', job1: 30000, job2: 0, bik: 1570, current: '1257L' } },
  mini: { kind: 'mini:compare', props: { code: '1257L', code2: 'BR', pay: 30000 } },
  related: ['check-my-tax-code', 'tax-refund-wrong-code', 'underpaid-tax-code', 'second-job-tax-code', 'new-job-tax-code'],
  sources: ['gov_update', 'hmrc_check', 'gov_paidwrong', 'gov_emergency', 'gov_p45', 'gov_relief', 'employer_2627'],
  demarche: true,
  en: {
    slug: 'wrong-tax-code', nav: 'Wrong tax code', card: 'The signs that your code does not fit, how to correct HMRC\'s record and when the new code reaches your payslip.',
    title: 'Wrong Tax Code: Signs, Fixes and When Your Pay Changes',
    description: 'Think your tax code is wrong? Spot the signs, correct the details HMRC holds online, and see when the new code reaches your payslip and what the error has cost.',
    h1: 'Wrong tax code: how to spot it and get it fixed',
    intro: 'Most wrong codes come from wrong or missing details at HMRC. Find the mistake, correct the record and follow the new code to your payslip.',
    resume: (h) => {
      const Y = h.Y();
      const br = h.taxYear('BR', 30000) - h.taxYear('1257L', 30000);
      return `A tax code is usually wrong because HMRC has incorrect or missing information about your jobs, pensions, benefits or expenses, not because of a payroll error. The quickest fix, as ${h.src('gov_update', 'GOV.UK')} sets out, is to sign in to the ${h.src('hmrc_check', 'Check your Income Tax online service')}, review your employment and pension details, the estimated taxable income, any company benefits and expenses, and correct what is wrong. If a change is needed, HMRC updates the code and tells both you and your employer within ${h.R.codeChangeWorkingDays} working days. Monthly paid staff should see it on their next or the following payslip; weekly paid staff on the third. The error can be costly: an only job of ${h.gbp(30000)} wrongly coded BR loses the ${h.gbp(Y.personalAllowance)} Personal Allowance and pays ${h.pence(br)} too much over a year, while a second job wrongly on 1257L leaves a debt for later. After starting a new job, allow ${h.R.waitAfterNewJobDays} days for HMRC to receive your details before you contact it.`;
    },
    faqs: (h) => [
      { q: 'How long does HMRC take to correct a wrong tax code after I update my details?', a: `If the code needs to change, HMRC issues the new one and tells you and your employer within ${h.R.codeChangeWorkingDays} working days. Your employer then applies it: for monthly pay, on the next or the following payslip; for weekly pay, by the third. If your payslip still shows the old code after that, ask your payroll team whether the notice has reached them.` },
      { q: 'Who do I contact about a wrong tax code if I cannot use the online service?', a: 'GOV.UK points you to the HMRC contact for Income Tax enquiries from individuals, pensioners and employees. Your employer cannot choose or change your code on its own; it uses the one HMRC sends. Family members can help you with your tax if you register them as a trusted helper, and agents have a separate PAYE Coding Notice query form.' },
      { q: 'Should I wait before reporting a wrong tax code in a new job?', a: `Yes. GOV.UK asks you to wait ${h.R.waitAfterNewJobDays} days after starting, because that is how long HMRC can take to receive income details from your new and previous employers and send a proper code. Giving your new employer the P45 from your last job speeds this up. If the code still looks wrong after that period, update your details online.` },
      { q: 'Will I get money back once a wrong tax code is corrected?', a: 'Usually, yes. When HMRC updates the code it checks whether it has all your income details for the year. If it does, it works out the overpayment and asks your employer or pension provider to refund it through your pay, normally when the new code is first used. If details are missing, the refund waits until after the tax year ends.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const pay = 30000;
      const right = h.taxYear('1257L', pay);
      const rows = ['BR', '0T', 'D0', '1100L', '1383M'].map((c) => {
        const t = h.taxYear(c, pay);
        return [c, h.pence(t), `${t >= right ? '+' : '−'}${h.pence(Math.abs(t - right))}`];
      });
      const taken = h.taxYear('1257L', 28000) + h.taxYear('1257L', 7000);
      const due = h.due({ region: 'ruk', job1: 28000, job2: 7000 });
      return `
<h2>Signs that your code does not fit your situation</h2>
<p>Start with the code on your latest payslip and ask whether it describes your year. The usual mismatches are easy to spot once you know them:</p>
<ul>
<li>a second job or pension shows a code with a number instead of ${h.a('br-tax-code', 'BR')} or a D code, so both sources are giving you an allowance;</li>
<li>your only job shows BR or 0T, so no allowance is given at all;</li>
<li>the code still ends in W1, M1 or X more than ${h.R.waitAfterNewJobDays} days after you started, which the ${h.src('gov_emergency', 'emergency code guidance')} treats as a sign the code may still be wrong;</li>
<li>a company car or medical insurance has started or stopped and the number has not moved;</li>
<li>you claimed job expenses or Marriage Allowance and the number or letter has not changed;</li>
<li>the code is built on an old salary or on a job you have left.</li>
</ul>
<p>The tool at the top builds the code your situation points to and sets it against the code you have, so you can see the gap before you sign in anywhere.</p>

<h2>What a wrong code costs over a year</h2>
<p>The table compares several codes with 1257L on a single job of ${h.gbp(pay)}, using the ${Y.label} rates for England and Northern Ireland. A code that gives too little allowance overcharges every month; one that gives too much leaves a shortfall.</p>
${h.table(['Code used', 'Tax over the year', 'Against 1257L'], rows, `Single job of ${h.gbp(pay)}, equal monthly pay, Income Tax only; rates from ${h.src('employer_2627', 'GOV.UK')}.`, ['l', 'r', 'r'])}
<p>The opposite mistake is just as common with two jobs. With ${h.gbp(28000)} from a main job and ${h.gbp(7000)} from a second, both coded 1257L, payroll takes ${h.pence(taken)} over the year while ${h.pence(due)} is due, leaving ${h.pence(due - taken)} to be ${h.a('underpaid-tax-code', 'collected later through your code')}. The ${h.a('second-job-tax-code', 'second job guide')} explains which code each source should carry.</p>
<!--tool:mini:secondjob|{"j1":28000,"j2":7000}-->

<h2>Correcting the record with HMRC</h2>
<p>HMRC normally updates codes from what employers and pension providers report, so a wrong code points to a wrong record. Fix the record and the code follows. In the ${h.src('hmrc_check', 'Check your Income Tax service')}:</p>
<ol>
<li>sign in, or create sign-in details if you have none; you may be asked to prove your identity with photo ID;</li>
<li>check each employment and pension listed, the taxable income HMRC estimates for the year, and any company benefits and expenses;</li>
<li>update anything wrong or missing, such as a job that has ended or a salary that has risen;</li>
<li>claim ${h.src('gov_relief', 'tax relief on employment expenses')} if you pay for things your job requires.</li>
</ol>
<p>If you left a job and never received a ${h.src('gov_p45', 'P45')}, ask the former employer for one: it carries the pay, tax and code HMRC needs. Without access to the online service, you can contact HMRC instead.</p>

<h2>From new code to corrected payslip</h2>
<p>Once HMRC changes the code, it tells you and your employer within ${h.R.codeChangeWorkingDays} working days. Payroll then has to load it: on monthly pay you should see it on the next or the following payslip, and on weekly pay by the third. If it does not appear, the first check is with your employer, who may not have processed the notice yet.</p>
<p>A cumulative code applied mid-year recalculates the tax on all your pay since 6 April, so the first payslip on the new code often carries the correction in one go. If you paid too much, the ${h.a('tax-refund-wrong-code', 'refund after a wrong code')} usually arrives that way; if HMRC still lacks some income details, the balance is settled after the tax year ends instead.</p>`;
    },
  },
});
