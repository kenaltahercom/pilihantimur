import { describe, expect, it } from 'vitest';
import { bestDocStatus, classifyUrl } from '../src/lib/sources/trust';
import { validateDestination, type DestinationInput } from '../src/lib/destination-form';

describe('classifyUrl', () => {
  it('situs pemerintah = P1', () => {
    expect(classifyUrl('https://disparbud.nttprov.go.id/x').docStatus).toBe('P1');
    expect(classifyUrl('https://www.kemenparekraf.go.id/a').tier).toBe('official');
  });
  it('tidak tertipu domain menyerupai .go.id', () => {
    expect(classifyUrl('https://evil.go.id.example.com/').tier).toBe('other');
    expect(classifyUrl('https://notgo.id/').tier).toBe('other');
  });
  it('media/direktori = P2, sosial/lainnya = P3', () => {
    expect(classifyUrl('https://www.kompas.com/a').docStatus).toBe('P2');
    expect(classifyUrl('https://id.wikipedia.org/wiki/X').tier).toBe('directory');
    expect(classifyUrl('https://www.instagram.com/p/1').docStatus).toBe('P3');
    expect(classifyUrl('https://blogsaya.example/').docStatus).toBe('P3');
  });
  it('bestDocStatus memilih yang tertinggi, P0 bila kosong', () => {
    expect(bestDocStatus([])).toBe('P0');
    expect(bestDocStatus(['https://x.example', 'https://a.go.id'])).toBe('P1');
    expect(bestDocStatus(['https://x.example'])).toBe('P3');
  });
});

const empty = { summary: '', description: '', access_notes: '', tips: '' };
const base: DestinationInput = { access: 'A', doc_status: 'P1', latitude: '', longitude: '', id: empty, en: empty };

describe('validateDestination', () => {
  it('koordinat harus berpasangan dan dalam rentang', () => {
    expect(validateDestination(base)).toEqual({ ok: true, latitude: null, longitude: null });
    expect(validateDestination({ ...base, latitude: '-8,49', longitude: '119.88' })).toEqual({ ok: true, latitude: -8.49, longitude: 119.88 });
    expect(validateDestination({ ...base, latitude: '-8.49' }).ok).toBe(false);
    expect(validateDestination({ ...base, latitude: '95', longitude: '1' }).ok).toBe(false);
    expect(validateDestination({ ...base, latitude: 'abc', longitude: '1' }).ok).toBe(false);
  });
  it('menolak nilai enum dan teks terlalu panjang', () => {
    expect(validateDestination({ ...base, access: 'Z' }).ok).toBe(false);
    expect(validateDestination({ ...base, doc_status: 'P9' }).ok).toBe(false);
    expect(validateDestination({ ...base, id: { ...empty, summary: 'a'.repeat(301) } }).ok).toBe(false);
  });
});
