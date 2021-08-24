import { BigNumber } from "ethers";
import useTheDateContract from "@/hooks/useTheDateContract"; 
import useBlockNumber from "@/hooks/useBlockNumber"; 
import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import useEtherPrice from "@/hooks/useEtherPrice"; 
import { useState } from "react";
import { parseBalance, shortenHex, formatEtherscanLink, toPriceFormat } from '@/utils/ethers';
import { SECONDS_IN_A_DAY, blockTimestampToUTC } from '@/utils/thedate';
import { useRendersCount, useAsync } from "react-use";  
import { formatEther } from "@ethersproject/units";

interface BidHistoryItem {
  tokenId: number;
  bidder: string;
  amount: BigNumber;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ArtworkBidHistory() {
  const { library, chainId } = useActiveWeb3React();
  const TheDate = useTheDateContract();  
  const { data : blockNumber} = useBlockNumber();
  const { data: etherPrice } = useEtherPrice();
  const [ tokenId, setTokenId ] = useState<number>(0);
  const [ bidHistory, setBidHistory ] = useState<BidHistoryItem[]>([]);
  const rendersCount = useRendersCount();

  useAsync(async () => {
    if (!library || !blockNumber || !TheDate) {
      return; 
    }
    const block_ = await library.getBlock(blockNumber);
    const tokenId_ = BigNumber.from(block_.timestamp).div(SECONDS_IN_A_DAY).toNumber();
    const filter = TheDate.filters.BidPlaced(tokenId_, null, null);
    const bidHistory_ = await Promise.all((await TheDate.queryFilter(filter)).map(async x => ({
      tokenId: x.args.tokenId.toNumber(),
      bidder: x.args.bidder,
      amount: x.args.amount,
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })));
    bidHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
    setTokenId(tokenId_);
    setBidHistory(bidHistory_);
    // [
    //   TheDate?.filters.ArtworkMinted(tokenId),
    //   TheDate?.filters.ArtworkNoteEngraved(tokenId, null),
    //   TheDate?.filters.ArtworkNoteErased(tokenId),
    //   TheDate?.filters.AuctionEnded(tokenId, null, null),
    //   TheDate?.filters.Transfer(null, null, tokenId)];

  }, [blockNumber, library, TheDate]);

  return (
    <table className="text-xs text-left">
      <thead>
        <tr>
          <th className="w-60 text-left">Time</th>
          <th className="w-44 text-left">From</th>
          <th className="w-44 text-left">Price</th>        
        </tr>
      </thead>
      <tbody>
          {bidHistory && bidHistory.map((x, i) => (
            <tr key="{i}" className={ i > 0 ? "line-through" : ""}>
              <td>
                <a className="link" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                  { blockTimestampToUTC(x.timestamp) }
                </a>
              </td>
              <td>
                <a className="link" href={formatEtherscanLink("Account", [chainId, x.bidder])}>
                  { shortenHex(x.bidder) }
                </a>
              </td>
              <td>
                Ξ{ parseBalance(x.amount) } { 
                  etherPrice ? `(\$${toPriceFormat(Number(formatEther(x.amount)) * etherPrice)})` : "" }
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}