/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config();
const apiRewrite = {
  source: '/api/:path*',
  destination: process.env.API_URL || 'http://localhost:5000/api/:path*'
};
const nextConfig = {
  async rewrites() {
    return [
      apiRewrite,
    ];
  },
};

console.log('API_URL', process.env.API_URL);
console.log('Rewrites configuration:', JSON.stringify(apiRewrite, null, 2));

export default nextConfig;
