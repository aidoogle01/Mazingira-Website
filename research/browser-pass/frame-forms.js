// Lists form fields inside iframes (Jotform, HubSpot, Typeform and similar) that capture.js cannot see.
// Usage: node frame-forms.js <siteKey> <url>   -> merges into <siteKey>/data.json as framesForms
// Reads only; never types into or submits a form.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [key, url] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-GB' })).newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(8000);
  const out = [];
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    const fields = await f.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
      const txt = el => (el ? (el.innerText || el.textContent || '') : '').replace(/\s+/g, ' ').trim();
      const seen = new Set();
      return [...document.querySelectorAll('input, select, textarea')].filter(i => !['hidden', 'submit', 'button'].includes(i.type)).map(i => {
        const lab = (i.id && document.querySelector(`label[for="${CSS.escape(i.id)}"]`)) || i.closest('label') || i.closest('li, .form-line, fieldset')?.querySelector('label, legend');
        return { type: i.type, name: i.name, label: txt(lab).slice(0, 80), placeholder: i.placeholder || '', visible: vis(i) };
      }).filter(d => { const k = (d.type === 'radio' || d.type === 'checkbox') ? d.type + d.name : Math.random(); if (seen.has(k)) return false; seen.add(k); return true; });
    }).catch(() => []);
    const pages = await f.evaluate(() => document.querySelectorAll('.form-section, .form-section-closed, [data-type=control_pagebreak]').length).catch(() => 0);
    if (fields.length) out.push({ frame: f.url().slice(0, 140), pagesOrSections: pages, fields });
  }
  const p = path.join(__dirname, key, 'data.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  data.framesForms = data.framesForms || {};
  data.framesForms[url] = out;
  fs.writeFileSync(p, JSON.stringify(data, null, 1));
  console.log(JSON.stringify(out.map(o => ({ frame: o.frame, pages: o.pagesOrSections, n: o.fields.length, fields: o.fields.map(x => `${x.type}:${x.label || x.placeholder || x.name}`.slice(0, 60)) }))));
  await browser.close();
})();
