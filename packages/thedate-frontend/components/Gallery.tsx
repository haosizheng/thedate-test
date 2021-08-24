
import { useState } from "react";
import { useAsync } from "react-use";
import { ethers } from "ethers";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from "@/hooks/useTheDateContract";
import { shortenHex } from "@/utils/ethers";
import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";

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

    setTokenIdList(tokenIdList_);
  }, [library, TheDate]);

  return (
    <>
    <div className="hero">
      <div className="hero-content">
        { owner ? 
          <p>Gallery of {shortenHex(owner)}</p>
          :
          <p>Gallery of all The Date </p>
        }
      </div>
    </div>
    <div className="hero">
      <div className="hero-content">
      {tokenIdList.map(tokenId => (
        <div key={tokenId} className="flex flex-col">
          <div className="flex-none" key={tokenId}>
            <ArtworkImageViewer tokenId={tokenId} />
          </div>
          <div className="flex-grow ">
            <ArtworkCatalogue tokenId={tokenId} />
          </div>
        </div>
      ))}
      </div>
    </div>
    </>
  );
}
