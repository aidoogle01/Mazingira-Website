const { chromium, devices } = require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13']});const p=await c.newPage();
const res=[];p.on('response',async r=>{try{const buf=await r.body();res.push({u:r.url(),n:buf.length,t:r.headers()['content-type']})}catch{}});
await p.goto(process.argv[2],{waitUntil:'load'});await p.waitForTimeout(6000);
const tot=res.reduce((a,r)=>a+r.n,0);const by={};for(const r of res){const k=(r.t||'?').split(';')[0];by[k]=(by[k]||0)+r.n}
console.log('TOTAL MB',(tot/1e6).toFixed(2),'reqs',res.length);console.log(Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>k+' '+(v/1e6).toFixed(2)+'MB').join(' | '));
res.sort((a,b)=>b.n-a.n).slice(0,6).forEach(r=>console.log((r.n/1e6).toFixed(2)+'MB',r.t,r.u.slice(0,140)));await b.close()})();
