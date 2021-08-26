
import { useState } from "react";
import { useAsync } from "react-use";
import { ethers } from "ethers";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from "@/hooks/useTheDateContract";
import { shortenHex } from "@/utils/ethers";
import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";
import ArtworkModelViewer from "./ArtworkModelViewer";
import Link from "next/link";
import { tokenIdToDateString } from "@/utils/thedate";

export default function Gallery({ owner }: { owner?: string }) {
  const { library, chainId, account, active } = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [tokenIdList, setTokenIdList] = useState<number[]>([]);

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
    <div className="hero">
      <div className="hero-content">
        { owner ? 
          <p>Owned by {shortenHex(owner)}:</p>
          :
          <p>List of all The Date:</p>
        }
      </div>
    </div>
    <div className="hero pt-20">
      <div className="hero-content">
        { tokenIdList.length == 0 ? 
            (owner ? 
              <p className="text-xs">No artworks owned by {shortenHex(owner)} </p>
              :
              <p className="text-xs">No artworks exist </p>
            )
        : 
        <table> 
          <tbody>
              {tokenIdList.map(tokenId => (
                <tr key={tokenId}>
                  <td>
                  <Link href={`/artwork/${tokenId}`}>
                    <a className="hover:link">#{tokenId}</a>
                  </Link>
                  </td>
                  <td className="pl-10">
                  <Link href={`/artwork/${tokenId}`}>
                    <a className="hover:link">{tokenIdToDateString(tokenId)}</a>
                  </Link>
                  </td>
                  
                {/* <div key={tokenId} className="flex flex-col items-center">
                  <div className="flex-none w-96 h-96" key={tokenId}>
                    <ArtworkImageViewer tokenId={tokenId} />
                  </div>
                  <div className="flex-grow">
                    <ArtworkCatalogue tokenId={tokenId} />
                  </div>
                 */}
                </tr>
              ))}          
          </tbody>
         </table>
         }
       </div>
    </div>
    </>
  );
}
