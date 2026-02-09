/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 's.gravatar.com'],
  },
}

module.exports = nextConfig