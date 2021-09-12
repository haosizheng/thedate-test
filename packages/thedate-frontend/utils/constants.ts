import { getTheDateContractAddress } from "@/utils/contracts";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import { NETWORK_CHAIN_ID } from "@/utils/connectors"; 

export const PROJECT_INFO = {
  name: "The Date",
  description: "The Date is a metadata-based NFT art experiment about time and blockchain. " +
    "Each fleeting day would be imprinted into an NFT artwork immutably lasting forever. " +
    "The owner can engrave or erase a note on the artwork as an additional metadata. " +
    "The Date is metadata. Feel free to use the Date in any way you want.",
  website_url: "https://thedate.art",
  twitter_account: "thedate_nft",
  twitter_url: "https://twitter.com/@thedate_nft",
  discord_url: "https://discord.gg/CZQdyvuKwj",
  opensea_url: formatOpenSeaLink("Collection", NETWORK_CHAIN_ID, "the-date-v2"),
  contract_address: getTheDateContractAddress(NETWORK_CHAIN_ID),
  etherscan_url: formatEtherscanLink("Token", [NETWORK_CHAIN_ID, getTheDateContractAddress(NETWORK_CHAIN_ID)]),
  snapshot_url: "https://snapshot.org/#/thedate.eth"
};
