# Adding or editing a page

One page = one file `src/content/pages/<id>.ts` exporting `definePage({...})` (types in
`src/lib/guide-types.ts`). The file name must equal `id`, and the slug equals the id. Model:
`1257l-tax-code.ts`. The page is built at `/en/<en.slug>/`; menus, footer, home lists, llms.txt and sitemap
follow by themselves. English only (en-GB). The plan of pages is `PLANNED` in `src/lib/helpers.ts`.

## Fields

- `group`: `tools`, `codes`, `situations` or `rules`; `order`: position in its group.
- `tool`: the main tool, right under the H1 (first screen):
  - `decoder` (props: `code`, `pay`), `payslip` (`code`, `pay`, `freq`, `period`), `rightcode` (`region`, `job1`,
    `job2`, `sp` weekly State Pension, `bik`, `expenses`, `ma`, `current`), `emergency` (`freq`, `pay`, `start`,
    `periods`, `emergency`: `X`|`BR`|`0T`, `correct`), `compare` (`a`, `b`, `pay`, `freq`), `kcode` (`k`, `pay`, `freq`);
  - `{ kind: 'mini:<spec>', props?: {...} }`, specs in `src/lib/mini-specs.ts` (`MINI_KINDS`). Numeric props
    override input defaults; `code` and `code2` take a code from the list `CODES` of that file.
- `mini`: a second tool under the citable block. In a body, `<!--tool:mini:month|{"code":"BR","pay":900}-->`
  places a tool between paragraphs.
- `related`: 3–5 page ids. `sources`: keys of `src/data/params-2026.json` → `sources`.
- `demarche: true` on pages about a step with HMRC: adds the "independent site, not HMRC" line under the H1.

## Text rules (checked by `npx vitest run tests/pages.test.ts`, then `npm run check`)

- `title` 50–60 characters, key term first, never "How…", "What…", "UK…", a nation or London first.
- `description` 150–160 characters.
- `resume(h)`: ONE paragraph (no tags but links) of at least 120 words answering the page's query with figures.
- `faqs(h)`: 3–5 questions unique across the site, each answer 42–88 words, plain text (no tags).
- `body(h)`: HTML with at least three `<h2>` sections; resume + body at least 650 words. No `<h1>`.
- No em dash; British spelling; dates in words; coming changes written as coming, with their date.
- Pages must read differently (check-unique): no shared boilerplate paragraph.
- Links only to primary sources (`h.src(key, text)`) and internal pages (`h.a(id, text)`). Never a firm, an
  accountant, a refund company or a forum; never mention a search engine or another site. Never present the site as
  HMRC: changes go through the HMRC online account (`h.src('hmrc_check', …)`).

## Figures

Never type a rate, a threshold or an allowance: read them through `h` (`src/lib/helpers.ts`): `h.Y(year?)` (year
parameters: `personalAllowance`, `incomeLimit`, `emergencyCode`, `payeThreshold`, `marriageAllowance`,
`blindPersonsAllowance`, `maxRate`, `label`), `h.sc(region, year?)` (bands, rates, names), `h.bandEdges(region)`,
`h.R` (rules: coding out limit, days, refund times, examples), `h.B` (Budget 2026 figures), `h.taxYear(code, pay)`,
`h.taxPeriod(code, freq, pay, period)`, `h.freePay(num, 12|52)`, `h.pa(income)`, `h.codeFor(amount, letter, region)`,
`h.expected(situation)`, `h.due(situation)`, `h.emergency({...})`, `h.flat('D0')`, `h.gbp`, `h.pence`, `h.date(iso)`,
`h.table(headers, rows, caption, align)`. Example salaries (`h.gbp(30000)`) are fine. A fact that is not in a primary
text is not written.

## Data

`src/data/params-2026.json`: years 2025-26, 2026-27, 2027-28 (Scottish and Welsh 2027-28 rates null until published,
with the expected date), rules and sources, read by hand on GOV.UK. Texts of the sources (Crown copyright, OGL) go in
`data/textes-sources/*.txt`, ignored by git, for `check-copie`.
