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
import { ISODateToTokenId } from "@/utils/thedate";
import { PROJECT_INFO } from "@/utils/constants";

export default function FAQPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [ currentAuctionTokenId, setCurrentAuctionTokenId ] = useState<number | undefined>(undefined);
  const [ totalSupply, setTotalSupply ] = useState<number | undefined>(undefined);

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);
  const contractLinkToRead = ((s: string) => 
    <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#readContract`}><i>{`${s}`}</i></a>
  );
  const contractLinkToWrite = ((s: string) => 
    <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#writeContract`}><i>{`${s}`}</i></a>
  );

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
          <ArtworkSVG dateString="2021-09-13" noteString="The Date was launched." />
      </figure>
                
        <h2>Frequently Asked Questions</h2>
        <div className="content_item">
          <h3>What’s The Date?</h3>
          <p>
            The Date is an interactable on-chain metadata NFT project about time and meaning. 
          </p>
            <p>The Date is <span className="text-neutral-focus">timeless</span>.
              Each fleeting day would be imprinted into an NFT as metadata immutably. 
              Everyday, the Date of that day will be auctioned. One Date a day, running forever.
            </p>
            <p>
              The Date is <span className="text-neutral-focus">monumental</span>. Time is related to everyone. 
              Everyone has dates meaningful to them. 
              The Date could be used in any purposes, such as storytelling, gifting, or memorizing.
            </p>
            <p>
              The Date is <span className="text-neutral-focus">user-interactable</span>. 
              The owner can interact with The Date by engraving or erasing a note attached as additional metadata.
              As an interactable on-chain pure metadata NFT, it&apos;s the first of its kind. 
            </p>
            <p>
              The Date is <span className="text-neutral-focus">purely on-chain metadata</span>. 
              Images, appearances, and other functionality are intentionally omitted for others to interpret.
              Feel free to create something with The Date. 
              To inspire you, we build a <Link href={`/model/${ISODateToTokenId("2017-06-23")}`}><a target="_blank" rel="noreferrer">
              3D artwork</a></Link> based on the metadata. 
              We believe that the <a target="_blank" rel="noreferrer" href={PROJECT_INFO.snapshot_url}>community</a> will lead the project a way.
            </p>
        </div>

        <div className="content_item">
          <h3>How many The Date are there? </h3>
          <p>Each day, one and only one The Date NFT was available to be generated. </p>
          <p>
           You cannot claim The Date of future.
           You can <Link href="/auction"><a>auction</a></Link> The Date of today.
           You can <Link href="/claim"><a>claim</a></Link> The Date of past if not auctioned or claimed by others.
         </p>

          <p>
          NFT Token # is defined by the number of days passed since <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>. 
          The earliest The Date NFT was <b>{tokenIdToISODateString(0)}</b> (Token #0).
          {currentAuctionTokenId !== undefined && 
            <> The latest The Date NFT was <b>{tokenIdToISODateString(currentAuctionTokenId)}</b> (Token #{currentAuctionTokenId}). </>
          }
          </p>
        </div>

        <div className="content_item">
          <h3>How can I own The Date of Today? </h3>
          <p>
           One Date a day. An auction for The Date of each day will be held from 00:00:00 UTC to 23:59:59 UTC, running forever.
          </p>

          <p>
          The highest bidder of each day will own The Date of that day. 
          The reserve Price ({contractLinkToRead("reservePrice")}) is Ξ0.01. 
          At least 10% increment in each bid ({contractLinkToRead("minBidIncrementBps")}).
          </p>

          <p>
          You can see the current auction status, such as current price and biding history, by visiting <Link href="/auction"><a>Auction</a></Link> page.
          You could place your bid via calling {contractLinkToWrite("placeBid()")} function in the contract on Etherscan. 
          After the auction ends, you can settle the auction by calling {contractLinkToWrite("settleLastAuction()")} function in the contract. 
          </p>
        </div>
        
        <div className="content_item">
          <h3>How can I own The Date of Past? </h3>

          <p>
            If The Date you want is passed, and not owned by others, you could claim it via 
            calling {contractLinkToWrite("claim(tokenId)")} in the contract 
            at {contractLinkToRead("claimingPrice")}  Ξ0.01. 
            Check carefully via {contractLinkToRead("available(tokenId)")} function 
            to see if the date you chosen is claimable.
          </p>

          <p>
            Additionally, as an metadata-based NFT project, to respect the first of its 
            kind, <a target="_blank" rel="noreferrer" href="https://lootproject.com/">Loot</a>, 
            all the Loot holders are <span className="text-neutral-focus">free</span> to claim The Date. 
          </p>

          <p>
            For claimed dates, you can trade it on the secondary 
            market <a target="_blank" rel="noreferrer" href={PROJECT_INFO.opensea_url}>OpenSea</a>.
          </p>
        </div>

        <div className="content_item">
          <h3>How can I interact with The Date as an owner? </h3>
          <p>
            As the owner of The Date, you could optionally engrave a note (100 bytes at max with printable characters) via
            calling {contractLinkToWrite("engraveNote(tokenId, note)")}
             at price {contractLinkToRead("engravingPrice")} Ξ0.05.
          </p>
          <p>
            However, you have to pay  {contractLinkToRead("erasingPrice")} Ξ0.1 to erase the existing engraved note via 
            calling {contractLinkToWrite("eraseNote(tokenId)")} before a new one can be engraved. 
          </p>
        </div>

        <div className="content_item">
          <h3>What can I do with The Date as a builder? </h3>
          <p>
            The Date is metadata. You are free to use The Date in anyway you want. 
            It could be a building block for stories, experiements, and metaverses. 
          </p>
          <p>
            To inspire you, based on the metadata of the Date, we make this <Link href={`/model/${ISODateToTokenId("2021-08-27")}`}><a target="_blank" rel="noreferrer">
              3D artwork</a></Link> as an sample artwork.
          </p>
          <div className="artwork-3d">
            <ArtworkModelViewer tokenId={ISODateToTokenId("2021-08-27")} noteString="The Loot was launched." fov={30} />
          </div>
        </div>

        <div className="content_item">
          <h3>What is The Date DAO for? </h3>
          <p>
            The holders of The Date NFT will automatically became the members of 
            <a target="_blank" rel="noreferrer" href={PROJECT_INFO.snapshot_url}>The Date DAO</a>. Members can vote on Snapshot to decide where this project to go.
          </p>
          <p>
            For example, a proposal can be proposed to change the claiming price {contractLinkToRead("claimingPrice")}, 
            the reserve price for auction {contractLinkToRead("reservePrice")}, 
            the minimal increment bps for auction {contractLinkToRead("minBidIncrementBps")}, 
            the note-engraving price {contractLinkToRead("engravingPrice")}, 
            or the note-erasing price {contractLinkToRead("erasingPrice")}, and
            even the length of the note {contractLinkToRead("noteSizeLimit")}. 
          </p>
          <p>
            Community would drive this project. 
          </p>
        </div>
      </div>
    </Layout>
  );
}
