import { CATEGORIES, REGIONS, type CategoryKey, type Destination, type Lang, type RegionId } from './data';

export const pad = (n: number): string => String(n).padStart(2, '0');

export const kindOf = (d: Destination): string => d.category ?? 'generic';

export const regionName = (id: RegionId, lang: Lang): string => {
  const r = REGIONS.find((x) => x.id === id);
  return r ? r[`${lang}_name`] : id;
};

export const categoryName = (c: CategoryKey | null, lang: Lang, uncat: string): string => (c ? CATEGORIES[c][lang] : uncat);

export const asLang = (l: string): Lang => (l === 'en' ? 'en' : 'id');
