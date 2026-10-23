/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['rss-parser'],
  },
  images: {
    // Photos published on kansascitydefender.com
    remotePatterns: [{ protocol: 'https', hostname: 'd2yj79r0roqbdr.cloudfront.net' }],
  },
};

export default nextConfig;
