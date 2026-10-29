import type { Locale } from './routes';
const en = {
  updatedOn: 'Rates and rules checked on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Rules read on HMRC’s texts by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Next steps', sourcesTitle: 'Where these rules were read', writtenBy: 'Written by',
  asOf: 'Tax codes', lastUpdated: 'read on HMRC’s payroll specification, GOV.UK and the rates for employers, last checked on',
  footerValidated: 'Every rate, band and allowance links to the HMRC or GOV.UK page it was read on',
  footerBrowser: 'Calculators run in your browser · nothing you type is sent or stored · free, no account',
  footerDisclaimer: 'Tax Code Calc is an independent site published by Radif Partners. It is not HMRC, GOV.UK, a payroll bureau, an accountant or a tax refund company, it cannot see or change your tax code and it takes no payment. Results are estimates only, from HMRC’s published method and rates; they are not tax advice and do not replace HMRC’s own calculation: HMRC decides your tax code and the tax you owe.',
  footerPopular: 'Calculators',
  notFound: 'There is no page at this address. The tax code checker is on the home page.',
  readMore: 'Read more', back: 'Home',
  independent: 'Independent site, not HMRC. Only HMRC can change your code: use your HMRC online account or app.',
};
export function t(_lang: Locale = 'en') { return en; }
