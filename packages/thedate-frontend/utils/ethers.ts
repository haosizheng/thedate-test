import { formatUnits } from "@ethersproject/units";
import type { BigNumberish } from "@ethersproject/bignumber";
import { ETHERSCAN_PREFIXES } from './chains'
import dateFormat from 'dateformat';


export const SECONDS_IN_A_DAY = 86400;

export function blockTimestampToUTC(timestamp: number) {
  return dateFormat(new Date(timestamp * 1000), "UTC:mmm d yyyy HH:MM:ss Z");
}

export function blockTimestampToDate(timestamp: number) {
  return dateFormat(new Date(timestamp * 1000), "mmm d yyyy");
}

export function tokenIdToDate(tokenId: number) {
  return dateFormat(new Date(tokenId * SECONDS_IN_A_DAY * 1000), "mmm d yyyy");
}

export function shortenHex(hex?: string | null, length = 4) {
  if (!hex) return "";
  return `${hex.substring(0, length + 2)}...${hex.substring(hex.length - length)}`;
}

export const toPriceFormat = (price: number) =>
  price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

export const parseBalance = (balance: BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

export function formatEtherscanLink(
  type?: "Account" | "Transaction" | "Token",
  data?: [number | undefined, string | null | undefined]
) {
  if (!type || !data) {
    return "";
  }
  const [chainId, addressOrHash] = data;
  if (!chainId || !addressOrHash) {
    return "";
  }
  let linkType: string;

  switch (type) {
    case "Account": {
      linkType = "address";
      break;
    }
    case "Transaction": {
      linkType = "tx";
      break;
    }
    case "Token": {
      linkType = "token";
      break;
    }
  }
  return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/${linkType}/${addressOrHash}`;
}
