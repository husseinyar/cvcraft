
import type {NextConfig} from 'next';

// Security Headers configuration
const securityHeaders = [
  // Prevents browsers from incorrectly guessing content types.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Prevents the site from being embedded in iframes on other sites (clickjacking protection).
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // A basic Content Security Policy to prevent a wide range of injection attacks.
  // This can be made more restrictive as needed.
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * blob: data:; media-src 'none'; connect-src *; font-src 'self';",
  },
];

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'studio--cv-craft-h1bob.us-central1.hosted.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
