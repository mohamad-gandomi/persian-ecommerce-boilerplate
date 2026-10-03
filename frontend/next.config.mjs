/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
      },
    ],
  },
  // Proxy API requests to NestJS backend seamlessly if requested
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:4000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
