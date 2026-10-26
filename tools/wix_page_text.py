"""Extract a Wix page's content from its page JSON (https://<site>/sites/<pageJsonFileName>.json.z).

Wix keeps every text block in data.document_data, and the component tree in structure.
Walking the tree in order gives the page's text *including content hidden in tabs, slideshows
and lightboxes*, which a rendered-browser capture misses.

    python3 wix_page_text.py page.json            # Markdown-ish text
    python3 wix_page_text.py page.json --tree     # component tree with text
"""
import json, re, html, sys

def to_md(h):
    h = re.sub(r'<h([1-6])[^>]*>', lambda m: '\n' + '#' * int(m.group(1)) + ' ', h)
    h = re.sub(r'<li[^>]*>', '\n- ', h)
    h = re.sub(r'<br\s*/?>|</p>|</h\d>|</li>', '\n', h)
    h = re.sub(r'<[^>]+>', '', h)
    h = html.unescape(h).replace('​', '').replace('\xa0', ' ')
    h = re.sub(r'[ \t]+\n', '\n', h)
    return re.sub(r'\n\s*\n+', '\n', h).strip()

def blocks(page):
    """Yield dicts {type, tab, text} in document order. `tab` is the label of the enclosing SingleTab, if any."""
    docs = page['data'].get('document_data', {})
    out = []
    def rec(c, tab):
        short = c.get('componentType', c.get('type', '')).split('.')[-1]
        item = docs.get(c.get('dataQuery', '').lstrip('#'), {})
        if short == 'SingleTab':
            tab = (item.get('label') or item.get('title') or '').strip() or c.get('id')
        txt = to_md(item['text']) if isinstance(item.get('text'), str) else ''
        if txt:
            out.append({'type': short, 'tab': tab, 'text': txt})
        for ch in c.get('components', []):
            rec(ch, tab)
    rec(page['structure'], None)
    return out

if __name__ == '__main__':
    page = json.load(open(sys.argv[1]))
    for b in blocks(page):
        if '--tree' in sys.argv:
            print(f"[{b['type']}|{b['tab']}] " + b['text'][:100].replace('\n', ' / '))
        else:
            print(b['text'] + '\n')
