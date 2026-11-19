// Validasi laporan koreksi dari pengunjung (fungsi murni, mudah diuji).

export const REPORT_LIMITS = { messageMin: 10, messageMax: 2000, contactMax: 200 } as const;
export const REPORT_STATUS = ['open', 'reviewing', 'resolved', 'rejected'] as const;
export type ReportStatus = (typeof REPORT_STATUS)[number];
export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: 'Baru',
  reviewing: 'Diperiksa',
  resolved: 'Selesai',
  rejected: 'Ditolak',
};
export const NOTE_MAX = 1000;

export interface ReportInput {
  slug: string;
  message: string;
  contact?: string;
  website?: string; // kolom jebakan (honeypot): manusia tidak melihatnya, bot biasanya mengisi
}

export type ReportCheck =
  | { ok: true; value: { slug: string; message: string; contact: string | null } }
  | { ok: false; code: 'invalid' | 'spam' };

/** Membuang karakter kontrol (kecuali baris baru) dan merapikan spasi. */
const clean = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export function validateReport(raw: ReportInput, validSlugs: ReadonlySet<string>): ReportCheck {
  if ((raw.website ?? '').trim() !== '') return { ok: false, code: 'spam' };
  const slug = (raw.slug ?? '').trim();
  if (!validSlugs.has(slug)) return { ok: false, code: 'invalid' };
  const message = clean(raw.message ?? '');
  if (message.replace(/\s/g, '').length < REPORT_LIMITS.messageMin || message.length > REPORT_LIMITS.messageMax)
    return { ok: false, code: 'invalid' };
  const contact = clean(raw.contact ?? '').replace(/\n/g, ' ');
  if (contact.length > REPORT_LIMITS.contactMax) return { ok: false, code: 'invalid' };
  return { ok: true, value: { slug, message, contact: contact || null } };
}

export const isReportStatus = (s: unknown): s is ReportStatus => (REPORT_STATUS as readonly unknown[]).includes(s);
