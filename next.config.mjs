/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The standalone celebration-menu builder was retired in favour of /order,
      // which prices dishes by the piece with a live total. Links to menu.html
      // were shared on WhatsApp, so keep them working.
      { source: '/menu.html', destination: '/order', permanent: true },
    ]
  },
}

export default nextConfig
