import Layout from "@/components/Layout";
import Link from "next/link";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_CHAIN_ID } from "@/utils/connectors";
import ArtworkSVG from "@/components/ArtworkSVG";
import { tokenIdToDateString, jsDateToDate } from "@/utils/thedate";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";

export default function FAQPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);
  const openseaLink = formatEtherscanLink("Token", [chainId, TheDate?.address]);

  return (
    <Layout>
      <div className="content">
        <figure>
          <ArtworkSVG dateString="2021-08-28" noteString="On the date, Loot was released." />
        </figure>

        <h2>Frequently Asked Questions</h2>
        <div className="faq__item">
          <h3>What’s The Date?</h3>
          <p>
            The Date is a metadata-based NFT art experiment about memorizing and celebrating our past.
          </p>
          <p>
            Each fleeting day would be imprinted into a metadata-based NFT artwork on blockchain immutably.
            Optionally, the owner can engrave or erase a note on The Date artwork as an additional metadata.
          </p>
          <p>
            The Date is metadata. It could be a building block of future Metaverse ecosystem. 
            You can use it in anyway you wants, such as storytelling, gifting, memorization, building an artwork, or use it in metaverses. 
          </p>
        </div>

        <div className="faq__item">
          <h3>How can I own The Date of today? </h3>
          <p>
          The Date of today will be minted as a non-fungible token through an auction 
          opening from 00:00:00 UTC to 23:59:59 UTC each day. 
          The highest bidder will own The Date of that day. 
          </p>

          <p>
          You could <a href={`${etherscanLinkOfToken}#writeContract`}>place your bid</a> via calling placeBid() function in the contract on Etherscan. 
          You can see the auction status, such as current price and biding history, by visiting <Link href="/auction"><a>Auction</a></Link> page .
          </p>
        </div>

        <div className="faq__item">
          <h3>How many The Date are there? </h3>
          <p>Since <a href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>, One The Date a day was generated. </p>

          <p>
          The earliest The Date generated was <a href={formatOpenSeaLink("Asset", 0)}> {tokenIdToDateString(0)}</a>  (Token #0) and 
          the latest The Date generated was <a href={formatOpenSeaLink("Asset", 0)}>{jsDateToDate(new Date())}</a> (Token #0).
          </p>
        </div>
        
        <div className="faq__item">
          <h3>How can I own past The Date? </h3>

          <p>
            For claimed past The Date, you can purchase it on the secondary market <a href={openseaLink}>OpenSea</a>.
          </p>
          <p>
            For unclaimed past The Date, you could <a href={`${etherscanLinkOfToken}#writeContract`}>claim</a> it directly the contract. Select an available date to claim, and note that only one The Date will be available for each date. Each initial claim will cost Ξ 0.01
          </p>
          <p>
            As an metadata-based NFT project, to respect the first of its kind, <a href="https://lootproject.com/">Loot</a>, all the Loot holders are free to  <a href={`${etherscanLinkOfToken}#writeContract`}>claim</a> The Date. 
            
          </p>
        </div>

        <div className="faq__item">
          <h3>What can I do with The Date as an owner? </h3>
          <p>
            As the owner of The Date, you could optionally <a href={`${etherscanLinkOfToken}#writeContract`}>engrave</a> a note (100 ASCII characters including spaces) at 0.01 ether. 
            However, you have to pay 0.1 ether to <a href={`${etherscanLinkOfToken}#writeContract`}>erase</a> the existing engraved note before a new one can be engraved. 
          </p>
        </div>

        <div className="faq__item">
          <h3>What can I do with The Date as a builder? </h3>
          <p>
            Basically, you are free to use The Date in anyway you want. 
            It could be a building block for stories, experiements, and metaverses. 
            To demonstrate how you can use the metadata of the Date, we make this <a >3D artwork</a>. 
          </p>
          <div className="artwork-3d">
            <ArtworkModelViewer tokenId={0} fov={30} />
          </div>
        </div>

        <div className="faq__item">
          <h3>Why there is The Date DAO? </h3>
          <p>
            Also, the holders of The Date NFT automatically became the members of The Date DAO 
            Community can vote on Snapshot to decide where this project to go. 
            For example, a proposal can be promoted to <a href=""> setReservedPrice()</a>, 
            <a href=""> setMinimumBps()</a>
            <a href=""> setReservedPrice()</a>
            <a href=""> setReservedPrice()</a>
            the min Percentage for auction, the note-engraving price, or the note-erasing price, 
            even the length of the note. 
          </p>
        </div>
      </div>
    </Layout>
  );
}
