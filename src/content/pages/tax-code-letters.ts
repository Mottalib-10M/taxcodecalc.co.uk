import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tax-code-letters', group: 'codes', order: 14,
  tool: { kind: 'decoder', props: { code: 'S1383M', pay: 32000 } },
  mini: { kind: 'mini:compare', props: { code: '1257L', code2: '0T', pay: 30000 } },
  related: ['tax-code-numbers', 'what-does-my-tax-code-mean', 'br-tax-code', 'k-tax-code', 'w1-m1-x-tax-codes'],
  sources: ['gov_meaning', 'gov_employee_codes', 'gov_emergency', 'paye_spec', 'employer_2627', 'hmrc_check'],
  en: {
    slug: 'tax-code-letters', nav: 'All letters', card: 'Every letter, prefix and ending in a UK tax code in one table, with the tax each one takes.',
    title: 'Tax Code Letters: L, M, N, T, K, BR, D0, NT, S, C and M1',
    description: 'Every letter in a tax code in one table: L, M, N and T after the number, K, S and C in front, BR, D0, D1, 0T and NT on their own, W1, M1 and X at the end.',
    h1: 'Tax code letters',
    intro: 'Where a letter sits tells you what it does: after the number, in front of it, instead of it, or at the very end.',
    resume: (h) => {
      const Y = h.Y();
      return `The letters in a tax code fall into four groups, and their position tells you which group you are looking at. A letter after the number, such as L, M, N or T, describes your situation but does not change the arithmetic: 1257L, 1257M or 1257T all give ${h.pence(h.freePay(1257, 12))} of free pay a month. A letter in front changes how the code works: K adds the number to your pay instead of giving it tax-free, S applies the Scottish rates and C the Welsh rates. Some codes are letters only: BR charges ${h.flat('BR')}% on everything, D0 ${h.flat('D0')}%, D1 ${h.flat('D1')}%, 0T gives no allowance but keeps the bands, and NT takes no tax at all. Finally, W1, M1, X or NONCUM at the end switch the code to a week 1 or month 1 basis, where each pay is taxed alone. The comparison shows how much the letter matters: on ${h.gbp(30000)} a year, ${h.src('employer_2627', `${Y.label} rates`)} give ${h.pence(h.taxYear('1257L', 30000))} with 1257L, ${h.pence(h.taxYear('0T', 30000))} with 0T, ${h.pence(h.taxYear('BR', 30000))} with BR and ${h.pence(h.taxYear('D0', 30000))} with D0. Each letter below links to its own page.`;
    },
    faqs: (h) => [
      { q: 'Which tax code letters change how much tax I pay?', a: `The ones in front of the number or instead of it. K, S and C change the calculation, and BR, D0, D1, 0T and NT replace the allowance altogether. The suffix letters L, M, N and T do not enter the calculation, so the number in front of them decides the tax. An ending such as M1 changes the tax only when your pay or start date is uneven.` },
      { q: 'Can a tax code have both a prefix and an ending letter?', a: 'Yes. GOV.UK gives S875L M1 and C663L X as examples of emergency codes, each with a nation prefix and an ending, and HMRC’s payroll specification covers K codes run on a week 1 or month 1 basis too. Read the code from left to right: prefix, number, suffix letter, then any ending after a space.' },
      { q: 'Why do some tax code letters, like the T in 0T and NT, look the same?', a: 'HMRC’s payroll specification treats T as a suffix in both. In 0T it follows a zero allowance, so the pay goes through the bands with nothing tax-free. In NT the N stands for no tax, so nothing is deducted. In a code such as 1150T the T means your allowance includes other calculations HMRC is reviewing.' },
    ],
    body: (h) => {
      const Y = h.Y();
      const L = (id: string, t: string) => `<strong>${h.a(id, t)}</strong>`;
      const rows: Array<[string, string, string]> = [
        [L('1257l-tax-code', 'L'), 'After the number', 'Standard Personal Allowance'],
        [L('m-and-n-tax-codes', 'M'), 'After the number', `Marriage Allowance received, ${h.gbp(Y.marriageAllowance)} added`],
        [L('m-and-n-tax-codes', 'N'), 'After the number', `Marriage Allowance transferred, ${h.gbp(Y.marriageAllowance)} taken off`],
        [L('t-tax-code', 'T'), 'After the number', 'Allowance includes other calculations HMRC reviews'],
        [L('k-tax-code', 'K'), 'In front of the number', `Deductions exceed the allowance: number × 10 added to pay, tax capped at ${Y.maxRate}% of pay`],
        [L('s1257l-tax-code', 'S'), 'In front', 'Scottish rates and bands'],
        [L('c1257l-tax-code', 'C'), 'In front', 'Welsh rates'],
        [L('br-tax-code', 'BR'), 'Whole code', `All pay at the basic rate, ${h.flat('BR')}%`],
        [L('d0-tax-code', 'D0'), 'Whole code', `All pay at the higher rate, ${h.flat('D0')}%`],
        [L('d1-tax-code', 'D1'), 'Whole code', `All pay at the additional rate, ${h.flat('D1')}%`],
        [L('0t-tax-code', '0T'), 'Whole code', 'No allowance, normal bands from the first pound'],
        [L('nt-tax-code', 'NT'), 'Whole code', 'No tax deducted; no Scottish or Welsh version'],
        [L('w1-m1-x-tax-codes', 'W1'), 'Ending', 'Week 1 basis for weekly pay'],
        [L('w1-m1-x-tax-codes', 'M1'), 'Ending', 'Month 1 basis for monthly pay'],
        [L('w1-m1-x-tax-codes', 'X'), 'Ending', 'Non-cumulative basis when pay dates vary'],
        [L('w1-m1-x-tax-codes', 'NONCUM'), 'Ending', 'Printed by some payroll software for the same basis'],
      ];
      const cmp = ['1257L', '1383M', '1131N', '1257T', '0T', 'BR', 'D0', 'S1257L', 'C1257L'].map((c) => [c, h.pence(h.taxPeriod(c, 'monthly', 2500, 1)), h.pence(h.taxYear(c, 30000))]);
      return `
<h2>Every letter in one table</h2>
<p>The table brings together the letters listed by ${h.src('gov_meaning', 'GOV.UK')} for employees and by the ${h.src('gov_employee_codes', 'employer guidance')} for payroll staff, sorted by where they appear in the code. Rates are those of ${Y.label} for England and Northern Ireland.</p>
${h.table(['Letter', 'Where it sits', 'What it does'], rows, `Tax code letters and their effect, ${Y.label}.`, ['l', 'l', 'l'])}

<h2>The same pay under different letters</h2>
<p>Here the pay stays fixed and only the code changes: ${h.gbp(2500)} in one month and ${h.gbp(30000)} over a year. The first four lines show that suffix letters do nothing on their own; the difference between 1383M and 1131N comes from their numbers. The flat codes and 0T show what losing the allowance costs, and the S line shows the effect of the Scottish bands at this level of pay.</p>
${h.table(['Code', 'Tax in month 1 on £2,500', 'Tax over the year on £30,000'], cmp, `Income Tax only, ${Y.label}, equal monthly pay; calculation follows HMRC's PAYE specification.`, ['l', 'r', 'r'])}
<!--tool:mini:month|{"code":"1257L","pay":2500}-->

<h2>How to read a full code</h2>
<p>Take the code from left to right. A prefix comes first: S or C for the nation, or K when the number is added to pay. A Scottish K code reads SK, a Welsh one CK. Next comes the number, the tax-free amount divided by ten, explained on the ${h.a('tax-code-numbers', 'page on code numbers')}. Then the suffix letter. Last, after a space, any ending that changes the basis. So S1257L M1 means Scottish rates, ${h.gbp(Y.personalAllowance)} tax-free, standard allowance, month 1 basis.</p>
<p>A few combinations never appear. HMRC's ${h.src('paye_spec', 'PAYE specification')} rules out SNT and CNT, and it gives the emergency code no S or C prefix because a single emergency code serves the whole UK. Outside Scotland there is no D2, since the scale stops at the additional rate; in Scotland the flat codes run from SBR to SD3, listed on the ${h.a('scottish-tax-codes', 'Scottish codes page')}.</p>

<h2>Endings and why they matter</h2>
<p>${h.src('gov_emergency', 'GOV.UK')} treats a code ending in W1, M1, X or NONCUM as an emergency code. The ending does not change the allowance; it stops the running total, so allowance not used in earlier weeks or months is not given back. A code with no ending is cumulative, which is the normal state. If your code has carried an ending for weeks, or a letter in the table does not match your situation, check your record in your ${h.src('hmrc_check', 'HMRC online account')}.</p>`;
    },
  },
});
