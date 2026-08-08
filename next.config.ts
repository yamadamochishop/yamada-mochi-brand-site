import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Middleware owns trailing-slash normalization so a legacy URL with a
  // trailing slash can redirect straight to its canonical destination.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
