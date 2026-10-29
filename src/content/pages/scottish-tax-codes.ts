import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'scottish-tax-codes', group: 'codes', order: 12,
  tool: { kind: 'compare', props: { a: 'SBR', b: 'SD0', pay: 10000 } },
  mini: { kind: 'mini:flat', props: { pay: 10000, region: 1 } },
  related: ['s1257l-tax-code', 'scottish-income-tax-rates', 'br-tax-code', 'd0-tax-code', 'k-tax-code'],
  sources: ['gov_meaning', 'gov_employee_codes', 'gov_scot', 'paye_spec', 'employer_2627', 'hmrc_check'],
  en: {
    slug: 'scottish-tax-codes', nav: 'SBR, SD0 to SD3', card: 'SBR, SD0, SD1, SD2, SD3, S0T and SK: which Scottish rate each code charges and when HMRC uses it.',
    title: 'Scottish Tax Codes SBR, SD0 to SD3, S0T and SK Explained',
    description: 'SBR, SD0, SD1, SD2 and SD3 charge one Scottish rate on all pay from a second job or pension; S0T and SK use the bands. See which rate each code takes and when.',
    h1: 'Scottish tax codes: SBR, SD0 to SD3, S0T and SK',
    intro: 'Every Scottish code starts with S. The flat ones charge a single rate; the others run through six bands.',
    resume: (h) => {
      const s = h.sc('scot');
      return `Scottish taxpayers have their own family of tax codes, all starting with S. Four of the flat-rate codes exist only in Scotland, because the Scottish scale has six rates instead of three. SBR charges the Scottish basic rate of ${h.flat('SBR')}% on every pound, not the starter rate of ${s.rates[0]}%. SD0 charges the intermediate rate of ${h.flat('SD0')}%, SD1 the higher rate of ${h.flat('SD1')}%, SD2 the advanced rate of ${h.flat('SD2')}% and SD3 the top rate of ${h.flat('SD3')}%. ${h.src('gov_meaning', 'GOV.UK')} describes all five as codes usually used when you have more than one job or pension; the choice follows the band your main income already reaches. On a second job paying ${h.gbp(10000)} a year, SBR takes ${h.pence(h.taxYear('SBR', 10000))}, SD0 ${h.pence(h.taxYear('SD0', 10000))}, SD1 ${h.pence(h.taxYear('SD1', 10000))}, SD2 ${h.pence(h.taxYear('SD2', 10000))} and SD3 ${h.pence(h.taxYear('SD3', 10000))}. Two other codes keep the bands: S0T gives no allowance but charges the six rates in turn, and SK adds an amount to your pay before the Scottish bands apply. There is no SNT, and the emergency code never carries the S.`;
    },
    faqs: (h) => [
      { q: 'Why does SD0 in Scotland charge 21% and not 40%?', a: `HMRC’s payroll specification defines the D codes as the rates above the basic rate, counted in order. In England the next rate is the higher rate, but in Scotland it is the intermediate rate of ${h.flat('SD0')}%. So SD0 is the Scottish intermediate rate, SD1 the higher rate of ${h.flat('SD1')}%, and the Scottish ladder needs two more codes, SD2 and SD3, to reach the top.` },
      { q: 'Which Scottish tax code should my second job have?', a: `It follows your main income. If the main job stays within the basic band, up to ${h.gbp(h.bandEdges('scot')[1])}, the second job usually gets SBR. From there to ${h.gbp(h.bandEdges('scot')[2])} it is SD0, then SD1 up to ${h.gbp(h.bandEdges('scot')[3])}, SD2 up to ${h.gbp(h.bandEdges('scot')[4])} and SD3 above. HMRC sets the code from the pay estimates on your record.` },
      { q: 'Is there a Scottish version of the NT tax code?', a: 'No. HMRC’s payroll specification says the NT code applies to the whole of the UK and that the S and C identifiers must not be added to it. A Scottish taxpayer who qualifies for no deductions on a particular income simply has NT. The single UK emergency code is the other code that never takes the S prefix.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('scot');
      const s = h.sc('scot');
      const codes: Array<[string, string, string]> = [['SBR', 'basic', `up to ${h.gbp(e[1])}`], ['SD0', 'intermediate', `${h.gbp(e[1] + 1)} to ${h.gbp(e[2])}`], ['SD1', 'higher', `${h.gbp(e[2] + 1)} to ${h.gbp(e[3])}`], ['SD2', 'advanced', `${h.gbp(e[3] + 1)} to ${h.gbp(e[4])}`], ['SD3', 'top', `over ${h.gbp(e[4])}`]];
      const rows = codes.map(([c, name, main]) => [c, `${name}, ${h.flat(c)}%`, main, h.pence(h.taxPeriod(c, 'monthly', 800, 1)), h.pence(h.taxYear(c, 10000))]);
      return `
<h2>The flat-rate Scottish codes</h2>
<p>The ${h.src('gov_employee_codes', 'employer guidance')} lists each Scottish flat code as tax taken from all income at one named Scottish rate, for a second job or pension. The table adds the range of main income at which each code usually fits, using the ${h.src('gov_scot', 'Scottish bands')} for ${Y.label} with the standard allowance.</p>
${h.table(['Code', 'Rate charged', 'Main income already reaches', 'Tax on £800 in one month', 'Tax on £10,000 a year'], rows, `Income Tax on the second source only, ${Y.label}; rates from ${h.src('employer_2627', 'GOV.UK rates for employers')}.`, ['l', 'l', 'l', 'r', 'r'])}
<p>The logic is the same as with ${h.a('br-tax-code', 'BR')} and ${h.a('d0-tax-code', 'D0')} elsewhere in the UK. Income Tax is charged on total income, so a second income sits on top of the first and is taxed at whatever rate applies at that height. If the main salary is ${h.gbp(50000)}, already past ${h.gbp(e[2])}, every extra pound is taxed at ${s.rates[3]}%, and SD1 takes exactly that.</p>
<!--tool:mini:secondjob|{"j1":50000,"j2":10000,"region":1}-->

<h2>Why SBR is basic rate, not starter rate</h2>
<p>Scotland's first band after the allowance is the starter band at ${s.rates[0]}%, which ends at ${h.gbp(e[0])} of income. Even so, SBR charges ${h.flat('SBR')}%. HMRC's ${h.src('paye_spec', 'PAYE specification')} ties BR to the basic rate in each scale, and in the Scottish scale the basic rate is the second step. When the main job has already filled the starter band, every pound of the second income falls at ${h.flat('SBR')}% or above, and SBR matches the tax due on it.</p>

<h2>S0T and SK: Scottish codes that keep the bands</h2>
<p><strong>S0T</strong> means no tax-free pay, either because the allowance is used up or because a new employer lacks your details. Unlike SBR, it runs the pay through all six Scottish rates, starting at ${s.rates[0]}%. On ${h.gbp(2000)} in one month on a month 1 basis, S0T takes ${h.pence(h.taxPeriod('S0T M1', 'monthly', 2000, 1))}, while SBR would take ${h.pence(h.taxPeriod('SBR', 'monthly', 2000, 1))}. Payments made after you leave a job, once the P45 is issued, are also taxed with S0T if your code had the S prefix.</p>
<p><strong>SK</strong> is the Scottish form of a ${h.a('k-tax-code', 'K code')}: the number shows an amount added to your pay, because deductions such as company benefits or tax owed exceed your allowance. The specification groups K, SK and CK codes together, and the same safeguard applies to each: the tax on any pay cannot be more than ${Y.maxRate}% of it. With SK475 and ${h.gbp(2000)} a month, the payroll taxes ${h.gbp(2000)} plus ${h.pence(h.freePay(475, 12))} through the Scottish bands, giving ${h.pence(h.taxPeriod('SK475', 'monthly', 2000, 1))} in month 1.</p>

<h2>Checking that the S is right</h2>
<p>Every code above depends on HMRC treating you as a Scottish taxpayer, which follows your main home. If you moved to or from Scotland, update your address in your ${h.src('hmrc_check', 'HMRC online account')}; HMRC backdates the change to 6 April of that year. The specification explains how the payroll copes: on a cumulative code, the software switches to the new set of rates and bands from that point while keeping your taxable pay and tax to date, so the year evens out on later payslips. On a week 1 or month 1 code, each pay keeps being taxed alone until HMRC sends a cumulative code, and any difference is put right then or after the year ends. If the band behind an SD code looks wrong, check the estimated pay held for each job. For the standard code and the full table of bands, see ${h.a('s1257l-tax-code', 'S1257L')}.</p>`;
    },
  },
});
