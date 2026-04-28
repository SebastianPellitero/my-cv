import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/fpv-faque',
        destination: 'https://fpv-faque.vercel.app/en',
      },
      {
        source: '/fpv-faque/:path*',
        destination: 'https://fpv-faque.vercel.app/:path*',
      },
      // {
      //   source: '/3d-figurine/:path*',
      //   destination: 'https://3d-figurine-creator.vercel.app/:path*',
      // },
      // {
      //   source: '/2-step-planner/:path*',
      //   destination: 'https://2-step-planner.vercel.app/:path*',
      // },
    ]
  },
}

export default nextConfig
