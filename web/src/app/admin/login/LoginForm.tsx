'use client';

import { useActionState } from 'react';
import { signIn } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form className="adm-form" action={action}>
      <h1>Masuk admin</h1>
      {state?.error && (
        <p className="adm-err" role="alert">
          {state.error}
        </p>
      )}
      <label>
        Email
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Kata sandi
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="adm-btn solid" type="submit" disabled={pending}>
        {pending ? 'Memeriksa…' : 'Masuk'}
      </button>
    </form>
  );
}
