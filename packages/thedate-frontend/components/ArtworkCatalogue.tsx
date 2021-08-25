import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import { useState, useRef } from "react";
import { shortenHex } from "@/utils/ethers";
import Link from "next/link";
import useTheDateContract from "@/hooks/useTheDateContract";
import ArtworkModelViewer from "./ArtworkModelViewer";

export default function ArtworkCatalogue({ tokenId, editable = false }: { tokenId: number, editable?: boolean}) {
  const {library, account} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const {exists, owner, dateString, noteString, highestBidder, auctionEnded, 
    engraveNote, eraseNote, claimArtwork } = useTheDateArtwork(tokenId);
  
  const noteInputBox = useRef<HTMLInputElement>(null!);
  const onClickEngrave = () => {
    if (noteInputBox.current?.textContent) {
      engraveNote(noteInputBox.current.textContent);
    }
  };

  return  (<>
    { exists !== undefined && owner != undefined && dateString !== undefined && noteString !== undefined && (
      !exists ? 
        <div>
          No artwork exists
        </div>
      : (
        <div>
          {/* <ArtworkModelViewer tokenId={tokenId} noteString="" /> */}
          <p>Token ID: {" "}
            <Link href={`/artwork/${tokenId}`}>
              <a className="hover:link">#{tokenId}</a>
            </Link>
          </p>
          <p>
            Date:{" "}
            <Link href={`/artwork/${tokenId}`}>
              <a className="hover:link">{dateString}</a>
            </Link>
          </p>
          <p>
            Note: {noteString.length > 0 ? `"${noteString}"` : "(unengraved)"}
            {account === owner && editable && noteString.length == 0 && (
              <>
                <input ref={noteInputBox} type="text" maxLength={100} 
                  className="border-none focus:border-black-300 w-96 
                  focus:outline-none outline-none focus:border-black focus:underline bg-transparent" placeholder="(unset)" />
                  <br></br>
                <button className="link" onClick={onClickEngrave}>Engrave</button>
              </>
            )}
            {account === owner && editable && noteString.length > 0 && (
              <button className="link" onClick={eraseNote}>Erase</button>
            )}
          </p>
          <p>
            Owner:{" "}
              { owner === TheDate?.address ? (
                !auctionEnded ? 
                  <>Auction not ended yet</>
                : (editable && highestBidder === account) ? 
                  <button className="link" onClick={claimArtwork}>Claim your artwork</button>
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
          </p>
        </div>
    ))
    } </>
  );
}
