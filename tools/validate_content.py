"""Validate content/ against content/_schema and check cross-references.

    python3 tools/validate_content.py      # exit 1 on any error
"""
import json, glob, os, sys
from jsonschema import Draft202012Validator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'content')
schema = lambda n: json.load(open(os.path.join(C, '_schema', n + '.schema.json')))
RULES = [('trips/*.json', 'trip'), ('parks/*.json', 'park'), ('experiences/[!_]*.json', 'experience'),
         ('pages/*.json', 'page'), ('team/*.json', 'team-member'), ('site.json', 'site')]

errors, n = [], 0
ids = {}
for pattern, name in RULES:
    v = Draft202012Validator(schema(name))
    for f in sorted(glob.glob(os.path.join(C, pattern))):
        doc, rel = json.load(open(f)), os.path.relpath(f, C)
        n += 1
        for e in v.iter_errors(doc):
            errors.append(f"{rel}: {'/'.join(map(str, e.absolute_path)) or '(root)'}: {e.message}")
        if 'id' in doc:
            if os.path.basename(f)[:-5] != doc['id']:
                errors.append(f'{rel}: id "{doc["id"]}" does not match filename')
            ids.setdefault(name, set()).add(doc['id'])

# cross-references and sanity checks
for f in glob.glob(os.path.join(C, 'trips/*.json')):
    t, rel = json.load(open(f)), os.path.relpath(f, C)
    for a in t.get('add_ons', []):
        if a not in ids.get('experience', set()):
            errors.append(f'{rel}: add_on "{a}" is not an experience')
    if t['status'] == 'published':
        if not t['itinerary']:
            errors.append(f'{rel}: published trip has no itinerary')
        elif max(d['days'][-1] for d in t['itinerary']) != t['duration_days']:
            errors.append(f"{rel}: itinerary ends on day {max(d['days'][-1] for d in t['itinerary'])} but duration_days is {t['duration_days']}")
        tiers = [x['usd_per_person'] for x in t['price']['tiers']]
        if tiers and t['price']['from'] != min(tiers):
            errors.append(f"{rel}: price.from {t['price']['from']} != cheapest tier {min(tiers)}")

# placeholders: warn normally, fail with --strict (use before launch)
ans_path = os.path.join(C, '_review/client-answers.json')
if os.path.exists(ans_path):
    ph = [a['id'] for a in json.load(open(ans_path))['answers'] if a.get('status') != 'confirmed']
    if ph:
        msg = f"{len(ph)} client answers are still placeholders: {', '.join(ph)}"
        (errors.append if '--strict' in sys.argv else print)(('' if '--strict' in sys.argv else 'WARNING: ') + msg)
if '--strict' in sys.argv:
    for f in glob.glob(os.path.join(C, 'trips/*.json')):
        t = json.load(open(f))
        if t['status'] == 'published' and not t['price']['confirmed']:
            errors.append(f"{os.path.relpath(f, C)}: price not confirmed by client")

print(f'{n} files checked')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('OK')
