// next.config.js
/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-src 'self' https://www.google.com https://maps.google.com",
    ].join('; '),
  },
]
const nextConfig = {
  serverExternalPackages: ['jose'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      // Yahoo Images
      {
        protocol: 'https',
        hostname: 'id.images.search.yahoo.com',
      },
      // Tribunnews / asset CDN
      {
        protocol: 'https',
        hostname: 'asset.tribunnews.com',
      },
      {
        protocol: 'https',
        hostname: '**.tribunnews.com',
      },
      // UploadThing (untuk upload gambar kamu)
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
      },
      // Neon / storage lain
      {
        protocol: 'https',
        hostname: '**',  // wildcard semua domain - pakai ini kalau mau simple
      },
    ],
  },
}

module.exports = nextConfig