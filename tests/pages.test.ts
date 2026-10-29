/**
 * Editorial rules checked on the page files before any build (RECETTE §7, §11, §21):
 * run `npx vitest run tests/pages.test.ts` after writing a page.
 */
import { describe, expect, it } from 'vitest';
import { PAGES } from '../src/lib/guides';
import { helpers } from '../src/lib/helpers';
import { getSpec } from '../src/lib/mini-specs';
import P from '../src/data/params-2026.json';

const h = helpers('en', true);
const strip = (s: string) => s.replace(/<!--.*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
const words = (s: string) => strip(s).split(/\s+/).filter((w) => /[A-Za-z0-9£]/.test(w)).length;
const COUNTRY_START = /^(uk |united kingdom|britain|england|scotland|wales|northern ireland|london)/i;
const GENERIC = /^(how|what|when|calculator|calculate|about|faq|methodology)\b/i;
const FORBIDDEN = /—|google|first result|competitor|guaranteed|we claim for you|no win no fee|official site of|accountant near|refund company/i;
const TOOL_KINDS = new Set(['decoder', 'payslip', 'rightcode', 'emergency', 'compare', 'kcode']);
const toolOk = (k: string) => TOOL_KINDS.has(k) || (k.startsWith('mini:') && !!getSpec(k.slice(5)));

const seenQ = new Map<string, string>();
const seenTitle = new Map<string, string>();
for (const p of PAGES) {
  describe(p.id, () => {
    const T = p.en;
    it('title 50–60 characters, key term first', () => {
      expect(T.title.length, T.title).toBeGreaterThanOrEqual(50);
      expect(T.title.length, T.title).toBeLessThanOrEqual(60);
      expect(COUNTRY_START.test(T.title) || GENERIC.test(T.title), T.title).toBe(false);
      expect(seenTitle.get(T.title), 'duplicate title').toBeUndefined(); seenTitle.set(T.title, p.id);
    });
    it('description 150–160 characters', () => {
      expect(T.description.length, T.description).toBeGreaterThanOrEqual(150);
      expect(T.description.length, T.description).toBeLessThanOrEqual(160);
    });
    it('citable block of 120 words or more, in one paragraph', () => {
      const r = T.resume(h);
      expect(words(r), r.slice(0, 80)).toBeGreaterThanOrEqual(120);
      expect(r).not.toMatch(/<p|<\/p>|<h\d|<table|<ul/);
    });
    it('3 to 5 FAQ, answers of 40 to 90 words, questions unique across the site', () => {
      const f = T.faqs(h);
      expect(f.length).toBeGreaterThanOrEqual(3);
      expect(f.length).toBeLessThanOrEqual(5);
      for (const x of f) {
        const n = words(x.a);
        expect(n, `${x.q} (${n} words)`).toBeGreaterThanOrEqual(42);
        expect(n, `${x.q} (${n} words)`).toBeLessThanOrEqual(88);
        expect(x.a).not.toMatch(/<[a-z]/);
        const k = x.q.toLowerCase().replace(/\W+/g, ' ').trim();
        expect(seenQ.get(k), `FAQ "${x.q}" already on ${seenQ.get(k)}`).toBeUndefined();
        seenQ.set(k, p.id);
      }
    });
    it('enough substance: resume + body of 650 words or more', () => {
      const n = words(T.resume(h)) + words(T.body(h));
      expect(n).toBeGreaterThanOrEqual(650);
    });
    it('body: H2 sections, tools that exist, links that resolve, no forbidden words', () => {
      const b = T.body(h);
      expect((b.match(/<h2>/g) ?? []).length).toBeGreaterThanOrEqual(3);
      for (const m of b.matchAll(/<!--tool:([a-z0-9:-]+?)(?:\||-->)/g)) expect(toolOk(m[1]), m[1]).toBe(true);
      const all = [T.title, T.description, T.h1, T.intro, T.resume(h), b, ...T.faqs(h).flatMap((f) => [f.q, f.a])].join(' ');
      expect(all.match(FORBIDDEN)?.[0]).toBeUndefined();
      expect(all).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
    });
    it('tools, related pages and sources exist', () => {
      if (p.tool) expect(toolOk(p.tool.kind), p.tool.kind).toBe(true);
      if (p.mini) expect(toolOk(p.mini.kind), p.mini.kind).toBe(true);
      expect(p.tool || p.mini, 'a simulator on every page').toBeTruthy();
      for (const r of p.related) expect(PAGES.some((x) => x.id === r) || r === 'home', r).toBe(true);
      expect(p.related.length).toBeGreaterThanOrEqual(3);
      for (const s of p.sources) expect(Object.keys(P.sources), s).toContain(s);
      expect(p.sources.length).toBeGreaterThanOrEqual(1);
    });
  });
}
