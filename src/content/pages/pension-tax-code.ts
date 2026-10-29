import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'pension-tax-code', group: 'situations', order: 2,
  tool: { kind: 'rightcode', props: { job1: 9000, sp: 241.3 } },
  mini: { kind: 'mini:pension', props: { pen: 9000 } },
  related: ['state-pension-tax-code', 'k-tax-code', 'emergency-tax-code', 'check-my-tax-code', 'p800-tax-calculation'],
  sources: ['gov_pension_tax', 'gov_sp_tax', 'gov_new_sp', 'gov_meaning', 'gov_emergency', 'gov_overunder'],
  en: {
    slug: 'pension-tax-code', nav: 'Pension', card: 'Workplace and private pensions: why the code is often far below 1257L once the State Pension is counted.',
    title: 'Pension Tax Code: Workplace Pension Plus the State Pension',
    description: 'Why a workplace or private pension code is often far below 1257L: the State Pension is paid gross and its tax is collected through that code. Worked figures.',
    h1: 'Tax code on a workplace or private pension',
    intro: 'Your pension provider runs PAYE like an employer, and its code usually carries the tax on your State Pension too.',
    resume: (h) => {
      const Y = h.Y();
      const sp = h.R.statePensionWeekly2627;
      const spYear = Math.round(sp * (h.R.statePensionWeeksOld + h.R.statePensionWeeksNew) * 100) / 100;
      const e = h.expected({ region: 'ruk', job1: 9000, statePension: spYear });
      return `A workplace or personal pension is taxed through PAYE: the provider applies a code from HMRC to each payment, exactly as an employer would. What surprises many retired people is how low that code can be. The State Pension arrives with no tax taken off, so HMRC takes its yearly amount away from your ${h.gbp(Y.personalAllowance)} Personal Allowance and lets the private pension collect the tax on both (${h.src('gov_pension_tax', 'GOV.UK, tax when you get a pension')}). The full new State Pension pays ${h.gbp(sp)} a week (${h.src('gov_new_sp', 'GOV.UK')}), about ${h.gbp(spYear)} over a year at that rate, which leaves almost nothing of the allowance. With a workplace pension of ${h.gbp(9000)} on top, the estimate gives a code of ${e.main} on the private pension and a bill of ${h.pence(h.due({ region: 'ruk', job1: 9000, statePension: spYear }))} for ${Y.label}, nearly all of it taken from the workplace pension. If you have several pensions or still work, only one source carries the State Pension deduction; the others get their own codes, often BR.`;
    },
    faqs: (h) => [
      { q: 'Why is the code on my workplace pension so much lower than 1257L?', a: `Because your State Pension uses up part of the same allowance. HMRC takes the yearly State Pension away from ${h.gbp(h.Y().personalAllowance)} and gives the private pension only what is left. With the full new State Pension, that leaves a code close to zero, and the tax on both incomes comes out of the workplace pension payments. A code below 1257L is normal in this situation, not an error.` },
      { q: 'Why did my first private pension payment use an emergency code?', a: 'When a pension starts, the provider may not yet hold a code from HMRC or your income for the year, so it can pay on a week 1 or month 1 basis. Each payment then gets only one period of allowance, and too much or too little may be taken. HMRC normally sends a proper code once it has the details, and the difference is settled through later payments or a calculation after the year ends.' },
      { q: 'Which pension carries the tax on my State Pension when I have two?', a: 'Only one of them. GOV.UK says that when you have more than one pension provider or employer, only one takes the tax for the State Pension, and each source can have a different code. Your HMRC online account shows which source holds it. The others are often coded BR, so every pound they pay is taxed at the basic rate.' },
      { q: 'Does a tax-free pension lump sum reduce my Personal Allowance?', a: 'No. GOV.UK states that the tax-free lump sum leaves your Personal Allowance unchanged. The provider takes tax off the rest of what you withdraw before paying it, using the code it holds. A large taxable withdrawal can be taxed at a higher rate on the day it is paid and may leave extra tax to settle once the tax year ends.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const r = h.sc('ruk').rates;
      const spYear = Math.round(h.R.statePensionWeekly2627 * (h.R.statePensionWeeksOld + h.R.statePensionWeeksNew) * 100) / 100;
      const weeks = h.R.statePensionWeeksOld + h.R.statePensionWeeksNew;
      const cases: Array<[number, number]> = [[h.R.statePensionWeekly2627, 9000], [200, 9000], [150, 9000], [h.R.statePensionWeekly2627, 25000]];
      const rows = cases.map(([w, p]) => {
        const year = Math.round(w * weeks * 100) / 100;
        const e = h.expected({ region: 'ruk', job1: p, statePension: year });
        return [h.gbp(w), h.gbp(p), e.main, h.pence(h.due({ region: 'ruk', job1: p, statePension: year })), h.pence(h.taxYear(e.main, p))];
      });
      return `
<h2>Why the pension code absorbs the State Pension</h2>
<p>The State Pension reaches your bank account with nothing deducted, yet it counts as taxable income in full. ${h.src('gov_sp_tax', 'GOV.UK explains')} that HMRC usually changes the code on your wages or other pensions so that the tax is collected there. In practice the yearly State Pension figure appears as a deduction in the code calculation, next to the Personal Allowance, and the number shrinks accordingly.</p>
<p>The table counts each weekly State Pension amount for a whole year and a workplace pension paid monthly in England or Northern Ireland, with no other income. The last column is what the pension provider deducts over the year with the expected code: it matches the total bill because the State Pension tax rides along.</p>
${h.table(['State Pension a week', 'Workplace pension a year', 'Expected code', 'Tax due on both', 'Taken by the provider'], rows, `Estimate for ${Y.label}; full rate from ${h.src('gov_new_sp', 'GOV.UK')}, lower weekly amounts are examples.`, ['r', 'r', 'l', 'r', 'r'])}
<p>Two things stand out. With the full rate, the code barely moves whatever the size of the workplace pension, because the State Pension alone almost fills the allowance. With a smaller State Pension, more of the allowance survives and the code rises, so two neighbours with the same workplace pension can hold very different codes.</p>
<p>If the State Pension plus a protected payment or other untaxed items is larger than the allowance, the code turns into a ${h.a('k-tax-code', 'K code')}: an amount is added to the pension instead of taken off. Providers cannot deduct more than half of a payment under a K code (${h.src('gov_meaning', 'GOV.UK')}).</p>

<h2>Starting a pension: the first payments</h2>
<p>A new pension is a new PAYE source, and the provider needs a code before it can pay you correctly. Until HMRC sends one, it may use the emergency basis, where each payment gets a single week's or month's allowance (${h.src('gov_emergency', 'emergency tax codes')}). GOV.UK also notes that you may be put on an emergency code when you start receiving the State Pension, which is normal while HMRC adjusts the figures for that year. Check in your ${h.src('hmrc_check', 'HMRC online account')} that the pension and the State Pension both appear with sensible yearly amounts.</p>
<!--tool:mini:month|{"code":"1257L M1","pay":1500}-->
<p>Starting a pension at work is also one of the reasons GOV.UK lists for receiving a ${h.a('p800-tax-calculation', 'tax calculation letter')} after the year ends (${h.src('gov_overunder', 'overpayments and underpayments')}). Those letters are sent between ${h.R.lettersFrom} and ${h.R.lettersTo} of the next year.</p>

<h2>Lump sums and irregular withdrawals</h2>
<p>A tax-free lump sum leaves your Personal Allowance untouched. Whatever you take on top of it is taxable, and the provider deducts tax before paying using the code on file. GOV.UK warns that a large withdrawal may be taxed at a higher rate and leave more to pay at the end of the year. A single payment of arrears covering earlier years can push you into a higher band too; you can ask HMRC to recalculate each year with a payment schedule from the provider.</p>

<h2>Several pensions, or a pension and a job</h2>
<p>Each provider and employer gets its own code. One of them carries the allowance, minus the State Pension; the rest are usually BR at ${r[0]}%, or D0 at ${r[1]}% if the main source already reaches the higher band. At the end of the year every provider sends a P60 showing what it deducted. If those amounts add up to more than your bill, HMRC normally asks the provider to repay the difference through your pension once the code is corrected, or sets it out in a letter after the year ends; see ${h.a('tax-refund-wrong-code', 'refunds after a wrong code')}.</p>`;
    },
  },
});
