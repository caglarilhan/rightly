/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:9011/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
