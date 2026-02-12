import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'auftek.com',
                pathname: '/blog-uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'auftek.com.br',
                pathname: '/blog-uploads/**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;