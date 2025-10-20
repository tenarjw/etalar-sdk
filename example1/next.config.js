/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withTM({
    output: 'export', // Enable static exports
    compress: false,
    trailingSlash: true,
    reactStrictMode: false,
    images: {
      unoptimized: true, // Disable image optimization for static exports
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      }
      return config
    },
  })
)