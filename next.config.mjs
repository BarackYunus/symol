/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
  reactStrictMode: true,
  // Add async headers to allow Telegram Web App to load
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://web.telegram.org',
          },
        ],
      },
    ];
  },
  // Ensure output is static for better compatibility
  output: 'export',
}

export default nextConfig;

  
