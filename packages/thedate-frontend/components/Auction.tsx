import ArtworkSVG from '@/components/ArtworkSVG';
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useEtherPrice from '@/hooks/useEtherPrice';
import useTheDateContract from '@/hooks/useTheDateContract';
import { formatEtherscanLink, parseBalance, shortenHex, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC, SECONDS_IN_A_DAY, tokenIdToDateString, tokenIdToISODateString } from "@/utils/thedate";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useRef, useState } from 'react';
import Countdown from "react-countdown";
import { useAsync } from "react-use";
import { PROJECT_INFO } from "@/utils/constants";

interface BidHistoryItem {
  tokenId: number;
  bidder: string;
  amount: BigNumber;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function Auction() {
  const { library, chainId, account, active, error} = useActiveWeb3React();
  const TheDate = useTheDateContract();  
  const [ tokenId, setTokenId ] = useState<number | undefined>(undefined);
  const [ exists, setExists ] = useState<boolean | undefined>(undefined);
  const [ minBidPrice, setMinBidPrice ] = useState<BigNumber>(ethers.constants.Zero);
  const [ highestBidder, setHighestBidder] = useState<string | undefined>(undefined);
  const [ highestBid, setHighestBid] = useState<BigNumber | undefined>(undefined);
  const [ reservePrice, setReservePrice] = useState<BigNumber | undefined>(undefined);
  const [ minBidIncrementBps, setMinBidIncrementBps] = useState<BigNumber | undefined>(undefined);
  const [ bidHistory, setBidHistory ] = useState<BidHistoryItem[]>([]);
  const { data: etherPrice } = useEtherPrice();

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    try {
      const reservePrice_ = await TheDate.reservePrice();
      const minBidIncrementBps_ = await TheDate.minBidIncrementBps();
      const minBidPrice_ = await TheDate.getCurrentMinimumBid();
      const tokenId_ = (await TheDate.getCurrentAuctionTokenId()).toNumber();
      
      setMinBidIncrementBps(minBidIncrementBps_);
      setReservePrice(reservePrice_);
      setMinBidPrice(minBidPrice_);
      setTokenId(tokenId_);

      const exists_ = await TheDate.exists(tokenId_);
      setExists(exists_);
      if (!exists_) {
        return;
      }

      const { bidder: highestBidder_, amount: highestBid_ } = await TheDate.getHighestBid(tokenId_);
      setHighestBid(highestBid_);
      setHighestBidder(highestBidder_);

      const filter = TheDate.filters.BidPlaced(tokenId_, null, null);
      const bidHistory_ = await Promise.all((await TheDate.queryFilter(filter)).map(async (x) => ({
        tokenId: x.args.tokenId.toNumber(),
        bidder: x.args.bidder,
        amount: x.args.amount,
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
      })));
      bidHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
      setBidHistory(bidHistory_);

    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [library, TheDate]);

  const errorMessageRef = useRef<HTMLDivElement>(null!);
  const bidPriceRef = useRef<HTMLInputElement>(null!);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (tokenId == undefined || tokenId == 0
    ? <div className="content">
      <p className="text-center">Loading...</p>
      </div> 
    : <div className="content">
        <figure>
          <ArtworkSVG dateString={tokenIdToISODateString(tokenId)} noteString="(to be engraved by the note owner)" />
        </figure>
        <div className="faq__item">
          <p>
            The Date of today &quot;<span className="text-neutral-base">{ tokenIdToISODateString(tokenId) }</span>&quot; (Token #{tokenId}) is 
            available to be auctioned and minted into Ethernum network immutably in remaining {" "}
            <span className="text-neutral-base"> 
            <Countdown intervalDelay={1000} 
              date={new Date((tokenId + 1) * SECONDS_IN_A_DAY * 1000)}
              renderer={ ({ formatted, completed }) => {
                if (completed) {
                  // Render a completed state
                  return <span>00:00:00</span>;
                } else {
                  // Render a countdown
                  return <span>{formatted.hours}:{formatted.minutes}:{formatted.seconds}</span>;
                }
              }} 
            />
            </span>.
          </p>
          <p>
              { bidHistory.length == 0 && <> No bid is placed yet. </> }
              { !!reservePrice && <> Reserve Price is Ξ{parseBalance(reservePrice)}. </> } 

              { !!highestBid  && <>Current highest bid is Ξ{parseBalance(highestBid)}. </>}
              { !!minBidPrice && <>Bidding <span className="text-neutral-base">Ξ{parseBalance(minBidPrice)}</span> or more is required. </>} 
          </p>
          <p>
            Place your bid via <a href={`${PROJECT_INFO.etherscan_url}#writeContract`}>the contract</a>. 
          </p>
        </div>
        
        { bidHistory.length > 0 && (
          <div className="faq__item">
            <h3>Auction for Today &quot;{ tokenIdToDateString(tokenId) }&quot;:</h3>
            <div className="flex items-start flex-col px-5 py-16 md:px-0 max-w-prose w-full">
              <table className="text-xs text-left">
                <thead>
                  {bidHistory.length > 0 &&
                    <tr>
                      <th className="w-52 text-left">Time</th>
                      <th className="w-40 text-left">From</th>
                      <th className="w-44 text-left">Price</th>        
                    </tr>
                  }
                </thead>
                <tbody>
                    {bidHistory.map((x, i) => (
                      <tr key={i} className={ i > 0 ? "line-through text-gray-400" : ""}>
                        <td>
                          <a className="hover:link" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                            { blockTimestampToUTC(x.timestamp) }
                          </a>
                        </td>
                        <td>
                            <a className="hover:link" href={formatEtherscanLink("Account", [chainId, x.bidder])}>
                            { shortenHex(x.bidder) } { account === x.bidder && <> (you)</>}
                          </a>
                        </td>
                        <td>
                          Ξ{ parseBalance(x.amount) } { 
                            etherPrice !== undefined ? `(\$${toPriceFormat(Number(formatEther(x.amount)) * etherPrice)})` : "" }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    );
}

