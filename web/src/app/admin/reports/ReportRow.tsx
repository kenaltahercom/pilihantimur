'use client';

import { useState, useTransition } from 'react';
import { REPORT_STATUS, REPORT_STATUS_LABEL, type ReportStatus } from '@/lib/report';
import { updateReport } from './actions';

export function ReportRow({ id, status, note }: { id: string; status: ReportStatus; note: string }) {
  const [s, setS] = useState<ReportStatus>(status);
  const [n, setN] = useState(note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="adm-row"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        start(async () => {
          const r = await updateReport(id, s, n);
          setMsg({ ok: r.ok, text: r.ok ? r.message : r.error });
        });
      }}
    >
      <label>
        Status
        <select value={s} onChange={(e) => setS(e.target.value as ReportStatus)}>
          {REPORT_STATUS.map((x) => (
            <option key={x} value={x}>
              {REPORT_STATUS_LABEL[x]}
            </option>
          ))}
        </select>
      </label>
      <label style={{ flex: 1, minWidth: '14rem' }}>
        Catatan penanganan (internal)
        <input value={n} maxLength={1000} onChange={(e) => setN(e.target.value)} />
      </label>
      <button className="adm-btn solid" type="submit" disabled={pending}>
        {pending ? 'Menyimpan…' : 'Simpan'}
      </button>
      {msg && (
        <span role={msg.ok ? 'status' : 'alert'} className={msg.ok ? 'adm-hint' : 'adm-err'}>
          {msg.text}
        </span>
      )}
    </form>
  );
}
