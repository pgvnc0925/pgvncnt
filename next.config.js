/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Exclude template folders from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/files+sito/**', '**/pv-app-template/**', '**/evaluation form/**'],
    };
    return config;
  },
}

module.exports = nextConfig
