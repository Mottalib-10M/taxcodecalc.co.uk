import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'what-does-my-tax-code-mean', group: 'tools', order: 1,
  tool: { kind: 'decoder', props: { code: 'S1100L M1', pay: 28000 } },
  mini: { kind: 'mini:allowance', props: { num: 1100 } },
  related: ['tax-code-letters', 'tax-code-numbers', '1257l-tax-code', 'k-tax-code', 'p2-tax-code-notice'],
  sources: ['gov_meaning', 'gov_taxcodes', 'paye_spec', 'gov_emergency', 'gov_k'],
  en: {
    slug: 'what-does-my-tax-code-mean', nav: 'Tax code meaning', card: 'Read any code from left to right: prefix, number, letter and emergency marker, with examples.',
    title: 'Tax Code Meaning: Read Any UK Code Letter by Letter',
    description: 'Prefix, number, letter, emergency marker: read your tax code piece by piece, see the tax-free pay behind it and the tax it takes, with twelve codes decoded.',
    h1: 'What does my tax code mean?',
    intro: 'Read your code from left to right: where you pay tax, how much is tax-free, why, and whether each pay stands alone.',
    resume: (h) => {
      const t = h.taxYear('S1100L M1', 28000);
      return `Every UK tax code can be read in four pieces from left to right, and each piece answers one question. An S or C at the start says your income is taxed at the Scottish or Welsh rates; no prefix means the rates for England and Northern Ireland. The number is your tax-free pay from this job with the last digit removed, so 1100 means ${h.gbp(11000)}. The letter after it says why the allowance has that size: L for the standard one, M or N for Marriage Allowance received or given, T when other calculations are part of it. A code may instead be two letters with no number, such as BR or NT, which replace the allowance altogether, or start with K, which adds to pay. Finally, W1, M1 or X means each pay is taxed on its own. S1100L M1 on ${h.gbp(28000)} a year therefore means Scottish rates, ${h.gbp(11000)} tax-free, a benefit or deduction already taken off, emergency basis: ${h.pence(t)} over the year.`;
    },
    faqs: (h) => [
      { q: 'Why does my tax code have a different number from 1257?', a: `The number is your Personal Allowance after HMRC's adjustments, divided by ten. Company benefits, the State Pension, untaxed income or tax owed from an earlier year make it smaller; job expenses or Marriage Allowance received make it bigger. With nothing to adjust, the number is 1257 for ${h.Y().label}. Your HMRC online account lists each adjustment.` },
      { q: 'Does the letter in my tax code change how much tax I pay?', a: 'For codes with a number, the tax depends on the number and the prefix, not on the letter. L, M, N and T describe why the allowance has its size: the standard allowance, Marriage Allowance received or given, or other calculations. Letters that replace the number, such as BR, D0, D1, NT and K, do change the tax.' },
      { q: 'What does NONCUM mean next to my code?', a: 'NONCUM, short for non-cumulative, is how some payroll software shows the week 1 or month 1 basis. It means the same as W1, M1 or X: each pay is taxed with one period of allowance and no look back at the rest of the year. It is usually temporary, until HMRC sends a cumulative code.' },
    ],
    body: (h) => {
      const ex = ['1257L', '1383M', '1131N', '1100T', 'S1257L', 'C1257L', 'K475', 'BR', 'D0', '0T', 'NT', '1257L M1'];
      const what: Record<string, string> = {
        '1257L': 'Standard allowance', '1383M': 'Marriage Allowance received', '1131N': 'Marriage Allowance given', '1100T': 'Other calculations',
        'S1257L': 'Scottish rates', 'C1257L': 'Welsh rates', 'K475': 'Amount added to pay', 'BR': 'All at basic rate', 'D0': 'All at higher rate',
        '0T': 'No allowance, normal bands', 'NT': 'No tax', '1257L M1': 'Emergency basis',
      };
      const rows = ex.map((c) => { const p = h.code(c); const free = p.kind === 'suffix' ? h.gbp(p.num * 10) : p.kind === 'K' ? `−${h.gbp(p.num * 10)}` : '£0'; return [c, what[c], free, h.pence(h.taxYear(c, 30000))]; });
      return `
<h2>Twelve codes decoded</h2>
<p>The table applies each code to the same ${h.gbp(30000)} a year paid monthly, so you can see how much the prefix, the number and the letters matter. Figures follow HMRC's payroll method for ${h.Y().label} (${h.src('paye_spec', 'PAYE specification')}).</p>
${h.table(['Code', 'What it says', 'Tax-free a year', 'Tax on £30,000'], rows, `Meanings from ${h.src('gov_meaning', 'GOV.UK')}; Income Tax only.`, ['l', 'l', 'r', 'r'])}

<h2>The prefix: where you pay tax</h2>
<p>HMRC decides whether you are a Scottish or Welsh taxpayer from where you live, and the prefix tells payroll which rates to use. S sends the pay through the six Scottish bands, from ${h.sc('scot').rates[0]}% to ${h.sc('scot').rates[5]}%. C applies the Welsh rates, which give the same totals as England in ${h.Y().label}. A missing prefix when you live in Scotland, or an S when you have moved to England, is a common error worth checking in your ${h.src('hmrc_check', 'HMRC online account')}. The emergency code has no prefix: it is the same across the UK.</p>
<!--tool:mini:scotland|{"pay":30000}-->

<h2>The number and the letter</h2>
<p>The number times ten is the yearly tax-free pay from this job. Payroll converts it with HMRC's tables, which add £9 before dividing, so 1257 gives ${h.pence(h.freePay(1257, 12))} a month rather than an exact twelfth. The letter after the number is a label: L for the standard allowance, M when your partner has transferred Marriage Allowance to you, N when you have transferred it, T when your allowance includes other calculations HMRC has made. Some codes have no number at all: ${h.a('br-tax-code', 'BR')}, ${h.a('d0-tax-code', 'D0')}, ${h.a('d1-tax-code', 'D1')}, ${h.a('0t-tax-code', '0T')} and ${h.a('nt-tax-code', 'NT')}. A ${h.a('k-tax-code', 'K code')} has a number that is added to pay.</p>

<h2>Where your code is printed</h2>
<p>The code appears on every payslip, usually near your National Insurance number, and on your P60 at the end of the tax year. HMRC's online service and app show the code for each job and pension, with the calculation behind it and the codes of earlier years (${h.src('gov_taxcodes', 'GOV.UK tax codes')}). When HMRC changes a code it may also send a coding notice listing each allowance and deduction. If two documents show different codes for the same job, the most recent one from HMRC is the one your employer should be using; a payslip can lag a new code by one or two pay days.</p>

<h2>The end of the code: cumulative or not</h2>
<p>Without anything after the letter, the code is cumulative: each payslip looks at the whole year so far. W1 (weekly pay), M1 (monthly pay) and X (irregular pay dates) switch to the emergency basis described on ${h.src('gov_emergency', 'GOV.UK')}, where each pay is taxed alone. The ${h.a('w1-m1-x-tax-codes', 'W1, M1 and X page')} explains when this costs you money and how it is reversed.</p>`;
    },
  },
});
