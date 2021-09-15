import Layout from "@/components/Layout";
import { formatEtherscanLink, formatOpenSeaLink, parseBalance, shortenHex, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC, ISODateToTokenId, SECONDS_IN_A_DAY, tokenIdToDateString, tokenIdToISODateString } from "@/utils/thedate";
import useTheDateContract from "@/hooks/useTheDateContract";
import useLootContract from "@/hooks/useLootContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useState, useRef, ReactElement } from "react";
import { useAsync } from "react-use";
import moment from "moment";
import { injected, NETWORK_CHAIN_ID } from "@/utils/connectors";
import { useWeb3React } from '@web3-react/core';
import { PROJECT_INFO } from "@/utils/constants";
import { ethers } from "ethers";

interface ClaimHistoryItem {
  tokenId: number;
  owner: string;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ClaimPage() {
  const {account, activate} = useWeb3React();
  const {chainId} = useActiveWeb3React();
  const TheDate = useTheDateContract();
  const Loot = useLootContract();

  const [ isLootUser, setIsLootUser ] = useState<boolean | undefined>(undefined);

  const [ currentAuctionTokenId, setCurrentAuctionTokenId ] = useState<number | undefined>(undefined);
  const [ totalSupply, setTotalSupply ] = useState<number | undefined>(undefined);
  const [ claimingHistory, setClaimingHistory ] = useState<ClaimHistoryItem[]>([]);

  const [inputDateString, setInputDateString] = useState<string | undefined>("");
  const hintRef = useRef<ReactElement>(<></>);
  const etherscanLinkOfToken = formatEtherscanLink("Token", [chainId, TheDate?.address]);
  const contractLinkToRead = ((s: string) => 
    <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#readContract`}><i>{`${s}`}</i></a>
  );
  const contractLinkToWrite = ((s: string) => 
    <a target="_blank" rel="noreferrer" href={`${etherscanLinkOfToken}#writeContract`}><i>{`${s}`}</i></a>
  );

  useAsync(async () => {
    if (!TheDate) {
      return; 
    }
    setCurrentAuctionTokenId((await TheDate?.getCurrentAuctionTokenId()).toNumber());
    setTotalSupply((await TheDate?.totalSupply()).toNumber());

    // const claimingFilter = TheDate.filters.ArtworkClaimed(null, null);
    // const claimingHistory_ = await Promise.all((await TheDate.queryFilter(claimingFilter)).map(async (x) => ({
    //   tokenId: x.args.tokenId.toNumber(),
    //   owner: x.args.owner,
    //   transactionHash: x.transactionHash,
    //   blockNumber: x.blockNumber,
    //   timestamp: (await x.getBlock()).timestamp
    // })));
    // claimingHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
    // setClaimingHistory(claimingHistory_);

  }, [TheDate]);

  useAsync(async() => {
    if (account === undefined || account === null || !Loot)  {
      return; 
    }
    
    setIsLootUser((await Loot.balanceOf(account)).gt(0));
  }, [account, Loot]);

  useAsync(async () => {
    if (inputDateString === undefined || !TheDate || !currentAuctionTokenId) {
      return;
    }

    if (inputDateString === "") {
      hintRef.current = <></>;
    }

    const aDate = moment(inputDateString, 'YYYY-MM-DD', true);

    if (!inputDateString.match(/^\d{4}[\-]\d{2}[\-]\d{2}$/)) {
      hintRef.current = (<span className="text-xs">The Date should be in format &quot;yyyy-mm-dd&quot;, e.g. 2021-09-12</span>);
      return;
    } else if (!aDate.isValid()) {
      hintRef.current = (<span className="text-xs">Invalid date</span>);
      return;
    }
    
    const tokenId = ISODateToTokenId(inputDateString);
    if (0 <= tokenId && tokenId < currentAuctionTokenId) {
      let currentISODate = tokenIdToISODateString(tokenId);
      
      hintRef.current = (<span className="text-xs">{`Checking if ${currentISODate} (Token #${tokenId}) is available...`}</span>);
      const available = await TheDate?.available(tokenId);
      const claimingPrice = await TheDate?.claimingPrice();
      if (available) {
        hintRef.current = (<><span className="text-xs">{`${currentISODate} (Token #${tokenId})`} is available. </span><br/><br/>
          { account ?
          <span><button className="text-neutral-focus hover:underline" onClick={async () => {
            await TheDate?.claim(tokenId, {value: 
              isLootUser ? ethers.constants.Zero : claimingPrice });
          }}>Click here to claim {`${currentISODate} (Token #${tokenId})`} {isLootUser ? " at Ξ0.00 because you are Loot owner." : " at Ξ0.01" }  </button></span>
          : <span className="wallet"><button onClick={() => { activate(injected) }} >
          Connect your Metamask
        </button> before claiming. </span>}</>);
      } else {
        hintRef.current = (<span className="text-xs">{`${currentISODate} (Token #${tokenId}) is unavailable.`}</span>);
      }
    } else {
      hintRef.current = (<span className="text-xs">{`Wrong date range. It should be from 1970-01-01 to ${tokenIdToISODateString(currentAuctionTokenId)}.`}</span>);
    }
  }, [TheDate, Loot, inputDateString, currentAuctionTokenId]);

  return (
    <Layout>
      <div className="content">
        <div className="content_item">
         
          <h3>Claim The Date</h3> 
           <p>
            You could claim The Date of past via 
            calling {contractLinkToWrite("claim(tokenId)")} in the contract 
            at {contractLinkToRead("claimingPrice")} Ξ0.01. Loot holders are free to claim.
          </p>

          <h3>Check availability</h3> 
          <p>
            Since <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Unix_time">Unix Epoch</a>, 
            only one The Date NFT a day is availabile.{" "}
            {currentAuctionTokenId !== undefined && 
              <>
              The earliest one was <b>{tokenIdToISODateString(0)}</b> (Token #0).
              The latest one (Today) is <b>{tokenIdToISODateString(currentAuctionTokenId)}</b> (Token #{currentAuctionTokenId}). 
              </>
            }
          </p>

          <p>
            <label>Check if the Date you want is available: </label>
            <input autoFocus className="user-input w-32" 
              placeholder="" type="text"
              onChange={(event) => { setInputDateString(event.target.value); }}
              />
            <br/>
            <span>{hintRef.current}</span>
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
