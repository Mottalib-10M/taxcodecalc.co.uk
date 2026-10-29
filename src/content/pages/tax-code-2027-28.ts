import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-code-2027-28', group: 'rules', order: 2,
  tool: { kind: 'decoder', props: { code: '1257L', pay: 45000 } },
  mini: { kind: 'mini:y2728', props: { pay: 45000 } },
  related: ['tax-code-2026-27', 'personal-allowance', 'scottish-income-tax-rates', 'welsh-income-tax-rates', 'state-pension-tax-code'],
  sources: ['ootlar_annex_a', 'gov_scot_news', 'p9x_2026', 'employer_2627', 'gov_blind', 'gov_marriage', 'paye_spec'],
  en: {
    slug: 'tax-code-2027-28', nav: 'Tax code 2027/28', card: 'What the Budget of 28 October 2026 sets for the year from 6 April 2027, and what is still to be announced.',
    title: 'Tax Code 2027/28: What the Budget Sets From 6 April 2027',
    description: 'Tax codes for 2027/28: Personal Allowance and bands unchanged at £12,570, new 24% savings and property rates, Scottish rates due 3 December 2026, Welsh pending.',
    h1: 'Tax codes for 2027/28',
    intro: 'The tax year from 6 April 2027 to 5 April 2028, as set out in the Budget of 28 October 2026, and the pieces still missing.',
    resume: (h) => {
      const N = h.Y('2027-28');
      const B = h.B;
      return `${h.src('ootlar_annex_a', 'Annex A of the Budget of 28 October 2026')} keeps the Personal Allowance at ${h.gbp(N.personalAllowance)} for ${N.label}, with the same ${h.gbp(N.incomeLimit)} income limit and the same basic rate band, so the standard code from 6 April 2027 stays 1257L and wages are taxed at ${h.sc('ruk', '2027-28').rates.join(', ')}% in England and Northern Ireland. On ${h.gbp(45000)} a year, a 1257L payslip takes ${h.pence(h.taxYear('1257L', 45000, '2027-28'))} over ${N.label}, exactly what it takes this year. The changes sit elsewhere: savings interest above the allowances will be taxed at ${B.savingsRates2728.join(', ')}% and a new set of property rates at ${B.propertyRates2728.join(', ')}%, neither of which applies to PAYE wages. Blind Person's Allowance rises to ${h.gbp(N.blindPersonsAllowance)}. Scottish rates will come with the Scottish Budget on ${h.date(N.scotExpected as string)}, Welsh rates with the Welsh budget, and the emergency code with HMRC's next P9X notice.`;
    },
    faqs: (h) => [
      { q: 'Will my 1257L code change on 6 April 2027?', a: `Not because of the Budget. The Personal Allowance stays at ${h.gbp(h.Y('2027-28').personalAllowance)} for ${h.Y('2027-28').label}, so a standard code stays 1257L, S1257L or C1257L. Your own code can still change if HMRC adjusts it for benefits, a pension, an earlier underpayment or savings interest, and it would send you a new coding notice.` },
      { q: 'Do the 2027/28 savings rates of 24% change the tax on my salary?', a: `No. The savings rates of ${h.B.savingsRates2728.join(', ')}% apply to savings income such as bank interest, and the property rates to rental profits. Wages and pensions stay on the main rates. If HMRC collects tax on interest above your Personal Savings Allowance through your code, that is the one route by which the new savings rates could show on a payslip.` },
      { q: 'When will the Scottish tax rates for 2027/28 be known?', a: `The Scottish Government said on 28 October 2026 that the Scottish Budget, which proposes the rates and bands for Scottish taxpayers, will be published on ${h.date(h.Y('2027-28').scotExpected as string)}. Until then nobody can say what S1257L will take from April 2027, and calculators can only use the ${h.Y('2026-27').label} Scottish rates as a placeholder.` },
      { q: 'What will the emergency tax code be in 2027/28?', a: `HMRC has not published it yet. It confirms the emergency code each year in its P9X notice to employers, usually released in January or February before the new tax year begins. With the Personal Allowance unchanged at ${h.gbp(h.Y('2027-28').personalAllowance)}, the figure that notice gives would be expected to match the allowance, but only the P9X itself confirms it.` },
    ],
    body: (h) => {
      const N = h.Y('2027-28');
      const C = h.Y('2026-27');
      const B = h.B;
      const top = N.incomeLimit + 2 * N.personalAllowance;
      const rC = h.sc('ruk', '2026-27').rates;
      const allow = [
        ['Personal Allowance', h.gbp(C.personalAllowance), h.gbp(N.personalAllowance)],
        ['Income limit for the allowance', h.gbp(C.incomeLimit), h.gbp(N.incomeLimit)],
        ['Marriage Allowance', h.gbp(C.marriageAllowance), h.gbp(N.marriageAllowance)],
        ["Blind Person's Allowance", h.gbp(C.blindPersonsAllowance), h.gbp(N.blindPersonsAllowance)],
        ["Married Couple's Allowance, maximum", h.gbp(B.marriedCouplesMax['2026-27']), h.gbp(B.marriedCouplesMax['2027-28'])],
        ["Married Couple's Allowance, minimum", h.gbp(B.marriedCouplesMin['2026-27']), h.gbp(B.marriedCouplesMin['2027-28'])],
        ["Income limit for Married Couple's Allowance", h.gbp(B.mcaIncomeLimit['2026-27']), h.gbp(B.mcaIncomeLimit['2027-28'])],
        ['Dividend Allowance', h.gbp(B.dividendAllowance), h.gbp(B.dividendAllowance)],
      ];
      const rates = [
        ['Main rates (wages, pensions)', `${rC.join(', ')}%`, `${h.sc('ruk', '2027-28').rates.join(', ')}%`],
        ['Savings rates', `${rC.join(', ')}%`, `${B.savingsRates2728.join(', ')}%`],
        ['Property rates', 'main rates apply', `${B.propertyRates2728.join(', ')}%`],
      ];
      const pays = [25000, 45000, 70000];
      const tax = pays.map((p) => [h.gbp(p), h.pence(h.taxYear('1257L', p, '2026-27')), h.pence(h.taxYear('1257L', p, '2027-28'))]);
      return `
<h2>Allowances confirmed for 2027/28</h2>
<p>The Budget tables published on 28 October 2026 give every Income Tax allowance for both years side by side. For a tax code, the line that counts is the first one: the Personal Allowance does not move, so neither does the number in a standard code. The basic rate band stays at ${h.gbp(h.sc('ruk', '2027-28').bands[0])} above the allowance and the additional rate still starts at ${h.gbp(top)}.</p>
${h.table(['Allowance', C.label, N.label], allow, `From ${h.src('ootlar_annex_a', 'Budget 2026, Annex A')}.`, ['l', 'r', 'r'])}
<p>Two lines can change a code. ${h.a('m-and-n-tax-codes', 'Marriage Allowance')} still moves ${h.gbp(N.marriageAllowance)} between spouses or civil partners, which keeps the codes at ${h.codeFor(N.personalAllowance + N.marriageAllowance, 'M', 'ruk')} and ${h.codeFor(N.personalAllowance - N.marriageAllowance, 'N', 'ruk')}. ${h.src('gov_blind', "Blind Person's Allowance")} goes up by ${h.gbp(N.blindPersonsAllowance - C.blindPersonsAllowance)}, so someone with the standard allowance plus this one moves from ${h.codeFor(C.personalAllowance + C.blindPersonsAllowance, 'L', 'ruk')} to ${h.codeFor(N.personalAllowance + N.blindPersonsAllowance, 'L', 'ruk')}. Married Couple's Allowance, only for couples where one partner was born before 6 April 1935, rises too; a couple cannot have it and Marriage Allowance at the same time.</p>

<h2>New savings and property rates from April 2027</h2>
<p>The biggest Income Tax change in the Budget is not on wages. From ${N.label}, savings income above the starting rate and the Personal Savings Allowance (${h.gbp(B.psaBasic)} for basic rate taxpayers, ${h.gbp(B.psaHigher)} for higher rate taxpayers) is taxed at ${B.savingsRates2728.join(', ')}% instead of ${rC.join(', ')}%. Property income, which this year is taxed at the main rates, gets its own rates of ${B.propertyRates2728.join(', ')}%. The property rates apply across England, Wales and Northern Ireland, and the Scottish and Welsh governments can set their own.</p>
${h.table(['Type of income', C.label, N.label], rates, 'Basic, higher and additional rates; dividend rates are unchanged.', ['l', 'r', 'r'])}
<p>On a payslip, nothing changes for salary. Where it can show is in the code of someone whose interest goes over the Personal Savings Allowance: GOV.UK lists that as one of the reasons HMRC changes a tax code, to collect the tax on the interest through pay. The Budget also confirms that from 6 April 2027 employers must report and payroll company cars, vans, fuel and medical benefits through the payroll, which means those benefits will be taxed directly in pay rather than through a lower code number.</p>

<h2>Tax on wages: this year against next year</h2>
<p>With identical allowances and bands, the same salary on 1257L gives the same yearly Income Tax in both years outside Scotland. The table uses HMRC's monthly payroll method with equal pay each month.</p>
${h.table(['Yearly pay', `1257L, ${C.label}`, `1257L, ${N.label}`], tax, 'England and Northern Ireland.', ['l', 'r', 'r'])}
<p>Pensioners have one new item. A Pensions Tax Allowance is introduced for ${N.label} and the two years after it, so that people whose income is no more than the full new State Pension do not receive small Simple Assessment bills. It applies in full up to ${h.gbp(B.pensionsTaxAllowance.eligibility)} of income and has gone completely by ${h.gbp(B.pensionsTaxAllowance.removedAt)}. Its effect on codes is not yet described; the ${h.a('state-pension-tax-code', 'State Pension page')} covers how the pension is coded today.</p>

<h2>What is still to be announced</h2>
<p><strong>Scottish rates.</strong> The ${h.src('gov_scot_news', 'Scottish Government')} announced that its Budget, which sets the Scottish rates and bands, will be published on ${h.date(N.scotExpected as string)}. Until then, the ${h.a('scottish-income-tax-rates', 'Scottish bands')} shown for April 2027 are this year's, used as a placeholder.</p>
<p><strong>Welsh rates.</strong> ${N.walesExpected}. In ${C.label} the Welsh totals equal those for England.</p>
<p><strong>Emergency code.</strong> HMRC confirms it in ${N.emergencyCodeExpected[0].toLowerCase() + N.emergencyCodeExpected.slice(1)}, as it did in the ${h.src('p9x_2026', 'notice for 2026')}. When the new year starts, any W1 or M1 marking on your code is removed and the code runs cumulatively again. Once the year begins, you can see the code HMRC has issued in your ${h.src('hmrc_check', 'HMRC online account')}.</p>`;
    },
  },
});
