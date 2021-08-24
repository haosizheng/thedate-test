import useActiveWeb3React from "@/hooks/useActiveWeb3React"; 
import { BigNumber } from "ethers";
import useTheDateContract from "@/hooks/useTheDateContract"; 
import useBlockNumber from "@/hooks/useBlockNumber"; 
import useEtherPrice from "@/hooks/useEtherPrice"; 
import { useState } from "react";
import { shortenHex, formatEtherscanLink, blockTimestampToUTC, SECONDS_IN_A_DAY} from '@/utils/ethers';
import { useRendersCount, useAsync } from "react-use";  

interface ArtworkHistoryItem {
  tokenId: number;
  from: string;
  action: string;
  message: string;
  transactionHash: string;
  blockNumber: number; 
  timestamp: number;
}

export default function ArtworkHistory({ tokenId }: { tokenId: number }) {
  const { library, chainId } = useActiveWeb3React();
  const TheDate = useTheDateContract();  
  const { data : blockNumber} = useBlockNumber();
  const { data: etherPrice } = useEtherPrice();
  const [ tokenId, setTokenId ] = useState<number>(0);
  const [ history, setHistory ] = useState<ArtworkHistoryItem[]>([]);
  const rendersCount = useRendersCount();

  useAsync(async () => {
    if (!library || !blockNumber || !TheDate) {
      return; 
    }
    const block_ = await library.getBlock(blockNumber);
    const tokenId_ = BigNumber.from(block_.timestamp).div(SECONDS_IN_A_DAY).toNumber();
    
    const filters = [
      {
        filter: TheDate.filters.BidPlaced(tokenId_, null, null),
        fn: (x) => {message: x.to }
      }, 
      {
        filter: TheDate.filters.ArtworkMinted(tokenId_, null, null),
        fn: (x) => {message: x.to }
      }, 
      {
        filter: TheDate.filters.ArtworkNoteEngraved(tokenId_, null, null),
        fn: (x) => {message: x.to }
      }, 
      {
        filter: TheDate.filters.ArtworkNoteErased(tokenId_),
        fn: (x) => {message: "1 Ether spend for erasing." }
      }, 
      {
        filter: TheDate.filters.AuctionEnded(tokenId_, null, null),
        fn: (x) => {message: x.to }
      }, 
      {
        filter: TheDate.filters.Transfer(null, null, tokenId_),
        fn: (x) => {message: x.to }
      }, 
    ]
    // const history_ = (await TheDate.queryFilter(
    //   )).map(async x => ({
    //   tokenId: x.args.tokenId.toNumber(),
    //   action: x.event,
    //   from: x.args.bidder,
    //   message: parseBalance(x.args.amount),
    //   transactionHash: x.transactionHash,
    //   blockNumber: x.blockNumber,
    //   timestamp: (await x.getBlock()).timestamp
    // }));

    const history_ = await Promise.all((await TheDate.queryFilter(
      TheDate.filters.Transfer(null, null, tokenId_))).map(async x => ({
      tokenId: x.args.tokenId.toNumber(),
      action: x.event!,
      from: x.args.from,
      message: shortenHex(x.args.to),
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })));

    const history_ = await Promise.all((await TheDate.queryFilter(
      TheDate.filters.(null, null, tokenId_))).map(async x => ({
      tokenId: x.args.tokenId.toNumber(),
      action: x.event!,
      from: x.args.from,
      message: shortenHex(x.args.to),
      transactionHash: x.transactionHash,
      blockNumber: x.blockNumber,
      timestamp: (await x.getBlock()).timestamp
    })));

    setTokenId(tokenId_);
    setHistory(history_);
    
    // TheDate?.filters.ArtworkMinted(tokenId),
    //    TheDate?.filters.ArtworkNoteEngraved(tokenId, null),
    //    TheDate?.filters.ArtworkNoteErased(tokenId),
    //    TheDate?.filters.AuctionEnded(tokenId, null, null),
    //    TheDate?.filters.Transfer(null, null, tokenId)];

    history_.sort((a, b) => (b.blockNumber - a.blockNumber));

  }, [blockNumber, library, TheDate]);

  return (
    <table className="text-xs text-left">
      <thead>
        <tr>
          <th className="w-44 text-left">Action</th>
          <th className="w-44 text-left">From</th>
          <th className="w-44 text-left">Message</th>     
          <th className="w-60 text-left">Time</th> 
        </tr>
      </thead>
      <tbody>
          {history && history.map((x, i) => (
            <tr key="{i}" className={ i > 0 ? "line-through" : ""}>
              <td>
                {x.action}
              </td>
              <td>
                <a className="link" href={formatEtherscanLink("Account", [chainId, x.from])}>
                  { shortenHex(x.from) }
                </a>
              </td>
              <td>
                <a className="link" href={formatEtherscanLink("Transaction", [chainId, x.transactionHash])}>
                  { blockTimestampToUTC(x.timestamp) }
                </a>
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