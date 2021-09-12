import ArtworkSVG from '@/components/ArtworkSVG';
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useTheDateContract from '@/hooks/useTheDateContract';
import { formatEtherscanLink, formatOpenSeaLink, parseBalance, shortenHex, toPriceFormat } from '@/utils/ethers';
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
  const [ auctionHistory, setAuctionHistory ] = useState<BidHistoryItem[]>([]);

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

      const auctionFilter = TheDate.filters.AuctionSettled(null, null, null);
      const auctionHistory_ = await Promise.all((await TheDate.queryFilter(auctionFilter)).map(async (x) => ({
        tokenId: x.args.tokenId.toNumber(),
        bidder: x.args.winner,
        amount: x.args.amount,
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
      })));
      auctionHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
      setAuctionHistory(auctionHistory_);

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
        <div className="content_item">
          <p className="pb-10">
            The Date of Today &quot;<span className="text-neutral-base">{ tokenIdToISODateString(tokenId) }</span>&quot; (Token #{tokenId}) is 
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
              { bidHistory.length == 0 ?
               <> No bid is placed yet. 
               { !!reservePrice && <> Reserve Price is Ξ{parseBalance(reservePrice)}. </> } 
               </> 
              : <>
                { !!highestBid  && <>Current highest bid is Ξ{parseBalance(highestBid)}. </>}
                { !!minBidPrice && <>Bidding <span className="text-neutral-base">Ξ{parseBalance(minBidPrice)}</span> or more is required. </>} 
                </>
              }
              <br/>
              Place your bid via <a target="_blank" rel="noreferrer" href={`${PROJECT_INFO.etherscan_url}#writeContract`}>the contract</a> via calling placeBid() function. 
          </p>
        </div>
        
        { bidHistory.length > 0 && (
          <div className="content_item pt-10">
              <h3>Bidding History for Today &quot;{ tokenIdToISODateString(tokenId) }&quot;:</h3> 
              <table className="text-xs text-left mx-auto text-neutral-content">
                <thead>
                  <tr>
                    <th className="w-60 text-left">Time</th>
                    <th className="w-44 text-left">From</th>
                    <th className="w-44 text-left">Bid</th>        
                  </tr>
                </thead>
                <tbody>
                    {bidHistory.map((x, i) => (
                      <tr key={i} className={ i > 0 ? "line-through" : ""}>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                            { blockTimestampToUTC(x.timestamp) }
                          </a>
                        </td>
                        <td>
                            <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Account", [chainId, x.bidder])}>
                            { shortenHex(x.bidder) } { account === x.bidder && <> (you)</>}
                          </a>
                        </td>
                        <td>
                          Ξ{ parseBalance(x.amount) } 
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        )}

        { auctionHistory.length > 0 && (
          <div className="content_item pt-10">
              <h3>History for Past Auctions</h3> 
              <table className="text-xs text-left mx-auto text-neutral-content">
                <thead>
                  <tr>
                    <th className="w-60 text-left">Date</th>
                    <th className="w-44 text-left">Winner</th>
                    <th className="w-44 text-left">Price</th>        
                  </tr>
                </thead>
                <tbody>
                    {auctionHistory.map((x, i) => (
                      <tr key={i}>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatOpenSeaLink("Asset", chainId, PROJECT_INFO.contract_address, x.tokenId)}>
                          { `${tokenIdToISODateString(x.tokenId)} (Token #${x.tokenId})` }
                          </a>
                        </td>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Account", [chainId, x.bidder])}>
                            { shortenHex(x.bidder) } { account === x.bidder && <> (you)</>}
                          </a>
                        </td>
                        <td>
                          <a target="_blank" rel="noreferrer" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                          Ξ{ parseBalance(x.amount) } 
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        )}
      </div>
    );
}

