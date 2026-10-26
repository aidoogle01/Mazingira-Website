// Mazingira's own photos, downloaded by tools/fetch_photos.py. Wix stock, lodge marketing images and
// old map graphics are classified in the manifest and never used as page photography.
import type { ImageMetadata } from 'astro';
import manifest from '../assets/photos/manifest.json';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const byFile = (f: string) => files[`../assets/photos/${f}`]?.default;
const entries = Object.entries(manifest.images as Record<string, any>);

export type Photo = { img: ImageMetadata; alt: string };

/** A photo by the start of its file name, e.g. "1ac0ef_16abc605". */
export function photo(prefix: string, alt?: string): Photo {
  const hit = entries.find(([, v]) => v.file.startsWith(prefix));
  if (!hit) throw new Error(`No photo starting ${prefix}`);
  return { img: byFile(hit[1].file)!, alt: alt ?? hit[1].alt };
}

/** Usable photographs for an item from the content model (its images[]), in order. */
export function photosFor(item: { images?: { src: string }[] }): Photo[] {
  return (item.images ?? [])
    .map((i) => (manifest.images as Record<string, any>)[i.src])
    .filter((v) => v && v.kind === 'photo')
    .map((v) => ({ img: byFile(v.file)!, alt: v.alt }));
}

export const teamPhoto = (key: string, alt: string): Photo | null => {
  const f = (manifest.team as Record<string, string>)[key];
  return f ? { img: byFile(f)!, alt } : null;
};
