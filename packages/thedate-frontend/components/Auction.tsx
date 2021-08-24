import Link from "next/link";
import { useAsync } from "react-use";
import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { useState, useRef } from 'react';

import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 

import useEtherPrice from '@/hooks/useEtherPrice';
import useBlockNumber from '@/hooks/useBlockNumber';
import useTheDateContract from '@/hooks/useTheDateContract';
import Wallet from './Wallet';
import Countdown from "react-countdown";
import { SECONDS_IN_A_DAY, tokenIdToDateString } from "@/utils/thedate"
import { parseBalance } from '@/utils/ethers';

import ArtworkBidHistory from './ArtworkBidHistory';
import ArtworkModelViewer from './ArtworkModelViewer';

export default function Auction() {
  const { library, chainId, account, active, error} = useActiveWeb3React();
  const TheDate = useTheDateContract();  

  const { data : blockNumber} = useBlockNumber();
  const [ tokenId, setTokenId ] = useState<number>(0);

  const [ minBidPrice, setMinBidPrice ] = useState<BigNumber>(ethers.constants.Zero);
  const [ highestBidder, setHighestBidder] = useState<string>(null!);
  const [ highestBid, setHighestBid] = useState<BigNumber>(null!);
  const [ reservePrice, setReservePrice] = useState<BigNumber>(null!);
  const [ minBidIncrementPermyriad, setMinBidIncrementPermyriad] = useState<BigNumber>(null!);

  useAsync(async () => {
    if (!library || !TheDate || !blockNumber) {
      return;
    }
    const timestamp_ = (await library.getBlock(blockNumber)).timestamp;
    const tokenId_ = BigNumber.from(timestamp_).div(SECONDS_IN_A_DAY).toNumber();
    setTokenId(tokenId_);

    const { bidder: highestBidder_, amount: highestBid_ } = await TheDate.getHighestBid(tokenId);
    const reservePrice_ = await TheDate.getAuctionReservePrice();
    const minBidIncrementPermyriad_ = await TheDate.getAuctionMinBidIncrementPermyriad();
    
    if (highestBid_ && highestBid_.eq(0)) {
      setMinBidPrice(reservePrice_);
    } else {
      setMinBidPrice(highestBid_.mul(minBidIncrementPermyriad_.add(10000)).div(10000));
    }

    setHighestBid(highestBid_);
    setHighestBidder(highestBidder_);
    setMinBidIncrementPermyriad(minBidIncrementPermyriad_);
    setReservePrice(reservePrice_);
  }, [library, TheDate, blockNumber]);

  const errorMessageRef = useRef<HTMLDivElement>(null!);

  const clickToAuction = () => {
    TheDate?.placeBid(tokenId!, {value: minBidPrice }).then(
      (reason) => {
        if (errorMessageRef.current) {
          errorMessageRef.current!.innerText = "Success!";
        }
      }
    ).catch(
      (reason) => {
        if (errorMessageRef.current) {
          errorMessageRef.current!.innerText = reason.data.message;
        }
      }
    )
  };

  return (
    <>
      <div className="hero">
        <div className="hero-content h-96 w-full">
          { tokenId ? <ArtworkModelViewer tokenId={tokenId} /> : "Loading..." }
        </div>
      </div>
      <div className="hero">
        <div className="hero-content py-16 leading-10 max-w-prose text-left flex-col flex">
          <p className="mb-44">
            One and only one <Link href="/about"><a className="link"><b>The Date</b></a></Link> artwork of Today - { tokenIdToDateString(tokenId) } - is 
            available to mint into Ethernum network immutably in {" "}
            <Countdown intervalDelay={1000} 
              date={new Date(tokenId * (SECONDS_IN_A_DAY + 1) * 1000)}
              renderer={ ({ hours, minutes, seconds, completed }) => {
                if (completed) {
                  // Render a completed state
                  return <span>Auction ended!</span>;
                } else {
                  // Render a countdown
                  return <span>{hours}:{minutes}:{seconds}</span>;
                }
              }} 
            />
            .
          </p>

          <p className="">
            Auction to win the date. 
          </p>
          {/* <p>Why?  <Link href="/about"><a className="link">About The Date art project</a></Link></p> */}

          <p className="">
            { reservePrice && <> Reserve Price is Ξ{parseBalance(reservePrice)}. </> }
            { highestBid && highestBid.gt(0) && minBidIncrementPermyriad && <>Current highest bid is Ξ{parseBalance(highestBid)}. 
              Bidding {minBidIncrementPermyriad.div(100).toNumber()}% more is required. </>}
          </p>

          {!account ?
            <p>
              Connect your Wallet to start bidding. 
            </p>
          : 
            <p>
              Place your bid with 
            Ξ<input type="text" 
              className="bg-transparent focus:outline-none focus:border-none underline " 
              value={parseBalance(minBidPrice)} 
              onChange={() => {return true;}} pattern="^-?[0-9]\d*\.?\d*$"/>
              <a onClick={clickToAuction} className="hover:link" > to own the date. </a>
            </p>
          }
          <div className="text-xs" ref={errorMessageRef}></div>
        </div>
      </div>
      { tokenId &&
        <div className="hero">
          <div className="hero-content">
            <ArtworkBidHistory tokenId={tokenId}/>
          </div>
        </div>
      }
    </>
  );
}

