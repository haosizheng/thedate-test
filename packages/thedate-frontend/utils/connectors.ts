import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { SupportedChainId, INFURA_PREFIXES} from './chains'

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const WALLETCONNECT_BRIDGE_URL = process.env.WALLETCONNECT_BRIDGE_URL || "https://bridge.walletconnect.org";
const NETWORK_CHAIN_ID = process.env.NETWORK_CHAIN_ID ? 
  Number.parseInt(process.env.NETWORK_CHAIN_ID) : SupportedChainId.MAINNET;

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET, 
  SupportedChainId.RINKEBY,
  SupportedChainId.ROPSTEN,
  SupportedChainId.HARDHAT,
]
const NETWORK_URLS: {[chainId: number]: string} = {
  [SupportedChainId.MAINNET]: `https://${INFURA_PREFIXES[SupportedChainId.MAINNET]}infura.io/v3/${INFURA_API_KEY}`,
  [SupportedChainId.RINKEBY]: `https://${INFURA_PREFIXES[SupportedChainId.RINKEBY]}infura.io/v3/${INFURA_API_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://${INFURA_PREFIXES[SupportedChainId.ROPSTEN]}infura.io/v3/${INFURA_API_KEY}`,
  [SupportedChainId.HARDHAT]: `http://127.0.0.1:8545`,
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
})

export const NetworkContextName: string = "NETWORK";

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: NETWORK_CHAIN_ID
})

export const connectorsByName = {
  Injected: injected,
  WalletConnect: walletconnect,
  Network: network,
};

