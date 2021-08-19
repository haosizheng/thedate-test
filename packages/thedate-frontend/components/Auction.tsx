import Account from './Account';
import ETHBalance from './ETHBalance';
import Link from "next/link";
import TheDateArtwork from "./TheDateArtwork";
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

import { TheDate__factory, TheDate } from '@thefoundation/contracts/typechain';
import { parseBalance, shortenHex, formatEtherscanLink, blockTimestampToUTC } from '../utils/ethers';

export default function Auction() {
  const { library, chainId, account, active, error} = useWeb3React<Web3Provider>();
  const contractOfTheDate = useTheDateContract(true);

  const { data: blockNumber } = useBlockNumber();
  const { data: etherPrice } = useEtherPrice();
  const SECONDS_IN_A_DAY = 86400;

  const [ tokenId, setTokenId ] = useState<BigNumber>();

  useEffect(() => { (async function() {
    if (library) {
      const timestamp = (await library?.getBlock(blockNumber!)).timestamp;
      setTokenId(BigNumber.from(timestamp).div(SECONDS_IN_A_DAY));
    }
  })() }, [library, blockNumber]);

  const { data: bidHistory} = useTheDateBidHistory(tokenId!);
  
  const [ minBidPrice, setMinBidPrice ] = useState<BigNumber>(ethers.constants.Zero);

  useEffect(() => { (async function() {
    if (contractOfTheDate && tokenId) {
      const highestBid = await contractOfTheDate.getHighestBid(tokenId);
      const reservePrice = await contractOfTheDate.getAuctionReservePrice();
      const minBidIncrementPermyriad = await contractOfTheDate.getAuctionMinBidIncrementPermyriad();

      if (highestBid.amount.eq(0)) {
        setMinBidPrice(reservePrice);
      } else {
        setMinBidPrice(highestBid.amount.mul(minBidIncrementPermyriad.add(10000)).div(10000));
      }
    }
  })() }, [tokenId, contractOfTheDate]);

  const errorMessageRef = useRef<HTMLDivElement>();
  const clickToAuction = () => {
    contractOfTheDate?.placeBid(tokenId!, {value: minBidPrice }).then(
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
    <div className="hero flex flex-col">
     
      {/* <p>blockNumber: {blockNumber?.toString()}</p>
      <p>etherPrice: {etherPrice?.toString()}</p>
      <p>tokenId: {tokenId?.toString()}</p>
      
       */}
      <div className="flex-none m-7 h-96 w-96">
        <TheDateArtwork />
      </div>
      <div className="text-center text-xs flex-none py-32 leading-10">
        <p>The Date of Today - MAR 3 2021 - will be minted into Ethernum network immutably in 
          <span className="countdown">
          <span ></span>h
            <span ></span>m        
            <span ></span>s
          </span>. 
        </p>

        <p>Okay. But <Link href="/whitepaper"><a className="link"> why</a></Link>?</p>


        <p>Only one today will be minted. </p>


        <p>Current minimum bid price: <span className="underline">Ξ{ parseBalance(minBidPrice) }</span> </p>
        <p onClick={clickToAuction} className="link">Auction to own the date. </p>
        <div ref={errorMessageRef}></div>
      </div>
      <div className="flex-none justify-center text-xs py-10">
        <table className="">
          <thead>
            <tr>
              <th className="w-44"></th>
              <th className="w-60"></th> 
              <th className="w-44"></th>
            </tr>
          </thead>
          <tbody>
             {bidHistory ? bidHistory!.map( (x) =>  (
                  <tr className="line-through">
                    <td>
                    <span>Ξ{parseBalance(x.args.amount)}</span>
                    </td>
                    <td>
                      <a href={formatEtherscanLink("Transaction", [chainId, x.transactionHash.toString()])}>
                        {/* <span>
                          { blockTimestampToUTC((await x.getBlock()).timestamp) }
                        </span> */}
                      </a>
                    </td>
                    <td><span>{shortenHex(x.args.bidder)}</span></td>
                  </tr>
              )) : <></>}
            <tr>
              <td>
              <span>Ξ11 </span>
              </td>
              <td>
                <span>Mar 3 2021 23:30:12 UTC</span>
              </td>
              <td><span>0x6301...1423</span></td>
            </tr>
            <tr className="line-through">
              <td>
              <span>Ξ11.71 ($23,415.68)</span>
              </td>
              <td>
                <span>Mar 3 2021 23:30:12 UTC</span>
              </td>
              <td><span>0x6301...1423</span></td>
            </tr>
          </tbody>
        </table>
        </div>
    </div>
  );
}

