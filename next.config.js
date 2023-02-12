// next.config.js
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['source.boringavatars.com, margaux-dev.github.io, twitter.com, imgur.com'],
  },
}
