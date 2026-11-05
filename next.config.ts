import type { NextConfig } from 'next'

const privateHeaders = [
  { key: 'X-Robots-Tag', value: 'noindex' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Cache-Control', value: 'no-store' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/calendar/:path*', headers: privateHeaders },
      { source: '/admin/:path*', headers: privateHeaders },
    ]
  },
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
