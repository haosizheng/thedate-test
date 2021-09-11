import { getTheDateContractAddress } from "@/utils/contracts";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import { NETWORK_CHAIN_ID } from "@/utils/connectors"; 

export const PROJECT_INFO = {
  name: "TheDate",
  description: "TheDate is a metadata-based NFT art experiment about time and blockchain.",
  website_url: "https://thedate.art",
  twitter_account: "thedate_nft",
  twitter_url: "https://twitter.com/@thedate_nft",
  discord_url: "https://discord.gg/CZQdyvuKwj",
  opensea_url: formatOpenSeaLink("Collection", NETWORK_CHAIN_ID, "thedate_art"),
  contract_address: getTheDateContractAddress(NETWORK_CHAIN_ID),
  etherscan_url: formatEtherscanLink("Token", getTheDateContractAddress(NETWORK_CHAIN_ID)),
  snapshot_url: "https://snapshot.org/#/thedate.eth"
};
