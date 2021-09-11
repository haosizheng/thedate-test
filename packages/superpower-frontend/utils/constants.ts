import { getSuperpowerContractAddress } from "@/utils/contracts";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import { NETWORK_CHAIN_ID } from "@/utils/connectors"; 

export const PROJECT_INFO = {
  name: "Superpower",
  description: "Super is a metadata-based NFT art experiment about time and blockchain.",
  website_url: "https://superpower.art",
  twitter_account: "superpower_art",
  twitter_url: "https://twitter.com/superpower_art",
  discord_url: "https://discord.gg/superpower_art",
  opensea_url: formatOpenSeaLink("Collection", NETWORK_CHAIN_ID, "superpower_art"),
  contract_address: getSuperpowerContractAddress(NETWORK_CHAIN_ID),
  etherscan_url: formatEtherscanLink("Token", getSuperpowerContractAddress(NETWORK_CHAIN_ID)),
  snapshot_url: "https://snapshot.org/#/superpower.art"
}
