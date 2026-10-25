import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/fpv-faque/:path*',
        destination: 'https://faquefpv.com.ar/:path*',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
