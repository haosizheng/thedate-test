import { getTheDateContractAddress } from "@/utils/contracts";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import { NETWORK_CHAIN_ID } from "@/utils/connectors"; 

export const PROJECT_INFO = {
  name: "The Date",
  description: "The Date is a fully on-chain interactable metadata NFT project. " +
    "Each fleeting day would be imprinted into an NFT artwork immutably lasting forever. " +
    "The owner can interact with The Date by engraving or erasing a note on The Date artwork as an additional metadata." +
    "As an interactable on-chain NFT, it's the first of its kind. ",
  website_url: "https://thedate.art",
  twitter_account: "thedate_nft",
  twitter_url: "https://twitter.com/@thedate_nft",
  discord_url: "https://discord.gg/CZQdyvuKwj",
  opensea_url: formatOpenSeaLink("Collection", NETWORK_CHAIN_ID, "the-date-v2"),
  contract_address: getTheDateContractAddress(NETWORK_CHAIN_ID),
  etherscan_url: formatEtherscanLink("Token", [NETWORK_CHAIN_ID, getTheDateContractAddress(NETWORK_CHAIN_ID)]),
  snapshot_url: "https://snapshot.org/#/thedate.eth"
};
