// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
  serverExternalPackages: ['@prisma/client'],
  outputFileTracingIncludes: {
    '**': ['./prisma/**/*'],
  },
}

export default nextConfig