import Layout from "@/components/Layout";
import { formatEtherscanLink, formatOpenSeaLink, parseBalance, shortenHex, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC, SECONDS_IN_A_DAY, tokenIdToDateString, tokenIdToISODateString } from "@/utils/thedate";
import useTheDateContract from "@/hooks/useTheDateContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { NETWORK_CHAIN_ID } from "@/utils/connectors";
import ArtworkSVG from "@/components/ArtworkSVG";
import ArtworkModelViewer from "@/components/ArtworkModelViewer";
import { useState } from "react";
import { useAsync } from "react-use";
import Link from "next/link";

import { PROJECT_INFO } from "@/utils/constants";

interface ClaimHistoryItem {
  tokenId: number;
  owner: string;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ClaimPage() {
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const [ currentAuctionTokenId, setCurrentAuctionTokenId ] = useState<number | undefined>(undefined);
  const [ totalSupply, setTotalSupply ] = useState<number | undefined>(undefined);
  const [ claimingHistory, setClaimingHistory ] = useState<ClaimHistoryItem[]>([]);

  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);

  useAsync(async () => {
    if (!TheDate) {
      return; 
    }
    setCurrentAuctionTokenId((await TheDate?.getCurrentAuctionTokenId()).toNumber());
    setTotalSupply((await TheDate?.totalSupply()).toNumber());

    const claimingFilter = TheDate.filters.ArtworkClaimed(null, null);
    const claimingHistory_ = await Promise.all((await TheDate.queryFilter(claimingFilter)).map(async (x) => ({
      tokenId: x.args.tokenId.toNumber(),
      owner: x.args.owner,
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })));
    claimingHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
    setClaimingHistory(claimingHistory_);

  }, [TheDate]);

  return (
    <Layout>
      <div className="content">
        <div className="content_item">
          <p>
            Since <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>, only one The Date would be available each date. 
            {currentAuctionTokenId !== undefined && 
              <>
              The earliest date to be claimable was <b>{tokenIdToISODateString(0)}</b> (Token #0).
              The latest date was <b>{tokenIdToISODateString(currentAuctionTokenId - 1)}</b> (Token #{currentAuctionTokenId - 1}). 
              Any date in-between were claimable. {totalSupply !== undefined && <>Currently in total {currentAuctionTokenId - totalSupply} tokens of The Date were available to be claimed.</>}
              </>
            }
          </p>

          <p>
            You can claim the past date via calling <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#writeContract`}><i>claim(tokenId)</i></a>{" "}
            in the contract at price Ξ0.05. {" "}
            Check carefully via calling <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#readContract`}><i>available(tokenId)</i></a> function to see if the date you chosen were claimed by others.
          </p>


          <p>
            For getting The Date of Today, you can join <Link href="/auction"><a>the auction</a></Link> of Today.
          </p>
        </div>

        { claimingHistory.length > 0 && (
          <div className="content_item pt-10">
              <h3>History of Claiming</h3> 
              <table className="text-xs text-left mx-auto text-neutral-content">
                <thead>
                  <tr>
                    <th className="w-60 text-left">Date</th>
                    <th className="w-44 text-left">Claimer</th>
                    <th className="w-44 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                    {claimingHistory.map((x, i) => (
                      <tr key={i}>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatOpenSeaLink("Asset", chainId, PROJECT_INFO.contract_address, x.tokenId)}>
                          { `${tokenIdToISODateString(x.tokenId)} (Token #${x.tokenId})` }
                          </a>
                        </td>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Account", [chainId, x.owner])}>
                            { shortenHex(x.owner) } 
                          </a>
                        </td>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                            { blockTimestampToUTC(x.timestamp) }
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
