/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  images: {
    domains: ['storage.googleapis.com'],
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  env: {
    web3Network: 'bsctestnet', // bsc, bsctestnet, Ethereum, Rinkeby, Polygon
    web3ChainId: 97, // 97 --> bsctestnet, 56 --> bsc, 1 --> Ethereum, 4 --> Rinkeby, polygon --> 137
    // -------------------------------------------------------------------------------------
    apiEndpoint: 'https://nft-platfrom-qa-ikrcogluxq-uc.a.run.app/', // QA
    // apiEndpoint: 'https://nft-platfrom-dev-ikrcogluxq-uc.a.run.app/', // Development
    // apiEndpoint: 'http://0.0.0.0:8080/', // Local
    // -------------------------------------------------------------------------------------
    web3BscMainnetRpcs: ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed1.defibit.io/', 'https://bsc-dataseed1.ninicoin.io/'],
    web3BscTestnetRpcs: ['https://nd-886-709-422.p2pify.com/9920a2d0dbf3d3a72f573e50625eeac6'],
    web3EthMainnetRpcs: ['https://mainnet.infura.io/v3/b621536ff102441ca7975a93410212a2'],
    web3RinkebyRpcs: ['https://rinkeby.infura.io/v3/b621536ff102441ca7975a93410212a2'],
    web3MaticMainnetRpcs: ['https://polygon-rpc.com/'],
    web3MarketplaceAddress: '0xb922E4D044efc636e5Fb55C49ba17C9ebFeda126',
    web3EscrowAddress: '0x7E1f7FAa3ec8C9507Df0c3490626eca3127dacd6',
    web3ARizeNFTAddress: '0xA5A85c6e00F82018657fdF8F09ce021EE1134Cc4',
    StreamingOptions: {
      baseUrl: 'https://general.gorillastreaming.com',
      appEnvId: '83d96092-7c8a-4bd3-87fc-55b1752665a6',
      apiKey: '0ca296cf-09ca-4cdc-8e84-7410ba8c3b23'
    },
    SENTRY_DSN : 'https://322e9598ba3a4aab95a3922613810a7d@o1330955.ingest.sentry.io/6686500'
  },
  images: {
    domains: ['storage.googleapis.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/explore',
        permanent: true
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);