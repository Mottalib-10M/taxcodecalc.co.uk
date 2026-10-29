import { definePage } from '../../lib/guide-types';

const DAY = 86400000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const start = Date.UTC(2026, 3, 6);
/** Tax month n of 2026 to 2027: 6th of a calendar month to the 5th of the next. */
const monthSpan = (n: number) => [iso(Date.UTC(2026, 3 + n - 1, 6)), iso(Date.UTC(2026, 3 + n, 5))];
const weekOf = (t: number) => Math.floor((t - start) / DAY / 7) + 1;
const weekStart = (n: number) => iso(start + (n - 1) * 7 * DAY);
const weekEnd = (n: number) => iso(Math.min(start + (n * 7 - 1) * DAY, Date.UTC(2027, 3, 5)));
const weekday = (t: number) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(t).getUTCDay()];

export default definePage({
  id: 'tax-month-and-week', group: 'rules', order: 7,
  tool: { kind: 'mini:taxmonth' },
  mini: { kind: 'mini:month', props: { pay: 2500 } },
  related: ['how-paye-is-calculated', 'tax-per-payslip', 'tax-code-2026-27', 'w1-m1-x-tax-codes', 'leaving-a-job-p45'],
  sources: ['paye_spec', 'employer_2627', 'gov_rates', 'p9x_2026'],
  en: {
    slug: 'tax-month-and-week', nav: 'Tax month and week', card: 'Find the tax month and tax week of any pay day, and why payroll counts from 6 April.',
    title: 'Tax Month and Tax Week: Find the PAYE Period of a Pay Day',
    description: 'The UK tax year runs from 6 April to 5 April. Find the tax month and tax week of any pay day, see the dates of each month in 2026/27 and how week 53 is taxed.',
    h1: 'Tax month and tax week',
    intro: 'Payroll does not count in calendar months. Type a pay day to get its tax month and week, then see why that number sets your free pay.',
    resume: (h) => {
      const Y = h.Y();
      const oct = Date.UTC(2026, 9, 30);
      return `The UK tax year runs from 6 April to 5 April, so ${Y.label} started on ${h.date(Y.start)} and ends on ${h.date(Y.end)}. Payroll splits it into twelve tax months, each running from the 6th of one calendar month to the 5th of the next: month 1 is 6 April to 5 May, month 7 is 6 October to 5 November, and month 12 is 6 March to 5 April. Weekly pay uses tax weeks counted in sevens from 6 April, so week 1 of ${Y.label} is ${h.date(weekStart(1))} to ${h.date(weekEnd(1))}. The period number comes from the date you are paid. A pay day on ${h.date(iso(oct))} falls in tax month ${7} and tax week ${weekOf(oct)}. That number matters with a cumulative code, because it is what the free pay is multiplied by: in tax month 7, 1257L gives ${h.pence(h.freePay(1257, 12) * 7)} of free pay to date.`;
    },
    faqs: (h) => [
      { q: 'Which tax month does a pay day between the 1st and the 5th fall in?', a: `The previous one. Tax months change on the 6th, so pay received on 3 May belongs to tax month 1, not month 2, and pay on 2 April belongs to month 12 of the year that is ending. That is why a pay day early in April can still use the old year's code and bands, with the free pay for month 12, ${h.pence(h.freePay(1257, 12) * 12)} to date on 1257L.` },
      { q: 'What is tax week 53 and how is a week 53 pay taxed?', a: `A tax year has 52 full weeks plus one extra day, two in a leap year, so a weekly pay day can land in week 53. HMRC's payroll specification treats a week 53 payment on a non-cumulative basis, using the week 1 tables, rather than adding a fifty-third week of free pay. For fortnightly and four-weekly pay, the specification names weeks 54 and 56 in the same way.` },
      { q: 'How do fortnightly and four-weekly pays map onto tax weeks?', a: `They use the weekly tables, counted in steps of two or four weeks. A fortnightly pay in the third pay period of the year sits at tax week 6, so a cumulative 1257L gives six weeks of free pay, ${h.pence(h.freePay(1257, 52) * 6)}. Four-weekly pay counts thirteen periods in the year, each worth four tax weeks.` },
    ],
    body: (h) => {
      const Y = h.Y();
      const fpM = h.freePay(1257, 12);
      const fpW = h.freePay(1257, 52);
      const names = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
      const months = names.map((m, i) => { const [a, b] = monthSpan(i + 1); return [`${i + 1}`, `${m} pay`, `${h.date(a)} to ${h.date(b)}`, h.pence(fpM * (i + 1))]; });
      const weeks = [1, 5, 13, 26, 39, 52, 53].map((n) => [`${n}`, n === 53 ? h.date(weekStart(n)) : `${h.date(weekStart(n))} to ${h.date(weekEnd(n))}`, n === 53 ? 'week 1 tables, non-cumulative' : h.pence(fpW * n)]);
      const last = Date.UTC(2027, 3, 5);
      return `
<h2>Tax months of ${Y.label}</h2>
<p>Every tax month starts on the 6th, which is why the payslip for pay received on the 28th of a month carries the number of the tax month that began on the 6th of that same month. The table gives the dates for the current year and the free pay to date that a cumulative 1257L reaches by each month. For month 1 that is the same ${h.pence(fpM)} you see quoted as the monthly figure; by month 12 it adds up to slightly more than the yearly ${h.gbp(Y.personalAllowance)}, because HMRC's ${h.src('paye_spec', 'tables')} round the free pay for each code up.</p>
${h.table(['Tax month', 'Usually holds', 'Dates', 'Free pay to date, 1257L'], months, `Tax year ${Y.label}, which starts on ${h.date(Y.start)}, as on ${h.src('gov_rates', 'GOV.UK')}.`, ['r', 'l', 'l', 'r'])}
<p>A pay day close to a boundary needs care. An employer who pays on the 5th puts each payment in the tax month that is ending, so the April pay of someone paid on 5 May is month 1 and the pay on 5 April closes month 12. An employer who pays on the 6th or later starts the new month with it.</p>

<h2>Tax weeks and week 53</h2>
<p>Weekly payroll counts tax weeks from 6 April in blocks of seven days, whatever weekday that is. Week 1 of ${Y.label} runs from ${h.date(weekStart(1))} to ${h.date(weekEnd(1))}, and each later week starts seven days after the one before. With a cumulative code, the week number multiplies the weekly free pay of ${h.pence(fpW)} for 1257L.</p>
${h.table(['Tax week', 'Dates', 'Free pay to date, 1257L'], weeks, `Tax weeks of ${Y.label}.`, ['r', 'l', 'r'])}
<p>Fifty-two weeks of seven days cover 364 days, so one day is left over, or two in a leap year. In ${Y.label} that day is ${h.date(iso(last))}, a ${weekday(last)}: someone paid weekly on ${weekday(last)}s receives a pay in week 53. HMRC's ${h.src('paye_spec', 'payroll specification')} does not give that pay a fifty-third week of free pay; it taxes it on a non-cumulative basis with the week 1 tables. Fortnightly and four-weekly payrolls have the same issue, which the specification handles as weeks 54 and 56 with the week 2 and week 4 tables. BR, D and NT codes need nothing special in those weeks apart from the non-cumulative basis.</p>

<h2>Why the period number changes your tax</h2>
<p>On a cumulative code, payroll compares your pay to date with the free pay for the current period number, so a wrong number would give the wrong allowance. If you start a job in tax month 7 after months without work, payroll still uses period 7 and gives you seven months of free pay at once, which is why the first payslip can show little or no tax. The ${h.a('how-paye-is-calculated', 'page on how PAYE is calculated')} walks through that example in full, and the ${h.a('tax-per-payslip', 'payslip calculator')} takes the tax month as an input.</p>
<!--tool:mini:month|{"code":"1257L","pay":2500}-->
<p>On a week 1 or month 1 code, by contrast, the period number has no effect: every pay gets one week's or one month's free pay. That is why an emergency code costs most to someone who starts late in the year. At the turn of the year, the count restarts at 1 on 6 April, and HMRC's ${h.src('p9x_2026', 'P9X instructions')} tell employers to drop any week 1 or month 1 marking from the code carried into the new year.</p>`;
    },
  },
});
