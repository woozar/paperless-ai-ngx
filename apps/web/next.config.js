import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler (Next.js 16 feature)
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
