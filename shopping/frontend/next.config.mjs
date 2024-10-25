/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
  skipTrailingSlashRedirect: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:5001/'}:path*`,
      }
    ];
  },
  output: "standalone",
};

export default nextConfig;
