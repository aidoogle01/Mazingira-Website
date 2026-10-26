"""Build the platform-neutral content model in content/ from the captured Wix page data.

    python3 tools/build_content.py

Inputs:  audit/raw/wix-pages/*.json   (Wix page JSON, includes hidden tab/lightbox content)
         audit/raw/pages/*.json       (rendered capture: image URLs, links)
         audit/content/business.json  (audit findings)
Outputs: content/**                   (see content/README.md)
         content/_review/corrections.md, needs-client.md

Re-running regenerates everything under content/ except files listed in KEEP_MANUAL.
"""
import json, re, os, glob, shutil, sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from wix_page_text import blocks, to_md  # noqa: E402

WIX = os.path.join(ROOT, 'audit/raw/wix-pages')
RENDERED = os.path.join(ROOT, 'audit/raw/pages')
OUT = os.path.join(ROOT, 'content')
SOURCE = 'https://www.mazingirasafari.com/'

# ---------------------------------------------------------------- corrections
# Applied to all client-authored copy (never to customer reviews). Each hit is logged.
TYPOS = [
    (r'\bAccomodation\b', 'Accommodation'), (r'\bACCOMODATION\b', 'ACCOMMODATION'),
    (r'\bNogorongoro\b', 'Ngorongoro'), (r'\bARUSHEA\b', 'ARUSHA'), (r'\bTarangerie\b', 'Tarangire'),
    (r'\bLake Mantra\b', 'Lake Manyara'), (r'\bMaasi\b', 'Maasai'), (r'\bPlaning\b', 'Planning'),
    (r"\bSafari's\b", 'Safaris'), (r"\bSafari’s\b", 'Safaris'), (r"\bVisa's\b", 'Visas'), (r"\bsafari's\b", 'safaris'),
    (r'\bFWD vehicle\b', '4x4 vehicle'), (r'\bKilimajoa\b', 'Kilimamoja'), (r'\bLaver Tower\b', 'Lava Tower'),
    (r'\bKatanga (Camp|Gate)\b', r'Karanga \1'), (r'\bparK\b', 'park'), (r'\bKubukubu\b', 'Kubu Kubu'),
    (r'\bklimanajro\b', 'Kilimanjaro'), (r'\bMasai\b', 'Maasai'),
    (r'(Arrival in Arusha)(Your)', r'\1\n\2'), (r'(Departure Day)(Savor)', r'\1\n\2'),
    (r'\s+,', ','), (r'[ \t]{2,}', ' '),
]
LOG = []  # (where, before, after)

def fix(s, where):
    if not isinstance(s, str):
        return s
    for pat, rep in TYPOS:
        new = re.sub(pat, rep, s)
        if new != s and pat not in (r'\s+,', r'[ \t]{2,}'):
            for m in re.finditer(pat, s):
                LOG.append((where, m.group(0), re.sub(pat, rep, m.group(0))))
        s = new
    return s.strip()

NEEDS_CLIENT = defaultdict(list)  # file -> [notes]

def flag(where, note):
    NEEDS_CLIENT[where].append(note)

# ---------------------------------------------------------------- helpers
def wix(slug):
    return json.load(open(os.path.join(WIX, slug + '.json')))

def rendered(slug):
    p = os.path.join(RENDERED, slug.replace('/', '__') + '.json')
    return json.load(open(p)) if os.path.exists(p) else None

def tidy_md(s):
    s = re.sub(r'\n-\s*\n\s*', '\n- ', '\n' + s).strip()      # "-\n\tItem" -> "- Item"
    s = re.sub(r'^#+\s*$', '', s, flags=re.M)                  # empty headings
    return re.sub(r'\n{3,}', '\n\n', s).strip()

def original_image(url):
    """Wix image URL -> original-resolution URL (drops the /v1/fill/... transform)."""
    m = re.match(r'(https://static\.wixstatic\.com/media/[^/]+)', url or '')
    return m.group(1) if m else url

def page_images(slug, limit=None):
    r = rendered(slug)
    if not r:
        return []
    seen, out = set(), []
    for im in r['images']:
        src = original_image(im['src'])
        if 'wixstatic' not in src or src in seen or im.get('w', 0) and im['w'] < 120:
            continue
        if im.get('alt') in ('Instagram', 'Facebook', 'TikTok'):
            continue
        seen.add(src)
        out.append({'src': src, 'alt': fix(im.get('alt') or '', slug)})
    return out[:limit] if limit else out

def write(rel, obj):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
        f.write('\n')

def bullets(text):
    return [re.sub(r'^[•\-\s]+', '', l).strip().rstrip(';').strip() for l in text.split('\n')
            if l.strip() and not re.match(r'^(Package Price|Prices can vary)', l.strip())]

def parse_days(label):
    nums = [int(n) for n in re.findall(r'\d+', label)]
    return (nums[0], nums[-1]) if nums else (None, None)

# ---------------------------------------------------------------- trips
TRIPS = {  # wix page slug -> (new id, style)
    'serengeti-escape-romance-package': ('serengeti-romantic-escape', 'honeymoon'),
    'savannah-to-shore-package': ('savannah-to-shore', 'safari-and-beach'),
    'serengeti-under-the-stars': ('serengeti-under-the-stars', 'camping'),
    'family-safari-package': ('family-wilderness-adventure', 'family'),
    'blank-2': ('honeymoon-safari-and-zanzibar', 'honeymoon'),
    'winged-wonders-package': ('winged-wonders-birding', 'special-interest'),
    'great-migration-package': ('great-migration-river-crossing', 'migration'),
    'wildlife-photography-package': ('wildlife-photography-safari', 'special-interest'),
    'kilimanjaro-packages': ('kilimanjaro-machame-7-day', 'kilimanjaro'),
}
LIVE_URL = {'blank-2': 'packages/honeymoon-package'}
PRICE_ELSEWHERE = {  # from audit: other places the same trip shows a different price
    'serengeti-romantic-escape': {'home_card': 3950, 'packages_listing': 4090},
    'savannah-to-shore': {'home_card': 5495},
    'serengeti-under-the-stars': {'home_card_mobile': 2800},
    'honeymoon-safari-and-zanzibar': {'packages_listing': 8600},
}
MONTHS = 'jan feb mar apr may jun jul aug sep oct nov dec'.split()

def months_from(text):
    t = text.lower().replace('sept', 'sep')
    found = re.findall(r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*', t)
    if len(found) == 2 and ('-' in t or '–' in t):
        a, b = MONTHS.index(found[0]), MONTHS.index(found[1])
        return [MONTHS[(a + i) % 12] for i in range(((b - a) % 12) + 1)]
    return sorted(set(found), key=MONTHS.index)

def build_trip(wslug, tid, style):
    page = wix(wslug)
    bs = blocks(page)
    where = f'trips/{tid}.json'
    pre = [b for b in bs if b['tab'] is None]
    text_of = lambda b: fix(re.sub(r'^#+\s*', '', b['text'], flags=re.M), where)

    # header facts: label/value pairs before the itinerary
    facts, i = {}, 0
    labels = {'BEST TIME TO TRAVEL': 'best_time', 'DURATION': 'duration', 'LOCATIONS': 'locations', 'STARTING POINT': 'start'}
    title = text_of(pre[0]).replace('\n', ' ')
    price_txt = next((b['text'] for b in pre if re.match(r'^#*\s*(from )?\$\d+pp$', b['text'].strip(), re.I)), '')
    basis = next((b['text'] for b in pre if 'based on' in b['text'].lower()), '')
    while i < len(pre):
        t = re.sub(r'^#+\s*', '', pre[i]['text']).strip()
        if t in labels and i + 1 < len(pre):
            facts[labels[t]] = text_of(pre[i + 1]).replace('\n', ' ')
            i += 2
            continue
        i += 1
    itin_idx = next(k for k, b in enumerate(bs) if b['text'].strip().lstrip('# ') == 'ITINERARY')
    description = next(text_of(b) for b in pre if len(b['text']) > 250 and bs.index(b) < itin_idx)

    # itinerary: group blocks by tab label, in order
    tabs, order = defaultdict(list), []
    last_tab = None
    for b in bs[itin_idx + 1:]:
        if re.match(r'^(Package Price|Prices can vary)', b['text']):
            break
        t = b['tab'] or last_tab          # orphan blocks between tabs belong to the previous tab
        if t is None or not re.sub(r'[#\s]', '', b['text']):
            continue
        if t not in tabs:
            order.append(t)
        tabs[t].append(b['text'])
        last_tab = t
    itinerary, seen_ranges = [], set()
    for t in order:
        first, rest = tabs[t][0], tabs[t][1:]
        parts = [re.sub(r'^#+\s*', '', first, flags=re.M)]
        for blk in rest:
            for piece in re.split(r'\n(?=#*\s*(?:Meal Plan|Accom+odation|Destination|Altitude)\s*\n)', '\n' + blk):
                piece = piece.strip()
                if not piece:
                    continue
                piece = re.sub(r'^#+\s*', '', piece, flags=re.M)
                k0, _, v0 = piece.partition('\n')
                if k0.strip() in ('Meal Plan', 'Accommodation', 'Accomodation', 'Destination', 'Altitude'):
                    parts.append(k0.strip())
                    if v0.strip():
                        parts.append(v0.strip())
                else:
                    parts.append(piece)
        d_from, d_to = parse_days(t)
        if (d_from, d_to) in seen_ranges:
            flag(where, f'Wix has a duplicate itinerary tab "{t}"; skipped')
            continue
        seen_ranges.add((d_from, d_to))
        head = fix(parts[0], where)
        m = re.match(r'(Day[^:\n]*):\s*([^\n]*)\n?([\s\S]*)', head)
        heading_label, day_title, body = (m.group(1), m.group(2).strip(), m.group(3).strip()) if m else (t, '', head)
        if m and parse_days(heading_label) != (d_from, d_to):
            flag(where, f'Tab "{t}" content is headed "{heading_label}" on the live site; day numbering taken from the tab')
        if len(day_title) > 80:  # heading and body run together on the live site
            body, day_title = (day_title + '\n' + body).strip(), ''
        if not day_title:
            flag(where, f'{t}: no day title on the live site; needs one')
        fields, k, extra = {}, 1, []
        keymap = {'Meal Plan': 'meal_plan', 'Accommodation': 'accommodation', 'Accomodation': 'accommodation', 'Destination': 'destination_note', 'Altitude': 'altitude'}
        while k < len(parts):
            key = parts[k].strip()
            if key in keymap:
                nxt = parts[k + 1].strip() if k + 1 < len(parts) and parts[k + 1].strip() not in keymap else ''
                fields[keymap[key]] = fix(nxt, where).replace('\n', ' ') or None
                k += 2 if nxt else 1
            else:
                extra.append(fix(parts[k], where))
                k += 1
        if extra:
            fields['destination_note'] = '\n\n'.join(x for x in [fields.get('destination_note')] + extra if x)
        acc = fields.get('accommodation') or ''
        if re.match(r'^(Machame|Shira|Barranco|Karanga|Barafu|Mweka|Millennium)', acc) and len(acc) > 60:
            name, _, note = acc.partition(' -')
            fields['accommodation'] = name.strip()
            fields['accommodation_note'] = note.strip(' -') or None
        itinerary.append({'days': [d_from, d_to] if d_to != d_from else [d_from], 'title': day_title, 'description': tidy_md(body), **fields})

    # price block + includes/excludes
    tail = '\n'.join(b['text'] for b in bs)
    tiers = [{'group_size': g.replace(' people', '').strip(), 'usd_per_person': int(p)} for p, g in re.findall(r'\$(\d+)pp\s+(\d\+? people)', tail)]
    inc = re.search(r'Package Price includes:\s*\n([\s\S]*?)(?=\nPackage Price Does not include|\nPrices can vary|$)', tail)
    exc = re.search(r'Package Price Does not include:\s*\n([\s\S]*?)(?=\nPrices can vary|\nPackage Price includes|$)', tail)
    headline = int(re.search(r'\d+', price_txt).group()) if price_txt else None

    trip = {
        'id': tid,
        'status': 'published',
        'title': title,
        'style': style,
        'summary': None,
        'description': tidy_md(description),
        'duration_days': int(re.search(r'\d+', facts.get('duration', '0')).group()),
        'best_time': {'text': facts.get('best_time'), 'months': months_from(facts.get('best_time', ''))},
        'locations': [x.strip() for x in re.split(r',', facts.get('locations', '')) if x.strip()],
        'start': facts.get('start'),
        'price': {
            'currency': 'USD', 'per': 'person',
            'from': headline,
            'basis': re.sub(r'^\*\s*', '', basis).strip() or None,
            'tiers': tiers,
            'note': 'Prices can vary between seasons' if 'Prices can vary' in tail else None,
            'confirmed': tid not in PRICE_ELSEWHERE,
            'conflicting_prices_on_old_site': PRICE_ELSEWHERE.get(tid),
        },
        'itinerary': itinerary,
        'includes': [fix(x, where) for x in bullets(inc.group(1))] if inc else [],
        'excludes': [fix(x, where) for x in bullets(exc.group(1))] if exc else [],
        'add_ons': [],
        'images': page_images(LIVE_URL.get(wslug, wslug), 8),
        'source': SOURCE + LIVE_URL.get(wslug, wslug),
    }
    if tid in PRICE_ELSEWHERE:
        other = ', '.join(f"${v} ({k.replace('_', ' ')})" for k, v in PRICE_ELSEWHERE[tid].items())
        flag(where, f'Price conflict on old site: trip page ${headline}; also shown as {other}. Confirm current price.')
    covered = max(d['days'][-1] for d in itinerary)
    if covered != trip['duration_days']:
        flag(where, f"Duration says {trip['duration_days']} days but itinerary covers {covered}")
    return trip

# trip-specific corrections that can't be expressed as typo rules
def correct_trip(t):
    w = f"trips/{t['id']}.json"
    if t['id'] == 'wildlife-photography-safari':
        t['duration_days'] = 8
        t['locations'] = ['Arusha', 'Tarangire', 'Serengeti', 'Ngorongoro Crater']
        LOG.append((w, 'DURATION 12 Days; LOCATIONS incl. Zanzibar', '8 days; Arusha, Tarangire, Serengeti, Ngorongoro (from description and itinerary)'))
        flag(w, 'Old site said 12 days and listed Zanzibar; corrected to 8 days / no Zanzibar from the description. Confirm.')
    if t['id'] == 'winged-wonders-birding':
        t['locations'] = ['Arusha', 'Lake Manyara', 'Lake Natron', 'Serengeti', 'Ngorongoro Crater']
        LOG.append((w, 'LOCATIONS: Arusha, Serengeti, Ngorongoro Crater, Zanzibar', 'from itinerary: Arusha, Lake Manyara, Lake Natron, Serengeti, Ngorongoro'))
    if t['id'] == 'serengeti-romantic-escape':
        t['locations'] = [x for x in t['locations'] if x != 'Zanzibar']
        LOG.append((w, 'LOCATIONS incl. Zanzibar', 'Zanzibar removed (5-day trip has no Zanzibar day)'))
    for d in t['itinerary']:
        if d['days'][0] == 1 and not d['title'] and re.search(r'airport|arrival', d['description'], re.I):
            d['title'] = 'Arrival in Arusha'
            LOG.append((w, 'Day 1 (no title)', 'Arrival in Arusha'))
    if t['id'] == 'kilimanjaro-machame-7-day':
        last = t['itinerary'][-1]
        LOG.append((w, f"Day 7 title: {last['title']}", 'Mweka Gate descent (old title was copied from Day 5)'))
        last['title'] = 'Mweka Camp to Mweka Gate'
        last['accommodation_note'], last['accommodation'] = last['accommodation'], None
        flag(w, 'Day 7: old title was a copy of Day 5 ("Karanga Gate, Journey to Barafu Camp"); retitled "Mweka Camp to Mweka Gate". Check the Day 7 description matches the descent.')
        flag(w, 'No short summary on the old site (no listing card); write one.')
    # consistency: places visited in the itinerary vs the "locations" fact
    places = ['Arusha', 'Tarangire', 'Lake Manyara', 'Serengeti', 'Ndutu', 'Ngorongoro', 'Lake Natron', 'Zanzibar', 'Ruaha']
    visited = {p for d in t['itinerary'] for p in places if p.lower() in (d['title'] + ' ' + (d.get('destination_note') or '')).lower()}
    listed = {p for p in places for l in t['locations'] if p.lower() in l.lower()}
    if t['itinerary'] and visited - listed - {'Arusha'}:
        flag(w, f"Itinerary visits {', '.join(sorted(visited - listed - {'Arusha'}))} but locations don't list it")
    if t['itinerary'] and listed - visited - {'Arusha'}:
        flag(w, f"Locations list {', '.join(sorted(listed - visited - {'Arusha'}))} but no itinerary day goes there")
    t['summary'] = SUMMARIES.get(t['id'])
    t['add_ons'] = ADD_ONS.get(t['id'], [])
    return t

SUMMARIES = {}   # filled from listing cards below
ADD_ONS = {
    'serengeti-romantic-escape': ['balloon-safari', 'sunset-picnic'],
    'savannah-to-shore': ['balloon-safari', 'maasai-village'],
    'serengeti-under-the-stars': ['balloon-safari', 'maasai-village'],
    'family-wilderness-adventure': ['maasai-village'],
    'honeymoon-safari-and-zanzibar': ['sunset-picnic'],
    'great-migration-river-crossing': ['balloon-safari'],
    'wildlife-photography-safari': ['balloon-safari', 'maasai-village', 'night-game-drive'],
}

def listing_summaries():
    """Short card text from /safari-packages: {normalised title: summary}."""
    bs = [b['text'] for b in blocks(wix('safari-packages'))]
    out = {}
    for i, t in enumerate(bs):
        if not re.match(r'^\d+ DAYS FROM', t):
            continue
        title = next(bs[j] for j in range(i - 1, -1, -1) if bs[j].startswith('#'))
        near = [x for x in bs[max(0, i - 2): i + 2] if len(x) > 120 and not x.startswith('#')]
        if near:
            out[norm_title(title)] = near[0]
    return out

def norm_title(t):
    return re.sub(r'[^a-z0-9]', '', re.sub(r'^#+', '', t).lower())[:14]


# ---------------------------------------------------------------- parks
PARKS = {
    'the-serengeti': 'serengeti', 'ngorogoro-national-park': 'ngorongoro', 'lake-manyara': 'lake-manyara',
    'tarangire-national-park': 'tarangire', 'ruaha-national-park': 'ruaha', 'arusha-national-park': 'arusha',
    'kilimanjaro-national-park': 'kilimanjaro',
}

PARK_NAMES = {'serengeti': 'Serengeti National Park', 'ngorongoro': 'Ngorongoro Conservation Area', 'lake-manyara': 'Lake Manyara National Park',
              'tarangire': 'Tarangire National Park', 'ruaha': 'Ruaha National Park', 'arusha': 'Arusha National Park',
              'kilimanjaro': 'Kilimanjaro National Park'}

def labelled_list(md, start_pat, stop_pat):
    m = re.search(start_pat + r'[^\n]*\n([\s\S]*?)(?=' + stop_pat + r'|\Z)', md, re.I)
    if not m:
        return []
    out = []
    for line in m.group(1).split('\n'):
        line = line.strip().lstrip('- ').strip()
        if ':' in line:
            k, v = line.split(':', 1)
            out.append({'name': k.strip(), 'note': v.strip(' .') + '.' if v.strip(' .') else None})
        elif line and not line.startswith('#'):
            out.append({'name': line.rstrip('.'), 'note': None})
    return out

def build_park(wslug, pid):
    where = f'parks/{pid}.json'
    md = tidy_md(fix('\n\n'.join(b['text'] for b in blocks(wix(wslug))), where))
    title = md.split('\n', 1)[0].lstrip('# ').strip()
    intro_end = re.search(r'\nIMPORTANT FACTS', md)
    body = md[len(md.split('\n', 1)[0]):intro_end.start() if intro_end else len(md)].strip()
    travel = re.search(r'TRAVEL TIME[^\n]*\n([\s\S]*?)(?=\n[A-Z][^\n]{40,}|\nIMPORTANT FACTS|\Z)', md)
    travel_times = [l.strip().lstrip('- ').strip() for l in (travel.group(1) if travel else '').split('\n') if ':' in l]
    if travel:
        body = body.replace(travel.group(0), '').strip()
    facts_intro = re.search(r'IMPORTANT FACTS\s*\n([^\n]+)', md)
    return {
        'id': pid,
        'title': PARK_NAMES[pid],
        'old_title': title,
        'summary': None,
        'body': re.sub(r'^#+ ', '### ', body, flags=re.M),
        'facts_intro': facts_intro.group(1).strip() if facts_intro else None,
        'wildlife': labelled_list(md, r'(?:Most )?Prominent Wildlife', r'\nNoteworthy Facts'),
        'noteworthy': labelled_list(md, r'Noteworthy Facts', r'\n#|\nTRAVEL TIME|\nA visit to'),
        'travel_times': travel_times,
        'images': page_images(wslug, 10),
        'source': SOURCE + wslug,
    }

# ---------------------------------------------------------------- generic pages
def page_md(wslug, where, drop=()):
    md = tidy_md(fix('\n\n'.join(b['text'] for b in blocks(wix(wslug)) if b['text'].strip() not in drop), where))
    return md

ACTIVITIES = {  # wix slug -> id
    'balloon-safaris': 'balloon-safari', 'night-time-game-drives': 'night-game-drive', 'walking-safaris': 'walking-safari',
    'maasai-village': 'maasai-village', 'sunset-picnics': 'sunset-picnic', 'tented-safari': 'tented-camping',
}
GUIDES = {  # wix slug -> (id, section)
    'about-tanzania': ('about-tanzania', 'plan'), 'travel-guide': ('travel-guide', 'plan'), 'visa-info': ('visas-and-entry', 'plan'),
    'what-to-pack': ('what-to-pack', 'plan'), 'big-5': ('big-five', 'wildlife'), 'kilimanjaro': ('kilimanjaro', 'kilimanjaro'),
    'kilimanjaro-routes': ('kilimanjaro-routes', 'kilimanjaro'), 'kilimanjaro-packing-guide': ('kilimanjaro-packing-list', 'kilimanjaro'),
    'who-is-mazingira': ('about-us', 'about'), 'terms-and-condition-payment-process': ('booking-process', 'about'),
    'terms-conditions': ('terms-and-conditions', 'legal'), 'accessibility-statement': ('accessibility', 'legal'),
    'accommodation': ('accommodation', 'plan'),
}
BLOG_KEEP = {'best-time-to-visit-tanzania-for-a-safari', 'how-to-plan-the-perfect-safari-honeymoon-in-tanzania-and-zanzibar'}
CTA_NOISE = {'ENQUIRE NOW', 'CONTACT US', 'Contact Us', 'More Information', 'READ MORE . .', 'READ MORE', 'Home', 'SAMPLE ITINERARY',
             'ROUTES', 'PACKING GUIDE', 'TERMS & CONDITIONS', 'OFFICIAL VISA APPLICATIONS', 'VIEW ACCOMMODATION', 'VIEW ACCOMODATION', 'Learn More'}

def main():
    if os.path.isdir(OUT):
        for d in ['trips', 'parks', 'experiences', 'pages', 'team', '_review']:
            shutil.rmtree(os.path.join(OUT, d), ignore_errors=True)
    os.makedirs(OUT, exist_ok=True)

    # trips
    cards = listing_summaries()
    trips = []
    for ws, (tid, style) in TRIPS.items():
        t = build_trip(ws, tid, style)
        SUMMARIES[tid] = fix(cards.get(norm_title(t['title']), ''), f'trips/{tid}.json') or None
        trips.append(correct_trip(t))
    trips.append({
        'id': 'wild-wonders-serengeti-tarangire-ruaha', 'status': 'hidden', 'title': 'Wild Wonders: A Safari Across Serengeti, Tarangire, and Ruaha',
        'style': 'safari', 'summary': 'Embark on a thrilling 10-day safari across Tanzania, exploring the Serengeti, Tarangire, and Ruaha National Park. Experience diverse ecosystems, encounter the Big Five, and enjoy breathtaking landscapes with expert guides on this unforgettable adventure.',
        'description': None, 'duration_days': 10, 'best_time': None, 'locations': ['Serengeti', 'Tarangire', 'Ruaha'], 'start': None,
        'price': {'currency': 'USD', 'per': 'person', 'from': 7500, 'basis': None, 'tiers': [], 'note': None, 'confirmed': False, 'conflicting_prices_on_old_site': None},
        'itinerary': [], 'includes': [], 'excludes': [], 'add_ons': [], 'images': [],
        'source': 'https://mazingirasafariuk.my.canva.site/maintenance',
    })
    flag('trips/wild-wonders-serengeti-tarangire-ruaha.json', 'Hidden: listed at $7,500 on the old site with no page. Client to confirm whether it is still sold and supply the itinerary.')
    for t in trips:
        write(f"trips/{t['id']}.json", t)

    # shared inclusions: the lines most trips share
    counts = defaultdict(int)
    for t in trips:
        for x in set(t['includes']):
            counts[x] += 1
    write('shared/standard-inclusions.json', {
        'note': 'Lines included in at least 5 safari packages on the old site. Trips list their own includes; use this to keep wording consistent.',
        'includes': sorted([x for x, n in counts.items() if n >= 5], key=lambda x: -counts[x]),
    })

    # parks
    for ws, pid in PARKS.items():
        write(f'parks/{pid}.json', build_park(ws, pid))

    # experiences (activities)
    hub = [b['text'] for b in blocks(wix('activities'))]
    for ws, aid in ACTIVITIES.items():
        where = f'experiences/{aid}.json'
        md = page_md(ws, where, CTA_NOISE)
        title, _, body = md.partition('\n')
        write(f'experiences/{aid}.json', {'id': aid, 'title': title.lstrip('# ').strip(), 'summary': None, 'body': body.strip(),
                                           'images': page_images(ws, 6), 'source': SOURCE + ws})
    write('experiences/_hub-cards.json', {'note': 'Card text from the old /activities page. The "Romantic Sunset Picnic" card reused the night-drive text there; it is not reused here.',
                                          'cards': [fix(x, 'experiences/_hub-cards.json') for x in hub if len(x) > 120 and 'nighttime game drive' not in x.lower() or 'Night Game Drive' in x]})
    flag('experiences/sunset-picnic.json', 'Old /activities card used the night-drive description for the sunset picnic; write a proper card summary.')

    # guide / info pages
    for ws, (gid, section) in GUIDES.items():
        where = f'pages/{gid}.json'
        md = page_md(ws, where, CTA_NOISE)
        if gid == 'terms-and-conditions':
            md = re.sub(r'Bank Details:[\s\S]*?(?=\nPayment Schedule)', '', md)
            md = md.replace('payments can be made via bank transfer using the following details:',
                            'payments can be made by bank transfer. Bank details are provided with your written quote; always confirm them with us by phone before paying.')
            LOG.append((where, 'Bank account details published on page', 'Removed; replaced with "provided with your written quote" (decision 07)'))
            flag(where, 'Bank details removed per decision. Confirm legal entity name and payment process wording.')
        if gid == 'accessibility':
            md = md.replace('P.O. Box 12345', 'P.O. Box 12544')
            LOG.append((where, 'P.O. Box 12345', 'P.O. Box 12544 (matches footer and contact page)'))
            flag(where, 'Rewrite once the new site is audited against WCAG 2.1 AA; current claims are not met by the old site.')
        title, _, body = md.partition('\n')
        write(f'pages/{gid}.json', {'id': gid, 'section': section, 'title': title.lstrip('# ').strip(), 'body': body.strip(),
                                    'images': page_images(ws, 6), 'source': SOURCE + ws})

    # blog: keep two as evergreen guides
    for p in glob.glob(os.path.join(RENDERED, 'post__*.json')):
        d = json.load(open(p))
        slug = os.path.basename(p)[6:-5]
        if slug not in BLOG_KEEP:
            continue
        txt = d['text'].split('min read', 1)[-1]
        txt = re.split(r'\n\d+ views|\nRecent Posts', txt)[0]
        txt = re.sub(r'^\s*Updated:[^\n]*', '', txt.strip())
        where = f'pages/{slug}.json'
        write(f'pages/{slug}.json', {'id': slug, 'section': 'plan', 'title': fix(d['title'], where), 'body': tidy_md(fix(txt, where)),
                                     'images': page_images('post__' + slug, 4), 'source': d['url']})

    # FAQs
    faqs = json.load(open(os.path.join(ROOT, 'audit/content/faqs.json')))
    write('faqs.json', [{'q': fix(f['q'], 'faqs.json').replace(' ?', '?'), 'a': fix(f['a'], 'faqs.json')} for f in faqs])

    # team: names/roles from Meet the Team, bios from the lightbox pages
    roster = json.load(open(os.path.join(ROOT, 'audit/content/team.json')))
    bios = {}
    for p in glob.glob(os.path.join(WIX, '*.json')):
        d = json.load(open(p))
        if d['pageUriSEO'].startswith('copy-of-') or d['pageUriSEO'] == 'popup-x6mms':
            bios[d['title'].strip().lower()] = page_md(d['pageUriSEO'], 'team')
    for m in roster:
        key = next((k for k in bios if k.split()[0] in m['name'].lower()), None)
        tid = re.sub(r'[^a-z]+', '-', m['name'].lower().split('(')[0]).strip('-')
        write(f'team/{tid}.json', {'id': tid, 'name': re.sub(r'\s+', ' ', m['name']).replace('Jacob. S', 'Jacob S.').strip(),
                                    'role': re.sub(r'\s*,\s*', ', ', m['role'].strip()), 'bio': bios.get(key), 'photo': None})
        if not bios.get(key):
            flag(f'team/{tid}.json', 'No bio on old site')

    # reviews
    t = json.load(open(os.path.join(ROOT, 'audit/content/testimonials.json')))
    write('reviews.json', {
        'aggregate': [
            {'source': 'TripAdvisor', 'url': 'https://www.tripadvisor.com/Attraction_Review-g297913-d10022127-Reviews-Mazingira_Safari-Arusha_Arusha_Region.html', 'rating': None, 'count': None},
            {'source': 'SafariBookings', 'url': 'https://www.safaribookings.com/p1823', 'rating': 5.0, 'count': 81, 'checked': 'search snippet 2026-10-26, verify'},
        ],
        'featured': [{**r, 'source': None, 'trip': None, 'date': None} for r in t['on_site']],
    })
    flag('reviews.json', 'Fill TripAdvisor rating/count; get permission to quote recent reviews with source and date.')

    # lodges: accommodation page cards + every lodge named in an itinerary
    acc = [b['text'] for b in blocks(wix('accommodation'))]
    links = {l['text']: l['href'] for l in rendered('accommodation')['links']}
    lodges = {}
    for t in trips:
        for d in t['itinerary']:
            a = d.get('accommodation')
            if a and not re.match(r'^(No |Machame|Shira|Barranco|Karanga|Barafu|Mweka|Millennium)', a):
                for name in re.split(r'\s+or\s+|\s*/\s*', a):
                    name = re.sub(r'^\d\*\s*', '', name).strip()
                    lodges.setdefault(name, {'name': name, 'area': None, 'description': None, 'url': None, 'used_in': []})['used_in'].append(t['id'])
    write('lodges.json', {'note': 'Old site claims 60+ inspected lodges; these are the ones named on it. Area/description filled where the accommodation page had them.',
                          'raw_accommodation_page_blocks': [fix(x, 'lodges.json') for x in acc if x.strip() not in CTA_NOISE],
                          'lodges': sorted(({**v, 'used_in': sorted(set(v['used_in']))} for v in lodges.values()), key=lambda x: x['name'])})

    # business / site settings
    b = json.load(open(os.path.join(ROOT, 'audit/content/business.json')))
    write('site.json', {
        'name': 'Mazingira Safari',
        'legal_name': None,
        'tagline': 'Eco-Friendly Safari Adventures',
        'meaning': "'Mazingira' means 'environment' in Swahili.",
        'founded': 2007,
        'base': 'Arusha, Tanzania',
        'contact': {
            'email': 'info@mazingirasafari.com', 'email_uk_sales': 'uk.sales@mazingirasafari.com',
            'phone': '+255784278205', 'phone_alt': '+255767278204', 'whatsapp': None,
            'address': {'line1': 'Mazingira Eco Friendly Safari Adventure', 'locality': 'Arusha', 'po_box': '12544', 'country': 'Tanzania', 'street': None},
        },
        'social': b['social'],
        'memberships': ['TATO (Tanzania Association of Tour Operators)'],
        'badges': [{'name': "TripAdvisor Travellers' Choice", 'year': 2020}],
        'booking_terms': {'deposit_pct': 30, 'second_payment_pct': 40, 'second_payment_due': '8 weeks before travel', 'balance_pct': 30,
                          'balance_due': '30 days before travel', 'full_payment_if_within_days': 40,
                          'cancellation': [{'days_before': '61+', 'fee_pct': 20}, {'days_before': '45-60', 'fee_pct': 50},
                                           {'days_before': '31-44', 'fee_pct': 70}, {'days_before': '0-30', 'fee_pct': 100}]},
    })
    for n in ['legal_name: account holder on old site is "Local Safari Guide Promotion Ltd"; confirm the legal entity',
              'whatsapp: number needed (decision: add WhatsApp)', 'founded: 2007 is from SafariBookings; confirm',
              'contact.address.street: confirm (search snippets say Moshi Arusha Road)', 'badges: 2020 Travellers\' Choice; any newer awards?',
              'phone_alt: only shown in old footer; still in use?']:
        flag('site.json', n)

    # review files
    os.makedirs(os.path.join(OUT, '_review'), exist_ok=True)
    with open(os.path.join(OUT, '_review/corrections.md'), 'w') as f:
        f.write('# Corrections applied to the old site\'s copy\n\nGenerated by `tools/build_content.py`. Customer reviews are never edited.\n\n| File | Old | New |\n|---|---|---|\n')
        for where, a, c in sorted(set(LOG)):
            f.write(f"| `{where}` | {a.replace('|', '/').replace(chr(10), ' ')} | {c.replace('|', '/').replace(chr(10), ' ')} |\n")
    with open(os.path.join(OUT, '_review/needs-client.md'), 'w') as f:
        f.write('# Needs the client\n\nItems in the content model that can\'t be finalised without Mazingira. Generated by `tools/build_content.py`.\n\n')
        for where in sorted(NEEDS_CLIENT):
            f.write(f'## `{where}`\n' + ''.join(f'- [ ] {n}\n' for n in dict.fromkeys(NEEDS_CLIENT[where])) + '\n')
    print(f'{len(trips)} trips, {len(PARKS)} parks, {len(ACTIVITIES)} experiences, {len(GUIDES)} pages; '
          f'{len(set(LOG))} corrections; {sum(len(v) for v in NEEDS_CLIENT.values())} client items')

if __name__ == '__main__':
    main()
