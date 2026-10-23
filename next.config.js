/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/casos-exito', destination: '/proyectos', permanent: true }]
  },
}

module.exports = nextConfig
