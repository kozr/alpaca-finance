/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

module.exports = nextConfig
