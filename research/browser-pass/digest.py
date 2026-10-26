"""Compact per-site digest of data.json, for writing findings.md. Usage: python3 digest.py <siteKey>"""
import json, sys, re
key = sys.argv[1]
d = json.load(open(f"{key}/data.json"))
def clean(s): return re.sub(r"[-]", "", s or "").strip()
for pg, modes in d["pages"].items():
    for mode, r in modes.items():
        x = r.get("data") or {}
        print(f"== {pg} {mode} status={r.get('status')} {r.get('blocked') or ''}{r.get('error') or ''} url={x.get('url', r.get('url'))}")
        if not x: continue
        p = r.get("perf") or {}
        print(f"  perf lcp={r.get('lcpMs')} ttfb={p.get('ttfb')} perfApiKB={p.get('perfApiTransferKB')} pwKB={r.get('transferKB_afterScroll')} reqs={r.get('requests')} docH={x.get('docHeight')} cookie={r.get('cookie')}")
        c = x["contact"]
        if mode == "mobile":
            print("  fixed:", [(f["pos"], f["top"], f["bottom"], f["h"], clean(f["text"])[:60]) for f in c["fixed"]])
            print("  overflowX:", x["overflowX"], x["scrollWidth"], " ctaFold:", [clean(t) for t in x["cta"]["aboveFold"]])
            continue
        print("  title:", x["title"]); print("  nav:", [clean(n) for n in x["nav"]][:22]); print("  h1:", x["h1"])
        h = x["hero"]; print("  hero: videos", [v["src"][:60] for v in h["videos"]], "iframes", h["iframes"][:2], "sliders", h["sliders"][:2], "bigImgs", len(h["bigImages"]), "bgSections", h["bgImageSections"])
        print("  cta:", [(clean(t), n) for t, n in x["cta"]["counts"]][:12]); print("  ctaFold:", [clean(t) for t in x["cta"]["aboveFold"]])
        for f in x["forms"]:
            print(f"  form y={f['y']} fields={f['fieldsTotal']} visible={f['fieldsVisible']} step={f['stepText']} next={f['nextBtn']} submit={f['submit']} action={f['action'][:60]}")
            print("    ", [(fl['type'], clean(fl['label'] or fl['placeholder'] or fl['name'])[:45]) for fl in f["fields"] if fl["visible"]])
        print("  iframes:", [s[:70] for s in x["iframes"] if "google" not in s][:6])
        print("  vendors:", c["vendorHits"], " wa:", c["whatsapp"][:3], " tel:", [t["text"] for t in c["tel"]][:3], " phrases:", c["phrases"])
        print("  fixed:", [(f["pos"], f["top"], f["bottom"], f["h"], f["w"], clean(f["text"])[:50]) for f in c["fixed"]][:6])
        print("  prices:", [clean(s) for s in x["prices"]][:6])
        print("  trust:", [(t["match"], t["where"], t["text"][:60]) for t in x["trust"]][:10]); print("  trustImgs:", x["trustImgs"][:8]); print("  ratings:", x["ratingText"][:5])
        print("  fonts:", x["fonts"]); print("  colours:", x["colours"])
        print("  slop:", x["slop"]); print("  imgs:", x["images"]["count"], x["images"]["alts"][:18])
