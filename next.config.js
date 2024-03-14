// next.config.js
module.exports = {
  images: {
    domains: ['*'], // Allow images from all domains
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};
