import Layout from "@/components/Layout";
import Link from "next/link";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_CHAIN_ID } from "@/utils/connectors";
import ArtworkSVG from "@/components/ArtworkSVG";
import { tokenIdToDateString, jsDateToDate } from "@/utils/thedate";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";

export default function UpdatesPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);
  const openseaLink = formatEtherscanLink("Token", [chainId, TheDate?.address]);

  return (
    <Layout>
      <div className="content">
       
        <h2>Updates</h2>


        <div className="content_item">
          <h3>2021-09-13</h3>
          <p>
            The Date was launched today.
          </p>
          <figure>
            <ArtworkSVG dateString="2021-09-13" noteString="The Date was launched." />
          </figure>
        </div>

      </div>
    </Layout>
  );
}
