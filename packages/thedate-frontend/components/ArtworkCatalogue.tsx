import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import useTheDateContract from "@/hooks/useTheDateContract";
import { shortenHex } from "@/utils/ethers";
import { tokenIdToISODateString, ISODateToTokenId} from "@/utils/thedate";
import Link from "next/link";
import { useRef } from "react";
import { injected, NETWORK_CHAIN_ID } from "@/utils/connectors";
import { useWeb3React } from '@web3-react/core';
import ArtworkModelViewer from '@/components/ArtworkModelViewer';

export default function ArtworkCatalogue({ tokenId, editable = false }: { tokenId: number, editable?: boolean}) {
  const {account, activate} = useWeb3React();
  const TheDate = useTheDateContract();
  const {exists, owner, dateString, noteString, highestBidder, auctionEnded } = useTheDateArtwork(tokenId);
  
  const noteInputBox = useRef<HTMLInputElement>(null!);

  return  (<>
    { exists !== undefined && owner != undefined && dateString !== undefined && noteString !== undefined && (
      !exists ? 
        <div>
          No artwork exists
        </div>
      : (
        <div>
          <h3>
            Profile of The Date:
          </h3>
          <p>Token ID: {" "}
            <Link href={`/artwork/${tokenId}`}>
              <a className="hover:link">#{tokenId}</a>
            </Link>
            <br/>
            Date:{" "}
            <Link href={`/artwork/${tokenId}`}>
              <a className="hover:link">{tokenIdToISODateString(tokenId)}</a>
            </Link>
            <br/>
            Owner:{" "}
              { owner === TheDate?.address ? (
                !auctionEnded ? 
                  <>Auction not ended yet</>
                : (editable && highestBidder === account) ? 
                  <button className="link">Claim your artwork</button>
                : <Link href={`/artwork/${tokenId}`}>
                    <a className="link">Not claimed yet</a>
                  </Link>
              )
              :
                <Link href={`/gallery/${owner}`}>
                  <a className="hover:link" >
                    {shortenHex(owner)} { account === owner && " (you)" }
                  </a>
                </Link>
            }
            <br/>
            Note: {noteString.length > 0 ? <span className="text-neutral-focus">{noteString}</span> : "(unengraved)"}
          </p>
          { editable && <>
          <h3 className="pt-10">
              Interact with The Date: 
          </h3>
          {account === undefined ?
            <p>
              <span className="wallet"><button onClick={() => { activate(injected) }} >
                Connect your Metamask
              </button> before engraving or erasing note. </span>
            </p>
          : account !== owner ? 
            <p>
             Only owner can interact with The Date.
            </p>
          :
            <p>
              {noteString.length == 0 && (
                  <>
                    Note to engrave on The Date: 
                    <br/>
                    <input ref={noteInputBox} type="text" maxLength={100} 
                      className="user-input w-96 sm:w-120" placeholder="(printable characters at max 100 bytes)" 
                      />
                      <br></br>
                    <br></br>
                    <button onClick={ async () => {
                      TheDate?.engraveNote(tokenId, noteInputBox.current.value, {value: await TheDate?.engravingPrice()})
                    }}>Click here to engrave note at price Ξ0.05</button>
                  </>
                )}
              {noteString.length > 0 && (
                <button onClick={ async () => {
                  TheDate?.eraseNote(tokenId, {value: await TheDate?.erasingPrice()})
                }}>Click here to erase note at price Ξ0.1</button>
              )}
            </p>
          }
          </> }
          <h3 className="pt-10">
            Artworks based on The Date metadata
          </h3>
          <div className="artwork-3d">
          <ArtworkModelViewer tokenId={tokenId} noteString={noteString} fov={30} />
          </div>
          <p>
            <Link href={`/model/${tokenId}`}>
            <a>
              Click here to open the 3D Model. 
            </a>
            </Link>
          </p>
        </div>
    ))
    } </>
  );
}
