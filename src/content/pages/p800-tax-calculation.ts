import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'p800-tax-calculation', group: 'situations', order: 14,
  tool: { kind: 'mini:refund', props: { paid: 4200, pay: 30000 } },
  mini: { kind: 'mini:underpaid', props: { owed: 450, rate: 0 } },
  related: ['tax-refund-wrong-code', 'underpaid-tax-code', 'wrong-tax-code', 'state-pension-tax-code', 'self-assessment-tax-code'],
  sources: ['gov_overunder', 'gov_paidwrong', 'gov_sp_tax', 'gov_claim_refund', 'hmrc_check', 'employer_2627'],
  en: {
    slug: 'p800-tax-calculation', nav: 'P800 letter', card: 'The year-end letter that settles a wrong code: refund or debt, who gets it, when, and what to do next.',
    title: 'P800 Tax Calculation: Refund or Tax Owed After the Year',
    description: 'A P800 says you paid too much or too little tax last year. Check the sum, see why it happened, how a refund is paid and how a debt goes into next year\'s code.',
    h1: 'P800 tax calculation letter',
    intro: 'HMRC\'s year-end check on employees and pensioners: what the letter compares, why it arrives and how each outcome is settled.',
    resume: (h) => {
      const due = h.due({ region: 'ruk', job1: 30000 });
      const paid = 420000;
      return `A P800, also called a tax calculation letter, is the result of HMRC's check once a tax year has closed on 5 April: it compares the Income Tax taken through PAYE with the tax due on your full income, as described on ${h.src('gov_overunder', 'GOV.UK')}. Only employees and pension recipients receive one, and the letters are sent between ${h.R.lettersFrom} and ${h.R.lettersTo} of the next tax year. People in Self Assessment never get a P800, because their return already corrects the figure. If you earned ${h.gbp(30000)} from one job in England and payroll took ${h.pence(paid)}, the tax due with the standard allowance is ${h.pence(due)}, so the letter would show ${h.pence(paid - due)} overpaid. A refund claimed online arrives within ${h.R.refundOnlineWorkingDays} working days. A debt under ${h.gbp(h.R.codingOutLimit)} is usually taken through your code over ${h.R.codingOutMonths} months from the next April; larger sums, or tax that payroll cannot collect, come as a Simple Assessment letter instead.`;
    },
    faqs: (h) => [
      { q: 'Why did I get a P800 when my employer handled all my tax?', a: 'Because PAYE works with the code it was given, and that code can be out of step with your real income. HMRC names the usual causes: a wrong code built on wrong information, two jobs paying you in the same month during a change of employer, a workplace pension that started, and Employment and Support Allowance or Jobseeker\'s Allowance received during the year.' },
      { q: 'What is the difference between a P800 and a Simple Assessment letter?', a: `Both arrive after the year ends and both state a final figure. A P800 covers refunds and debts that can be settled through payroll or a payment from HMRC. A Simple Assessment is used when tax cannot be taken automatically from your income, when the debt exceeds ${h.gbp(h.R.codingOutLimit)}, or for tax on the State Pension. It comes with a deadline by which you must pay.` },
      { q: 'What should I do if the figures on my P800 are wrong?', a: 'Contact HMRC and point to the amounts you think are incorrect, giving the figures you believe are right, for example from your P60 or your last payslip of the year. If HMRC agrees, it issues a fresh calculation. If it disagrees, it explains why. Keep the original letter and its reference number while the query is open.' },
      { q: 'I think I overpaid tax but have no P800 letter: what now?', a: `HMRC suggests using its refund checker to find the claim route that fits your case. Letters only go out between ${h.R.lettersFrom} and ${h.R.lettersTo}, so a missing letter early in that window may simply not be sent yet. If you believe you owe tax and nothing has arrived, GOV.UK asks you to contact HMRC rather than wait.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const basic = h.sc('ruk').rates[0];
      const rows = [
        ['Refund, letter invites an online claim', `within ${h.R.refundOnlineWorkingDays} working days by bank transfer`],
        ['Refund, you request a cheque online', `within ${h.R.refundChequeWeeks} weeks`],
        ['Refund, letter says a cheque is coming', `within ${h.R.refundAutoChequeDays} days of the letter's date, no claim needed`],
        [`Debt under ${h.gbp(h.R.codingOutLimit)}, enough PAYE income`, `lower code, ${h.R.codingOutMonths} equal monthly instalments from the next April`],
        ['Debt that cannot be coded', 'HMRC writes with other ways to pay'],
      ];
      const owed = 450;
      const cut = Math.ceil((owed * 100) / basic);
      return `
<h2>What the letter compares</h2>
<p>Your employers and pension providers report every payment to HMRC, together with the tax they deducted. After the year closes, HMRC adds the reports up, along with income from the benefits office, and recalculates the tax on the total using your real allowances. The P800 sets the two numbers side by side: tax due on one line, tax paid on the other, and the gap between them.</p>
<p>The check only concerns people taxed through PAYE. If you are registered for Self Assessment, an under- or overpayment is absorbed by your return and no tax calculation letter is sent. If you think the PAYE figures for the current year are drifting, the ${h.src('hmrc_check', 'Check your Income Tax service')} shows the estimate HMRC is working from before the year ends.</p>

<h2>Reasons a P800 is sent</h2>
<p>GOV.UK gives four typical triggers, and each one is a code problem at heart:</p>
<ul>
<li>a ${h.a('wrong-tax-code', 'wrong tax code')}, often because HMRC held the wrong income figures;</li>
<li>leaving one job and starting another, with both paying you in the same month;</li>
<li>a workplace pension starting during the year;</li>
<li>Employment and Support Allowance or Jobseeker's Allowance received during the year.</li>
</ul>
<p>When a P800 is not possible, a Simple Assessment letter takes its place: for tax that cannot be taken automatically from your income, for debts above ${h.gbp(h.R.codingOutLimit)}, and for tax on the ${h.a('state-pension-tax-code', 'State Pension')} that could not be collected through another code, as the ${h.src('gov_sp_tax', 'State Pension guidance')} confirms.</p>

<h2>How each outcome is settled</h2>
${h.table(['Outcome on the letter', 'What happens'], rows, `Routes and times published by ${h.src('gov_overunder', 'GOV.UK')}.`, ['l', 'l'])}
<p>For an online claim you need the reference number on the letter and your National Insurance number. With a UK bank account you can also claim through your personal tax account or the HMRC app. Where you are owed for several years, an automatic cheque pays it all at once. The ${h.a('tax-refund-wrong-code', 'refund guide')} shows how much of the same money could have come back earlier through payroll.</p>
<!--tool:mini:underpaid|{"owed":${owed},"rate":0}-->

<h2>When the P800 shows tax owed</h2>
<p>A debt is usually recovered without a payment from you. HMRC changes your code for the following tax year so that your employer or pension provider deducts a little more each month, normally in equal instalments over ${h.R.codingOutMonths} months. Three things must be true: you pay Income Tax through PAYE, your income above the Personal Allowance is large enough, and the debt is under ${h.gbp(h.R.codingOutLimit)}. A basic rate payer owing ${h.gbp(owed)} would see ${h.gbp(cut)} come off the allowance, taking 1257L to ${h.codeFor(Y.personalAllowance - cut, 'L', 'ruk')}; the ${h.a('underpaid-tax-code', 'underpaid tax page')} shows the effect for other amounts and rates.</p>
<p>You do not have to accept the slower route. GOV.UK allows you to pay the sum before the next tax year begins, which keeps your April code clean. If the letter is wrong rather than simply unwelcome, contact HMRC with the amounts you dispute and the figures you believe are right; it either sends a corrected calculation or explains why the original stands.</p>

<h2>If no letter arrives</h2>
<p>No P800 may mean HMRC found nothing to correct, or that your letter has not been sent yet within the ${h.R.lettersFrom} to ${h.R.lettersTo} window. If you are confident you overpaid on a job or pension, HMRC's ${h.src('gov_claim_refund', 'refund checker')} points to the right claim. If you suspect you underpaid and nothing has come, GOV.UK asks you to contact HMRC instead of waiting for a letter.</p>`;
    },
  },
});
