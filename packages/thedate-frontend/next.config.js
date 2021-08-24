const { join } = require('path');
const workspace = join(__dirname, '..');

module.exports = {
  env: {
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    NETWORK_CHAIN_ID: process.env.NETWORK_CHAIN_ID,
    INFURA_KEY: process.env.INFURA_KEY,
    WALLETCONNECT_BRIDGE_URL: process.env.WALLETCONNECT_BRIDGE_URL,
  },
  webpack: (config, options) => {
    /** Allows import modules from packages in workspace. */
    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [workspace],
          exclude: /node_modules/,
          use: options.defaultLoaders.babel,
        },
      ],
    };

    return config;
  },
  reactStrictMode: true,
}
