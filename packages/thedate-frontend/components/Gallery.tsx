
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from "@/hooks/useTheDateContract";
import { shortenHex } from "@/utils/ethers";
import { tokenIdToDateString, tokenIdToISODateString } from "@/utils/thedate";
import { ethers } from "ethers";
import Link from "next/link";
import { useState } from "react";
import { useAsync } from "react-use";
import ArtworkSVGOnChain from "./ArtworkSVGOnChain";

export default function Gallery({ owner }: { owner?: string }) {
  const { library, chainId, account, active } = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [tokenIdList, setTokenIdList] = useState<number[] | undefined>(undefined);

  const range = (start: number, end: number, length = end - start) => Array.from({ length }, (_, i) => start + i);

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    let tokenIdList_: number[] = [];
    if (!!owner && typeof owner == "string" && ethers.utils.isAddress(owner)) {
      const tokenNum_ = (await TheDate.balanceOf(owner)).toNumber();
      if (tokenNum_ == 0) {
        return;
      }
      tokenIdList_ = await Promise.all(
        range(0, tokenNum_).map(async i => (await TheDate.tokenOfOwnerByIndex(owner, i)).toNumber()),
      );
    } else {
      const tokenNum_ = (await TheDate.totalSupply()).toNumber();
      if (tokenNum_ == 0) {
        return;
      }
      tokenIdList_ = await Promise.all(range(0, tokenNum_).map(async i => (await TheDate.tokenByIndex(i)).toNumber()));
    }

    setTokenIdList(tokenIdList_.reverse());
  }, [library, TheDate, owner]);

  return (
    <>
    <div className="content">
      <div className="text-center">
        { owner ? 
          <p>Owned by {shortenHex(owner)}:</p>
          :
          <p>List of all The Date:</p>
        }
      </div>
    </div>
    <div className="content">
      <div className="text-center">
        { tokenIdList === undefined ? 
           <p className="">Loading...</p>
        : tokenIdList.length === 0 ?
        (owner ? 
          <p className="">No artworks owned by {shortenHex(owner)} </p>
          :
          <p className="">No artworks exist</p>
        ) :
        <div className="mx-auto flex gap-4 flex-wrap"> 
              {tokenIdList.map(tokenId => (
                <div key={tokenId} className="w-80 h-80">
                  <Link href={`/artwork/${tokenId}`}>
                  <a><figure><ArtworkSVGOnChain tokenId={tokenId} />
                  </figure>
                  </a>
                  </Link>
                </div>
              ))}          
         </div>
         }
       </div>
    </div>
    </>
  );
}
