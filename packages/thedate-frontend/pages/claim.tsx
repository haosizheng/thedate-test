import Layout from "@/components/Layout";
import Link from "next/link";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_CHAIN_ID } from "@/utils/connectors";
import ArtworkSVG from "@/components/ArtworkSVG";
import { tokenIdToDateString, jsDateToDate } from "@/utils/thedate";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";

export default function ClaimPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);
  const openseaLink = formatEtherscanLink("Token", [chainId, TheDate?.address]);

  return (
    <Layout>
      <div className="content">
        <p>You could <a href={`${etherscanLinkOfToken}#writeContract`}>claim</a> it directly the contract at a cost of 0.01 Ether.</p>
      </div>
    </Layout>
  );
}
