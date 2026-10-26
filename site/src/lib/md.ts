// Minimal Markdown for the content model's text fields: paragraphs, "- " lists, ### headings, **bold**.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

export function md(src: string | null | undefined): string {
  if (!src) return '';
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) { out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`); list = []; } };
  for (const raw of src.split('\n')) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('- ')) { list.push(line.slice(2)); continue; }
    flush();
    const h = line.match(/^#{1,6}\s+(.*)$/);
    out.push(h ? `<h3>${inline(h[1])}</h3>` : `<p>${inline(line)}</p>`);
  }
  flush();
  return out.join('\n');
}
