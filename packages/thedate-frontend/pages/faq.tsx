import Layout from "@/components/Layout";
import Link from "next/link";
import { formatEtherscanLink, formatOpenSeaLink } from "@/utils/ethers";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_CHAIN_ID } from "@/utils/connectors";
import ArtworkSVG from "@/components/ArtworkSVG";
import { tokenIdToISODateString, jsDateToDate } from "@/utils/thedate";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import { useState } from "react";
import { useAsync } from "react-use";

import { PROJECT_INFO } from "@/utils/constants";

export default function FAQPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [ currentAuctionTokenId, setCurrentAuctionTokenId ] = useState<number | undefined>(undefined);
  const [ totalSupply, setTotalSupply ] = useState<number | undefined>(undefined);

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);

  useAsync(async () => {
    if (!TheDate) {
      return; 
    }
    setCurrentAuctionTokenId((await TheDate?.getCurrentAuctionTokenId()).toNumber());
    setTotalSupply((await TheDate?.totalSupply()).toNumber());

  }, [TheDate]);

  return (
    <Layout>
      <div className="content">
        <figure>
          <ArtworkSVG dateString="2021-09-12" noteString="The Date was launched." />
        </figure>

        <h2>Frequently Asked Questions</h2>
        <div className="content_item">
          <h3>What’s The Date?</h3>
          <p>
            The Date is a metadata-based NFT art experiment about our past and future.
          </p>
          <p>
            Each fleeting day would be imprinted into a metadata-based NFT artwork on blockchain immutably.
            Optionally, the owner can engrave or erase a note on The Date artwork as an additional metadata.
          </p>
          <p>
            The Date is metadata. It could be a building block of future metaverse ecosystem. 
            You can use it in whatever ways, such as storytelling, gifting, memorization, building an artwork, or use it in metaverse. 
          </p>
        </div>

        <div className="content_item">
          <h3>How can I own The Date of today? </h3>
          <p>
          The Date of Today will be minted as a non-fungible token (NFT) through an auction. 
          Opening from 00:00:00 UTC to 23:59:59 UTC each day. 
          The highest bidder will own The Date of that day. 
          </p>

          <p>
          You could <a href={`${etherscanLinkOfToken}#writeContract`}>place your bid</a> via calling placeBid() function in the contract on Etherscan. 
          You can see the auction status, such as current price and biding history, by visiting <Link href="/auction"><a>Auction</a></Link> page .
          </p>
        </div>

        <div className="content_item">
          <h3>How many The Date are there? </h3>
          <p>Since <a href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>, one The Date each day was generated. </p>

          <p>
          The earliest date generated was <b>{tokenIdToISODateString(0)}</b> (Token #0).
          {currentAuctionTokenId !== undefined && 
            (currentAuctionTokenId - 1)
            && <> The latest date generated was <b>{tokenIdToISODateString(currentAuctionTokenId - 1)}</b> (Token #{currentAuctionTokenId - 1}). </>
          }
          </p>

          <p>Any date in-between were claimable. {totalSupply !==undefined && <>Currently in total {totalSupply} tokens of The Date  were claimed.</>}</p>
        </div>
        
        <div className="content_item">
          <h3>How can I own past The Date? </h3>

          <p>
            For claimed past The Date, you can trade it on the secondary market <a href={PROJECT_INFO.opensea_url}>OpenSea</a>.
          </p>
          <p>
            For unclaimed past The Date, you can <Link href="/claim"><a>claim</a></Link> it via calling <i>claim(tokenId)</i> in the contract at price Ξ0.05. 
            Note that only one The Date will be available for each date. 
            Check carefully via <i>exists(tokenId)</i> function to see if the date you chosen is claimable.
          </p>
          <p>
            As an metadata-based NFT project, to respect the first of its kind, <a href="https://lootproject.com/">Loot</a>, 
            all the Loot holders are free to claim The Date. 
          </p>
        </div>

        <div className="content_item">
          <h3>What can I do with The Date as an owner? </h3>
          <p>
            As the owner of The Date, you could optionally <a href={`${etherscanLinkOfToken}#writeContract`}>engrave</a> {" "}
            a note (100 bytes at max with printable characters) at Ξ0.01 via calling <i>engraveNote()</i>.
          </p>
          <p>
            However, you have to pay Ξ0.1 to <a href={`${etherscanLinkOfToken}#writeContract`}>erase</a> the existing 
            engraved note via calling <i>eraseNote()</i> before a new one can be engraved. 
          </p>
        </div>

        <div className="content_item">
          <h3>What can I do with The Date as a builder? </h3>
          <p>
            The Date is metadata. You are free to use The Date in anyway you want. 
            It could be a building block for stories, experiements, and metaverses. 
          </p>
          <p>
            To inspire you, based on the metadata of the Date, we make this <Link href="/model/6209"><a>
              3D artwork</a></Link> as an sample artwork.
          </p>
          <div className="artwork-3d">
            <ArtworkModelViewer tokenId={0} noteString="Unix Epoch" fov={30} />
          </div>
        </div>

        <div className="content_item">
          <h3>What is The Date DAO for? </h3>
          <p>
            The holders of The Date NFT will automatically became the members of The Date DAO.{" "}
            <a href={PROJECT_INFO.snapshot_url}>The Date DAO</a> members can vote on Snapshot to decide where this project to go.
          </p>
          <p>
            For example, a proposal can be proposed to change the claiming price <i>claimingPrice</i>, the reserved price for auction <i>reservedPrice</i>, 
            the minimal increment bps for auction <i>minBidIncrementBps</i>, the note-engraving price <i>engravingPrice</i>, or the note-erasing price <i>erasingPrice</i>,
            even the length of the note <i>noteSizeLimit</i>. 
          </p>
          <p>
            Community will drive this project. 
          </p>
        </div>
      </div>
    </Layout>
  );
}
