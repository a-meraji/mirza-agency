/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ['mongoose', 'mongodb', 'aws4'],
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Add support for MongoDB and Mongoose
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'mongodb': require.resolve('mongodb'),
      'mongoose': require.resolve('mongoose'),
      'aws4': require.resolve('aws4'),
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      'buffer': require.resolve('buffer'),
      'util': require.resolve('util'),
    };
    return config;
  },
  // Add Turbopack configuration
  experimental: {
    turbo: {
      resolveAlias: {
        'mongoose': 'mongoose',
        'aws4': 'aws4',
      },
    },
  },
//  reactStrictMode: true, // Ensure React Strict Mode is enabled
};

module.exports = nextConfig
