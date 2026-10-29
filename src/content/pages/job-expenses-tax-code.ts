import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'job-expenses-tax-code', group: 'situations', order: 9,
  tool: { kind: 'rightcode', props: { job1: 30000, expenses: 600 } },
  mini: { kind: 'mini:expenses', props: { ex: 600, pay: 30000 } },
  related: ['tax-code-numbers', 'tax-refund-wrong-code', 'check-my-tax-code', 'tax-code-changed', 'wrong-tax-code'],
  sources: ['gov_relief', 'gov_meaning', 'gov_claim_refund', 'gov_update', 'employer_2627'],
  demarche: true,
  en: {
    slug: 'job-expenses-tax-code', nav: 'Job expenses', card: 'Uniforms, professional fees, business mileage: how tax relief on job expenses raises the number in your code.',
    title: 'Job Expenses Tax Code: Relief for Uniforms, Fees and Mileage',
    description: 'Tax relief on job expenses such as uniforms, professional fees or mileage is usually given by raising your tax code. See the new code and what it saves you.',
    h1: 'Job expenses and your tax code',
    intro: 'Relief on work costs you pay yourself is added to your tax-free pay, so the code goes up rather than down.',
    resume: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      const e = h.expected({ region: 'ruk', job1: 30000, expenses: 600 });
      const saved = h.taxYear('1257L', 30000) - h.taxYear(e.main, 30000);
      return `When you spend your own money on things your job requires and your employer does not pay you back, HMRC can give tax relief, and for the current tax year it usually does so by raising your tax code (${h.src('gov_relief', 'GOV.UK, claiming tax relief on job expenses')}). The relief is not the expense itself but the tax on it, at the rate you pay: a basic rate taxpayer saves ${r[0]}p for each pound claimed, a higher rate taxpayer ${r[1]}p. Claim ${h.gbp(600)} of eligible costs on a salary of ${h.gbp(30000)} and the expected code moves from 1257L to ${e.main}, saving ${h.pence(saved)} over ${Y.label}, about ${h.pence(Math.round(saved / 12))} a month. Typical claims cover cleaning or replacing a uniform or specialist clothing, small tools, fees to approved professional bodies, and business mileage in your own vehicle. Working from home is the exception: relief for it cannot be claimed for ${Y.label}, although earlier years remain open. For past years HMRC either adjusts your code or pays a refund.`;
    },
    faqs: (h) => [
      { q: 'Why did my tax code go up after claiming job expenses?', a: `Because relief on expenses is added to your tax-free pay. HMRC adds the amount allowed to your Personal Allowance before turning it into a code, so ${h.gbp(600)} of expenses moves 1257L to ${h.expected({ region: 'ruk', job1: 30000, expenses: 600 }).main}. Your payroll then deducts slightly less tax each month. If the claim was an estimate and your real spending turns out different, you must tell HMRC.` },
      { q: 'Can I claim working from home relief through my tax code for 2026 to 2027?', a: 'No. GOV.UK states that relief for working from home cannot be claimed for the tax year from 6 April 2026 to 5 April 2027. Claims for earlier tax years are still possible if you were required to work from home, say because your employer has no office, and not by choice. Costs used for both private and work purposes, such as rent or broadband, never qualified.' },
      { q: 'Are job expenses from earlier years paid back through my code or as a refund?', a: 'Either. For the current year, HMRC normally adjusts your code. For previous tax years, GOV.UK says HMRC will adjust your code or give you a tax refund. Relief cannot exceed the tax you paid in the year concerned, and you must have paid tax that year. If you fill in a Self Assessment return, the claim goes on the return instead.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const rows: Array<[number, number]> = [[200, 30000], [600, 30000], [1500, 30000], [600, 60000], [1500, 60000]];
      const t = rows.map(([ex, pay]) => {
        const code = h.expected({ region: 'ruk', job1: pay, expenses: ex }).main;
        const saved = h.taxYear('1257L', pay) - h.taxYear(code, pay);
        return [h.gbp(ex), h.gbp(pay), code, h.pence(saved)];
      });
      return `
<h2>From a claim to a higher number</h2>
<p>A code is your allowance plus anything that gives relief, minus anything taxed through your pay, with the last digit dropped (${h.src('gov_meaning', 'GOV.UK')}). Job expenses sit on the plus side. That is why a successful claim pushes the number above 1257, unlike benefits or untaxed income, which pull it below. The payroll then gives you more free pay each period, and the saving is spread over the remaining paydays.</p>
<p>The table runs five claims through the estimate for a monthly salary in England or Northern Ireland. The saving doubles when the claim is set against pay taxed at the higher rate, because the relief follows your top rate rather than a fixed percentage. Small claims still matter: the extra free pay repeats on every payslip for as long as the expense stays in your code.</p>
${h.table(['Expenses allowed', 'Salary', 'Expected code', 'Tax saved in the year'], t, `Estimate for ${Y.label}; rates from ${h.src('employer_2627', 'Rates and thresholds for employers')}.`, ['r', 'r', 'l', 'r'])}

<h2>What qualifies</h2>
<p>Two conditions come first: you paid for the item yourself because the job requires it, and you use it only for work. If your employer repays everything, or offers an alternative you turned down, there is no relief; if it repays part, only the rest counts (${h.src('gov_relief', 'claiming tax relief')}).</p>
<ul>
<li><strong>Uniforms, work clothing and tools.</strong> Washing, mending or replacing specialist clothing or a uniform, such as overalls or safety boots, and repairing or replacing small tools. Not the first purchase of clothing, everyday clothes or protective equipment. Many jobs have an agreed flat rate expense you can claim without receipts.</li>
<li><strong>Professional fees and subscriptions.</strong> Membership fees you must pay to do your job, and annual subscriptions to bodies on HMRC's approved list when membership is relevant to your work.</li>
<li><strong>Vehicles.</strong> Business journeys in your own car, van, motorcycle or bicycle at the approved mileage rate, minus any mileage allowance from your employer; fuel for business trips in a company car. Commuting does not count unless you travel to a temporary workplace.</li>
<li><strong>Travel and overnight costs.</strong> Public transport, hotels, meals, parking and tolls on work trips.</li>
<li><strong>Working from home.</strong> Not available for ${Y.label}; earlier years only, and only when you had to work at home rather than chose to.</li>
</ul>
<!--tool:mini:compare|{"code":"1257L","code2":"1100L","pay":30000}-->

<h2>Claiming and keeping the code right</h2>
<p>Most employees claim online through HMRC's job expenses service, with receipts or mileage logs where asked; anyone who files a Self Assessment return claims on the return. Check afterwards in your ${h.src('hmrc_check', 'HMRC online account')} that the expense appears in your code, which HMRC confirms to you and your employer within ${h.R.codeChangeWorkingDays} working days of a change (${h.src('gov_update', 'how codes are updated')}). If your claim was an estimate, tell HMRC once you know the real amount: if you spent less, the relief in the code is too high and you would owe tax later. For older years, money due comes back as an adjustment to your code or a refund; other refund routes are on ${h.src('gov_claim_refund', 'claim a tax refund')}.</p>`;
    },
  },
});
