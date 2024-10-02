/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://shopping-backend:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
