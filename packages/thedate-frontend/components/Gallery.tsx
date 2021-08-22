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
import { parseBalance, shortenHex, formatEtherscanLink, blockTimestampToUTC, toPriceFormat } from "../utils/ethers";
import { useRendersCount, useAsync } from "react-use";
import { formatUnits, commify, formatEther } from "@ethersproject/units";
import ArtworkImageViewer from "./ArtworkImageViewer";
import ArtworkCatalogue from "./ArtworkCatalogue";

export interface GalleryProps {
  owner: string | string[] | undefined;
}

export default function Gallery({ owner }: GalleryProps) {
  const { library, chainId, account, active } = useWeb3React<Web3Provider>();
  const TheDate = useTheDateContract();
  const [tokenIdList, setTokenIdList] = useState<number[]>([]);

  const range = (start: number, end: number, length = end - start) => Array.from({ length }, (_, i) => start + i);


  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    console.log(library);

    let tokenIdList_: number[] = [];
    if (typeof owner == "string" && ethers.utils.isAddress(owner)) {
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
    console.log(tokenIdList_);
    
  }, [library, TheDate]);

  return (
    <div className="container flex flex-col">
      {tokenIdList.map(tokenId => (
        <div key={tokenId} className="flex flex-row">
          <div className="flex-none">
            <ArtworkImageViewer tokenId={tokenId} />
          </div>
          <div className="flex-grow">
            <ArtworkCatalogue tokenId={tokenId} />
          </div>
        </div>
      ))}
    </div>
  );
}
