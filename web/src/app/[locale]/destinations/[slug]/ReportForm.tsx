'use client';

import { useActionState } from 'react';
import { submitReport, type ReportState } from './report-action';

export interface ReportLabels {
  h: string;
  body: string;
  message: string;
  contact: string;
  contactHint: string;
  privacy: string;
  submit: string;
  ok: string;
  invalid: string;
  throttled: string;
  error: string;
}

export function ReportForm({ slug, L }: { slug: string; L: ReportLabels }) {
  const [state, action, pending] = useActionState<ReportState, FormData>(submitReport, { status: 'idle' });
  const msg = { ok: L.ok, invalid: L.invalid, throttled: L.throttled, error: L.error, idle: '' }[state.status];

  return (
    <section className="report" aria-labelledby="report-h">
      <h2 id="report-h" className="display">
        {L.h}
      </h2>
      <p className="mono small">{L.body}</p>
      {state.status === 'ok' ? (
        <p className="report-msg report-ok mono" role="status">
          {msg}
        </p>
      ) : (
        <form action={action} className="report-form">
          <input type="hidden" name="slug" value={slug} />
          <label className="mono">
            {L.message}
            <textarea name="message" required minLength={10} maxLength={2000} rows={4} defaultValue={state.message ?? ''} />
          </label>
          <label className="mono">
            {L.contact}
            <input name="contact" type="text" maxLength={200} autoComplete="off" defaultValue={state.contact ?? ''} />
            <small>{L.contactHint}</small>
          </label>
          {/* Kolom jebakan untuk bot: tersembunyi dari pengguna dan pembaca layar. */}
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <p className="mono small">{L.privacy}</p>
          {msg && (
            <p className="report-msg report-err mono" role="alert">
              {msg}
            </p>
          )}
          <button className="pill pill-teal" type="submit" disabled={pending}>
            {L.submit}
          </button>
        </form>
      )}
    </section>
  );
}
