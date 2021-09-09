import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@atixlabs/hardhat-time-n-mine";
import "hardhat-gas-reporter";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "solidity-coverage";
import "hardhat-contract-sizer";

import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";

import * as dotenv from "dotenv";
dotenv.config();

import "./tasks/accounts";

const chainIds = {
  ganache: 1337,
  hardhat: 31337,
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
};

const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
const FORKING = process.env.FORKING || "false";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const DEPLOYER_PUBLIC_KEY = process.env.DEPLOYER_PUBLIC_KEY || "";
const FOUNDATION_MEMBER_1_PUBLIC_KEY = process.env.FOUNDATION_MEMBER_1_PUBLIC_KEY || "";
const FOUNDATION_MEMBER_2_PUBLIC_KEY = process.env.FOUNDATION_MEMBER_2_PUBLIC_KEY || "";

const TEST_ACCOUNTS = {
  mnemonic: MNEMONIC,
}

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url = `https://${network}.infura.io/v3/${INFURA_API_KEY}`;
  return {
    accounts: [DEPLOYER_PRIVATE_KEY],
    chainId: chainIds[network],
    live: true,
    saveDeployments: true,
    url,
    tags: ["staging"]
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      mainnet: `privatekey://${DEPLOYER_PRIVATE_KEY}`, 
      rinkeby: `privatekey://${DEPLOYER_PRIVATE_KEY}`, 
    },
    foundationMember1: {
      default: FOUNDATION_MEMBER_1_PUBLIC_KEY,
      mainnet: FOUNDATION_MEMBER_1_PUBLIC_KEY, 
      rinkeby: FOUNDATION_MEMBER_1_PUBLIC_KEY,
    },
    foundationMember2: {
      default: FOUNDATION_MEMBER_2_PUBLIC_KEY,
      mainnet: FOUNDATION_MEMBER_2_PUBLIC_KEY, 
      rinkeby: FOUNDATION_MEMBER_2_PUBLIC_KEY,
    }
  },
  paths: {
    deploy: "./deploy",
    deployments: "./deployments",
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
    tests: "./test",
  },
  abiExporter: {
    path: "./abis",
    only: [":The"],
    clear: true,
    flat: true,
    spacing: 2,
  },
  networks: {
    localhost: {
      live: false,
      accounts: TEST_ACCOUNTS,
      saveDeployments: true,
      tags: ["test"]
    },
    hardhat: {
      accounts: TEST_ACCOUNTS,
      chainId: chainIds.hardhat,
      live: false,
      initialBaseFeePerGas: 0,
      saveDeployments: true,
      tags: ["test"],
      forking: {
        enabled: FORKING === "true",
        url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      },
    },
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    kovan: createTestnetConfig("kovan"),
    rinkeby: createTestnetConfig("rinkeby"),
    ropsten: createTestnetConfig("ropsten"),
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
