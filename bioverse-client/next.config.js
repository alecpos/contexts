/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer-core',
            '@sparticuz/chromium',
        ],
    },
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pplhazgfonbrptwkzfbe.supabase.co',
            },
        ],
        deviceSizes: [640, 1920],
    },
};

module.exports = nextConfig;
