import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'child-benefit-charge-tax-code', group: 'situations', order: 8,
  tool: { kind: 'mini:hicbc', props: { inc: 70000, cb: 2000 } },
  mini: { kind: 'mini:taper', props: { inc: 105000 } },
  related: ['tax-code-over-100k', 'self-assessment-tax-code', 'tax-code-changed', 'check-my-tax-code', 'personal-allowance'],
  sources: ['gov_hicbc', 'gov_ani', 'gov_meaning', 'gov_update'],
  demarche: true,
  en: {
    slug: 'child-benefit-charge-tax-code', nav: 'Child Benefit charge', card: 'Paying the High Income Child Benefit Charge through PAYE: how much it is and how it lowers your code.',
    title: 'Child Benefit Charge Tax Code: Paying the HICBC Through PAYE',
    description: 'Adjusted net income over £60,000? The Child Benefit charge can be taken through your tax code. See the charge, who pays it and how much lower your code becomes.',
    h1: 'High Income Child Benefit Charge in your tax code',
    intro: 'Instead of a tax return, the charge can be taken from your salary or pension by lowering your code.',
    resume: (h) => {
      const R = h.R;
      const steps = (R.hicbcAll - R.hicbcFrom) / R.hicbcStep;
      const pct = 100 / steps;
      return `The High Income Child Benefit Charge claws back Child Benefit when either partner's adjusted net income goes over ${h.gbp(R.hicbcFrom)}. The charge is ${pct}% of the Child Benefit for every ${h.gbp(R.hicbcStep)} above that level, so it reaches the whole benefit at ${h.gbp(R.hicbcAll)} (${h.src('gov_hicbc', 'GOV.UK, High Income Child Benefit Charge')}). If both partners are above the threshold, the one with the higher income pays. If you do not need a tax return for another reason, you can pay it through PAYE instead: you register online, and HMRC sends a new code to your employer or pension provider that collects the charge across the year. Take an income of ${h.gbp(70000)} and ${h.gbp(2000)} of Child Benefit received in the year, an example amount: the charge is half the benefit, ${h.gbp(1000)}, roughly ${h.gbp(Math.round(1000 / 12))} a month through your pay. Because the extra tax comes from your top rate of ${h.sc('ruk').rates[1]}%, this estimate takes about ${h.gbp(1000 / (h.sc('ruk').rates[1] / 100))} off your allowance, turning 1257L into roughly ${h.codeFor(h.Y().personalAllowance - 1000 / (h.sc('ruk').rates[1] / 100), 'L', 'ruk')}.`;
    },
    faqs: (h) => [
      { q: 'How is the Child Benefit charge worked out on an income of £70,000?', a: `Subtract ${h.gbp(h.R.hicbcFrom)} from your adjusted net income and divide by ${h.gbp(h.R.hicbcStep)}: on ${h.gbp(70000)} that gives 50, so you repay 50% of the Child Benefit received in the year. With ${h.gbp(2000)} of benefit as an example, the charge is ${h.gbp(1000)}. At ${h.gbp(h.R.hicbcAll)} or more the charge equals the full benefit, and below ${h.gbp(h.R.hicbcFrom)} there is nothing to pay.` },
      { q: 'Who can pay the Child Benefit charge through their tax code?', a: 'Anyone liable who does not need a tax return for another reason, such as self-employment or savings income that must be declared. You must also register by 31 January following the end of the tax year concerned, for the current or previous year onwards. If you already filed returns only because of the charge, you can phone HMRC to leave Self Assessment and switch to PAYE.' },
      { q: 'What happens to my tax code if I stop owing the Child Benefit charge?', a: 'HMRC adjusts it so that the deduction stops. If you separate from the partner who receives Child Benefit, you must tell HMRC through the online service for the charge or by contacting them. If your income falls below the threshold for a whole year, there is no charge. You can also opt out of Child Benefit payments, which ends the charge from the date payments stop.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const R = h.R;
      const rate = h.sc('ruk').rates[1];
      const cb = 2000;
      const rows = [60000, 64000, 70000, 76000, R.hicbcAll].map((inc) => {
        const pc = Math.max(0, Math.min(100, Math.floor((inc - R.hicbcFrom) / R.hicbcStep)));
        const charge = Math.floor((cb * pc) / 100);
        const cut = Math.ceil(charge / (rate / 100));
        return [h.gbp(inc), `${pc}%`, h.gbp(charge), h.codeFor(Y.personalAllowance - cut, 'L', 'ruk')];
      });
      return `
<h2>How the charge is measured</h2>
<p>The test is your own adjusted net income, not the household's. It starts from total taxable income, savings interest and dividends included, and deducts certain reliefs such as pension contributions and grossed-up Gift Aid (${h.src('gov_ani', 'HMRC, adjusted net income')}). HMRC's own example shows a total income of ${h.gbp(70000)} brought down by pension payments and Gift Aid to an adjusted figure well below it, with a smaller charge as a result. The charge can also apply when someone else is paid Child Benefit for a child who lives with you, and that person contributes at least as much as you to the child's upkeep.</p>
<p>The table uses ${h.gbp(cb)} of Child Benefit received in the year as an example amount and an employee whose top rate is ${rate}%.</p>
${h.table(['Adjusted net income', 'Share repaid', 'Charge', 'Approximate code'], rows, `Charge rules from ${h.src('gov_hicbc', 'GOV.UK')}; codes are an estimate assuming the charge is taken through a ${rate}% slice of pay, ${Y.label}.`, ['r', 'r', 'r', 'l'])}

<h2>Paying through PAYE instead of a tax return</h2>
<p>GOV.UK offers two routes: Self Assessment or your regular PAYE deductions. PAYE is open if you do not need a return for any other reason and you register on or before 31 January following the tax year you are paying for. You sign in to the HMRC service for the charge with your adjusted net income, and your partner's if you have one, and the National Insurance number and relationship dates of any partner who received Child Benefit. After that, HMRC sends details of your new code to you and to your employer, or to your pension provider if you draw a pension.</p>
<p>In the code, the charge is a deduction like a company benefit. ${h.src('gov_meaning', 'GOV.UK')} lists it among the items HMRC takes off your allowance before turning the rest into the number. The bigger the charge, the lower the number, and if other deductions already use most of your allowance, the result can be a K code.</p>
<!--tool:mini:compare|{"code":"1257L","code2":"1100L","pay":70000}-->

<h2>When it is better to opt out, and when things change</h2>
<p>If the charge would take the full benefit, you can opt out of the payments and keep your claim. You then keep National Insurance credits that count towards the State Pension, and your child still receives a National Insurance number without applying. Opting out is done online, by an online form or through the Child Benefit Office. You remain liable for any charge up to the date payments stopped.</p>
<p>A new partner moving in, a separation, or a change of income all alter who pays and how much. If you pay through PAYE and you split up, tell HMRC so that your code stops collecting the charge. For any other figure behind the code, such as your estimated pay, check and correct it in your ${h.src('hmrc_check', 'HMRC online account')} (${h.src('gov_update', 'updating your code')}). Adjusted net income above ${h.gbp(Y.incomeLimit)} also cuts the Personal Allowance; see ${h.a('tax-code-over-100k', 'codes above £100,000')}.</p>`;
    },
  },
});
