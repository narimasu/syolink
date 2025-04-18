/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wlbsxqoevrvrgcurkqjo.supabase.co',
        pathname: '/storage/v1/object/public/artworks/**',
      },
    ],
  }
};

export default nextConfig;