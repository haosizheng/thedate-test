import type { Web3Provider } from "@ethersproject/providers";

import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";
import { TheDate__factory, TheDate } from "@thefoundation/contracts/typechain";
import { BigNumberish, BigNumber, ethers } from "ethers";
import useTheDateContract from "../hooks/useTheDateContract";
import useCurrentBlock from "../hooks/useCurrentBlock";
import useBlockNumber from "../hooks/useBlockNumber";
import useTheDateBidHistory from "../hooks/useTheDateBidHistory";
import useEtherPrice from "../hooks/useEtherPrice";
import { useEffect, useState, memo, useRef, useDebugValue } from "react";
import {
  parseBalance,
  shortenHex,
  formatEtherscanLink,
  blockTimestampToUTC,
  toPriceFormat,
  tokenIdToDate,
} from "../utils/ethers";
import { useRendersCount, useAsync } from "react-use";
import { formatUnits, commify, formatEther } from "@ethersproject/units";
import Link from "next/link";

export interface ArtworkCatalogueProps {
  tokenId: number;
}

export default function ArtworkCatalogue({ tokenId }: ArtworkCatalogueProps) {
  const { library, chainId, account } = useWeb3React<Web3Provider>();
  const TheDate = useTheDateContract();
  const [owner, setOwner] = useState<string>(null!);
  const [dateString, setDateString] = useState<string>(null!);
  const [note, setNote] = useState<string>(null!);

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    const owner_ = await TheDate.ownerOf(tokenId);
    setOwner(owner_);
    const artwork_ = await TheDate.artworks(tokenId);
    setDateString(tokenIdToDate(artwork_.date.toNumber()));
    setNote(artwork_.note);
  }, [library, TheDate]);

  const engraveNote = async () => {
    if (!library || !TheDate) {
      return;
    }
    if (noteInputBox.current?.textContent) {
      await TheDate?.engraveArtworkNote(tokenId, note);
    }
  };

  const noteInputBox = useRef<HTMLInputElement>();
  const eraseNote = async () => {
    if (!library || !TheDate) {
      return;
    }
    await TheDate?.eraseArtworkNote(tokenId, { value: ethers.utils.parseEther("1") });
  };

  return (
    <div>
      <p>
        Artwork:{" "}
        <Link href={`/artwork/${tokenId}`}>
          <a className="link">{dateString}</a>
        </Link>
      </p>
      <p>
        Note: {note ? `"${note}"` : "<unset>"}
        {account == owner && !note && (
          <>
            {/* <input ref={noteInputBox} type="text" placeholder="note here"></input>
            <button onClick={engraveNote()}>Engrave</button> */}
          </>
        )}
        {account == owner && !note && <button onClick={eraseNote}>Erase</button>}
      </p>
      <p>
        Owner: 
        <a className="link" href={formatEtherscanLink("Account", [chainId, owner])}>
          {shortenHex(owner)}
        </a>
      </p>
      <p>TokenId: {tokenId}</p>
    </div>
  );
}
