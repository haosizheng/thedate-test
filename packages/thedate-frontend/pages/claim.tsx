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

import { PROJECT_INFO } from "@/utils/constants";
export default function ClaimPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [ currentAuctionTokenId, setCurrentAuctionTokenId ] = useState<number | undefined>(undefined);
  const [ totalSupply, setTotalSupply ] = useState<number | undefined>(undefined);

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);

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

        <p>Since <a href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>, only one The Date would be available each date. 

      {currentAuctionTokenId !== undefined && 
        <>
        The earliest date to be claimable was <b>{tokenIdToISODateString(0)}</b> (Token #0).
        The latest date was <b>{tokenIdToISODateString(currentAuctionTokenId - 1)}</b> (Token #{currentAuctionTokenId - 1}). 
        Any date in-between were claimable. {totalSupply !==undefined && <>Currently in total {totalSupply} tokens of The Date  were claimed.</>}
        </>
      }
      </p>

        <p>
          You can claim the past date via calling <a href={`${etherscanLinkOfToken}#writeContract`}><i>claim(tokenId)</i></a>{" "}
          in the contract at price Ξ0.05. {" "}
          Check carefully via calling <a href={`${etherscanLinkOfToken}#readContract`}><i>exists(tokenId)</i></a> function to see if the date you chosen were claimed by others.
        </p>


        <p>
          For getting The Date of Today, you can join <Link href="/auction"><a>the auction</a></Link> of Today.
        </p>
      </div>
    </Layout>
  );
}
