import Link from "next/link";
import { useAsync } from "react-use";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { useState, useRef } from 'react';

import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 

import useEtherPrice from '@/hooks/useEtherPrice';
import useBlockNumber from '@/hooks/useBlockNumber';
import useTheDateContract from '@/hooks/useTheDateContract';
import Countdown from "react-countdown";
import { SECONDS_IN_A_DAY, tokenIdToDateString } from "@/utils/thedate"
import { parseBalance, shortenHex, formatEtherscanLink, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC } from '@/utils/thedate';
import { formatEther } from "@ethersproject/units";

// import ArtworkBidHistory from './ArtworkBidHistory';
import ArtworkModelViewer from './ArtworkModelViewer';

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
  const [ minBidIncrementPermyriad, setMinBidIncrementPermyriad] = useState<BigNumber | undefined>(undefined);
  const [ bidPrice, setBidPrice] = useState<BigNumber | undefined>(undefined);
  const [ bidHistory, setBidHistory ] = useState<BidHistoryItem[]>([]);
  const { data: etherPrice } = useEtherPrice();

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    try {
      const reservePrice_ = await TheDate.getAuctionReservePrice();
      const minBidIncrementPermyriad_ = await TheDate.getAuctionMinBidIncrementPermyriad();
      setMinBidIncrementPermyriad(minBidIncrementPermyriad_);
      setReservePrice(reservePrice_);
      setMinBidPrice(reservePrice_);

      const blockNumber_ = await library.getBlockNumber();
      const timestamp_ = (await library.getBlock(blockNumber_)).timestamp;
      const tokenId_ = BigNumber.from(timestamp_).div(SECONDS_IN_A_DAY).toNumber();
      setTokenId(tokenId_);

      const exists_ = await TheDate.exists(tokenId_);
      setExists(exists_);
      if (!exists_) {
        return;
      }

      const { bidder: highestBidder_, amount: highestBid_ } = await TheDate.getHighestBid(tokenId_);
      
      if (!!highestBidder_ && highestBidder_ !== ethers.constants.AddressZero ) {
        setMinBidPrice(highestBid_.mul(minBidIncrementPermyriad_.add(10000)).div(10000));
      }

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

  const clickToAuction = () => {
    // const bidPrice = bidPriceRef.current ?
    // ethers.utils.parseEther(bidPriceRef.current.conte)
    // const typeInBidPrice = Number.parseFloat(bidPriceRef.current?.textContent);
    if (!active || !account || !TheDate || !tokenId) {
      return ;
    }
    TheDate.placeBid(tokenId, {value: minBidPrice }).then(
      (reason) => {
        if (errorMessageRef.current) {
          errorMessageRef.current!.innerText = "Success!";
          window.setTimeout(() => {
            errorMessageRef.current.innerText = ""
          }, 5000);
        }
      }
    ).catch(
      (reason) => {
        if (errorMessageRef.current) {
          errorMessageRef.current.innerText = reason.message;
          window.setTimeout(() => {
            errorMessageRef.current.innerText = ""
          }, 5000);
        }
      }
    )
  };

  const bidPriceOnChange = (typeInValue: string) => {
    const bidPrice = ethers.utils.parseEther(typeInValue);
    if (bidPrice >= minBidPrice) {
      setBidPrice(bidPrice)
      return true;
    }
    return false;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (tokenId == undefined || tokenId == 0
    ? <div className="hero">Loading...</div> 
    : (<>
      <div className="hero">
        <div className="flex items-center max-h-80 h-80 md:h-120 md:max-h-120 xl:h-150 xl:max-h-150 w-screen -mt-10 ">
          <ArtworkModelViewer tokenId={tokenId} noteString="(to be engraved by the note owner)" fov={30} />
        </div>
      </div>
      <div className="hero">
        <div className="flex px-5 md:px-0 items-left py-20 leading-10 max-w-prose text-left flex-col flex">
          <div className="">
            One and only one {" "}
            <Link href="/about"><a className="link"><b>The Date</b></a></Link> {" "}
            artwork of today &quot;{ tokenIdToDateString(tokenId) }&quot; is 
            available to be auctioned and minted into Ethernum network immutably in remaining {" "}
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
            .
          </div>
        </div>
      </div>
      <div className="hero">
        <div className="flex items-start flex-col px-5 py-16 md:px-0  max-w-prose w-full">
          <div className="mb-5 ">Auction for Today &quot;{ tokenIdToDateString(tokenId) }&quot;:</div>
          { bidHistory.length > 0 && (
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
                            <Link href={`/gallery/${x.bidder}`}>
                              <a className="hover:link">
                              { shortenHex(x.bidder) } { account === x.bidder && <> (you)</>}
                            </a>
                            </Link>
                          </td>
                          <td>
                            Ξ{ parseBalance(x.amount) } { 
                              etherPrice !== undefined ? `(\$${toPriceFormat(Number(formatEther(x.amount)) * etherPrice)})` : "" }
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )
            }
            <div className="text-xs mt-5 text-left">
              { bidHistory.length == 0 && <> No bid is placed yet. <br/></> }
              { !!reservePrice && <> Reserve Price is Ξ{parseBalance(reservePrice)}. <br/></> } 
              { !!highestBid  && <>Current highest bid is Ξ{parseBalance(highestBid)}. <br/> </>}
              { !!minBidIncrementPermyriad && <>Bidding {minBidIncrementPermyriad.div(100).toNumber()}% more is required. </>} 
            </div>
        </div>
      </div>
      <div className="hero">
        <div className="flex self-start items-start flex-col px-5 py-16 md:px-0 max-w-prose w-full">
          <div className="flex-none text-left ">
          {!account ?
              <p>
                Connect your wallet below to join the auction.
              </p>
            : 
                <form onSubmit={handleSubmit}>
                  <p>
                  <a onClick={clickToAuction} className="link" >Place your bid</a> with 
                  Ξ<input type="text" 
                    ref={ bidPriceRef }
                    className="bg-transparent hover:border focus:border border-none border-black w-20 " 
                    pattern="^[0-9]\d*\.?\d*$"
                    value={parseBalance(minBidPrice)}
                    onChange= { e => bidPriceOnChange(e.target.value) } 
                    placeholder={parseBalance(minBidPrice)} /> {" "} <br/>
                  </p>
                </form>
            }
            <div className="text-xs mt-2 text-gray-400" ref={errorMessageRef}></div>
          </div>
        </div>
      </div>
    </>));
}

