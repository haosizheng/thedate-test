import { getTheDateContractAddress } from "@/utils/contracts";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import { NETWORK_CHAIN_ID } from "@/utils/connectors"; 

export const PROJECT_INFO = {
  name: "The Date",
  description: "The Date is an interactable on-chain metadata NFT project about time and meaning. ",
  website_url: "https://thedate.art",
  twitter_account: "thedate_nft",
  twitter_url: "https://twitter.com/thedate_nft",
  discord_url: "https://discord.gg/CZQdyvuKwj",
  opensea_url: formatOpenSeaLink("Collection", NETWORK_CHAIN_ID, "the-date-project"),
  contract_address: getTheDateContractAddress(NETWORK_CHAIN_ID),
  etherscan_url: formatEtherscanLink("Token", [NETWORK_CHAIN_ID, getTheDateContractAddress(NETWORK_CHAIN_ID)]),
  snapshot_url: "https://snapshot.org/#/thedate.eth"
};
