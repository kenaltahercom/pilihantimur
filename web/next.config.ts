import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Unggah foto lewat Server Action (batas bucket 5 MB + sedikit ruang untuk isian formulir).
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
};

export default withNextIntl(nextConfig);
