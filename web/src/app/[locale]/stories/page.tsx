import { redirect } from 'next/navigation';

// Halaman ini tidak dipakai lagi (situs kini enam rekomendasi); arahkan ke beranda.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
