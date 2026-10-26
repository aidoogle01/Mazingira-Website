const { chromium, devices } = require('playwright'); const fs=require('fs'),path=require('path'); const W=process.argv[2];
const B='https://www.mazingirasafari.com/';
const pkgs=['serengeti-escape-romance-package','savannah-to-shore-package','serengeti-under-the-stars','family-safari-package','packages/honeymoon-package','winged-wonders-package','great-migration-package','wildlife-photography-package','kilimanjaro-packages'];
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage();
for(const pk of pkgs){
  await p.goto(B+pk,{waitUntil:'load',timeout:90000}).catch(()=>{}); await p.waitForTimeout(6000);
  const labels=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Day\s*\d[\d\s\-&]*$/.test(e.textContent.trim())).map(e=>e.textContent.trim()));
  const uniq=[...new Set(labels)]; const days={};
  const grab=async()=>{const t=await p.evaluate(()=>document.body.innerText);for(const m of t.matchAll(/\n(Day\s*\d[\d\s\-&]*:[^\n]*)\n([\s\S]*?)(?=\nPackage Price|\nPrices can vary)/g)){days[m[1].trim()]=m[2].trim()}};
  await grab();
  for(const l of uniq){
    const loc=p.locator(`text="${l}"`).first();
    try{await loc.scrollIntoViewIfNeeded({timeout:3000});await loc.click({timeout:3000,force:true});}catch(e){}
    for(let i=0;i<8;i++){await p.waitForTimeout(500);const t=await p.evaluate(()=>document.body.innerText); if(new RegExp('\\n'+l.replace(/[-&]/g,'.')+'\\s*:').test(t)) break;}
    await grab();
  }
  fs.writeFileSync(path.join(W,'itin',pk.replace('/','__')+'.json'),JSON.stringify({tabs:uniq,days},null,1));
  console.log(pk,'tabs',uniq.length,'captured',Object.keys(days).length);
}
// transfer size
const m=await b.newContext({...devices['iPhone 13']});const mp=await m.newPage();
for(const u of ['','safari-packages','savannah-to-shore-package']){await mp.goto(B+u,{waitUntil:'load'});await mp.waitForTimeout(5000);
 const r=await mp.evaluate(()=>{const e=performance.getEntriesByType('resource');const n=performance.getEntriesByType('navigation')[0];return {transferMB:+((e.reduce((a,x)=>a+(x.transferSize||0),0)+(n.transferSize||0))/1e6).toFixed(2),n:e.length}});console.log('transfer',u||'home',JSON.stringify(r));}
await b.close();})();
