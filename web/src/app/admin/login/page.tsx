import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getClaims();
    if (data?.claims) redirect('/admin');
  }
  return (
    <main>
      <LoginForm />
    </main>
  );
}
