/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: false,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  theme: {
    colors: {
      'money-green': '#65BD73',
      'money-red': '#EA6B6A',
      'money-grey': '#81818199',
      'positive-green': '#B9EAB3',
      'negative-red': '#EA6B6A',
      'neutral-grey': '#818181',
    }
  }
}

module.exports =  withPWA(nextConfig)
