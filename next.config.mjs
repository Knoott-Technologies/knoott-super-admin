/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "dxzpvgabvrkuizxgtzdt.supabase.co",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
