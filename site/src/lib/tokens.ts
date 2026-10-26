// CSS custom properties from the design system's tokens.json (light theme; the site is light-only).
import tokens from '../../../design/system/tokens.json';

const val = (v: any) => (typeof v === 'string' ? v : v.light);
const ref = (v: string) => v.replace(/^\{(.+)\}$/, 'var(--$1)');

export function tokensCss(): string {
  const lines: string[] = [];
  for (const t of tokens.color.tokens) lines.push(`--${t.name}: ${ref(val(t.value))};`);
  for (const fam of ['spacing', 'radius', 'shadow'] as const) for (const t of (tokens as any)[fam].tokens) lines.push(`--${t.name}: ${val(t.value)};`);
  for (const [k, v] of Object.entries(tokens.type.families)) lines.push(`--font-${k}: ${v};`);
  return `:root{${lines.join('')}}`;
}
