/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = {  
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
  }
}

module.exports =  withPWA(nextConfig)
