// Loads the platform-neutral content model in ../../../content. Never edit content here;
// see CLAUDE.md for how content changes are made.
const load = (mods: Record<string, unknown>) => Object.values(mods) as any[];

export const trips: any[] = load(import.meta.glob('../../../content/trips/*.json', { eager: true, import: 'default' }));
export const parks: any[] = load(import.meta.glob('../../../content/parks/*.json', { eager: true, import: 'default' }));
export const experiences: any[] = load(import.meta.glob('../../../content/experiences/[!_]*.json', { eager: true, import: 'default' }));
export const team: any[] = load(import.meta.glob('../../../content/team/*.json', { eager: true, import: 'default' }));
export { default as site } from '../../../content/site.json';
export { default as reviews } from '../../../content/reviews.json';

export const published = trips.filter((t) => t.status === 'published');
export const tripById = (id: string) => trips.find((t) => t.id === id);
export const tripPath = (t: any) => `${t.style === 'kilimanjaro' ? '/kilimanjaro' : '/safaris'}/${t.id}`;
export const experienceById = (id: string) => experiences.find((e) => e.id === id);
export const person = (id: string) => team.find((p) => p.id === id);

const MONTH = { jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June', jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December' } as Record<string, string>;
const WORD = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen'];

/** "June to September", from best_time.months (already in season order). */
export function bestMonths(t: any): string | null {
  const m = t.best_time?.months ?? [];
  if (!m.length) return null;
  if (m.length >= 12) return 'All year';
  // split into runs of consecutive months (in the given order, which already handles Nov–Apr wrapping)
  const order = Object.keys(MONTH);
  const runs: string[][] = [];
  for (const k of m) {
    const run = runs[runs.length - 1];
    if (run && (order.indexOf(run[run.length - 1]) + 1) % 12 === order.indexOf(k)) run.push(k);
    else runs.push([k]);
  }
  const say = (r: string[]) => (r.length === 1 ? MONTH[r[0]] : `${MONTH[r[0]]} to ${MONTH[r[r.length - 1]]}`);
  return runs.length === 1 ? say(runs[0]) : runs.slice(0, -1).map(say).join(', ') + ' and ' + say(runs[runs.length - 1]);
}
export const days = (n: number) => `${WORD[n] ?? n} days`;
export const nights = (n: number) => `${n - 1} nights`;
export const usd = (n: number | null | undefined) => (n == null ? '' : '$' + n.toLocaleString('en-GB'));
export const dayLabel = (d: number[]) => (d.length > 1 ? `Days ${d[0]}–${d[1]}` : `Day ${d[0]}`);

/** Prose label used under titles: "Nine days, best June to September". */
export function tripLabel(t: any): string {
  const parts = [days(t.duration_days)];
  if (t.style === 'camping') parts.push('camping');
  const b = bestMonths(t);
  if (b) parts.push(b === 'All year' ? 'any time of year' : `best ${b}`);
  return parts.join(', ');
}

/** WhatsApp link to the named planner, with the trip pre-filled. */
export function whatsapp(text?: string) {
  const n = String(site.contact.whatsapp || site.contact.phone).replace(/\D/g, '');
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
import site from '../../../content/site.json';
