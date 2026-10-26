const { chromium, devices } = require('playwright');
const fs = require('fs'); const path = require('path'); const W = process.argv[2];
const B='https://www.mazingirasafari.com/';
const pkgs=['serengeti-escape-romance-package','savannah-to-shore-package','serengeti-under-the-stars','family-safari-package','packages/honeymoon-package','winged-wonders-package','great-migration-package','wildlife-photography-package','kilimanjaro-packages'];
(async()=>{
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  for(const p of pkgs){
    await page.goto(B+p,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(5000);
    const days=await page.locator('text=/^Day \\d/').evaluateAll(els=>els.map(e=>e.innerText.trim()));
    const labels=[...new Set(days.filter(d=>d.length<14))];
    const out=[];
    for(const lab of labels){
      try{
        await page.getByText(lab,{exact:true}).first().click({timeout:5000}); await page.waitForTimeout(900);
        const txt=await page.evaluate(()=>document.body.innerText);
        const m=txt.split('\nITINERARY\n')[1]||txt;
        out.push({tab:lab,text:m.split('Package Price includes')[0].slice(0,4000)});
      }catch(e){out.push({tab:lab,error:e.message.split('\n')[0]});}
    }
    fs.writeFileSync(path.join(W,'itin',p.replace('/','__')+'.json'),JSON.stringify(out,null,1));
    console.log(p,labels.length,'tabs');
  }
  // design tokens from home
  await page.goto(B,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
  const tokens=await page.evaluate(()=>{
    const col={},font={},sizes={};
    for(const el of document.querySelectorAll('body *')){
      const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue;
      const cs=getComputedStyle(el);
      if(el.childNodes.length && [...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())){
        col['text '+cs.color]=(col['text '+cs.color]||0)+1;
        font[cs.fontFamily.split(',')[0]]=(font[cs.fontFamily.split(',')[0]]||0)+1;
        sizes[el.tagName+' '+cs.fontSize+' '+cs.fontWeight]=(sizes[el.tagName+' '+cs.fontSize+' '+cs.fontWeight]||0)+1;
      }
      if(cs.backgroundColor!=='rgba(0, 0, 0, 0)') col['bg '+cs.backgroundColor]=(col['bg '+cs.backgroundColor]||0)+1;
    }
    const logo=[...document.querySelectorAll('header img, img')].slice(0,3).map(i=>({src:i.currentSrc,alt:i.alt,w:i.naturalWidth}));
    const fontsLoaded=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight);
    return {col,font,sizes,logo,fontsLoaded:[...new Set(fontsLoaded)]};
  });
  fs.writeFileSync(path.join(W,'design-tokens.json'),JSON.stringify(tokens,null,1));
  await ctx.close();
  // mobile + perf
  const m=await browser.newContext({...devices['iPhone 13']});
  const mp=await m.newPage(); const perf={};
  for(const p of ['','safari-packages','savannah-to-shore-package','contact','enquire-now-form','who-is-mazingira','the-serengeti']){
    let bytes=0, reqs=0; const onr=r=>{reqs++; r.body().then(b=>bytes+=b.length).catch(()=>{})}; mp.on('response',onr);
    const t0=Date.now(); await mp.goto(B+p,{waitUntil:'load',timeout:90000}).catch(()=>{});
    const loadMs=Date.now()-t0; await mp.waitForTimeout(4000);
    const lcp=await mp.evaluate(()=>new Promise(res=>{let v=0;new PerformanceObserver(l=>{for(const e of l.getEntries())v=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});setTimeout(()=>res(Math.round(v)),500)}));
    const overflow=await mp.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    mp.off('response',onr);
    perf[p||'home']={loadMs,lcpMs:lcp,requests:reqs,MB:+(bytes/1e6).toFixed(2),horizontalOverflow:overflow};
    await mp.screenshot({path:path.join(W,'shots-mobile',(p||'home')+'.mobile.png'),fullPage:true}).catch(()=>{});
    console.log('mobile',p||'home',JSON.stringify(perf[p||'home']));
  }
  fs.writeFileSync(path.join(W,'perf-mobile.json'),JSON.stringify(perf,null,1));
  await browser.close();
})();
