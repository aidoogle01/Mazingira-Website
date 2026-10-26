// Browser pass over competitor safari sites.
// Usage: node capture.js <siteKey> <homeUrl> <tripUrl> <contactUrl> [enquiryUrl]
// Writes <siteKey>/{home,trip,contact}-{desktop,mobile}.jpg and <siteKey>/data.json.
// One site per run, pages in sequence, no form submissions. Cookie banners are accepted or closed;
// nothing else is clicked. Pages that serve a bot check are recorded as blocked and not retried.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const [key, ...urls] = process.argv.slice(2);
const names = ['home', 'trip', 'contact', 'enquiry'];
const OUT = path.join(__dirname, key);
fs.mkdirSync(OUT, { recursive: true });
const CAP = { desktop: 6000, mobile: 9000 }; // screenshot height cap, CSS px

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function dismissCookies(page) {
  const sels = ['#onetrust-accept-btn-handler', '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#CybotCookiebotDialogBodyButtonAccept', '.cky-btn-accept', '#cookie_action_close_header', '.cmplz-accept',
    '#wt-cli-accept-all-btn', '[data-cookiefirst-action="accept"]', '.cc-allow', '.cc-dismiss'];
  for (const s of sels) {
    const el = page.locator(s).first();
    if (await el.isVisible().catch(() => false)) { await el.click({ timeout: 3000 }).catch(() => {}); await sleep(800); return s; }
  }
  const re = /^(accept( all)?( cookies)?|allow( all)?( cookies)?|i agree|agree|got it|ok|okay|i accept|accept & close|accept and close)$/i;
  const btn = page.getByRole('button', { name: re }).first();
  if (await btn.isVisible().catch(() => false)) { const t = await btn.innerText().catch(() => ''); await btn.click({ timeout: 3000 }).catch(() => {}); await sleep(800); return 'button:' + t.trim(); }
  return null;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < Math.min(document.body.scrollHeight, 30000); y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); }
    window.scrollTo(0, 0);
  }).catch(() => {});
  await sleep(1500);
}

// Everything read from the DOM. Runs in the page.
function extract() {
  const vh = window.innerHeight, vw = window.innerWidth;
  const docH = document.documentElement.scrollHeight;
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const absY = el => el.getBoundingClientRect().top + window.scrollY;
  const txt = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const footer = document.querySelector('footer');
  const where = el => { const y = absY(el); if (footer && footer.contains(el)) return 'footer'; if (y < vh) return 'above-fold'; if (y > docH * 0.8) return 'bottom'; return 'body'; };

  // Navigation: visible links in the first header/nav near the top of the page
  const headerEl = [...document.querySelectorAll('header, nav, [role=banner]')].find(e => absY(e) < 200 && vis(e));
  const nav = headerEl ? [...new Set([...headerEl.querySelectorAll('a, button')].filter(vis).map(txt).filter(t => t && t.length < 40))] : [];

  const h1 = [...document.querySelectorAll('h1')].map(h => ({ text: txt(h).slice(0, 200), visible: vis(h) }));

  // Hero: what fills the first viewport
  const vids = [...document.querySelectorAll('video')].filter(v => vis(v) && absY(v) < vh).map(v => ({ autoplay: v.autoplay, muted: v.muted, loop: v.loop, src: (v.currentSrc || v.querySelector('source')?.src || '').slice(0, 150) }));
  const iframesTop = [...document.querySelectorAll('iframe')].filter(f => vis(f) && absY(f) < vh).map(f => f.src.slice(0, 120));
  const sliderTop = [...document.querySelectorAll('[class*=swiper],[class*=slick],[class*=splide],[class*=flickity],[class*=owl-],[class*=carousel],[class*=slider],[class*=Slider],[class*=Carousel]')].filter(e => vis(e) && absY(e) < vh * 0.6 && e.getBoundingClientRect().height > vh * 0.4).map(e => e.className.toString().slice(0, 80));
  const bigImgs = [...document.querySelectorAll('img')].filter(i => vis(i) && absY(i) < vh && i.getBoundingClientRect().width > vw * 0.5).map(i => ({ alt: i.alt, src: (i.currentSrc || i.src).slice(0, 150) }));
  const bgTop = [...document.querySelectorAll('section, div, header')].filter(e => absY(e) < vh * 0.5 && e.getBoundingClientRect().width > vw * 0.8 && e.getBoundingClientRect().height > vh * 0.4 && /url\(/.test(getComputedStyle(e).backgroundImage)).length;

  // CTAs: count link/button texts that look like calls to action
  const ctaRe = /enquir|inquir|plan|book|contact|get in touch|speak|talk|call|quote|request|tailor|start|make an|let's|lets|design (my|your)|check availability|availability|reserve|chat|whatsapp|consult|send|submit|ask/i;
  const ctaCount = {}, ctaFold = [];
  for (const el of document.querySelectorAll('a, button, input[type=submit]')) {
    if (!vis(el)) continue;
    const t = (txt(el) || el.value || el.getAttribute('aria-label') || '').slice(0, 60);
    if (!t || t.length > 50 || !ctaRe.test(t)) continue;
    ctaCount[t] = (ctaCount[t] || 0) + 1;
    if (absY(el) < vh) ctaFold.push(t);
  }

  // Forms: visible fields with their labels
  const forms = [];
  const formRoots = [...document.querySelectorAll('form')];
  for (const f of formRoots) {
    const fields = [...f.querySelectorAll('input, select, textarea')].filter(i => !['hidden', 'submit', 'button'].includes(i.type));
    if (!fields.length) continue;
    const describe = i => {
      const lab = (i.id && document.querySelector(`label[for="${CSS.escape(i.id)}"]`)) || i.closest('label');
      return { tag: i.tagName.toLowerCase(), type: i.type, name: i.name, label: lab ? txt(lab).slice(0, 80) : '', placeholder: i.placeholder || '', required: i.required || i.getAttribute('aria-required') === 'true', visible: vis(i) };
    };
    const all = fields.map(describe);
    const radiosGrouped = []; const seen = new Set();
    for (const d of all) { const k = (d.type === 'radio' || d.type === 'checkbox') && d.name ? d.type + ':' + d.name : null; if (k) { if (seen.has(k)) continue; seen.add(k); } radiosGrouped.push(d); }
    const stepText = /step\s*\d|\d\s*(of|\/)\s*\d/i.test(txt(f).slice(0, 3000));
    const nextBtn = [...f.querySelectorAll('button, a, input[type=button]')].some(b => /^(next|continue)\b/i.test(txt(b) || b.value || ''));
    forms.push({ action: (f.action || '').slice(0, 120), id: f.id, cls: f.className.toString().slice(0, 60), y: Math.round(absY(f)), fieldsTotal: radiosGrouped.length, fieldsVisible: radiosGrouped.filter(d => d.visible).length, fields: radiosGrouped.slice(0, 40), stepText, nextBtn, submit: [...f.querySelectorAll('button, input[type=submit]')].map(b => (txt(b) || b.value).slice(0, 40)).filter(Boolean).slice(0, 4) });
  }
  const iframes = [...document.querySelectorAll('iframe')].map(f => f.src).filter(Boolean).map(s => s.slice(0, 140));

  // Contact channels
  const html = document.documentElement.outerHTML;
  const scripts = [...document.querySelectorAll('script[src]')].map(s => s.src);
  const vendors = { intercom: /intercom/i, zendesk: /zdassets|zopim|zendesk/i, livechat: /livechatinc|livechat\.com/i, tawk: /tawk\.to/i, drift: /drift\.com|js\.driftt/i, hubspotChat: /js\.usemessages|hs-scripts|hubspot/i, tidio: /tidio/i, freshchat: /freshchat|wchat\.freshchat/i, olark: /olark/i, crisp: /crisp\.chat/i, gorgias: /gorgias/i, salesforceChat: /embeddedservice|salesforceliveagent|liveagent/i, whatsappWidget: /whatsapp/i, calendly: /calendly/i, trustpilot: /trustpilot/i, feefo: /feefo/i, tripadvisor: /tripadvisor/i, reviewsio: /reviews\.io|reviewsio/i, elfsight: /elfsight/i, googleReviews: /google.*reviews|featurable|trustindex/i, safaribookings: /safaribookings/i };
  const vendorHits = Object.fromEntries(Object.entries(vendors).map(([k, re]) => [k, scripts.some(s => re.test(s)) || iframes.some(s => re.test(s)) ? 'script/iframe' : (re.test(html) ? 'mentioned-in-html' : false)]).filter(([, v]) => v));
  const links = [...document.querySelectorAll('a[href]')];
  const wa = links.filter(a => /wa\.me|whatsapp\.com/i.test(a.href)).map(a => ({ text: txt(a).slice(0, 40), where: where(a), visible: vis(a) }));
  const tel = links.filter(a => /^tel:/i.test(a.href)).map(a => ({ text: txt(a).slice(0, 40), where: where(a), visible: vis(a) }));
  const mail = [...new Set(links.filter(a => /^mailto:/i.test(a.href)).map(a => a.href.slice(7, 80)))];
  const body = document.body.innerText;
  const phrases = ['call back', 'callback', 'request a call', 'book a call', 'schedule a call', 'video call', 'zoom', 'live chat', 'chat with', 'whatsapp', 'speak to', 'talk to'].filter(p => body.toLowerCase().includes(p));

  // Floating widgets: fixed elements in a corner
  const fixed = [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); return (cs.position === 'fixed' || cs.position === 'sticky') && vis(e); }).map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName.toLowerCase(), id: e.id, cls: e.className.toString().slice(0, 60), pos: getComputedStyle(e).position, top: Math.round(r.top), bottom: Math.round(vh - r.bottom), h: Math.round(r.height), w: Math.round(r.width), text: txt(e).slice(0, 100) }; }).filter(f => f.h < vh * 0.5).slice(0, 15);

  // Prices
  const priceRe = /(US\s?\$|USD|\$|£|GBP|€|EUR|ZAR|R)\s?\d{1,3}(,\d{3})+(\.\d+)?|(US\s?\$|USD|£|€)\s?\d{3,}|\d{1,3}(,\d{3})+\s?(USD|GBP|pp|per person)/g;
  const prices = []; let m; const b2 = body.replace(/\s+/g, ' ');
  while ((m = priceRe.exec(b2)) && prices.length < 12) prices.push(b2.slice(Math.max(0, m.index - 70), m.index + m[0].length + 50));

  // Trust and review signals, with placement
  const trustRe = /\b(ATOL|ABTA|AITO|B ?Corp|Travelife|Trustpilot|Feefo|Tripadvisor|TripAdvisor|Reviews\.io|SafariBookings|Google reviews|Excellent|ATTA|TATO|KPAP|IATA|Condé Nast|Conde Nast|Travel \+ Leisure|World Travel Awards|Which\?|Rough Guides|National Geographic)\b/;
  const trust = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || el.children.length > 3) continue;
    const t = txt(el); if (!t || t.length > 160) continue;
    const mm = t.match(trustRe); if (mm && !trust.some(x => x.text === t)) trust.push({ match: mm[0], text: t.slice(0, 120), where: where(el) });
    if (trust.length > 30) break;
  }
  const trustImgs = [...document.querySelectorAll('img')].filter(i => /atol|abta|aito|bcorp|b-corp|travelife|tripadvisor|trustpilot|feefo|award|safaribookings|logo-|badge|certif/i.test((i.alt || '') + ' ' + (i.currentSrc || i.src))).map(i => ({ alt: i.alt.slice(0, 60), src: (i.currentSrc || i.src).split('/').pop().slice(0, 60), where: where(i) })).slice(0, 20);
  const ratingText = (b2.match(/[\d.,]+\s*(\/\s*5|out of 5|stars?)[^.]{0,60}|\d[\d,]*\s+(reviews|ratings)/gi) || []).slice(0, 8);

  // Typography
  const ff = sel => { const e = [...document.querySelectorAll(sel)].find(vis); return e ? getComputedStyle(e).fontFamily : null; };
  const fs = sel => { const e = [...document.querySelectorAll(sel)].find(vis); if (!e) return null; const c = getComputedStyle(e); return `${c.fontSize}/${c.fontWeight} ls=${c.letterSpacing} tt=${c.textTransform}`; };
  const fonts = { loaded: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/["']/g, '')))], h1: ff('h1'), h1Style: fs('h1'), h2: ff('h2'), h2Style: fs('h2'), body: ff('p'), bodyStyle: fs('p'), nav: headerEl ? getComputedStyle(headerEl.querySelector('a') || headerEl).fontFamily : null, button: ff('button, .btn, [class*=button]') };

  // Colour by painted area (backgrounds) and by text count
  const bgArea = {}, textCol = {};
  for (const el of document.querySelectorAll('body, body *')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.backgroundColor && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)) bgArea[cs.backgroundColor] = (bgArea[cs.backgroundColor] || 0) + Math.min(r.width * r.height, vw * 4000);
    if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) textCol[cs.color] = (textCol[cs.color] || 0) + 1;
  }
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => k + ' ' + Math.round(v));

  // Images (for photo-mix judgement alongside the screenshots)
  const imgs = [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().width > 200).map(i => i.alt.slice(0, 80)).filter(Boolean);
  const imgCount = [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().width > 200).length;

  // AI-slop tell counters (Anthropic frontend-design list)
  let eyebrows = 0, eyebrowEx = [], dots = 0, dotEx = [], arrows = 0, arrowEx = [], numMarkers = 0, gradients = 0, radii = {}, hoverish = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    if (own && own.length < 40 && (cs.textTransform === 'uppercase' || (own === own.toUpperCase() && /[A-Z]{3}/.test(own))) && parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize) >= 0.08) { eyebrows++; if (eyebrowEx.length < 6) eyebrowEx.push(own); }
    if (own && /\s[·•|]\s/.test(own) && own.length < 120) { dots++; if (dotEx.length < 4) dotEx.push(own.slice(0, 80)); }
    if (own && /(→|⟶|↗|›|»|->)\s*$/.test(own) && own.length < 50) { arrows++; if (arrowEx.length < 4) arrowEx.push(own); }
    if (own && /^0\d\.?$/.test(own)) numMarkers++;
    if (/gradient/.test(cs.backgroundImage) && el.getBoundingClientRect().width > 300) gradients++;
    if (cs.borderRadius !== '0px' && el.getBoundingClientRect().width > 200 && el.getBoundingClientRect().height > 150) radii[cs.borderRadius] = (radii[cs.borderRadius] || 0) + 1;
  }
  const animAttrs = document.querySelectorAll('[data-aos],[class*=fade-up],[class*=fadeUp],[class*=fade-in],[class*=reveal],[class*=animate],[data-animate],[data-scroll]').length;

  return {
    url: location.href, title: document.title, docHeight: docH, nav, h1,
    hero: { videos: vids, iframes: iframesTop, sliders: sliderTop.slice(0, 3), bigImages: bigImgs.slice(0, 4), bgImageSections: bgTop },
    cta: { counts: Object.entries(ctaCount).sort((a, b) => b[1] - a[1]).slice(0, 15), aboveFold: [...new Set(ctaFold)] },
    forms, iframes: iframes.slice(0, 15),
    contact: { vendorHits, whatsapp: wa.slice(0, 5), tel: tel.slice(0, 5), mail, phrases, fixed },
    prices, trust: trust.slice(0, 20), trustImgs, ratingText,
    fonts, colours: { backgroundsByArea: top(bgArea, 8), textByCount: top(textCol, 6) },
    images: { count: imgCount, alts: imgs.slice(0, 40) },
    slop: { eyebrows, eyebrowEx, dots, dotEx, arrows, arrowEx, numMarkers, gradients, radii: top(radii, 5), animAttrs, interUsed: /\bInter\b/.test(getComputedStyle(document.body).fontFamily) },
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 2, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
  };
}

async function visit(browser, mode, url, name, data) {
  const ctx = await browser.newContext(mode === 'mobile' ? { ...devices['iPhone 13'], locale: 'en-GB' } : { viewport: { width: 1440, height: 900 }, locale: 'en-GB' });
  const page = await ctx.newPage();
  let bytes = 0, reqs = 0;
  page.on('requestfinished', async r => { reqs++; try { const s = await r.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; } catch {} });
  const rec = { url, mode };
  try {
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(async e => { rec.loadError = e.message.split('\n')[0]; return null; });
    rec.status = resp ? resp.status() : null; rec.loadMs = Date.now() - t0;
    await sleep(5000);
    const title = await page.title().catch(() => '');
    if (/just a moment|attention required|access denied|verify you are human|not acceptable/i.test(title) || rec.status === 403 || rec.status === 406) {
      rec.blocked = `bot check or refusal (HTTP ${rec.status}, title "${title}")`;
      await page.screenshot({ path: path.join(OUT, `${name}-${mode}.jpg`), type: 'jpeg', quality: 50 }).catch(() => {});
      return rec;
    }
    rec.lcpMs = await page.evaluate(() => new Promise(res => { let v = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {} setTimeout(() => res(Math.round(v)), 300); }));
    const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const res = performance.getEntriesByType('resource'); return { ttfb: n && Math.round(n.responseStart), domContentLoaded: n && Math.round(n.domContentLoadedEventEnd), perfApiTransferKB: Math.round(((n ? n.transferSize : 0) + res.reduce((a, r) => a + (r.transferSize || 0), 0)) / 1024), resources: res.length }; });
    rec.perf = nav;
    // Fold screenshot before any interaction, so the cookie banner shows if there is one
    await page.screenshot({ path: path.join(OUT, `${name}-${mode}-fold.jpg`), type: 'jpeg', quality: 55 });
    rec.cookie = await dismissCookies(page);
    await autoScroll(page);
    rec.data = await page.evaluate(extract);
    rec.transferKB_atLoadPlus5s = null;
    rec.transferKB_afterScroll = Math.round(bytes / 1024); rec.requests = reqs;
    const h = Math.min(rec.data.docHeight, CAP[mode]);
    await page.screenshot({ path: path.join(OUT, `${name}-${mode}.jpg`), type: 'jpeg', quality: 50, fullPage: true, clip: { x: 0, y: 0, width: mode === 'mobile' ? 390 : 1440, height: h }, scale: 'css' }).catch(e => rec.shotError = e.message.split('\n')[0]);
    rec.shotCappedAt = h < rec.data.docHeight ? h : null;
  } catch (e) { rec.error = e.message.split('\n')[0]; }
  finally { await ctx.close(); }
  return rec;
}

(async () => {
  const browser = await chromium.launch();
  const dataPath = path.join(OUT, 'data.json');
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : { key, pages: {} };
  data.captured = new Date().toISOString();
  for (let i = 0; i < urls.length; i++) {
    if (!urls[i] || urls[i] === '-') continue;
    data.pages[names[i]] = {};
    for (const mode of ['desktop', 'mobile']) {
      const r = await visit(browser, mode, urls[i], names[i], data);
      data.pages[names[i]][mode] = r;
      console.log(key, names[i], mode, r.status, r.blocked || r.error || r.loadError || `lcp=${r.lcpMs} kb=${r.transferKB_afterScroll}`);
      await sleep(2000);
      if (r.blocked && i === 0) break;
    }
    if (data.pages[names[i]].desktop?.blocked && i === 0) break;
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 1));
  await browser.close();
})();
