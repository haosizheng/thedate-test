import deployments from "@/../thedate-contracts/exports/deployments.json";
import { NETWORK_NAMES } from "@/utils/chains";

export function getTheDateContractAddress(chainId: number) {
  const TheDate_address = !!chainId ? 
    (<any>deployments)[`${chainId}`][NETWORK_NAMES[chainId]].contracts.TheDate.address : undefined;
  return TheDate_address;
}

export const TWITTER_ACCOUNT = "thedate_art"; 

export const DISCORD_URL = "https://discord.gg/thedate_art";
 
export const OPENSEA_URL = "https://opensea.io/collection/thedate_art";



