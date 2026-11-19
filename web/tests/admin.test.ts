import { describe, expect, it } from 'vitest';
import { STATUS_ORDER, countByStatus } from '../src/lib/admin';

describe('countByStatus', () => {
  it('menghitung per status dan mengisi nol untuk yang kosong', () => {
    const c = countByStatus([{ status: 'draft' }, { status: 'draft' }, { status: 'published' }]);
    expect(c).toEqual({ draft: 2, in_review: 0, published: 1, archived: 0 });
  });
  it('mencakup semua status', () => {
    expect(Object.keys(countByStatus([])).sort()).toEqual([...STATUS_ORDER].sort());
  });
});
