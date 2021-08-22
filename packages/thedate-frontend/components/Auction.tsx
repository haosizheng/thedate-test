import Account from './.Account';
import ETHBalance from './ETHBalance';
import Link from "next/link";
import TheDateNewArtwork from "./TheDateNewArtwork";

import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { formatEther, parseEther, parseUnits } from '@ethersproject/units';
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

import { useEffect, useState, useRef, useCallback } from 'react';
import useEtherPrice from '../hooks/useEtherPrice';
import useBlockNumber from '../hooks/useBlockNumber';
import useTheDateBidHistory from '../hooks/useTheDateBidHistory';
import useTheDateContract from '../hooks/useTheDateContract';
import Wallet from './Wallet';
import Countdown from "react-countdown";

import { TheDate__factory, TheDate } from '@thefoundation/contracts/typechain';
import { parseBalance, shortenHex, formatEtherscanLink, blockTimestampToUTC, blockTimestampToDate } from '../utils/ethers';

import { useAsync } from "react-use";
import ArtworkBidHistory from './ArtworkBidHistory';

const SECONDS_IN_A_DAY = 86400;

export default function Auction() {
  const { library, chainId, account, active, error} = useWeb3React<Web3Provider>();
  const TheDate = useTheDateContract();  
  const { data : blockNumber} = useBlockNumber();
  const { data: etherPrice } = useEtherPrice();
  const [ tokenId, setTokenId ] = useState<number>(0);
  const [ timestamp, setTimestamp ] = useState<number>(null!);
  const [ minBidPrice, setMinBidPrice ] = useState<BigNumber>(ethers.constants.Zero);
  const [ highestBidder, setHighestBidder] = useState<string>(null!);
  const [ highestBid, setHighestBid] = useState<BigNumber>(null!);
  const [ reversePrice, setReversePrice] = useState<BigNumber>(null!);

  const [ minBidIncrementPermyriad, setMinBidIncrementPermyriad] = useState<BigNumber>(null!);

  useAsync(async () => {
    if (!library || !TheDate) {
      return;
    }
    const timestamp_ = (await library.getBlock(blockNumber!)).timestamp;
    const tokenId_ = BigNumber.from(timestamp).div(SECONDS_IN_A_DAY).toNumber();
    setTokenId(tokenId_);
    setTimestamp(timestamp_);

    const { bidder: highestBidder_, amount: highestBid_ } = await TheDate.getHighestBid(tokenId);
    const reservePrice_ = await TheDate.getAuctionReservePrice();
    const minBidIncrementPermyriad_ = await TheDate.getAuctionMinBidIncrementPermyriad();
    
    if (highestBid_.eq(0)) {
      setMinBidPrice(reservePrice_);
    } else {
      setMinBidPrice(highestBid_.mul(minBidIncrementPermyriad_.add(10000)).div(10000));
    }
    setHighestBid(highestBid_);
    setHighestBidder(highestBidder_);
    setMinBidIncrementPermyriad(minBidIncrementPermyriad_);
    setReversePrice(reservePrice_);

  }, [library, blockNumber]);

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
         <TheDateNewArtwork />
        </div>
      </div>
      <div className="hero">
        <div className="hero-content text-xs py-16 leading-10 max-w-prose text-left flex-col flex">
          <p>
            One and only one <b>The Date</b> artwork of Today - { blockTimestampToDate(timestamp) } - is 
            available to mint into Ethernum network immutably in <Countdown
             date={new Date(tokenId * (SECONDS_IN_A_DAY + 1) - 1) }
             />
            
            <span className="countdown">
            <span ></span>h
              <span ></span>m
              <span ></span>s
            </span>. 
          </p>

          <p>Okay. But <Link href="/about"><a className="link"> why</a></Link>?</p>


          <p>Current minimum required bid price: 
          Ξ<input type="text" 
            className="bg-transparent focus:outline-none focus:border-none" 
            value={parseBalance(minBidPrice)} 
            onChange={() => {}} pattern="^-?[0-9]\d*\.?\d*$"/>
          </p>
          <p onClick={clickToAuction} className="hover:badge link">Auction to own the date. </p>
          <div ref={errorMessageRef}></div>
          <Wallet/>
        </div>
      </div>
      <div className="hero">
        <div className="hero-content">
          <ArtworkBidHistory/>
        </div>
      </div>
    </>
  );
}

