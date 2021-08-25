import { BigNumber, ethers, EventFilter } from "ethers";
import useTheDateContract from "@/hooks/useTheDateContract"; 
import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import useEtherPrice from "@/hooks/useEtherPrice"; 
import { useState } from "react";
import { parseBalance, shortenHex, formatEtherscanLink, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC } from '@/utils/thedate';
import { useAsync } from "react-use";  
import { formatEther } from "@ethersproject/units";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";
import Link from "next/link";
import { Event } from "ethers";

interface ArtworkHistoryItem {
  tokenId: number;
  from: string;
  action: string;
  message: JSX.Element;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ArtworkHistory({ tokenId }: { tokenId: number }) {
  const { library, chainId } = useActiveWeb3React();
  const TheDate = useTheDateContract();  
  const { exists } = useTheDateArtwork(tokenId);  
  const { data: etherPrice } = useEtherPrice();
  const [ history, setHistory ] = useState<ArtworkHistoryItem[]>([]);

  useAsync(async () => {
    if (!library || !TheDate || !exists) {
      return; 
    }

    const history_ = await Promise.all((await TheDate.queryFilter(TheDate.filters.BidPlaced(tokenId, null, null))).map(async (x) => ({
      from: x.args.bidder,
      message: <span>Bid Placed for Ξ{ parseBalance(x.args.amount) }</span>,
      action: x.event!,
      tokenId: x.args.tokenId.toNumber(),
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })).concat(
      (await TheDate.queryFilter(TheDate.filters.ArtworkMinted(tokenId))).map(async (x) => ({
        from: TheDate.address,
        message: <span>Artwork Minted</span>,
        action: x.event!,
        tokenId: x.args.tokenId.toNumber(),
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
    }))).concat(
      (await TheDate.queryFilter(TheDate.filters.ArtworkNoteEngraved(tokenId, null, null))).map(async (x) => ({
        from: x.args.owner,
        message: <span>Engrave note &quote;{x.args.note}&quote;</span>,
        action: x.event!,
        tokenId: x.args.tokenId.toNumber(),
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
    }))).concat(
      (await TheDate.queryFilter(TheDate.filters.ArtworkNoteErased(tokenId, null))).map(async (x) => ({
        from: x.args.owner,
        message: <span>Erase note.</span>,
        action: x.event!,
        tokenId: x.args.tokenId.toNumber(),
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
    }))).concat(
      (await TheDate.queryFilter(TheDate.filters.AuctionEnded(tokenId, null, null))).map(async (x) => ({
        from: x.args.winner,
        message: <span>Claim artwork</span>,
        action: x.event!,
        tokenId: x.args.tokenId.toNumber(),
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
    }))).concat(
      (await TheDate.queryFilter(TheDate.filters.Transfer(null, null, tokenId)))
        .filter((x) => (x.args.from !== TheDate.address && x.args.from !== ethers.constants.AddressZero))
        .map(async (x) => ({
        from: x.args.from,
        message: <span>Transfer to <Link href={`/gallery/${x.args.to}`}><a className="hover:link">{ shortenHex(x.args.to) }</a></Link></span>,
        action: x.event!,
        tokenId: x.args.tokenId.toNumber(),
        transactionHash: x.transactionHash,
        blockNumber: x.blockNumber,
        timestamp: (await x.getBlock()).timestamp
    }))));

    history_.sort((a, b) => (b.blockNumber - a.blockNumber));
    setHistory(history_);
  }, [library, TheDate, exists]);

  return (
    <table className="text-xs text-left">
      <thead>
        <tr>
          <th className="w-60 text-left">Time</th>     
          <th className="w-44 text-left">From</th>
          <th className="w-60 text-left">Message</th> 
        </tr>
      </thead>
      <tbody>
          {history && history.map((x, i) => (
            <tr key={i} className=" ">
              <td>
                <a className="hover:link" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                  { blockTimestampToUTC(x.timestamp) }
                </a>
              </td>
              <td>
                <Link href={`/gallery/${x.from}`}>
                  <a className="hover:link">
                  { shortenHex(x.from) }
                </a>
                </Link>
              </td>
              <td>
                {x.message}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}