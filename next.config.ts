
//ignorando warnings na build por enquanto para testes... será removido
const nextConfig: any = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'auftek.com',
                pathname: '/blog-uploads/**',
            },
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