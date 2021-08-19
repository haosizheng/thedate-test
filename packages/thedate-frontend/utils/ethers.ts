import { formatUnits } from "@ethersproject/units";
import type { BigNumberish } from "@ethersproject/bignumber";

export function blockTimestampToUTC(timestamp: number) {
  return new Date(timestamp * 1000).toUTCString();
}

export function shortenHex(hex?: string | null, length = 4) {
  if (!hex) return "";
  return `${hex.substring(0, length + 2)}...${hex.substring(hex.length - length)}`;
}

const ETHERSCAN_PREFIXES: Record<number, string> = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
  31337: "hardhat."
};

export function formatEtherscanLink(
  type?: "Account" | "Transaction",
  data?: [number | undefined, string | null | undefined]
) {
  if (!type || !data) {
    return "";
  }
  const [chainId, addressOrHash] = data;
  if (!chainId || !addressOrHash) {
    return "";
  }
  switch (type) {
    case "Account": {
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${addressOrHash}`;
    }
    case "Transaction": {
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${addressOrHash}`;
    }
  }
}

export const parseBalance = (balance: BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);
