import deployments from "@/../thedate-contracts/exports/deployments.json";
import { NETWORK_NAMES } from "@/utils/chains";

export function getMainContractAddress(chainId: number) {
  const TheDate_address = !!chainId ? 
    (<any>deployments)[`${chainId}`][NETWORK_NAMES[chainId]].contracts.TheDate.address : undefined;
  return TheDate_address;
}

export const PROJECT_INFO = {
  name: "Superpower",
  description: "Super is a metadata-based NFT art experiment about time and blockchain.",
  website_url: "https://superpower.art",
  twitter_account: "thedate_art",
  discord_url: "https://discord.gg/thedate_art",
  opensea_url: "https://opensea.io/collection/thedate_art",
}
