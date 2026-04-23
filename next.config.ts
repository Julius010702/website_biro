// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
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