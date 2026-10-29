/** PAYE engine checks against HMRC's Specification for PAYE Tax Table Routines v24.0, worked by hand. */
import { describe, expect, it } from 'vitest';
import { parseCode, periodAllowance, periodTax, runPayroll, yearTax, personalAllowance, codeFor, annualBandTax, scale } from '../src/lib/engine/paye';
import { liability, expectedCodes, emergencyRefund, checkCodes } from '../src/lib/engine/situation';

describe('parsing', () => {
  it('reads the usual shapes', () => {
    expect(parseCode('1257L').text).toBe('1257L');
    expect(parseCode(' s1257l m1 ').text).toBe('S1257L M1');
    expect(parseCode('1257L/W1').basis).toBe('W1');
    expect(parseCode('C1257L X').nonCum).toBe(true);
    expect(parseCode('K475').kind).toBe('K');
    expect(parseCode('SD3').d).toBe(3);
    expect(parseCode('0T').num).toBe(0);
    expect(parseCode('CBR').region).toBe('wales');
    expect(parseCode('1257L NONCUM').nonCum).toBe(true);
  });
  it('refuses codes that do not exist', () => {
    expect(parseCode('SNT').ok).toBe(false);
    expect(parseCode('D2').ok).toBe(false);
    expect(parseCode('SD4').ok).toBe(false);
    expect(parseCode('K0').ok).toBe(false);
    expect(parseCode('hello').ok).toBe(false);
  });
});

describe('free pay, paragraph 4.3.1 (quotient and remainder)', () => {
  it('code 1257: £1,048.26 a month, £241.92 a week', () => {
    expect(periodAllowance(1257, 12)).toBe(104826);
    expect(periodAllowance(1257, 52)).toBe(24192);
  });
  it('codes up to 500 use (code × 10 + 9) / periods rounded up', () => {
    expect(periodAllowance(475, 12)).toBe(39659);
    expect(periodAllowance(500, 52)).toBe(9633);
    expect(periodAllowance(0, 12)).toBe(0);
  });
});

describe('cumulative tax', () => {
  it('1257L, £3,000 in month 1: £390.20', () => {
    expect(periodTax('1257L', 'monthly', 3000, 1)!.tax).toBe(39020);
  });
  it('1257L, £3,000 every month: £4,684.00 over the year', () => {
    expect(yearTax('1257L', 'monthly', 3000)).toBe(468400);
  });
  it('S1257L, £3,000 in month 1: intermediate rate reached, £392.27', () => {
    expect(periodTax('S1257L', 'monthly', 3000, 1)!.tax).toBe(39227);
  });
  it('C1257L follows the same bands as England in 2026-27', () => {
    expect(periodTax('C1257L', 'monthly', 4000, 1)!.tax).toBe(periodTax('1257L', 'monthly', 4000, 1)!.tax);
  });
  it('higher rate: 1257L, £6,000 in month 1', () => {
    // free pay 1,048.26; taxable 4,951 → k1 = 7,540 / 12 = 628.3333; c1 = 3,141.6666; 628.3333 + 1,809.3334 × 40 %
    expect(periodTax('1257L', 'monthly', 6000, 1)!.tax).toBe(Math.floor((6283333 + Math.floor((49510000 - 31416666) * 40 / 100)) / 100));
  });
  it('flat codes: BR 20 %, D0 40 %, D1 45 %, SD0 21 %, NT nothing', () => {
    expect(periodTax('BR', 'monthly', 1000.99, 1)!.tax).toBe(20000);
    expect(periodTax('D0', 'monthly', 1000, 1)!.tax).toBe(40000);
    expect(periodTax('D1', 'monthly', 1000, 1)!.tax).toBe(45000);
    expect(periodTax('SD0', 'monthly', 1000, 1)!.tax).toBe(21000);
    expect(periodTax('SD3', 'monthly', 1000, 1)!.tax).toBe(48000);
    expect(periodTax('NT', 'monthly', 9000, 3)!.tax).toBe(0);
  });
  it('0T: no free pay', () => {
    expect(periodTax('0T', 'monthly', 1000, 1)!.tax).toBe(20000);
  });
});

describe('K codes and the regulatory limit (paragraph 4.5.2)', () => {
  it('K475, £2,250 a month: additional pay £396.59, tax £529.20', () => {
    expect(periodTax('K475', 'monthly', 2250, 1)!.tax).toBe(52920);
  });
  it('K2000, £600 in month 1: capped at half the pay, the rest held back', () => {
    const r = periodTax('K2000 M1', 'monthly', 600, 1)!;
    expect(r.tax).toBe(30000);
    expect(r.heldBack).toBe(45340 - 30000);
  });
  it('cumulative K code: what the cap held back is collected later when pay allows', () => {
    const rows = runPayroll({ code: 'K2000', freq: 'monthly', pays: [600, 3000] });
    expect(rows[0].tax).toBe(30000);
    expect(rows[1].tax).toBe(rows[1].taxDueToDate - 30000);
  });
});

describe('week 1 / month 1 basis', () => {
  it('each period stands alone: the same tax in month 9 as in month 1', () => {
    expect(periodTax('1257L M1', 'monthly', 3000, 9)!.tax).toBe(39020);
  });
  it('emergency code then the right code: the difference comes back in one pay', () => {
    const e = emergencyRefund({ freq: 'monthly', pay: 3000, start: 7, periods: 2, emergency: '1257L M1', correct: '1257L' });
    expect(e.onEmergency).toBe(78040);
    expect(e.right).toBe(0);
    expect(e.back).toBe(78040);
    expect(e.switchRow!.tax).toBe(-78040);
  });
});

describe('allowances and expected codes', () => {
  it('taper: £1 less for every £2 above £100,000, nothing left at £125,140', () => {
    expect(personalAllowance(100000)).toBe(12570);
    expect(personalAllowance(110000)).toBe(7570);
    expect(personalAllowance(125140)).toBe(0);
  });
  it('code numbers', () => {
    expect(codeFor(12570, 'L', 'ruk')).toBe('1257L');
    expect(codeFor(11000, 'L', 'ruk')).toBe('1100L');
    expect(codeFor(-4750, 'L', 'ruk')).toBe('K475');
    expect(codeFor(5, 'L', 'scot')).toBe('S0T');
  });
  it('the GOV.UK medical insurance example: £1,570 benefit gives 1100L', () => {
    expect(expectedCodes({ region: 'ruk', job1: 30000, bik: 1570 }).main).toBe('1100L');
  });
  it('Marriage Allowance: 1383M received, 1131N transferred', () => {
    expect(expectedCodes({ region: 'ruk', job1: 30000, ma: 'receive' }).main).toBe('1383M');
    expect(expectedCodes({ region: 'ruk', job1: 9000, ma: 'transfer' }).main).toBe('1131N');
  });
  it('second job: BR when the main job stays in the basic rate band, D0 above it', () => {
    expect(expectedCodes({ region: 'ruk', job1: 30000, job2: 8000 }).second).toBe('BR');
    expect(expectedCodes({ region: 'ruk', job1: 60000, job2: 8000 }).second).toBe('D0');
    expect(expectedCodes({ region: 'scot', job1: 60000, job2: 8000 }).second).toBe('SD1');
  });
  it('State Pension taken off the code of a workplace pension', () => {
    const sp = Math.round(241.3 * 52);
    expect(expectedCodes({ region: 'ruk', job1: 10000, statePension: sp }).main).toBe(codeFor(12570 - sp, 'L', 'ruk'));
  });
  it('annual tax: £30,000 in England is £3,486, in Scotland more', () => {
    expect(liability({ region: 'ruk', job1: 30000 }).tax).toBe(348600);
    expect(annualBandTax(17430, scale('2026-27', 'scot')!)).toBe(75373 + 12989 * 20 + 474 * 21);
  });
  it('right code gives back almost exactly the tax due', () => {
    const c = checkCodes({ region: 'ruk', job1: 30000 }, '1257L');
    expect(Math.abs(c.paidCurrent - c.liability.tax)).toBeLessThan(500);
    const w = checkCodes({ region: 'ruk', job1: 30000 }, '0T');
    expect(w.gap).toBeGreaterThan(250000);
  });
  it('2027-28 Scottish rates are not published: the engine falls back on 2026-27 and says so', () => {
    expect(scale('2027-28', 'scot')).toBeNull();
    expect(liability({ region: 'scot', job1: 30000, year: '2027-28' }).fallback).toBe(true);
  });
});

import { MINI_KINDS, getSpec } from '../src/lib/mini-specs';
describe('mini-tools', () => {
  for (const k of MINI_KINDS) it(`${k} runs on its defaults`, () => {
    const s = getSpec(k);
    const out = s.run(Object.fromEntries(s.inputs.map((i) => [i.id, i.def])));
    expect(out.head[1]).toBeTruthy();
    expect(out.head[1]).not.toMatch(/NaN|undefined/);
    for (const [, v] of out.rows) expect(v).not.toMatch(/NaN|undefined/);
  });
});
