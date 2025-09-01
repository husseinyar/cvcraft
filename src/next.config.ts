
import type {NextConfig} from 'next';


// ✅ Updated Security Headers configuration
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com;
      style-src 'self' 'unsafe-inline';
      img-src * blob: data:;
      media-src 'none';
      connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      frame-src 'self' https://www.gstatic.com https://apis.google.com;
      base-uri 'self';
    `.replace(/\s{2,}/g, ' ').trim(),
  },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;