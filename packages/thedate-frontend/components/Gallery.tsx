
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from "@/hooks/useTheDateContract";
import { shortenHex } from "@/utils/ethers";
import { tokenIdToDateString, tokenIdToISODateString } from "@/utils/thedate";
import { ethers } from "ethers";
import Link from "next/link";
import { useState } from "react";
import { useAsync } from "react-use";

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
        <table className="mx-auto"> 
          <tbody>
              {tokenIdList.map(tokenId => (
                <tr key={tokenId}>
                  <td>
                  <Link href={`/artwork/${tokenId}`}>
                    <a className="hover:underline">#{tokenId}</a>
                  </Link>
                  </td>
                  <td className="pl-10">
                  <Link href={`/artwork/${tokenId}`}>
                    <a className="hover:underline">{tokenIdToISODateString(tokenId)}</a>
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
