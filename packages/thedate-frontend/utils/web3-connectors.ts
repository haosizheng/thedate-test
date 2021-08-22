import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { SupportedChainId, INFURA_PREFIXES} from './chains'

const INFURA_KEY = process.env.INFURA_KEY || "";
const WALLETCONNECT_BRIDGE_URL = process.env.WALLETCONNECT_BRIDGE_URL || "";

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET, 
  SupportedChainId.RINKEBY,
  SupportedChainId.ROPSTEN,
  SupportedChainId.HARDHAT,
]
const NETWORK_URLS: {[chainId: number]: string} = {
  [SupportedChainId.MAINNET]: `https://${INFURA_PREFIXES[SupportedChainId.MAINNET]}infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://${INFURA_PREFIXES[SupportedChainId.RINKEBY]}infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://${INFURA_PREFIXES[SupportedChainId.ROPSTEN]}infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.HARDHAT]: `https://${INFURA_PREFIXES[SupportedChainId.HARDHAT]}infura.io/v3/${INFURA_KEY}`,
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS.concat([SupportedChainId.HARDHAT]),
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
})
