// Browser pass over rafikicamps.com (one site, pages in sequence, no form submissions, nothing clicked
// except a visible cookie "accept" if one appears).
// Usage: node capture.js  → writes {home,trip,book}-{desktop,mobile}.jpg and data.json next to this file.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = __dirname;
const PAGES = {
  home: 'https://rafikicamps.com/',
  trip: 'https://rafikicamps.com/packages/5-night',
  book: 'https://rafikicamps.com/book',
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

function extract() {
  const vh = innerHeight;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const absY = el => el.getBoundingClientRect().top + scrollY;
  const header = document.querySelector('header, nav');
  const nav = header ? [...new Set([...header.querySelectorAll('a,button')].filter(vis).map(txt).filter(t => t && t.length < 40))] : [];
  const navAll = header ? [...new Set([...header.querySelectorAll('a')].map(a => txt(a) + ' → ' + a.getAttribute('href')).filter(Boolean))] : [];
  const headings = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map(h => h.tagName + ': ' + txt(h).slice(0, 120)).slice(0, 60);
  const ctas = [...document.querySelectorAll('a,button')].filter(vis).map(e => ({ t: txt(e).slice(0, 60), href: e.getAttribute('href'), y: Math.round(absY(e)) }))
    .filter(c => /book|enquir|inquir|availab|reserve|contact|whatsapp|plan|request|quote|call|email|brochure|get in touch/i.test(c.t + ' ' + (c.href || '')));
  const fixed = [...document.querySelectorAll('body *')].filter(e => { const p = getComputedStyle(e).position; return (p === 'fixed' || p === 'sticky') && vis(e); })
    .map(e => ({ tag: e.tagName, pos: getComputedStyle(e).position, cls: (e.className || '').toString().slice(0, 120), text: txt(e).slice(0, 100), rect: (r => [r.x, r.y, r.width, r.height].map(Math.round))(e.getBoundingClientRect()) }));
  const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`);
  const cs = s => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return { font: c.fontFamily, size: c.fontSize, weight: c.fontWeight, ls: c.letterSpacing, tt: c.textTransform, color: c.color, lh: c.lineHeight }; };
  const typo = { h1: cs('h1'), h2: cs('h2'), h3: cs('h3'), p: cs('main p, p'), button: cs('button'), navlink: cs('header a, nav a'), body: cs('body') };
  // colour census: background + text colours weighted by element area
  const bg = {}, fg = {};
  for (const e of document.querySelectorAll('body *')) {
    if (!vis(e)) continue; const c = getComputedStyle(e); const r = e.getBoundingClientRect(); const a = r.width * r.height;
    if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)') bg[c.backgroundColor] = (bg[c.backgroundColor] || 0) + a;
    if (e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) fg[c.color] = (fg[c.color] || 0) + 1;
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} (${Math.round(v)})`);
  const eyebrows = [...document.querySelectorAll('p,span,div,h4,h5,h6')].filter(e => vis(e) && e.children.length === 0 && getComputedStyle(e).textTransform === 'uppercase' && parseFloat(getComputedStyle(e).letterSpacing) > 1).map(txt).filter(Boolean).slice(0, 30);
  const midDots = [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && /\s[·•|]\s/.test(e.textContent)).map(txt).slice(0, 15);
  const arrows = [...document.querySelectorAll('a,button')].filter(e => /[→›»]|->/.test(e.textContent)).map(txt).slice(0, 15);
  const radii = {}; for (const e of document.querySelectorAll('a,button,img,div,section,article')) { const r = getComputedStyle(e).borderRadius; if (r && r !== '0px' && vis(e)) radii[r] = (radii[r] || 0) + 1; }
  const shadows = {}; for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e).boxShadow; if (s && s !== 'none' && vis(e)) shadows[s.slice(0, 80)] = (shadows[s.slice(0, 80)] || 0) + 1; }
  const prices = (document.body.innerText.match(/(US)?\$\s?[\d,]{3,}[^\n]{0,40}/g) || []).slice(0, 30);
  const forms = [...document.querySelectorAll('form')].map(f => ({ action: f.getAttribute('action'), fields: [...f.querySelectorAll('input,select,textarea')].filter(i => i.type !== 'hidden').map(i => ({ type: i.type || i.tagName, name: i.name, label: (i.labels?.[0] && txt(i.labels[0])) || i.placeholder || i.getAttribute('aria-label'), req: i.required })) }));
  const iframes = [...document.querySelectorAll('iframe')].map(f => f.src.slice(0, 150));
  const videos = [...document.querySelectorAll('video')].map(v => ({ src: (v.currentSrc || v.querySelector('source')?.src || '').slice(0, 150), autoplay: v.autoplay, muted: v.muted, loop: v.loop, poster: v.poster, top: Math.round(absY(v)) }));
  const imgs = [...document.images].map(i => i.currentSrc || i.src).filter(Boolean);
  const imgExt = {}; imgs.forEach(s => { const m = s.split('?')[0].match(/\.(\w+)$/); const k = m ? m[1].toLowerCase() : 'other'; imgExt[k] = (imgExt[k] || 0) + 1; });
  const imgHosts = [...new Set(imgs.map(s => { try { return new URL(s).host; } catch { return 'data'; } }))];
  const hasPicture = document.querySelectorAll('picture source[type]').length;
  const lazy = [...document.images].filter(i => i.loading === 'lazy').length;
  const trust = [...document.querySelectorAll('body *')].filter(e => e.children.length < 3 && /tripadvisor|google review|safaribookings|reviews?\b|rated|stars?\b|award|certif|TATO|TALA|licen|member|guarantee|secure|ATOL|years/i.test(e.textContent) && txt(e).length < 160).map(txt);
  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return [].concat(j['@graph'] || j).map(x => x['@type']).flat(); } catch { return 'bad'; } }).flat();
  const animated = document.querySelectorAll('[style*="opacity: 0"], [style*="transform"]').length;
  return { url: location.href, title: document.title, docH: document.documentElement.scrollHeight, nav, navAll, headings, ctas, fixed, fonts: [...new Set(fonts)], typo,
    bg: top(bg, 12), fg: top(fg, 10), eyebrows: [...new Set(eyebrows)], midDots, arrows, radii: top(radii, 8), shadows: top(shadows, 6), prices: [...new Set(prices)], forms, iframes, videos,
    imgCount: imgs.length, imgExt, imgHosts, hasPicture, lazy, trust: [...new Set(trust)].slice(0, 40), jsonld, animatedInline: animated,
    lang: document.documentElement.lang, metaGen: document.querySelector('meta[name=generator]')?.content || null };
}

async function run(profile, ctxOpts) {
  const browser = await chromium.launch();
  const results = {};
  for (const [name, url] of Object.entries(PAGES)) {
    const ctx = await browser.newContext({ ...ctxOpts, locale: 'en-GB' }); // fresh context = cold cache per page
    const page = await ctx.newPage();
    const reqs = [];
    page.on('requestfinished', async req => {
      const s = await req.sizes().catch(() => null); const r = await req.response().catch(() => null);
      reqs.push({ url: req.url(), type: req.resourceType(), status: r && r.status(), bytes: s ? s.responseBodySize + s.responseHeadersSize : 0 });
    });
    page.on('requestfailed', req => reqs.push({ url: req.url(), type: req.resourceType(), failed: req.failure()?.errorText }));
    await page.addInitScript(() => {
      window.__lcp = null; window.__cls = 0;
      new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = { t: Math.round(e.startTime), el: e.element ? e.element.tagName + (e.element.currentSrc ? ' ' + e.element.currentSrc.slice(-60) : '') + ' ' + (e.element.textContent || '').slice(0, 40) : null, size: e.size }; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const loadMs = Date.now() - t0;
    await sleep(2000);
    const perf = await page.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return { lcp: window.__lcp, cls: +window.__cls.toFixed(3), fcp: fcp && Math.round(fcp.startTime), ttfb: Math.round(n.responseStart), domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd),
        transferKB: Math.round((n.transferSize + res.reduce((a, r) => a + (r.transferSize || 0), 0)) / 1024), decodedKB: Math.round((n.decodedBodySize + res.reduce((a, r) => a + (r.decodedBodySize || 0), 0)) / 1024), resources: res.length + 1 };
    });
    // cookie banner, if any (accept only)
    const cookie = page.getByRole('button', { name: /^(accept( all)?( cookies)?|allow all|got it|i agree|ok)$/i }).first();
    const cookieSeen = await cookie.isVisible().catch(() => false);
    const cookieText = cookieSeen ? await page.locator('body').evaluate(() => [...document.querySelectorAll('div,section,aside')].filter(e => /cookie/i.test(e.textContent) && e.textContent.length < 600).map(e => e.innerText).pop()) : null;
    await page.screenshot({ path: path.join(OUT, `${name}-${profile}-fold.jpg`), type: 'jpeg', quality: 70 });
    if (cookieSeen) { await cookie.click().catch(() => {}); await sleep(600); }
    // scroll through so lazy/in-view content renders, then full-page shot
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise(r => setTimeout(r, 300)); } });
    await sleep(1200);
    const scrolledFixed = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const p = getComputedStyle(e).position; const r = e.getBoundingClientRect(); return (p === 'fixed' || p === 'sticky') && r.width > 0 && r.height > 0; }).map(e => ({ tag: e.tagName, text: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 100), rect: [e.getBoundingClientRect().y, e.getBoundingClientRect().height].map(Math.round) })));
    await page.evaluate(() => scrollTo(0, 0)); await sleep(800);
    const data = await page.evaluate(extract);
    const h = Math.min(data.docH, profile === 'desktop' ? 9000 : 14000);
    await page.screenshot({ path: path.join(OUT, `${name}-${profile}.jpg`), type: 'jpeg', quality: 60, fullPage: true, clip: { x: 0, y: 0, width: page.viewportSize().width, height: h } }).catch(async () => page.screenshot({ path: path.join(OUT, `${name}-${profile}.jpg`), type: 'jpeg', quality: 60, fullPage: true }));
    const hosts = {}; for (const r of reqs) { try { const hh = new URL(r.url).host; hosts[hh] = hosts[hh] || { n: 0, kb: 0, types: new Set() }; hosts[hh].n++; hosts[hh].kb += (r.bytes || 0) / 1024; hosts[hh].types.add(r.type); } catch {} }
    const hostList = Object.fromEntries(Object.entries(hosts).map(([k, v]) => [k, { n: v.n, kb: Math.round(v.kb), types: [...v.types] }]));
    const byType = {}; for (const r of reqs) { byType[r.type] = byType[r.type] || { n: 0, kb: 0 }; byType[r.type].n++; byType[r.type].kb += Math.round((r.bytes || 0) / 1024); }
    const largest = reqs.filter(r => r.bytes).sort((a, b) => b.bytes - a.bytes).slice(0, 10).map(r => `${Math.round(r.bytes / 1024)}KB ${r.type} ${r.url.slice(0, 120)}`);
    results[name] = { perf, loadMs, requests: reqs.length, byType, hosts: hostList, largest, failed: reqs.filter(r => r.failed), cookieBanner: cookieText, scrolledFixed, ...data };
    console.log(profile, name, JSON.stringify(perf), reqs.length, 'reqs');
    await ctx.close();
    await sleep(2500);
  }
  await browser.close();
  return results;
}

(async () => {
  const out = {};
  out.desktop = await run('desktop', { viewport: { width: 1440, height: 900 } });
  out.mobile = await run('mobile', { ...devices['iPhone 13'] });
  fs.writeFileSync(path.join(OUT, 'data.json'), JSON.stringify(out, null, 1));
})();
