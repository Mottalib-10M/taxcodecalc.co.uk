import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-code-2026-27', group: 'rules', order: 1,
  tool: { kind: 'decoder', props: { code: '1257L', pay: 35000 } },
  mini: { kind: 'mini:bands', props: { pay: 50000 } },
  related: ['tax-code-2027-28', 'scottish-income-tax-rates', 'welsh-income-tax-rates', 'w1-m1-x-tax-codes', 'personal-allowance'],
  sources: ['employer_2627', 'employer_2526', 'p9x_2026', 'gov_rates', 'gov_scot', 'gov_wales', 'paye_spec', 'ootlar_annex_a'],
  en: {
    slug: 'tax-code-2026-27', nav: 'Tax code 2026/27', card: 'The codes, emergency code, PAYE threshold and bands in force from 6 April 2026 to 5 April 2027.',
    title: 'Tax Code 2026/27: 1257L, Emergency Code and Income Tax Bands',
    description: 'Tax codes for 2026/27: 1257L, the 1257L W1, M1 and X emergency code, the £242 weekly and £1,048 monthly PAYE threshold, and the bands for each UK nation.',
    h1: 'Tax codes for 2026/27',
    intro: 'Everything payroll uses this tax year, from 6 April 2026 to 5 April 2027: the standard code, the emergency code and the bands by nation.',
    resume: (h) => {
      const Y = h.Y();
      const e = h.bandEdges('ruk');
      return `For the ${Y.label} tax year, which runs from 6 April 2026 to 5 April 2027, the standard tax code is 1257L in England and Northern Ireland, S1257L in Scotland and C1257L in Wales, all built on a Personal Allowance of ${h.gbp(Y.personalAllowance)}. HMRC's ${h.src('p9x_2026', 'P9X notice')} sets the emergency code at ${Y.emergencyCode}, operated as ${Y.emergencyCode} W1, ${Y.emergencyCode} M1 or ${Y.emergencyCode} X, with no S or C prefix. Payroll starts taking Income Tax above ${h.gbp(Y.payeThreshold.week)} a week or ${h.gbp(Y.payeThreshold.month)} a month. Outside Scotland, gross pay up to ${h.gbp(e[0])} is taxed at ${h.sc('ruk').rates[0]}% above the allowance, then ${h.sc('ruk').rates[1]}% and ${h.sc('ruk').rates[2]}%. Scotland keeps six rates from ${h.sc('scot').rates[0]}% to ${h.sc('scot').rates[5]}%, with wider starter and basic bands than in ${h.Y('2025-26').label}. On a salary of ${h.gbp(35000)}, a full year on 1257L takes ${h.pence(h.taxYear('1257L', 35000))} of Income Tax, against ${h.pence(h.taxYear('S1257L', 35000))} on S1257L.`;
    },
    faqs: (h) => [
      { q: 'Is the standard tax code for 2026/27 still 1257L?', a: `Yes. The Personal Allowance for ${h.Y().label} is ${h.gbp(h.Y().personalAllowance)}, the same as the year before, so the standard code did not move. HMRC told employers to carry the code from the previous payroll record into the new year unless a new code arrived, but without any week 1 or month 1 marking.` },
      { q: 'Which emergency tax code applies in 2026/27?', a: `${h.Y().emergencyCode}, used on a week 1 or month 1 basis and written ${h.Y().emergencyCode} W1, ${h.Y().emergencyCode} M1 or ${h.Y().emergencyCode} X. There is one emergency code for the whole UK, so it never carries an S or C prefix, even for someone who lives in Scotland or Wales. HMRC replaces it once it has the income details.` },
      { q: 'Did Scottish Income Tax fall in 2026/27 compared with 2025/26?', a: `Slightly, for lower and middle earners. The starter band now ends at ${h.gbp(h.bandEdges('scot')[0])} of gross income instead of ${h.gbp(h.bandEdges('scot', '2025-26')[0])}, and the basic band at ${h.gbp(h.bandEdges('scot')[1])} instead of ${h.gbp(h.bandEdges('scot', '2025-26')[1])}. On ${h.gbp(30000)} the yearly tax goes from ${h.pence(h.taxYear('S1257L', 30000, '2025-26'))} to ${h.pence(h.taxYear('S1257L', 30000))}. The higher rate threshold did not change.` },
      { q: 'Until when does the 2026/27 tax code stay on my payslip?', a: 'Until 5 April 2027, unless HMRC sends your employer a new code during the year. From 6 April 2027 your employer keeps the same code for the new year unless it receives a fresh notice. Any W1, M1 or X marking is dropped at that point, so the code becomes cumulative again.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const Y0 = h.Y('2025-26');
      const top = Y.incomeLimit + 2 * Y.personalAllowance;
      const r = h.sc('ruk');
      const s = h.sc('scot');
      const s0 = h.sc('scot', '2025-26');
      const er = h.bandEdges('ruk');
      const es = h.bandEdges('scot');
      const es0 = h.bandEdges('scot', '2025-26');
      const pa = Y.personalAllowance;
      const cap = (x: string) => x[0].toUpperCase() + x.slice(1);
      const ruk = [
        ['Personal Allowance', `up to ${h.gbp(pa)}`, '0%'],
        [cap(r.names[0]), `${h.gbp(pa + 1)} to ${h.gbp(er[0])}`, `${r.rates[0]}%`],
        [cap(r.names[1]), `${h.gbp(er[0] + 1)} to ${h.gbp(top)}`, `${r.rates[1]}%`],
        [cap(r.names[2]), `over ${h.gbp(top)}`, `${r.rates[2]}%`],
      ];
      const scot = s.names.map((n, i) => {
        const from = i === 0 ? pa + 1 : es[i - 1] + 1;
        const to = i < 4 ? es[i] : top;
        const from0 = i === 0 ? pa + 1 : es0[i - 1] + 1;
        const to0 = i < 4 ? es0[i] : top;
        return [`${cap(n)}, ${s.rates[i]}%`, i < 5 ? `${h.gbp(from)} to ${h.gbp(to)}` : `over ${h.gbp(top)}`, i < 5 ? `${h.gbp(from0)} to ${h.gbp(to0)}` : `over ${h.gbp(top)}`];
      });
      const pays = [20000, 30000, 45000, 60000];
      const cmp = pays.map((p) => [h.gbp(p), h.pence(h.taxYear('1257L', p)), h.pence(h.taxYear('S1257L', p)), h.pence(h.taxYear('S1257L', p, '2025-26'))]);
      return `
<h2>The codes payroll starts the year with</h2>
<p>Nothing changed for the standard code between ${Y0.label} and ${Y.label}: the allowance stayed at ${h.gbp(pa)}, so 1257L, S1257L and C1257L carried over. Before the first pay day of the new year, HMRC's ${h.src('p9x_2026', 'P9X instructions')} asked employers to copy each authorised code from the old payroll record, to use the most recent P9(T) notice where one had been issued, and to strip any week 1 or month 1 marking. That last step matters to you: if you ended March on 1257L M1, your April payslip should show plain 1257L and run cumulatively from the first month.</p>
<p>The same notice gives the starting point for PAYE as ${h.gbp(Y.payeThreshold.week)} a week and ${h.gbp(Y.payeThreshold.month)} a month. Payroll software uses the slightly more precise free pay of ${h.pence(h.freePay(1257, 52))} a week and ${h.pence(h.freePay(1257, 12))} a month for code 1257, from HMRC's ${h.src('paye_spec', 'PAYE specification')}. If you earn less than that in a period and have been paid nothing else this year, no Income Tax comes off.</p>
<p>Someone who leaves before 6 April but is paid afterwards keeps the old code for that payment. A payment made after the P45 has been issued is taxed on 0T on a non-cumulative basis, S0T or C0T for those whose code had a Scottish or Welsh prefix.</p>

<h2>Bands for England and Northern Ireland, and for Wales</h2>
<p>For employees in England, Northern Ireland and Wales, the ${h.src('employer_2627', 'employer rates for 2026 to 2027')} show a basic rate band of ${h.gbp(r.bands[0])} above the allowance. Read as gross pay with the standard allowance, that gives these thresholds. The allowance shrinks above ${h.gbp(Y.incomeLimit)} and is gone at ${h.gbp(top)}, which is why the additional rate starts there.</p>
${h.table(['Band', 'Gross yearly income', 'Rate'], ruk, `Standard Personal Allowance, ${Y.label}. Wales applies the same totals; see ${h.src('gov_rates', 'GOV.UK')} and ${h.src('gov_wales', 'Welsh Income Tax')}.`, ['l', 'l', 'r'])}
<p>Wales has its own rates, signalled by the C prefix, but for ${Y.label} the Welsh totals match these figures exactly, so a C1257L payslip and a 1257L payslip take the same tax on the same pay. The ${h.a('welsh-income-tax-rates', 'Welsh rates page')} explains how the two parts add up.</p>

<h2>Scottish bands in 2026/27 against 2025/26</h2>
<p>Scotland is where the year brought a real change. Both the starter band, taxed at ${s.rates[0]}%, and the basic band, at ${s.rates[1]}%, were widened, which pushes the start of the intermediate rate up. The higher rate still starts at ${h.gbp(es[2] + 1)}, so people above that point see almost no difference. Bands below are gross income with the standard allowance, from ${h.src('gov_scot', 'GOV.UK')}.</p>
${h.table(['Scottish band', `${Y.label}`, `${Y0.label}`], scot, `The starter band grew from ${h.gbp(s0.bands[0])} to ${h.gbp(s.bands[0])} above the allowance.`, ['l', 'l', 'l'])}
${h.table(['Yearly pay', '1257L', `S1257L ${Y.label}`, `S1257L ${Y0.label}`], cmp, `Income Tax over a full year of equal monthly pay, worked with HMRC's payroll routines.`, ['l', 'r', 'r', 'r'])}
<!--tool:mini:scotland|{"pay":30000}-->
<p>The full detail of who counts as a Scottish taxpayer is on the ${h.a('scottish-income-tax-rates', 'Scottish rates page')}.</p>

<h2>Checking your own code this year</h2>
<p>The code itself only tells payroll how much tax-free pay to give and which bands to use. Whether it is right for you depends on your circumstances: a second job, a pension, company benefits, Marriage Allowance or an income above ${h.gbp(Y.incomeLimit)} all move it away from 1257L. Type the code from your payslip into the decoder above, then compare it with what HMRC holds in your ${h.src('hmrc_check', 'HMRC online account')}. For the year that starts on 6 April 2027, the ${h.a('tax-code-2027-28', 'next year page')} lists what the Budget of 28 October 2026 confirmed and what is still to come.</p>`;
    },
  },
});
