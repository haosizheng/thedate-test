import { ETHERSCAN_PREFIXES, OPENSEA_PREFIXES } from '@/utils/chains';
import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import {getTheDateContractAddress} from '@/utils/contracts';

export function shortenHex(hex?: string | null, length = 4) {
  if (!hex) return "";
  return `${hex.substring(0, length + 2)}...${hex.substring(hex.length - length)}`;
}

export const toPriceFormat = (price: number) =>
  price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

export const parseBalance = (balance: BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

export function formatOpenSeaLink(
  type?: "Collection" | "Asset",
  chainId?: number | undefined, 
  tokenId?: string | number | undefined
) {
  if (!type || !chainId) {
    return "";
  }

  let linkPrefix = `https://${OPENSEA_PREFIXES[chainId]}opensea.io`;
  let linkType;
  switch (type) {
    case "Collection": {
      return `${linkPrefix}/collection/thedate`;
    }
    case "Asset": {
      return `assets/${getTheDateContractAddress(chainId)}/${tokenId}`;
    }
  }
}

  
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
