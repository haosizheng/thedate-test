import { BigNumber } from "ethers";
import useTheDateContract from "@/hooks/useTheDateContract"; 
import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import useEtherPrice from "@/hooks/useEtherPrice"; 
import { useState } from "react";
import { parseBalance, shortenHex, formatEtherscanLink, toPriceFormat } from '@/utils/ethers';
import { blockTimestampToUTC } from '@/utils/thedate';
import { useAsync } from "react-use";  
import { formatEther } from "@ethersproject/units";
import useTheDateArtwork from "@/hooks/useTheDateArtwork";

interface BidHistoryItem {
  tokenId: number;
  bidder: string;
  amount: BigNumber;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ArtworkBidHistory({ tokenId }: { tokenId: number }) {

  const { library, chainId } = useActiveWeb3React();
  const TheDate = useTheDateContract();  
  const {exists} = useTheDateArtwork(tokenId);  

  const { data: etherPrice } = useEtherPrice();
  const [ bidHistory, setBidHistory ] = useState<BidHistoryItem[]>([]);

  useAsync(async () => {
    if (!library || !TheDate || !exists) {
      return; 
    }
    const filter = TheDate.filters.BidPlaced(tokenId, null, null);
    const bidHistory_ = await Promise.all((await TheDate.queryFilter(filter)).map(async x => ({
      tokenId: x.args.tokenId.toNumber(),
      bidder: x.args.bidder,
      amount: x.args.amount,
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })));
    bidHistory_.sort((a, b) => (b.blockNumber - a.blockNumber));
    setBidHistory(bidHistory_);
  }, [library, TheDate, exists]);

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
                <a className="hover:link" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                  { blockTimestampToUTC(x.timestamp) }
                </a>
              </td>
              <td>
                <a className="hover:link" href={formatEtherscanLink("Account", [chainId, x.bidder])}>
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