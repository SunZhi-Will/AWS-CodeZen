import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['idol-multimodal-output.s3.us-west-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'idol-multimodal-output.s3.us-west-2.amazonaws.com',
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
