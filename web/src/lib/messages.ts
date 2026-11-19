import { getMessages } from 'next-intl/server';
import type idMessages from '../../messages/id.json';

/** Bentuk pesan (ID dan EN harus identik; dijaga oleh tests/messages.test.ts). */
export type Messages = typeof idMessages;

/** Pesan untuk locale request saat ini, bertipe penuh. */
export async function getMsgs(): Promise<Messages> {
  return (await getMessages()) as unknown as Messages;
}

/** Isi placeholder {n} pada pesan hasil konversi fungsi prototype. */
export const fill = (tpl: string, n: number): string => tpl.replace('{n}', String(n));
