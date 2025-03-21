// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: '/test-web-poker',
  assetPrefix: '/test-web-poker/',
  output: 'export',
}

module.exports = nextConfig
