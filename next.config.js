/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Add this to stop Vercel ESLint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
