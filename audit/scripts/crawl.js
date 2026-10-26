const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const W = process.argv[2];
const urls = fs.readFileSync(path.join(W,'urls.txt'),'utf8').split('\n').map(l=>l.split(' ')[0]).filter(u=>u.startsWith('http'));
const uniq = [...new Set(urls)];
const slug = u => (new URL(u).pathname.replace(/^\/|\/$/g,'').replace(/\//g,'__') || 'home');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
  const queue = [...uniq];
  async function worker() {
    const page = await ctx.newPage();
    while (queue.length) {
      const u = queue.shift(); const s = slug(u); const t0 = Date.now();
      try {
        const resp = await page.goto(u, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
        await page.waitForTimeout(1500);
        // scroll to trigger lazy content
        await page.evaluate(async () => { for (let y=0; y<document.body.scrollHeight; y+=800) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,120)); } window.scrollTo(0,0); });
        await page.waitForTimeout(800);
        const data = await page.evaluate(() => {
          const q = (s) => [...document.querySelectorAll(s)];
          const meta = n => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || null;
          return {
            title: document.title,
            description: meta('description'), ogTitle: meta('og:title'), ogImage: meta('og:image'),
            canonical: document.querySelector('link[rel=canonical]')?.href || null,
            lang: document.documentElement.lang,
            headings: q('h1,h2,h3,h4').map(h => ({ tag: h.tagName, text: h.innerText.trim() })).filter(h=>h.text),
            text: document.body.innerText,
            links: q('a[href]').map(a => ({ text: (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,100), href: a.href })),
            images: q('img').map(i => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight })).filter(i=>i.src),
            forms: q('form').map(f => ({ fields: [...f.querySelectorAll('input,textarea,select')].map(e => ({ type: e.type, name: e.name, label: e.getAttribute('aria-label') || e.placeholder || e.id, required: e.required })) })),
            iframes: q('iframe').map(f => f.src).filter(Boolean),
            scripts: q('script[src]').map(s => s.src),
          };
        });
        data.url = u; data.finalUrl = page.url(); data.status = resp ? resp.status() : null; data.loadMs = Date.now() - t0;
        fs.writeFileSync(path.join(W,'pages',s+'.json'), JSON.stringify(data,null,1));
        await page.screenshot({ path: path.join(W,'shots',s+'.desktop.png'), fullPage: true }).catch(()=>{});
        console.log('ok', data.status, s, data.loadMs+'ms');
      } catch (e) { console.log('ERR', s, e.message.split('\n')[0]); }
    }
    await page.close();
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  await browser.close();
})();
