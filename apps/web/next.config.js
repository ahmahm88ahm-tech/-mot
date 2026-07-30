/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // محفوظ من الإعداد السابق

  compress: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.motanaqil.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // رؤوس أمنية تُطبَّق على كل المسارات
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), camera=(), microphone=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
