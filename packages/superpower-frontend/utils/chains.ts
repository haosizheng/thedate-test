export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  HARDHAT = 31337
}

export const NETWORK_NAMES: Record<SupportedChainId | number, string> = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.ROPSTEN]: 'ropsten',
  [SupportedChainId.RINKEBY]: 'rinkeby',
  [SupportedChainId.GOERLI]: 'goerli',
  [SupportedChainId.KOVAN]: 'kovan',
  [SupportedChainId.HARDHAT]: 'hardhat'
}

export const NETWORK_LABELS: Record<SupportedChainId | number, string> = {
  [SupportedChainId.MAINNET]: 'Mainnet',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
  [SupportedChainId.RINKEBY]: 'Rinkeby',
  [SupportedChainId.GOERLI]: 'Görli',
  [SupportedChainId.KOVAN]: 'Kovan',
  [SupportedChainId.HARDHAT]: 'Hardhat'
}

export const ETHERSCAN_PREFIXES: Record<SupportedChainId | number, string> = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.ROPSTEN]: 'ropsten.',
  [SupportedChainId.RINKEBY]: 'rinkeby.',
  [SupportedChainId.GOERLI]: 'goerli.',
  [SupportedChainId.KOVAN]: 'kovan.',
  [SupportedChainId.HARDHAT]: ''
}

export const OPENSEA_PREFIXES: Record<SupportedChainId | number, string> = {
  [SupportedChainId.MAINNET]: '',
  [SupportedChainId.RINKEBY]: 'testnet.',
}

export const INFURA_PREFIXES: Record<SupportedChainId | number, string> = {
  [SupportedChainId.MAINNET]: 'mainnet.',
  [SupportedChainId.ROPSTEN]: 'ropsten.',
  [SupportedChainId.RINKEBY]: 'rinkeby.',
  [SupportedChainId.GOERLI]: 'goerli.',
  [SupportedChainId.KOVAN]: 'kovan.',
  [SupportedChainId.HARDHAT]: 'mainnet.'
}
