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

        <div className="faq__item">
          <h3>2021-09-06</h3>
          <p>
            We sent to the owner of Steven Curry. 
          </p>
          <figure>
            <ArtworkSVG dateString="2021-09-08" noteString="On the date, Loot was released." />
          </figure>
        </div>

        <div className="faq__item">
          <h3>2021-09-06</h3>
          <p>
            Owner to Steven Curry. 
          </p>
          <figure>
            <ArtworkSVG dateString="2021-09-08" noteString="On the date, Loot was released." />
          </figure>
        </div>

        <div className="faq__item">
          <h3>2021-09-05</h3>
          <p>
            We lanuched the Date . 
          </p>
          <figure>
            <ArtworkSVG dateString="2021-09-08" noteString="On the date, Loot was released." />
          </figure>
        </div>

     
      </div>
    </Layout>
  );
}
