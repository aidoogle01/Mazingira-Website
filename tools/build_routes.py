"""Build the new site map (content/routes.json) and the old-to-new redirect map (content/redirects.json).

    python3 tools/build_routes.py

Routes come from the content model, so a new trip or page gets a URL automatically.
Redirects cover every URL in the old Wix sitemap, the old WordPress URLs still in search
results, and Wix's alternative paths, each mapped to one new route with a 301.
"""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'content')
load = lambda p: json.load(open(os.path.join(C, p)))

PAGE_PATHS = {  # page id -> new path
    'about-tanzania': '/destinations/tanzania', 'big-five': '/destinations/big-five',
    'kilimanjaro': '/kilimanjaro', 'kilimanjaro-routes': '/kilimanjaro/routes', 'kilimanjaro-packing-list': '/kilimanjaro/packing-list',
    'travel-guide': '/plan/travel-guide', 'visas-and-entry': '/plan/visas-and-entry', 'what-to-pack': '/plan/what-to-pack',
    'accommodation': '/plan/where-you-stay', 'best-time-to-visit-tanzania-for-a-safari': '/plan/best-time-to-visit',
    'how-to-plan-the-perfect-safari-honeymoon-in-tanzania-and-zanzibar': '/plan/honeymoon-safari-guide',
    'about-us': '/about', 'booking-process': '/about/how-booking-works',
    'terms-and-conditions': '/terms', 'accessibility': '/accessibility',
}

def routes():
    r = [
        {'path': '/', 'type': 'home', 'title': 'Home', 'nav': None},
        {'path': '/safaris', 'type': 'trip-list', 'title': 'Safaris', 'nav': 'main'},
        {'path': '/destinations', 'type': 'park-list', 'title': 'Destinations', 'nav': 'main'},
        {'path': '/experiences', 'type': 'experience-list', 'title': 'Experiences', 'nav': 'main'},
        {'path': '/plan', 'type': 'plan-hub', 'title': 'Plan your trip', 'nav': 'main'},
        {'path': '/plan/faqs', 'type': 'faqs', 'title': 'FAQs', 'source': 'content/faqs.json', 'nav': None},
        {'path': '/about/team', 'type': 'team', 'title': 'Meet the team', 'source': 'content/team/', 'nav': None},
        {'path': '/about/reviews', 'type': 'reviews', 'title': 'Reviews', 'source': 'content/reviews.json', 'nav': None},
        {'path': '/enquire', 'type': 'enquiry', 'title': 'Enquire', 'nav': 'cta'},
        {'path': '/contact', 'type': 'contact', 'title': 'Contact', 'source': 'content/site.json', 'nav': 'footer'},
        {'path': '/privacy', 'type': 'page', 'title': 'Privacy and cookies', 'source': None, 'nav': 'footer',
         'note': 'NEW: needed for cookie consent (Facebook Pixel). No content on the old site; to be written.'},
    ]
    for f in sorted(glob.glob(os.path.join(C, 'trips/*.json'))):
        t = json.load(open(f))
        base = '/kilimanjaro' if t['style'] == 'kilimanjaro' else '/safaris'
        r.append({'path': f"{base}/{t['id']}", 'type': 'trip', 'title': t['title'], 'source': f"content/trips/{t['id']}.json",
                  'status': t['status'], 'nav': None})
    for f in sorted(glob.glob(os.path.join(C, 'parks/*.json'))):
        p = json.load(open(f))
        r.append({'path': f"/destinations/{p['id']}", 'type': 'park', 'title': p['title'], 'source': f"content/parks/{p['id']}.json", 'nav': None})
    for f in sorted(glob.glob(os.path.join(C, 'experiences/[!_]*.json'))):
        e = json.load(open(f))
        r.append({'path': f"/experiences/{e['id']}", 'type': 'experience', 'title': e['title'], 'source': f"content/experiences/{e['id']}.json", 'nav': None})
    for f in sorted(glob.glob(os.path.join(C, 'pages/*.json'))):
        p = json.load(open(f))
        path = PAGE_PATHS[p['id']]
        r.append({'path': path, 'type': 'page', 'title': p['title'], 'source': f"content/pages/{p['id']}.json",
                  'nav': 'main' if path in ('/kilimanjaro', '/about') else ('footer' if path in ('/terms', '/accessibility') else None)})
    return r

def redirects(by_source, paths):
    """Old URL path -> new path. `by_source` maps old live URLs (from content `source`) to new paths."""
    m = {}
    for src, new in by_source.items():
        old = '/' + src.split('mazingirasafari.com/', 1)[-1].strip('/') if 'mazingirasafari.com' in src else None
        if old and old != '/':
            m[old] = new
    m.update({
        # hubs and pages without a content file of their own
        '/safari-packages': '/safaris', '/national-parks': '/destinations', '/activities': '/experiences',
        '/faqs': '/plan/faqs', '/blog': '/plan', '/testimonials': '/about/reviews', '/meet-the-team': '/about/team',
        '/who-is-mazingira': '/about', '/contact': '/contact', '/enquire-now-form': '/enquire', '/klimanajro-enquiry': '/enquire',
        '/kilimanjaro-packages': '/kilimanjaro/kilimanjaro-machame-7-day',
        # blog posts not kept -> nearest guide
        '/post/are-safari-holidays-safe': '/plan/faqs',
        '/post/why-choose-tanzania-for-your-safari-adventure-discover-the-best-reasons-with-mazingira-safari': '/destinations/tanzania',
        '/post/the-ultimate-guide-to-safari-photography': '/safaris/wildlife-photography-safari',
        '/post/10-must-visit-destinations-in-tanzania': '/destinations',
        '/post/ultimate-safari-packing-list-what-to-bring-for-a-perfect-tanzanian-adventure-in-2024': '/plan/what-to-pack',
        '/post/uncovering-the-hidden-gems-of-tanzania': '/destinations',
        # Wix placeholders and alternative paths
        '/items/this-is-a-title-01': '/', '/items/this-is-a-title-02': '/', '/items/this-is-a-title-03': '/',
        '/blank-2': '/safaris/honeymoon-safari-and-zanzibar',
        # old WordPress site (still in search results)
        '/about-mazingira': '/about', '/about-mazingira/our-guides': '/about/team', '/about-mazingira/the-mazingira-difference': '/about',
        '/contact-us': '/contact', '/tours': '/safaris', '/safaris': '/safaris',
    })
    # hidden trip: send to the listing until it is published
    for old, new in list(m.items()):
        if new not in paths:
            raise SystemExit(f'redirect target {new} (from {old}) is not a route')
    return {k: v for k, v in sorted(m.items()) if k != v}

def main():
    r = routes()
    paths = {x['path'] for x in r}
    by_source = {}
    for x in r:
        if (x.get('source') or '').startswith('content/') and x['source'].endswith('.json') and os.path.isfile(os.path.join(ROOT, x['source'])):
            doc = json.load(open(os.path.join(ROOT, x['source'])))
            src = doc.get('source', '') if isinstance(doc, dict) else ''
            if src and x.get('status', 'published') == 'published':
                by_source[src] = x['path']
    rd = redirects(by_source, paths)
    json.dump({'note': 'New site map, generated from content/ by tools/build_routes.py. `nav`: main, cta, footer or null.', 'routes': r},
              open(os.path.join(C, 'routes.json'), 'w'), indent=2, ensure_ascii=False)
    json.dump({'note': 'Permanent (301) redirects from old URLs to new routes. Generated by tools/build_routes.py.', 'status': 301, 'redirects': rd},
              open(os.path.join(C, 'redirects.json'), 'w'), indent=2, ensure_ascii=False)

    # human-readable site map
    sections = [('Main navigation', lambda x: x['nav'] in ('main', 'cta')), ('Safaris', lambda x: x['type'] == 'trip'),
                ('Destinations', lambda x: x['path'].startswith('/destinations/')), ('Experiences', lambda x: x['path'].startswith('/experiences/')),
                ('Plan your trip', lambda x: x['path'].startswith('/plan/')), ('Kilimanjaro', lambda x: x['path'].startswith('/kilimanjaro/') and x['type'] != 'trip'),
                ('About', lambda x: x['path'].startswith('/about/')), ('Footer', lambda x: x['nav'] == 'footer')]
    with open(os.path.join(C, 'sitemap.md'), 'w') as f:
        f.write('# New site map\n\nGenerated from `content/` by `tools/build_routes.py` (data: `routes.json`, redirects: `redirects.json`).\n\n')
        for name, test in sections:
            rows = [x for x in r if test(x)]
            f.write(f'## {name}\n\n| Path | Page | Content |\n|---|---|---|\n')
            for x in rows:
                extra = ' *(hidden until confirmed)*' if x.get('status') == 'hidden' else (' *(new page)*' if x.get('note') else '')
                f.write(f"| `{x['path']}` | {x['title']}{extra} | {('`' + x['source'] + '`') if x.get('source') else '—'} |\n")
            f.write('\n')
        f.write(f'## Redirects\n\n{len(rd)} permanent redirects from the old site, listed in `redirects.json`, including the old WordPress URLs and the misspelled Wix slugs.\n')

    # coverage: every old sitemap URL must have a redirect
    old = [l.split()[0] for l in open(os.path.join(ROOT, 'audit/raw/sitemap-urls.txt')) if l.startswith('http')]
    missing = []
    for u in old:
        p = '/' + u.split('mazingirasafari.com', 1)[1].strip('/')
        if p != '/' and p not in rd and p not in paths:
            missing.append(p)
    print(f'{len(r)} routes, {len(rd)} redirects; old sitemap URLs without a redirect: {missing or "none"}')
    if missing:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
