import { ethers } from "ethers";
import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import { useState, useRef } from "react";
import { shortenHex } from "@/utils/ethers";
import { useAsync } from "react-use";
import Link from "next/link";
import { SECONDS_IN_A_DAY } from "@/utils/thedate";
import useTheDateContract from "@/hooks/useTheDateContract";

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
  
  return (
    !exists ?
      <div>
        No artwork exists
      </div>
    : (
      <div>
        { !!dateString && <p>
          Date:{" "}
            <Link href={`/artwork/${tokenId}`}>
              <a className="hover:link">{dateString}</a>
            </Link>
          </p>
        }
        <p>
          Note: {noteString ? `"${noteString}"` : "(unset)"}
          {account === owner && editable && !noteString && noteString != "" && (
            <>
              <input ref={noteInputBox} type="text" placeholder="note here" />
              <button className="link" onClick={onClickEngrave}>Engrave</button>
            </>
          )}
          {account === owner && editable && !noteString && noteString.length > 0 && (
            <button className="link" onClick={eraseNote}>Erase</button>
          )}
        </p>
        <br/>
        { !!owner &&
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
        }
        <p>Token ID: {" "}
          <Link href={`/artwork/${tokenId}`}>
            <a className="hover:link">#{tokenId}</a>
          </Link>
        </p>
      </div>
    )
  );
}
