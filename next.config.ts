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

// Velite builds content/ into .velite before Next compiles (and watches it in dev).
// Awaited so `next build` never races the content output; the env flag stops worker processes running it again.
export default async function config(): Promise<NextConfig> {
  const isDev = process.argv.includes('dev')
  const isBuild = process.argv.includes('build')
  if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = '1'
    const { build } = await import('velite')
    await build({ watch: isDev, clean: !isDev })
  }
  return nextConfig
}
