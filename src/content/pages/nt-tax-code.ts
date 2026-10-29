import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nt-tax-code', group: 'codes', order: 6,
  tool: { kind: 'compare', props: { a: '1257L', b: 'NT', pay: 20000 } },
  mini: { kind: 'mini:zero', props: { pay: 1700 } },
  related: ['0t-tax-code', 'tax-code-letters', 'w1-m1-x-tax-codes', 'self-assessment-tax-code', 'check-my-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'paye_spec', 'hmrc_check', 'gov_update'],
  en: {
    slug: 'nt-tax-code', nav: 'NT', card: 'No tax deducted at all: the rare cases behind NT, why there is no SNT or CNT, and when NT gives tax back.',
    title: 'NT Tax Code: No Tax Deducted, the Rare Cases and Refunds',
    description: 'NT means your employer or pension payer deducts no Income Tax. See the rare cases where HMRC issues it, why there is no S or C version and when it refunds.',
    h1: 'NT tax code',
    intro: 'The only code that stops deductions completely, whatever the amount paid.',
    resume: (h) => {
      const e = h.emergency({ freq: 'monthly', pay: 2000, start: 1, periods: 6, emergency: '1257L', correct: 'NT' });
      return `NT stands for no tax. A payer using it deducts no Income Tax from what it pays you, however large the amount, and ${h.src('gov_meaning', 'GOV.UK')} sums it up as not paying any tax on this income. It is rare: the ${h.src('gov_employee_codes', 'employer guidance')} reserves it for very specific cases and gives the example of musicians regarded as self-employed and therefore outside PAYE. HMRC's ${h.src('paye_spec', 'PAYE specification')} adds three rules. NT applies across the whole UK, so there is no SNT or CNT. The employer must still keep a record of every payment. And when a cumulative NT code replaces another code during the year, tax already deducted can come back: someone paid ${h.gbp(2000)} a month on 1257L from April to September has ${h.pence(e.onEmergency)} deducted, and a cumulative NT from October returns ${h.pence(-(e.switchRow?.tax ?? 0))} on the next payslip. On a week 1 or month 1 basis, NT stops future deductions but returns nothing. If NT appears on an ordinary job with no reason you recognise, check your ${h.src('hmrc_check', 'HMRC online account')}.`;
    },
    faqs: (h) => [
      { q: 'Does the NT tax code mean my income is tax-free?', a: 'Not necessarily. NT only tells this payer not to deduct anything through PAYE. The employer guidance links it to cases such as musicians treated as self-employed, whose tax is dealt with outside the payroll. Whether you owe tax on the income depends on your whole situation, not on the code, so keep your own records of what you were paid under NT.' },
      { q: 'Why is there no Scottish or Welsh NT tax code?', a: 'HMRC’s payroll specification states that NT applies to the whole of the UK and that the S and C identifiers must not be added to it. Since no tax is deducted, there are no rates to choose between, so a separate Scottish or Welsh version would serve no purpose. A code printed as SNT or CNT is an error worth querying.' },
      { q: 'Will an NT code give back tax taken earlier in the year?', a: 'Only if HMRC issues it on a cumulative basis. The specification explains that a cumulative NT compares tax due to date, which is nil, with tax already paid, so the first NT payslip can show a refund. When NT is issued on a week 1 or month 1 basis, the employer must not refund earlier deductions; HMRC uses the cumulative form when a refund is intended.' },
    ],
    body: (h) => {
      const rows = [2, 4, 6, 9].map((k) => {
        const e = h.emergency({ freq: 'monthly', pay: 2000, start: 1, periods: k, emergency: '1257L', correct: 'NT' });
        return [`${k} months`, h.pence(e.onEmergency), h.pence(-(e.switchRow?.tax ?? 0)), '£0.00'];
      });
      return `
<h2>What the payroll does with NT</h2>
<p>Most codes tell the payroll how much tax-free pay to give and which rates to use. NT tells it to set the tax due to nil. The ${h.src('paye_spec', 'specification')} keeps the rest of the cumulative routine in place: the pay for each period is still added to the pay to date, and the record is kept, but the tax to date is fixed at zero. Your payslip therefore shows gross pay, any National Insurance and other deductions, and a blank Income Tax line.</p>
<p>Because the routine stays cumulative, the first NT payslip after another code can produce a negative figure. The employer works out tax due to date (nothing) minus tax already deducted since 6 April, and the difference is paid back to you through the payroll. The table shows that refund for someone on ${h.gbp(2000)} a month whose code switches to cumulative NT after a number of months on 1257L.</p>
${h.table(['Months on 1257L before NT', 'Tax deducted on 1257L', 'Refunded on the first NT payslip', 'Tax each month after'], rows, `Income Tax only, ${h.Y().label}, equal monthly pay of ${h.gbp(2000)}; calculation follows HMRC's PAYE specification.`, ['l', 'r', 'r', 'r'])}

<h2>NT on a week 1 or month 1 basis</h2>
<p>NT can also be issued with W1 or M1. The specification is clear about the difference: when a code is changed to NT on a week 1 or month 1 basis, the employer must not refund tax deducted earlier in the year. If HMRC wants that tax returned, it issues NT on a cumulative basis instead. So a payslip showing NT M1 means no tax from now on, but the earlier deductions stay where they are until HMRC deals with them, for instance after the tax year closes. NT is also one of the codes that, like every suffix code, is carried into the next tax year on a cumulative basis, so any M1 marking falls away on 6 April.</p>

<h2>When NT is used, and when it looks wrong</h2>
<p>HMRC does not publish a long list of NT cases. The ${h.src('gov_employee_codes', 'employer guidance')} describes very specific situations and gives one example, musicians treated as self-employed and so outside PAYE. Outside cases like that, NT on an ordinary salary is unusual. If your code switched to NT and you did not expect it, there are two risks: tax may be missing for the year, which HMRC will try to recover later, or another code may have changed at the same time.</p>
<p>Check what HMRC holds in your ${h.src('hmrc_check', 'HMRC online account')}: each job, each pension, and the estimated pay for the year. If something is wrong, GOV.UK's page on ${h.src('gov_update', 'updating a tax code')} explains the next steps and says HMRC tells you and the employer of any new code within ${h.R.codeChangeWorkingDays} working days.</p>

<h2>NT next to the other no-allowance codes</h2>
<p>It helps to place NT among its neighbours. ${h.a('0t-tax-code', '0T')} gives no allowance but still taxes through the bands. ${h.a('br-tax-code', 'BR')} gives no allowance and charges ${h.flat('BR')}% on every pound. NT gives no allowance and charges nothing. The ${h.a('tax-code-letters', 'table of all letters')} lines up every code side by side.</p>
<p>A practical point follows from this. Since NT leaves the Income Tax line empty, nothing on the payslip warns you if the code is wrong. Keep the payslips and the P60 for any year spent on NT: they show the pay the employer recorded, which is the figure HMRC compares with your other income when it checks the year.</p>`;
    },
  },
});
