import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'p2-tax-code-notice', group: 'situations', order: 15,
  tool: { kind: 'decoder', props: { code: '1100L', pay: 32000 } },
  mini: { kind: 'mini:p2', props: { old: 1257, neu: 1100, pay: 32000 } },
  related: ['tax-code-changed', 'tax-code-numbers', 'company-benefits-tax-code', 'wrong-tax-code', 'k-tax-code'],
  sources: ['gov_taxcodes', 'gov_meaning', 'gov_update', 'hmrc_check', 'gov_employee_codes', 'gov_benefits', 'gov_relief'],
  demarche: true,
  en: {
    slug: 'p2-tax-code-notice', nav: 'P2 coding notice', card: 'Reading the coding notice line by line: the allowances added, the deductions taken off and the code they produce.',
    title: 'P2 Tax Code Notice: Reading Allowances and Deductions',
    description: 'Got a P2 coding notice from HMRC? Read each line: allowances added, deductions taken off, the tax-free total and the code it gives, then check every figure.',
    h1: 'P2 tax code notice: how to read it',
    intro: 'The letter that explains how HMRC built your code: from your Personal Allowance to the number and letter your employer uses.',
    resume: (h) => {
      const Y = h.Y();
      const m = h.R.medicalExample;
      return `A P2, the PAYE Coding Notice, is the letter HMRC sends when it works out a new code for one of your jobs or pensions, to explain how the code was built. ${h.src('gov_taxcodes', 'GOV.UK')} calls it a Tax Code Notice and says HMRC will usually contact you this way when your code changes. The logic is a simple sum. It starts from your Personal Allowance, ${h.gbp(Y.personalAllowance)} in ${Y.label}, adds anything that gives you relief through the code, such as ${h.gbp(Y.marriageAllowance)} of Marriage Allowance received or job expenses, then takes off income not taxed elsewhere and deductions such as company benefits or the High Income Child Benefit Charge. The total is the tax-free amount for that source; drop its last digit and add a letter and you have the code. GOV.UK's own example takes ${h.gbp(m.benefit)} of medical insurance from the allowance, leaving ${h.gbp(Y.personalAllowance - m.benefit)} and the code ${m.code}, which costs a basic rate payer about ${h.pence((h.taxYear(m.code, 32000) - h.taxYear('1257L', 32000)) / 12)} more each month. Each line can be checked, and corrected, in your HMRC online account.`;
    },
    faqs: (h) => [
      { q: 'Do I have to send anything back after receiving a P2 coding notice?', a: 'No. The notice is for your information, and your employer or pension provider receives its own copy of the new code. You only need to act if a line is wrong: an employment you have left, a benefit you no longer get, an income estimate that is far off. In that case update the details in the online service rather than replying to the letter.' },
      { q: 'Why did I receive two P2 coding notices at once?', a: 'You get a separate code for each job or pension, so a change that affects more than one source can produce more than one notice. A typical case is a second job coded BR alongside a main job with a numbered code. Read each notice with the employer or pension provider it names, because the allowance is usually given to one source only.' },
      { q: 'Can I get my P2 coding notices by email rather than by post?', a: 'Yes. If you sign in to check your code online or use the HMRC app, you can sign up for paperless notifications. HMRC then emails you when your code changes, and the full details appear in your account. The same place lets you look at the codes you had in earlier tax years, which helps when you compare an old notice with a new one.' },
      { q: 'Does a P2 coding notice show the tax I will pay for the year?', a: 'It shows the code and the allowances and deductions behind it, which decide how much of your pay is tax-free. For the estimated tax on the year, the Check your Income Tax service shows the income HMRC expects from each job and pension and the tax you are likely to owe. The decoder above turns a code and a salary into the same kind of estimate.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const m = h.R.medicalExample;
      const k = h.R.kExample;
      const ex = 600;
      const examples = [
        ['Standard allowance only', h.gbp(Y.personalAllowance), '', h.gbp(Y.personalAllowance), h.codeFor(Y.personalAllowance, 'L', 'ruk')],
        ['Medical insurance from work', h.gbp(Y.personalAllowance), `−${h.gbp(m.benefit)}`, h.gbp(Y.personalAllowance - m.benefit), m.code],
        ['Marriage Allowance received', h.gbp(Y.personalAllowance), `+${h.gbp(Y.marriageAllowance)}`, h.gbp(Y.personalAllowance + Y.marriageAllowance), h.codeFor(Y.personalAllowance + Y.marriageAllowance, 'M', 'ruk')],
        ['Job expenses with relief', h.gbp(Y.personalAllowance), `+${h.gbp(ex)}`, h.gbp(Y.personalAllowance + ex), h.codeFor(Y.personalAllowance + ex, 'L', 'ruk')],
        ['Deductions above the allowance', h.gbp(Y.personalAllowance), `−${h.gbp(Y.personalAllowance + k.add)}`, `−${h.gbp(k.add)}`, k.code],
      ];
      return `
<h2>The structure of a coding notice</h2>
<p>Every notice follows the same logic, because every code is built the same way (${h.src('gov_meaning', 'GOV.UK')}). A notice concerns one job or pension, since each source of income has its own code, and the items behind that code fall into two groups:</p>
<ul>
<li><strong>allowances</strong>, which raise the tax-free amount: the Personal Allowance itself, Marriage Allowance received from a partner, and relief for ${h.src('gov_relief', 'job expenses')} that HMRC gives through the code for the current year;</li>
<li><strong>deductions</strong>, which lower it: ${h.src('gov_benefits', 'company benefits')} such as a car or medical insurance, untaxed income such as savings interest or part-time earnings, the State Pension where another source collects its tax, the High Income Child Benefit Charge, and any tax owed from an earlier year.</li>
</ul>
<p>HMRC subtracts the deductions from the allowances. What is left is the amount you can earn tax-free from that source over the year, and the code is that amount with its final digit replaced by a letter. A result below zero becomes a ${h.a('k-tax-code', 'K code')}.</p>

<h2>Worked examples line by line</h2>
<p>The table rebuilds five simple notices for ${Y.label}. The numbers are the ones GOV.UK uses or the current allowances; your own notice may combine several lines.</p>
${h.table(['Situation', 'Allowances', 'Adjustment', 'Tax-free amount', 'Code'], examples, `Allowances and examples from ${h.src('gov_meaning', 'GOV.UK')} and ${h.src('gov_employee_codes', 'HMRC\'s employer guidance')}; the expenses figure is illustrative.`, ['l', 'r', 'r', 'r', 'l'])}
<p>The K line works differently: there, ${h.num(k.add)} is added to taxable pay instead of being allowed tax-free, which is how HMRC's employer guidance explains ${k.code}. The ${h.a('tax-code-numbers', 'guide to code numbers')} covers the rounding behind the last digit.</p>
<!--tool:mini:p2|{"old":1257,"neu":1100,"pay":32000}-->

<h2>Checking each figure</h2>
<p>A coding notice is only as accurate as the information HMRC holds, and GOV.UK says a wrong code usually comes from incorrect or missing details. Read each line against your own records:</p>
<ol>
<li>benefit values: your employer can give you a record of what it reported for each benefit, including its cash value;</li>
<li>pension income: compare the State Pension line with your weekly State Pension over the year, and check that a workplace pension appears at the right amount;</li>
<li>estimated pay: the notice and the online service use an estimate of your income; a pay rise or a cut in hours can make it stale;</li>
<li>expenses and Marriage Allowance: make sure a claim you made actually appears;</li>
<li>underpayments: a line for tax owed should match the figure on your last year-end letter.</li>
</ol>
<p>If anything is wrong, sign in to the ${h.src('hmrc_check', 'Check your Income Tax service')}, update the employment, pension, benefit or expense details and let HMRC reissue the code. GOV.UK says HMRC tells you and your employer about a changed code within ${h.R.codeChangeWorkingDays} working days. The ${h.a('wrong-tax-code', 'wrong code guide')} follows the change through to your payslip.</p>

<h2>What your employer sees</h2>
<p>Your employer does not receive your letter. It gets the code through PAYE Online, the PAYE Desktop Viewer or its payroll software, in a tax code notice that employers sometimes call a P6, and it should load the new code before your next pay (${h.src('gov_employee_codes', 'GOV.UK')}). For a new tax year, employers hear about changed codes between January and March; a code that is not changing is simply carried forward from 6 April, without any W1 or M1 ending. During the year, a new notice reaches payroll whenever HMRC changes the code, and the ${h.a('tax-code-changed', 'tax code changes guide')} lists the usual triggers.</p>`;
    },
  },
});
