export const STATUS_ORDER = ['draft', 'in_review', 'published', 'archived'] as const;
export type ContentStatus = (typeof STATUS_ORDER)[number];

export interface DestinationRow {
  slug: string;
  name: string;
  kabupaten: string;
  access: 'A' | 'B' | 'C';
  doc_status: string;
  status: ContentStatus;
  verified_at: string | null;
}

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: 'Draf',
  in_review: 'Menunggu pemeriksaan',
  published: 'Terbit',
  archived: 'Arsip',
};

export function countByStatus(rows: Pick<DestinationRow, 'status'>[]): Record<ContentStatus, number> {
  const out: Record<ContentStatus, number> = { draft: 0, in_review: 0, published: 0, archived: 0 };
  for (const r of rows) out[r.status] += 1;
  return out;
}
