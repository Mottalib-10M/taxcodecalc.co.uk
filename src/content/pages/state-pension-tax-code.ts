import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'state-pension-tax-code', group: 'situations', order: 3,
  tool: { kind: 'mini:statepension' },
  mini: { kind: 'mini:pension', props: { pen: 15000 } },
  related: ['pension-tax-code', 'k-tax-code', 'personal-allowance', 'p800-tax-calculation', 'check-my-tax-code'],
  sources: ['gov_sp_tax', 'gov_new_sp', 'gov_pension_tax', 'gov_overunder', 'gov_meaning', 'gov_emergency'],
  en: {
    slug: 'state-pension-tax-code', nav: 'State Pension', card: 'The State Pension is paid gross: how HMRC counts it for the year and collects its tax through another code.',
    title: 'State Pension Tax Code: Taxable Amount and How It Is Paid',
    description: 'The State Pension is paid gross. See how HMRC counts its taxable amount for the year and collects the tax through another tax code or a Simple Assessment bill.',
    h1: 'State Pension and your tax code',
    intro: 'No code is attached to the State Pension itself: its tax is taken somewhere else, or billed after the year.',
    resume: (h) => {
      const Y = h.Y();
      const w = h.R.statePensionWeekly2627;
      const t = Math.round(w * (h.R.statePensionWeeksOld + h.R.statePensionWeeksNew) * 100) / 100;
      return `The State Pension has no tax code of its own, because it is paid in full with nothing deducted. It is still taxable income. HMRC adds it to your other income for the tax year and, if you work or draw a private pension, lowers the code on that other source so the tax comes out there (${h.src('gov_sp_tax', 'How your State Pension is taxed')}). The taxable figure is not what landed in your bank account but what you were entitled to: ${h.R.statePensionWeeksOld} week at the weekly rate before the April increase plus ${h.R.statePensionWeeksNew} weeks at the new rate, which applies to people whose State Pension started on or after 6 April 2010. The full new State Pension pays ${h.gbp(w)} a week for ${Y.label}, so a full year at that rate counts as ${h.gbp(t)}, just ${h.gbp(Math.round((Y.personalAllowance - t) * 100) / 100)} below the ${h.gbp(Y.personalAllowance)} Personal Allowance. If it is your only income and it stays under the allowance, nothing is due. If tax is due and no other source can collect it, HMRC sends a Simple Assessment bill after the year ends.`;
    },
    faqs: (h) => [
      { q: 'Why does my State Pension have no tax code on it?', a: 'Because nobody deducts tax from it. The State Pension is paid gross, so there is no payroll to apply a code. HMRC instead reduces the code on your job or private pension by the yearly State Pension amount, so the tax on both is taken there. If you only have the State Pension, tax is settled by a bill rather than through a code.' },
      { q: 'How is my taxable State Pension worked out for the tax year?', a: `HMRC uses ${h.R.statePensionWeeksOld} week at your weekly rate before the April increase and ${h.R.statePensionWeeksNew} weeks at the rate after it, based on the amounts on your Department for Work and Pensions letter, not on the payments received. If your State Pension started part way through the year, it counts the weeks from your entitlement date to the end of the tax year, multiplied by your weekly amount.` },
      { q: 'Will I get a Simple Assessment bill for tax on my State Pension?', a: 'You may, if the State Pension takes your total income above your allowances and HMRC cannot collect the tax through a code on wages or another pension. GOV.UK lists tax on the State Pension among the reasons for a Simple Assessment letter. The letter explains how much you owe, how to pay and by when. When your only income is the State Pension and it stays under the allowance, there is nothing to pay.' },
      { q: 'Can starting my State Pension put me on an emergency tax code?', a: 'Yes, it can. GOV.UK says you might be put on an emergency code when you start getting the State Pension, and calls this normal: it helps the right tax be taken in that first year. Check online that your code includes the State Pension. In the following tax year you should move to a normal, cumulative code.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const w = h.R.statePensionWeekly2627;
      const t = Math.round(w * (h.R.statePensionWeeksOld + h.R.statePensionWeeksNew) * 100) / 100;
      const weeks = h.R.statePensionWeeksOld + h.R.statePensionWeeksNew;
      const rows = [w, 200, 160, 120].map((x) => {
        const yr = Math.round(x * weeks * 100) / 100;
        const left = Math.round(Math.max(0, Y.personalAllowance - yr) * 100) / 100;
        return [h.gbp(x), h.gbp(yr), h.gbp(left), h.expected({ region: 'ruk', job1: 15000, statePension: yr }).main, h.pence(h.due({ region: 'ruk', job1: 15000, statePension: yr }))];
      });
      const part = 20;
      return `
<h2>From weekly payments to one taxable figure</h2>
<p>State Pension rates usually change in April, close to the start of the tax year on 6 April. For a full year, HMRC counts ${h.R.statePensionWeeksOld} week at the old rate and ${h.R.statePensionWeeksNew} at the new one, and uses the amounts you were entitled to rather than the dates money arrived (${h.src('gov_sp_tax', 'DWP and HMRC')}). The calculator at the top of this page does exactly that sum: enter the weekly rate shown on your letter before April and the one after. The same total goes into a Self Assessment return if you send one.</p>
<p>When the State Pension starts during the year, only the weeks from the entitlement date count. With ${part} weeks left in the tax year at the full rate, the taxable State Pension would be ${h.gbp(Math.round(w * part * 100) / 100)}, even if the first payment arrived weeks later and covered the earlier period in one go.</p>

<h2>Who collects the tax, depending on your other income</h2>
<p>Not everyone gets the full rate: older awards and incomplete National Insurance records give smaller weekly amounts. The table counts a whole year at four weekly amounts, shows what remains of the allowance, then adds ${h.gbp(15000)} of other income from a job or private pension in England or Northern Ireland to give the code on that source and the tax for the year on both.</p>
${h.table(['State Pension a week', 'Counted for the year', 'Allowance left', 'Code on the other income', 'Tax due on both'], rows, `Estimate for ${Y.label}; full rate of ${h.gbp(w)} from ${h.src('gov_new_sp', 'GOV.UK')}, the other weekly amounts are examples.`, ['r', 'r', 'r', 'l', 'r'])}
<p>Read the third column as the room left for other income before tax starts. A person on the full rate has almost none, so any other taxable income is taxed from close to the first pound. With a smaller State Pension, the other source keeps a larger part of its tax-free pay.</p>
<p>With other income, the code on that source starts from the allowance and takes away the State Pension. ${h.src('gov_pension_tax', 'GOV.UK')} adds that when you have several employers or pension providers, only one of them deducts the tax for the State Pension. If the State Pension and other untaxed items together exceed the allowance, the result is a ${h.a('k-tax-code', 'K code')}, which adds an amount to your pay rather than taking one off.</p>
<!--tool:mini:pension|{"pen":5000}-->

<h2>When no code can collect it</h2>
<p>Some people have the State Pension and income that PAYE does not touch, or only a small pension that cannot absorb the extra tax. In that case HMRC may send a Simple Assessment calculation once the year is over (${h.src('gov_overunder', 'tax overpayments and underpayments')}). Those letters are sent between ${h.R.lettersFrom} and ${h.R.lettersTo}, and each one states its own payment deadline. If you are registered for Self Assessment, the State Pension goes on your return instead and no separate letter follows.</p>

<h2>When the weekly amount changes</h2>
<p>GOV.UK lists a change in your weekly State Pension among the usual reasons for a new code. Each April increase therefore tends to bring a slightly lower number on the code of your private pension or job; HMRC tells employers and providers about codes for the new year between January and March. You may also see an emergency code in the first year you receive it, which GOV.UK describes as normal (${h.src('gov_emergency', 'emergency tax codes')}). If the yearly State Pension shown in your ${h.src('hmrc_check', 'HMRC online account')} does not match your award letter, update it there: the code is only as accurate as that figure.</p>`;
    },
  },
});
